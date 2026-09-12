"""
Phoenix Academic Intelligence - Multi-Persona Simulation & Demo Profiles
Provides distinct pre-configured student personas (School Student, College Undergrad, PhD Scholar, and New User)
with tailored facts, pedagogical preferences, vector embeddings, and session histories.
"""

import json
import os
from typing import Dict, Any, List, Optional
import database
import vector_store
import storage

DEMO_PERSONAS = {
    "school_student": {
        "id": "persona_school_aarav",
        "name": "Aarav Sharma",
        "age": 16,
        "institution": "Delhi Public School, R.K. Puram",
        "gradeOrDegree": "Class 11 CBSE (Science Track / JEE Prep)",
        "instituteVerified": True,
        "sheerIdToken": "SHEERID-CBSE-99421",
        "avatar": "🎓",
        "role_title": "School Student • JEE Aspirant",
        "goals": "Master Class 11 Physics Kinematics, Rotational Dynamics, and Trigonometry with intuitive analogies.",
        "sliders": {
            "rigorAndDepth": 3,
            "teachingStyle": 2, # Socratic mode
            "visualVsText": 5,  # High visual interactive simulations
            "challengePace": 3
        },
        "primaryInterests": ["Physics (Kinematics)", "Mathematics (Trigonometry)", "Chemistry (Atomic Structure)"],
        "weakTopics": ["Rotational Inertia Integration", "Projectile Motion Trajectories"],
        "history_samples": [
            {
                "id": "hist-school-01",
                "question": "Derive the maximum height and time of flight for a projectile launched at angle θ with velocity u.",
                "domain": "physics",
                "domain_label": "Physics",
                "agent_used": "Physics Specialist Agent",
                "speciality_notes": "Step-by-step 2D Kinematics Derivation with High-School Clarity",
                "answer": """### Derivation: Projectile Motion Trajectory

Let a particle be projected from the origin $(0, 0)$ with initial velocity $u$ at an angle $\\theta$ above the horizontal.

#### 1. Velocity Components
Resolving velocity into Cartesian orthogonal components:
$$u_x = u \\cos\\theta, \\quad u_y = u \\sin\\theta$$

#### 2. Time of Flight ($T$)
At the maximum height, vertical velocity component $v_y = 0$:
$$v_y = u_y - g t_{\\text{half}} = 0 \\implies t_{\\text{half}} = \\frac{u \\sin\\theta}{g}$$

By symmetry of parabolic motion under uniform gravitational acceleration $g$:
$$T = 2 t_{\\text{half}} = \\frac{2 u \\sin\\theta}{g} \\quad [1]$$

#### 3. Maximum Height ($H_{\\text{max}}$)
Using the kinematic third equation $v_y^2 = u_y^2 - 2g H_{\\text{max}}$:
$$0 = (u \\sin\\theta)^2 - 2g H_{\\text{max}}$$
$$H_{\\text{max}} = \\frac{u^2 \\sin^2\\theta}{2g} \\quad [2]$$

#### 4. Horizontal Range ($R$)
$$R = u_x \\times T = (u \\cos\\theta) \\left(\\frac{2 u \\sin\\theta}{g}\\right) = \\frac{u^2 \\sin(2\\theta)}{g} \\quad [3]$$
""",
                "citations": [
                    {"num": 1, "title": "NCERT Physics Class 11", "ref": "Chapter 4: Motion in a Plane, Section 4.10, pp. 77-80", "type": "textbook"},
                    {"num": 2, "title": "H.C. Verma: Concepts of Physics Vol 1", "ref": "Chapter 3: Rest and Motion - Kinematics, p. 38", "type": "book"},
                    {"num": 3, "title": "Feynman Lectures on Physics", "ref": "Vol. I, Ch. 9: Newton's Laws of Dynamics", "type": "lecture"}
                ]
            }
        ]
    },

    "college_undergrad": {
        "id": "persona_college_devansh",
        "name": "Devansh Patel",
        "age": 21,
        "institution": "Indian Institute of Technology (IIT Bombay)",
        "gradeOrDegree": "B.Tech Computer Science & Engineering (Year 3)",
        "instituteVerified": True,
        "sheerIdToken": "SHEERID-IITB-CS-2023",
        "avatar": "💻",
        "role_title": "College Undergrad • CS Engineer",
        "goals": "Deep dive into Distributed Consensus, Multi-Head Attention Transformers, and GPU Kernel Optimization.",
        "sliders": {
            "rigorAndDepth": 4,
            "teachingStyle": 4, # Step by step with code
            "visualVsText": 3,
            "challengePace": 4
        },
        "primaryInterests": ["Distributed Systems", "Machine Learning Systems", "Operating Systems"],
        "weakTopics": ["Paxos Quorum Overlaps", "Transformer Backprop GPU Tensors"],
        "history_samples": [
            {
                "id": "hist-college-01",
                "question": "How does the Scaled Dot-Product Attention mechanism compute weights in Transformers, and why scale by sqrt(d_k)?",
                "domain": "cs",
                "domain_label": "Computer Science",
                "agent_used": "CS Specialist Agent",
                "speciality_notes": "Algorithmic Formulation & Matrix Complexity Analysis",
                "answer": """### Scaled Dot-Product Attention in Transformer Architectures

Given query matrix $Q \\in \\mathbb{R}^{n \\times d_k}$, key matrix $K \\in \\mathbb{R}^{m \\times d_k}$, and value matrix $V \\in \\mathbb{R}^{m \\times d_v}$:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V \\quad [1]$$

#### 1. Why the Scaling Factor $\\frac{1}{\\sqrt{d_k}}$?
Assume components of $q$ and $k$ are independent random variables with zero mean and unit variance:
$$\\mathbb{E}[q_i] = 0, \\quad \\text{Var}(q_i) = 1$$

Their inner product is:
$$S = q \\cdot k = \\sum_{i=1}^{d_k} q_i k_i$$
$$\\mathbb{E}[S] = 0, \\quad \\text{Var}(S) = \\sum_{i=1}^{d_k} \\text{Var}(q_i k_i) = d_k$$

As the dimension $d_k$ grows large, the variance of the dot products becomes $d_k$, pushing the softmax function into regions with near-zero gradients (vanishing gradient problem) [2]. Scaling by $\\frac{1}{\\sqrt{d_k}}$ renormalizes the variance back to 1.
""",
                "citations": [
                    {"num": 1, "title": "Attention Is All You Need", "ref": "Vaswani et al., NeurIPS 2017, arXiv:1706.03762", "type": "paper"},
                    {"num": 2, "title": "Deep Learning Textbook", "ref": "Goodfellow, Bengio, Courville, MIT Press, Ch. 10", "type": "book"}
                ]
            }
        ]
    },

    "phd_professor": {
        "id": "persona_phd_meera",
        "name": "Dr. Meera Nambiar",
        "age": 34,
        "institution": "Tata Institute of Fundamental Research (TIFR)",
        "gradeOrDegree": "Postdoctoral Researcher & Quantum Physics Faculty",
        "instituteVerified": True,
        "sheerIdToken": "SHEERID-FACULTY-TIFR-401",
        "avatar": "🔬",
        "role_title": "PhD Scholar / Faculty • Quantum Physics",
        "goals": "Topological quantum memory, Kitaev surface codes, non-Abelian anyon braid statistics, and tensor network simulations.",
        "sliders": {
            "rigorAndDepth": 5, # Maximum theoretical rigor
            "teachingStyle": 5, # Formal proof
            "visualVsText": 2,
            "challengePace": 5
        },
        "primaryInterests": ["Topological Quantum Computing", "Anyonic Statistics", "Quantum Error Correction"],
        "weakTopics": ["Fault-Tolerant Magic State Distillation thresholds"],
        "history_samples": [
            {
                "id": "hist-phd-01",
                "question": "Formulate the Hamiltonian of the Kitaev Toric Code and demonstrate why star and plaquette stabilizer operators commute.",
                "domain": "physics",
                "domain_label": "Quantum Physics",
                "agent_used": "Theoretical Physics Specialist",
                "speciality_notes": "Rigorous Operator Algebra & Homological Stabilizer Proof",
                "answer": """### Kitaev Toric Code Hamiltonian Formulation

Consider a 2D square lattice on a 2-torus $\\mathbb{T}^2$, with qubits residing on edges $e \\in E$.

The Kitaev Toric Code Hamiltonian is defined as:
$$H = - J_s \\sum_{s \\in V} A_s - J_p \\sum_{p \\in F} B_p \\quad [1]$$

where the Star Operator $A_s$ and Plaquette Operator $B_p$ are:
$$A_s = \\prod_{e \\in \\text{star}(s)} \\sigma_e^x, \\quad B_p = \\prod_{e \\in \\partial p} \\sigma_e^z \\quad [2]$$

#### Proof of Commutation $[A_s, B_p] = 0$:
1. If vertex $s$ and plaquette $p$ share **no** edges, $[A_s, B_p] = 0$ trivially.
2. If vertex $s$ and plaquette $p$ share edges, on a standard 2D lattice they share **precisely 2 edges** (say $e_1$ and $e_2$).
3. Along edge $e_1$: $\\sigma_{e_1}^x \\sigma_{e_1}^z = -\\sigma_{e_1}^z \\sigma_{e_1}^x$.
4. Along edge $e_2$: $\\sigma_{e_2}^x \\sigma_{e_2}^z = -\\sigma_{e_2}^z \\sigma_{e_2}^x$.
5. The two minus signs compound:
$$(-1) \\times (-1) = +1 \\implies [A_s, B_p] = 0 \\quad \\forall s, p \\quad [3]$$
The ground space is the subspace satisfying $A_s |\\psi\\rangle = |\\psi\\rangle$ and $B_p |\\psi\\rangle = |\\psi\\rangle$.
""",
                "citations": [
                    {"num": 1, "title": "Fault-tolerant quantum computation by anyons", "ref": "A. Yu. Kitaev, Annals of Physics 303 (2003) 2-30", "type": "paper"},
                    {"num": 2, "title": "Topological Quantum Memory", "ref": "Dennis, Kitaev, Landahl, Preskill, J. Math. Phys. 43, 4452 (2002)", "type": "paper"},
                    {"num": 3, "title": "Quantum Error Correction", "ref": "Daniel A. Lidar and Todd A. Brun, Cambridge Univ Press", "type": "book"}
                ]
            }
        ]
    },

    "new_user": {
        "id": "persona_new_guest",
        "name": "New Scholar",
        "age": 18,
        "institution": "Welcome to Phoenix AI",
        "gradeOrDegree": "Unregistered / Starting Fresh",
        "instituteVerified": False,
        "sheerIdToken": None,
        "avatar": "👤",
        "role_title": "New Scholar • Fresh Account",
        "goals": "Explore STEM concepts, ask questions, and complete onboarding.",
        "sliders": {
            "rigorAndDepth": 3,
            "teachingStyle": 3,
            "visualVsText": 4,
            "challengePace": 3
        },
        "primaryInterests": ["Mathematics", "Physics", "Computer Science"],
        "weakTopics": [],
        "history_samples": []
    }
}

def get_available_personas() -> List[Dict[str, Any]]:
    """Returns summary list of available demo personas."""
    personas = []
    for key, val in DEMO_PERSONAS.items():
        personas.append({
            "key": key,
            "id": val["id"],
            "name": val["name"],
            "role_title": val["role_title"],
            "institution": val["institution"],
            "gradeOrDegree": val["gradeOrDegree"],
            "avatar": val["avatar"],
            "instituteVerified": val["instituteVerified"]
        })
    return personas

def switch_to_persona(persona_key: str) -> Dict[str, Any]:
    """
    Activates the specified persona:
    1. Updates student_facts and student_preferences in database.py
    2. Vectorizes preferences into vector_store.py
    3. Replaces active history in data/history.json with persona's tailored inquiries
    4. Updates user profile in storage.py
    """
    if persona_key not in DEMO_PERSONAS:
        return {"success": False, "error": f"Persona '{persona_key}' not found"}

    p = DEMO_PERSONAS[persona_key]

    # 1. Update Database (Facts & Preferences)
    db_payload = {
        "rawProfile": {
            "id": p["id"],
            "name": p["name"],
            "age": p["age"],
            "institution": p["institution"],
            "gradeOrDegree": p["gradeOrDegree"],
            "instituteVerified": p["instituteVerified"],
            "sheerIdVerificationId": p.get("sheerIdToken"),
            "claimedVsVerified": {
                "claimedGoals": p["goals"]
            },
            "sliders": p["sliders"],
            "primaryInterests": p["primaryInterests"],
            "weakOrComplexTopics": p["weakTopics"],
            "externalIntegrations": {
                "preferredTools": ["Desmos", "KaTeX LaTeX", "Python"]
            }
        }
    }
    db_res = database.save_onboarding_submission(db_payload)

    # 2. Vectorize Preferences into Vector Store
    vector_store.store_user_vector_preferences(
        user_id=p["id"],
        summary_text=f"{p['name']} ({p['gradeOrDegree']} - {p['institution']}) Goal: {p['goals']}",
        keywords=db_res["preferences"]["keywords"]
    )

    # 3. Update storage.py user profile
    profile_data = {
        "user_name": p["name"],
        "knowledge_level": "Advanced" if p["sliders"]["rigorAndDepth"] >= 4 else ("Beginner" if p["sliders"]["rigorAndDepth"] <= 2 else "Intermediate"),
        "institution": p["institution"],
        "gradeOrDegree": p["gradeOrDegree"],
        "instituteVerified": p["instituteVerified"],
        "persona_key": persona_key,
        "avatar": p["avatar"],
        "role_title": p["role_title"],
        "streak_days": 12 if persona_key != "new_user" else 0,
        "total_questions": len(p["history_samples"]),
        "focus_score": 98 if persona_key != "new_user" else 100,
        "coordinator_keywords": db_res["preferences"]["keywords"],
        "tailored_system_prompt": db_res["tailoredSystemPrompt"]
    }
    storage.save_user_profile(profile_data)

    # 4. Save history samples
    history_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "history.json")
    with open(history_file, "w", encoding="utf-8") as f:
        json.dump(p["history_samples"], f, indent=2, ensure_ascii=False)

    return {
        "success": True,
        "persona_key": persona_key,
        "profile": profile_data,
        "history_count": len(p["history_samples"]),
        "facts": db_res["facts"],
        "preferences": db_res["preferences"],
        "tailored_prompt": db_res["tailoredSystemPrompt"]
    }
