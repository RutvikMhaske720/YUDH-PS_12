"""
Phoenix Academic Intelligence - Relational & Vector Database Engine
Stores classified student data (Facts vs Preferences) and generates
vector embeddings & system prompt routing keywords for the Coordinator Agent.
"""

import sqlite3
import json
import os
import math
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "phoenix.db")

def get_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initializes normalized database tables for Facts, Preferences, and Vector Embeddings."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Facts Table: Official, immutable or institutional verified student identity facts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_facts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        age INTEGER,
        institution TEXT NOT NULL,
        grade_or_degree TEXT NOT NULL,
        institute_verified BOOLEAN DEFAULT 0,
        sheer_id_token TEXT,
        verified_gpa TEXT,
        verified_prerequisites TEXT,
        claimed_goals TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Preferences Table: Dynamic student pedagogical preferences, sliders, and topics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        rigor_level INTEGER DEFAULT 3,
        teaching_style INTEGER DEFAULT 2,
        visual_pref INTEGER DEFAULT 4,
        challenge_pace INTEGER DEFAULT 3,
        primary_interests TEXT,
        weak_topics TEXT,
        preferred_tools TEXT,
        syllabus_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES student_facts (user_id)
    );
    """)

    # 3. Vector Embeddings Table: High-dimensional embeddings & Coordinator system prompt keywords (pgvector/Pinecone schema)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS preference_embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        vector_data TEXT NOT NULL,
        embedding_model TEXT NOT NULL,
        dimension INTEGER NOT NULL,
        extracted_keywords TEXT NOT NULL,
        system_prompt_snippet TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES student_facts (user_id)
    );
    """)

    conn.commit()
    conn.close()

# Auto-initialize on import
init_database()

def compute_simulated_embedding(text: str, dimension: int = 64) -> List[float]:
    """Generates a deterministic vector embedding for preference text."""
    seed_hash = hashlib.sha256(text.encode("utf-8")).digest()
    raw_vec = [float((seed_hash[i % len(seed_hash)] - 128) / 128.0) for i in range(dimension)]
    norm = math.sqrt(sum(x * x for x in raw_vec)) or 1.0
    return [round(x / norm, 4) for x in raw_vec]

def extract_coordinator_keywords(preferences: Dict[str, Any], facts: Dict[str, Any]) -> List[str]:
    """Extracts high-signal behavioral keywords for the Coordinator Agent."""
    keywords = []

    # 1. Fact-based keywords
    grade = facts.get("grade_or_degree", "")
    if grade:
        clean_grade = grade.upper().replace(" ", "_").replace("-", "_")[:20]
        keywords.append(f"#{clean_grade}")
    
    if facts.get("institute_verified"):
        keywords.append("#INSTITUTE_VERIFIED_FACTS")
    else:
        keywords.append("#SELF_CLAIMED_STUDENT")

    # 2. Preference slider keywords
    rigor = preferences.get("rigor_level", 3)
    if rigor >= 4:
        keywords.append("#FORMAL_MATH_RIGOR")
    elif rigor <= 2:
        keywords.append("#INTUITIVE_ANALOGIES")
    else:
        keywords.append("#STANDARD_CURRICULUM_DEPTH")

    teaching = preferences.get("teaching_style", 2)
    if teaching <= 2:
        keywords.append("#SOCRATIC_QUESTIONING_MODE")
    else:
        keywords.append("#DIRECT_STEP_BY_STEP")

    visual = preferences.get("visual_pref", 4)
    if visual >= 4:
        keywords.append("#VISUAL_SIMULATION_INTERACTIVE")
    else:
        keywords.append("#FORMAL_TEXTUAL_PROOF")

    # 3. Weakness keywords
    weak_topics = preferences.get("weak_topics", [])
    if isinstance(weak_topics, str):
        weak_topics = [t.strip() for t in weak_topics.split(",") if t.strip()]
    for topic in weak_topics[:2]:
        clean_topic = topic.upper().replace(" ", "_")[:18]
        keywords.append(f"#TARGET_WEAKNESS_{clean_topic}")

    return keywords

def save_onboarding_submission(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Classifies and stores onboarding submission into:
    1. student_facts (Official profile)
    2. student_preferences (Learning settings)
    3. preference_embeddings (Vector store & system prompt tailoring)
    """
    conn = get_connection()
    cursor = conn.cursor()

    raw_profile = payload.get("rawProfile", payload)
    user_id = raw_profile.get("id") or f"student-{int(datetime.now().timestamp())}"
    name = raw_profile.get("name") or "Academic Scholar"
    age = int(raw_profile.get("age") or 18)
    institution = raw_profile.get("institution") or "Independent Learning Track"
    grade_or_degree = raw_profile.get("gradeOrDegree") or "Class 12 / University Prep"
    institute_verified = bool(raw_profile.get("instituteVerified", False))
    sheer_id_token = raw_profile.get("sheerIdVerificationId")

    claimed_vs_verified = raw_profile.get("claimedVsVerified", {})
    verified_gpa = claimed_vs_verified.get("verifiedGpaOrScore")
    verified_prereqs = json.dumps(claimed_vs_verified.get("verifiedPrerequisites", []))
    claimed_goals = claimed_vs_verified.get("claimedGoals", "Master core scientific subjects and derivations.")

    # 1. Insert or Update student_facts
    cursor.execute("""
    INSERT INTO student_facts (
        user_id, name, age, institution, grade_or_degree, institute_verified,
        sheer_id_token, verified_gpa, verified_prerequisites, claimed_goals, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
        name=excluded.name,
        age=excluded.age,
        institution=excluded.institution,
        grade_or_degree=excluded.grade_or_degree,
        institute_verified=excluded.institute_verified,
        sheer_id_token=excluded.sheer_id_token,
        verified_gpa=excluded.verified_gpa,
        verified_prerequisites=excluded.verified_prerequisites,
        claimed_goals=excluded.claimed_goals,
        updated_at=CURRENT_TIMESTAMP;
    """, (
        user_id, name, age, institution, grade_or_degree, institute_verified,
        sheer_id_token, verified_gpa, verified_prereqs, claimed_goals
    ))

    # 2. Extract Preferences
    sliders = raw_profile.get("sliders", {})
    rigor_level = int(sliders.get("rigorAndDepth", 3))
    teaching_style = int(sliders.get("teachingStyle", 2))
    visual_pref = int(sliders.get("visualVsText", 4))
    challenge_pace = int(sliders.get("challengePace", 3))

    primary_interests = json.dumps(raw_profile.get("primaryInterests", ["Mathematics", "Physics"]))
    weak_topics = json.dumps(raw_profile.get("weakOrComplexTopics", ["Calculus Derivatives"]))
    
    ext = raw_profile.get("externalIntegrations", {})
    preferred_tools = json.dumps(ext.get("preferredTools", ["Desmos Interactive Canvas", "Python Sandbox"]))
    syllabus_notes = ext.get("syllabusNotesSnippet", "")

    # Insert or Update student_preferences
    cursor.execute("""
    INSERT INTO student_preferences (
        user_id, rigor_level, teaching_style, visual_pref, challenge_pace,
        primary_interests, weak_topics, preferred_tools, syllabus_notes, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
        rigor_level=excluded.rigor_level,
        teaching_style=excluded.teaching_style,
        visual_pref=excluded.visual_pref,
        challenge_pace=excluded.challenge_pace,
        primary_interests=excluded.primary_interests,
        weak_topics=excluded.weak_topics,
        preferred_tools=excluded.preferred_tools,
        syllabus_notes=excluded.syllabus_notes,
        updated_at=CURRENT_TIMESTAMP;
    """, (
        user_id, rigor_level, teaching_style, visual_pref, challenge_pace,
        primary_interests, weak_topics, preferred_tools, syllabus_notes
    ))

    # 3. Vector Embeddings & System Prompt Keyword Generation
    facts_dict = {
        "institution": institution,
        "grade_or_degree": grade_or_degree,
        "institute_verified": institute_verified,
        "claimed_goals": claimed_goals
    }
    prefs_dict = {
        "rigor_level": rigor_level,
        "teaching_style": teaching_style,
        "visual_pref": visual_pref,
        "weak_topics": raw_profile.get("weakOrComplexTopics", [])
    }
    
    keywords = extract_coordinator_keywords(prefs_dict, facts_dict)

    # Construct synthesized system prompt tailored to the student
    tailored_system_prompt = f"""[COORDINATOR TAILORED STUDENT CONTEXT]
Student Facts: {name} ({grade_or_degree} - {institution}) | Status: {'VERIFIED VIA SHEERID' if institute_verified else 'SELF-REPORTED'}
Routing Flags: {' '.join(keywords)}
Pedagogical Directives:
- Rigor Level: {rigor_level}/5 ({'Include formal proofs and rigorous boundary conditions' if rigor_level >= 4 else 'Use clear intuitive analogies'})
- Teaching Mode: {teaching_style}/5 ({'Lead with Socratic questioning and intermediate hints' if teaching_style <= 2 else 'Provide direct step-by-step solutions'})
- Visual Element: {visual_pref}/5 ({'Generate interactive Desmos curve or physics simulation parameters' if visual_pref >= 4 else 'Focus on textual derivations'})
- Target Weak Areas: {claimed_goals}"""

    embedding_text = f"{name} {institution} {grade_or_degree} {primary_interests} {weak_topics} {' '.join(keywords)}"
    embedding_vec = compute_simulated_embedding(embedding_text, dimension=64)

    cursor.execute("""
    INSERT INTO preference_embeddings (
        user_id, vector_data, embedding_model, dimension, extracted_keywords, system_prompt_snippet
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
        vector_data=excluded.vector_data,
        extracted_keywords=excluded.extracted_keywords,
        system_prompt_snippet=excluded.system_prompt_snippet;
    """, (
        user_id, json.dumps(embedding_vec), "text-embedding-3-small", 64, json.dumps(keywords), tailored_system_prompt
    ))

    conn.commit()
    conn.close()

    # Also update storage.py profile for backward compatibility
    try:
        import storage
        p = storage.load_user_profile()
        p["user_name"] = name
        p["institution"] = institution
        p["gradeOrDegree"] = grade_or_degree
        p["knowledge_level"] = "Advanced" if rigor_level >= 4 else ("Beginner" if rigor_level <= 1 else "Intermediate")
        p["coordinator_keywords"] = keywords
        p["tailored_system_prompt"] = tailored_system_prompt
        storage.save_user_profile(p)
    except Exception as e:
        print(f"Notice: storage sync: {e}")

    return {
        "success": True,
        "user_id": user_id,
        "facts": {
            "name": name,
            "institution": institution,
            "gradeOrDegree": grade_or_degree,
            "instituteVerified": institute_verified,
            "sheerIdToken": sheer_id_token,
            "claimedGoals": claimed_goals
        },
        "preferences": {
            "rigorLevel": rigor_level,
            "teachingStyle": teaching_style,
            "visualPref": visual_pref,
            "keywords": keywords
        },
        "vectorEmbedding": {
            "model": "text-embedding-3-small",
            "dimension": 64,
            "sample": embedding_vec[:6]
        },
        "tailoredSystemPrompt": tailored_system_prompt
    }

def get_coordinator_context(user_id: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves facts, preferences, and tailored prompt for the Coordinator Agent."""
    conn = get_connection()
    cursor = conn.cursor()

    if user_id:
        cursor.execute("SELECT * FROM student_facts WHERE user_id = ?", (user_id,))
    else:
        cursor.execute("SELECT * FROM student_facts ORDER BY updated_at DESC LIMIT 1")
    
    fact_row = cursor.fetchone()
    if not fact_row:
        conn.close()
        return {
            "name": "Academic Scholar",
            "institution": "Independent Learner Track",
            "gradeOrDegree": "Class 12 / University Prep",
            "keywords": ["#STANDARD_CURRICULUM", "#DIRECT_STEP_BY_STEP"],
            "tailored_system_prompt": "Tailor responses with rigorous mathematical steps and verified academic citations."
        }

    uid = fact_row["user_id"]
    cursor.execute("SELECT * FROM student_preferences WHERE user_id = ?", (uid,))
    pref_row = cursor.fetchone()

    cursor.execute("SELECT * FROM preference_embeddings WHERE user_id = ?", (uid,))
    emb_row = cursor.fetchone()

    conn.close()

    keywords = json.loads(emb_row["extracted_keywords"]) if emb_row else ["#ACADEMIC_INTELLIGENCE"]
    prompt = emb_row["system_prompt_snippet"] if emb_row else ""

    return {
        "user_id": uid,
        "name": fact_row["name"],
        "institution": fact_row["institution"],
        "gradeOrDegree": fact_row["grade_or_degree"],
        "instituteVerified": bool(fact_row["institute_verified"]),
        "rigorLevel": pref_row["rigor_level"] if pref_row else 3,
        "teachingStyle": pref_row["teaching_style"] if pref_row else 2,
        "visualPref": pref_row["visual_pref"] if pref_row else 4,
        "keywords": keywords,
        "tailored_system_prompt": prompt
    }
