"""
Phoenix Academic Intelligence - Logs & Dwell Telemetry Database Engine
Stores and analyzes user web activity logs, domain dwell times, goal semantic similarity,
and distraction intervention events via SQLite (data/logs.db).
"""

import sqlite3
import os
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
LOGS_DB_PATH = os.path.join(DB_DIR, "logs.db")

def get_logs_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(LOGS_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_logs_db():
    """Initializes schema for tracking chrome extension logs, dwell times, and distraction alerts."""
    conn = get_logs_connection()
    cur = conn.cursor()

    # User activity logs table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL DEFAULT 'default_scholar',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        url TEXT NOT NULL,
        domain TEXT NOT NULL,
        page_title TEXT NOT NULL,
        time_spent_seconds REAL NOT NULL,
        category TEXT NOT NULL,
        similarity_score REAL NOT NULL,
        distraction_flag BOOLEAN NOT NULL DEFAULT 0,
        suggested_action TEXT,
        content_snippet TEXT
    );
    """)

    # Focus sessions tracking
    cur.execute("""
    CREATE TABLE IF NOT EXISTS focus_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        total_focus_seconds REAL DEFAULT 0,
        distraction_interventions INTEGER DEFAULT 0,
        average_similarity REAL DEFAULT 0.85
    );
    """)

    conn.commit()
    conn.close()

# Auto-initialize
init_logs_db()

def log_activity(entry: Dict[str, Any]) -> Dict[str, Any]:
    """Logs a single browsing activity record from Chrome Extension or frontend telemetry."""
    conn = get_logs_connection()
    cur = conn.cursor()

    user_id = entry.get("user_id", "default_scholar")
    url = entry.get("url", "https://academic.phoenix.ai")
    domain = entry.get("domain", "")
    if not domain and url:
        try:
            from urllib.parse import urlparse
            domain = urlparse(url).netloc
        except Exception:
            domain = "web"

    page_title = entry.get("page_title", "Untitled Web Page")
    time_spent_seconds = float(entry.get("time_spent_seconds", 0.0))
    category = entry.get("category", "Academic Research")
    similarity_score = round(float(entry.get("similarity_score", 0.85)), 3)
    
    # Flag distraction if similarity < 0.35 and dwell >= 10s (per demo requirement)
    distraction_flag = bool(entry.get("distraction_flag", similarity_score < 0.35 and time_spent_seconds >= 10.0))
    
    suggested_action = entry.get("suggested_action")
    if not suggested_action and distraction_flag:
        suggested_action = "Redirect to Phoenix AI Tutor Workspace: Topic alignment below threshold."

    snippet = entry.get("content_snippet", "")[:300]

    cur.execute("""
    INSERT INTO user_activity_logs (
        user_id, url, domain, page_title, time_spent_seconds,
        category, similarity_score, distraction_flag, suggested_action, content_snippet
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, url, domain, page_title, time_spent_seconds,
        category, similarity_score, distraction_flag, suggested_action, snippet
    ))

    rec_id = cur.lastrowid
    conn.commit()
    conn.close()

    return {
        "success": True,
        "log_id": rec_id,
        "distraction_flag": distraction_flag,
        "similarity_score": similarity_score,
        "suggested_action": suggested_action
    }

def get_recent_logs(limit: int = 50, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Returns recent browsing logs with formatted timestamps."""
    conn = get_logs_connection()
    cur = conn.cursor()

    if user_id:
        cur.execute("SELECT * FROM user_activity_logs WHERE user_id = ? ORDER BY id DESC LIMIT ?", (user_id, limit))
    else:
        cur.execute("SELECT * FROM user_activity_logs ORDER BY id DESC LIMIT ?", (limit,))

    rows = cur.fetchall()
    conn.close()

    return [dict(r) for r in rows]

def get_logs_analytics(user_id: Optional[str] = None) -> Dict[str, Any]:
    """Computes aggregated browsing insights, dwell times, and distraction rate."""
    conn = get_logs_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) as total_records, SUM(time_spent_seconds) as total_time FROM user_activity_logs")
    agg = cur.fetchone()
    total_records = agg["total_records"] if agg else 0
    total_seconds = agg["total_time"] if (agg and agg["total_time"]) else 0

    cur.execute("SELECT COUNT(*) as distractions FROM user_activity_logs WHERE distraction_flag = 1")
    d_row = cur.fetchone()
    distractions = d_row["distractions"] if d_row else 0

    cur.execute("SELECT AVG(similarity_score) as avg_sim FROM user_activity_logs")
    sim_row = cur.fetchone()
    avg_similarity = round(sim_row["avg_sim"], 2) if (sim_row and sim_row["avg_sim"]) else 0.82

    # Category breakdown
    cur.execute("""
    SELECT category, COUNT(*) as count, SUM(time_spent_seconds) as time_spent
    FROM user_activity_logs GROUP BY category ORDER BY time_spent DESC
    """)
    cat_rows = cur.fetchall()
    categories = [{
        "category": r["category"],
        "count": r["count"],
        "time_spent_seconds": round(r["time_spent"] or 0, 1)
    } for r in cat_rows]

    # Domain breakdown
    cur.execute("""
    SELECT domain, COUNT(*) as visits, SUM(time_spent_seconds) as time_spent
    FROM user_activity_logs GROUP BY domain ORDER BY time_spent DESC LIMIT 6
    """)
    domain_rows = cur.fetchall()
    top_domains = [{
        "domain": r["domain"],
        "visits": r["visits"],
        "time_spent_seconds": round(r["time_spent"] or 0, 1)
    } for r in domain_rows]

    conn.close()

    focus_score = round(max(0, min(100, (1.0 - (distractions / max(total_records, 1))) * 100)), 1) if total_records > 0 else 94.5

    return {
        "total_records": total_records,
        "total_time_minutes": round(total_seconds / 60.0, 1),
        "distraction_events": distractions,
        "average_similarity": avg_similarity,
        "focus_score": focus_score,
        "categories": categories,
        "top_domains": top_domains
    }

def seed_demo_logs():
    """Seeds realistic academic browsing logs if database is empty."""
    conn = get_logs_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) as count FROM user_activity_logs")
    if cur.fetchone()["count"] > 0:
        conn.close()
        return

    sample_logs = [
        {
            "user_id": "default_scholar",
            "url": "https://arxiv.org/abs/2308.12948",
            "domain": "arxiv.org",
            "page_title": "Quantum Error Correction via Topological Surface Codes",
            "time_spent_seconds": 420.0,
            "category": "Academic Research",
            "similarity_score": 0.94,
            "distraction_flag": 0,
            "suggested_action": "High goal alignment. Keep studying Hamiltonian stabilizers.",
            "content_snippet": "We introduce topological toric code stabilizers with error thresholds..."
        },
        {
            "user_id": "default_scholar",
            "url": "https://ncert.nic.in/textbook.php?keph1=3-8",
            "domain": "ncert.nic.in",
            "page_title": "NCERT Class 11 Physics - Chapter 3: Kinematics",
            "time_spent_seconds": 310.0,
            "category": "NCERT Textbook",
            "similarity_score": 0.91,
            "distraction_flag": 0,
            "suggested_action": "Relevant textbook chapter for JEE Physics.",
            "content_snippet": "Instantaneous acceleration and velocity vector integration in 2D."
        },
        {
            "user_id": "default_scholar",
            "url": "https://www.youtube.com/watch?v=IHZwWFHWa-w",
            "domain": "youtube.com",
            "page_title": "3Blue1Brown - The Essence of Calculus Chapter 1",
            "time_spent_seconds": 680.0,
            "category": "Video Masterclass",
            "similarity_score": 0.88,
            "distraction_flag": 0,
            "suggested_action": "Visual calculus reinforcement.",
            "content_snippet": "Visual intuition behind derivatives and area under curve."
        },
        {
            "user_id": "default_scholar",
            "url": "https://www.instagram.com/explore",
            "domain": "instagram.com",
            "page_title": "Instagram Reels & Explore Feed",
            "time_spent_seconds": 15.0,
            "category": "Distraction / Social Media",
            "similarity_score": 0.12,
            "distraction_flag": 1,
            "suggested_action": "Distraction detected (>10s on low match content). Redirect to Phoenix AI.",
            "content_snippet": "Trending video reels and lifestyle photo recommendations."
        },
        {
            "user_id": "default_scholar",
            "url": "https://reddit.com/r/gaming",
            "domain": "reddit.com",
            "page_title": "r/gaming - Trending Discussions",
            "time_spent_seconds": 12.5,
            "category": "Entertainment / Casual",
            "similarity_score": 0.18,
            "distraction_flag": 1,
            "suggested_action": "Focus alert triggered. Return to Academic derivations.",
            "content_snippet": "Discussion on latest GPU hardware and game release schedules."
        }
    ]

    for item in sample_logs:
        log_activity(item)

    conn.close()

# Auto-seed initial logs for demo
seed_demo_logs()
