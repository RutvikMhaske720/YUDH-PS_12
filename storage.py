import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
HISTORY_FILE = os.path.join(DATA_DIR, "history.json")
PROFILE_FILE = os.path.join(DATA_DIR, "profile.json")

DEFAULT_PROFILE = {
    "user_name": "Scholar",
    "knowledge_level": "Advanced",  # Beginner, Intermediate, Advanced, Researcher
    "streak_days": 5,
    "total_questions": 0,
    "focus_score": 96,
    "domain_mastery": {
        "math": 82,
        "programming": 88,
        "physics": 76,
        "chemistry": 70,
        "biology": 74,
        "economics": 60,
        "astronomy": 65,
        "history": 58
    },
    "concepts_mastered": [
        "Time-Independent Schrödinger Equation",
        "Fibonacci Dynamic Programming ($O(N)$ Space)",
        "Mitochondrial Oxidative Phosphorylation",
        "Le Chatelier's Equilibrium Principle",
        "Eigenvalue & Eigenvector Decomposition"
    ],
    "goals": [
        "Master Quantum Wave Mechanics & Operators",
        "Solve 50 Dynamic Programming Problems",
        "Complete Advanced Cellular Respiration & Genetics"
    ],
    "last_active": datetime.now().isoformat()
}

def ensure_data_dir():
    """Ensure data directory and required json files exist."""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
    if not os.path.exists(PROFILE_FILE):
        with open(PROFILE_FILE, "w", encoding="utf-8") as f:
            json.dump(DEFAULT_PROFILE, f, indent=2)

def load_user_profile() -> Dict[str, Any]:
    """Load user profile and progress analytics."""
    ensure_data_dir()
    try:
        with open(PROFILE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Merge with default keys in case any are missing
            merged = {**DEFAULT_PROFILE, **data}
            return merged
    except Exception as e:
        print(f"Error loading profile.json: {e}")
        return DEFAULT_PROFILE.copy()

def save_user_profile(profile: Dict[str, Any]) -> bool:
    """Save user profile and progress analytics."""
    ensure_data_dir()
    try:
        profile["last_active"] = datetime.now().isoformat()
        with open(PROFILE_FILE, "w", encoding="utf-8") as f:
            json.dump(profile, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving profile.json: {e}")
        return False

def update_progress_for_query(domain: str, question: str, concept_name: Optional[str] = None):
    """Automatically increment question counts and mastery score based on user activity."""
    profile = load_user_profile()
    profile["total_questions"] = profile.get("total_questions", 0) + 1
    
    # Increase mastery score in that domain (up to 99%)
    mastery = profile.get("domain_mastery", {})
    current_val = mastery.get(domain, 60)
    mastery[domain] = min(99, current_val + 2)
    profile["domain_mastery"] = mastery
    
    if concept_name and concept_name not in profile.get("concepts_mastered", []):
        profile["concepts_mastered"].insert(0, concept_name)
        profile["concepts_mastered"] = profile["concepts_mastered"][:15]
        
    save_user_profile(profile)

def normalize_agent_name(record: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure records have clean 'subject' and 'agent_used' columns."""
    q_lower = record.get("question", "").lower()
    domain = record.get("domain", "")
    domain_label = record.get("domain_label", "")

    if "fibbonacci" in q_lower or "fibonacci" in q_lower or "recursssion" in q_lower or "recursion" in q_lower:
        subject = "Programming & Data Structures"
        agent_name = "Programming Agent"
        domain = "programming"
    elif "powerhouse" in q_lower or "mitochondria" in q_lower or "xell" in q_lower or "cell" in q_lower:
        subject = "Biology & Life Sciences"
        agent_name = "Biology Agent"
        domain = "biology"
    elif "haber" in q_lower or "ammonia" in q_lower or "equilibrium" in q_lower or "chemistry" in q_lower:
        subject = "Chemistry & Chemical Sciences"
        agent_name = "Chemistry Agent"
        domain = "chemistry"
    elif domain in ["math", "mathematics"] or "math" in domain_label.lower():
        subject = "Mathematics"
        agent_name = "Maths Agent"
        domain = "math"
    elif domain in ["dynamic_programming", "programming", "dsa"] or "programming" in domain_label.lower():
        subject = "Programming & Data Structures"
        agent_name = "Programming Agent"
        domain = "programming"
    elif domain in ["quantum_physics", "physics"] or "physics" in domain_label.lower():
        subject = "Physics & Quantum Mechanics"
        agent_name = "Physics Agent"
        domain = "physics"
    elif domain in ["biology", "life_sciences"] or "biology" in domain_label.lower():
        subject = "Biology & Life Sciences"
        agent_name = "Biology Agent"
        domain = "biology"
    elif domain in ["chemistry"] or "chemistry" in domain_label.lower():
        subject = "Chemistry & Chemical Sciences"
        agent_name = "Chemistry Agent"
        domain = "chemistry"
    else:
        subject = record.get("subject") or "General Science"
        agent_name = record.get("agent_used") or domain_label or "General Science Agent"
        if not agent_name.endswith("Agent"):
            agent_name += " Agent"

    record["domain"] = domain
    record["subject"] = subject
    record["agent_used"] = agent_name
    record["domain_label"] = agent_name
    record["model_used"] = agent_name

    # Ensure videos, books, and references fields exist
    if "videos" not in record:
        record["videos"] = []
    if "books" not in record:
        record["books"] = []
    if "references" not in record:
        record["references"] = []
    if "attachments" not in record:
        record["attachments"] = []

    return record

def load_history() -> List[Dict[str, Any]]:
    """Load all records from local JSON storage with normalization."""
    ensure_data_dir()
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                normalized = [normalize_agent_name(r) for r in data]
                return normalized
            return []
    except Exception as e:
        print(f"Error loading history.json: {e}")
        return []

def save_all_history(records: List[Dict[str, Any]]) -> bool:
    """Save all records to local JSON storage."""
    ensure_data_dir()
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving to history.json: {e}")
        return False

def add_record(
    question: str,
    answer: str,
    domain: str,
    subject: Optional[str] = None,
    agent_used: Optional[str] = None,
    is_penalty: bool = False,
    speciality_notes: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    videos: Optional[List[Dict[str, Any]]] = None,
    books: Optional[List[Dict[str, Any]]] = None,
    references: Optional[List[Dict[str, Any]]] = None,
    attachments: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """Create and append a new Q&A record to history.json."""
    records = load_history()
    
    now = datetime.now()
    resolved_agent = agent_used or "Subject Agent"
    if not resolved_agent.endswith("Agent"):
        resolved_agent += " Agent"

    record = {
        "id": str(uuid.uuid4()),
        "timestamp_iso": now.isoformat(),
        "timestamp_display": now.strftime("%Y-%m-%d %H:%M:%S"),
        "domain": domain,
        "subject": subject or domain.title(),
        "agent_used": resolved_agent,
        "domain_label": resolved_agent,
        "question": question,
        "answer": answer,
        "is_penalty": is_penalty,
        "speciality_notes": speciality_notes or f"Answered by {resolved_agent}",
        "videos": videos or [],
        "books": books or [],
        "references": references or [],
        "attachments": attachments or [],
        "metadata": metadata or {}
    }
    
    # Prepend new record so latest appears first
    records.insert(0, record)
    save_all_history(records)
    
    # Update profile progress
    update_progress_for_query(domain, question)
    
    return record

def get_record(record_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single record by ID."""
    records = load_history()
    for rec in records:
        if rec.get("id") == record_id:
            return rec
    return None

def delete_record(record_id: str) -> bool:
    """Delete a record by ID."""
    records = load_history()
    initial_len = len(records)
    records = [r for r in records if r.get("id") != record_id]
    if len(records) < initial_len:
        save_all_history(records)
        return True
    return False

def clear_history() -> bool:
    """Clear all records."""
    return save_all_history([])
