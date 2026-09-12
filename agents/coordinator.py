"""
Phoenix Academic Intelligence - Coordinator Agent
Responsible for query classification (Level 0, 1, 2), injecting tailored database keywords,
and coordinating specialist agents and interactive elements.
"""

import re
from typing import Dict, Any, Tuple, Optional
import database

def detect_interactive_element(question: str, domain: str) -> Optional[Dict[str, Any]]:
    """
    Analyzes whether query can be represented on an interactive Desmos graph
    or dynamic simulation canvas, returning the initial configuration parameters.
    """
    q_lower = question.lower()

    # 1. Kinematics / Projectile Motion Simulation
    if any(k in q_lower for k in ["projectile", "trajectory", "launch angle", "initial velocity", "free fall", "parabolic motion"]):
        return {
            "type": "physics_simulation",
            "sim_type": "projectile",
            "title": "Interactive Projectile Trajectory Simulation",
            "description": "Adjust initial velocity, launch angle, and gravitational acceleration in real time.",
            "formula": "y(x) = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}",
            "params": [
                {"name": "velocity", "label": "Initial Velocity v0 (m/s)", "min": 5, "max": 60, "step": 1, "default": 25},
                {"name": "angle", "label": "Launch Angle θ (deg)", "min": 10, "max": 85, "step": 1, "default": 45},
                {"name": "gravity", "label": "Gravity g (m/s²)", "min": 1.6, "max": 25, "step": 0.2, "default": 9.8}
            ]
        }

    # 2. Simple Harmonic Motion / Pendulum
    if any(k in q_lower for k in ["pendulum", "harmonic oscillator", "shm", "spring mass", "oscillation", "damping"]):
        return {
            "type": "physics_simulation",
            "sim_type": "pendulum",
            "title": "Harmonic Oscillator & Phase Space Simulation",
            "description": "Explore angular displacement, damping ratio, and resonance frequencies.",
            "formula": "\\frac{d^2\\theta}{dt^2} + \\gamma \\frac{d\\theta}{dt} + \\frac{g}{L} \\sin(\\theta) = 0",
            "params": [
                {"name": "length", "label": "Length L (m)", "min": 0.2, "max": 3.0, "step": 0.1, "default": 1.0},
                {"name": "damping", "label": "Damping γ", "min": 0.0, "max": 0.5, "step": 0.01, "default": 0.05},
                {"name": "initial_theta", "label": "Release Angle θ0 (deg)", "min": 5, "max": 80, "step": 5, "default": 30}
            ]
        }

    # 3. Wave Propagation / Superposition
    if any(k in q_lower for k in ["wave", "superposition", "interference", "standing wave", "frequency", "wavelength"]):
        return {
            "type": "desmos_graph",
            "title": "Interactive Wave Superposition Plotter",
            "description": "Visualize constructive and destructive wave interference with variable wave numbers and phase shifts.",
            "formula": "y = A_1 \\sin(k_1 x - \\omega t) + A_2 \\sin(k_2 x + \\phi)",
            "params": [
                {"name": "a", "label": "Amplitude A", "min": 0.5, "max": 4.0, "step": 0.1, "default": 1.5},
                {"name": "b", "label": "Wave Number k", "min": 0.5, "max": 5.0, "step": 0.1, "default": 2.0},
                {"name": "c", "label": "Phase Shift φ", "min": -3.14, "max": 3.14, "step": 0.1, "default": 0.0}
            ]
        }

    # 4. Quadratic / Kinetic Energy / Polynomial Derivations
    if any(k in q_lower for k in ["kinetic energy", "parabola", "quadratic", "derivative of", "curve", "plot", "graph", "polynomial"]):
        return {
            "type": "desmos_graph",
            "title": "Desmos Interactive Analytical Curve Plotter",
            "description": "Live parameter sliders for second-order polynomial and quadratic potential energy curves.",
            "formula": "y = a \\cdot x^2 + b \\cdot x + c",
            "params": [
                {"name": "a", "label": "Curvature Coeff (a)", "min": -3.0, "max": 3.0, "step": 0.1, "default": 0.5},
                {"name": "b", "label": "Linear Slope (b)", "min": -5.0, "max": 5.0, "step": 0.2, "default": 0.0},
                {"name": "c", "label": "Vertical Offset (c)", "min": -5.0, "max": 5.0, "step": 0.5, "default": 0.0}
            ]
        }

    return None

def classify_query_routing(question: str) -> Tuple[int, str, str]:
    """
    Intelligently routes the query into:
    Level 0: Rapid direct LLM (< 1s) for casual chit-chat, greetings, trivia.
    Level 1: Specialist pipeline for standard conceptual single-domain STEM questions.
    Level 2: Multi-agent deep orchestration + PageIndex RAG for advanced derivations and proofs.
    
    Returns: (level, level_label, detected_domain)
    """
    q_clean = question.lower().strip()
    q_words = re.sub(r'[^a-zA-Z0-9\s]', ' ', q_clean).split()

    # Level 0: Casual, greetings, simple chit-chat
    casual_words = {
        "hi", "hello", "hey", "sup", "yo", "gm", "gn", "bye", "goodnight",
        "who", "name", "doing", "hru", "weather", "joke", "jokes", "story",
        "laugh", "bored", "talk", "chat", "fun", "cool", "thanks", "thank"
    }
    if len(q_words) <= 3 and any(w in casual_words for w in q_words):
        return (0, "Level 0: Rapid Direct Response (< 1s)", "general")

    if re.search(r'^(hi|hello|hey|who are you|what is your name|how are you|good morning|what can you do)[\?\.\!]?$', q_clean):
        return (0, "Level 0: Rapid Direct Response (< 1s)", "general")

    # Check for deep academic multi-agent markers (Level 2)
    level_2_indicators = [
        "derive", "formal proof", "prove that", "schrodinger", "hamiltonian",
        "dirac", "boundary condition", "eigenvalue", "dynamic programming recurrence",
        "compare and contrast", "multi agent", "textbook citation", "page index",
        "step by step proof", "higher order", "asymptotic", "thermodynamic cycle"
    ]
    if any(ind in q_clean for ind in level_2_indicators) or len(q_words) > 18:
        # Resolve domain
        domain = "physics" if any(p in q_clean for p in ["quantum", "physics", "force", "energy", "wave"]) else \
                 ("math" if any(m in q_clean for m in ["prove", "theorem", "matrix", "derivative", "integral"]) else \
                 ("programming" if any(c in q_clean for c in ["dp", "dynamic programming", "recursion", "dsa", "algorithm"]) else "general"))
        return (2, "Level 2: Multi-Agent Deep Orchestration", domain)

    # Otherwise Level 1: Specialist Agent
    domain = "physics" if any(p in q_clean for p in ["force", "motion", "gravity", "energy", "velocity", "optics", "physics"]) else \
             ("math" if any(m in q_clean for m in ["calculate", "solve", "function", "math", "triangle", "algebra"]) else \
             ("programming" if any(c in q_clean for c in ["python", "code", "array", "binary", "sort"]) else \
             ("chemistry" if any(k in q_clean for k in ["reaction", "acid", "base", "ph", "element", "compound"]) else \
             ("biology" if any(b in q_clean for b in ["cell", "dna", "plant", "animal", "organ"]) else "general"))))

    return (1, "Level 1: Specialist Pipeline", domain)

class CoordinatorAgent:
    """Coordinates student preferences from SQLite database with appropriate specialist agents."""

    def __init__(self):
        pass

    def prepare_coordinator_context(self) -> Dict[str, Any]:
        """Loads student facts, vector keywords, and tailored system prompts from database.py."""
        return database.get_coordinator_context()
