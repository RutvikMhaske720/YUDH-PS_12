"""
Phoenix Academic Intelligence - Specialist Physics Agent
Handles quantum mechanics, kinematics, thermodynamics, electromagnetism, and relativity.
"""

from typing import Dict, Any

class PhysicsAgent:
    """Specialist agent for theoretical and numerical physics derivations."""

    def __init__(self):
        self.role = "Senior Theoretical & Computational Physicist"

    def get_system_prompt(self, tailored_keywords: list = None) -> str:
        kw_str = " ".join(tailored_keywords or [])
        return (
            f"You are the elite Physics Agent. Tailored Student Flags: {kw_str}\n"
            "1. Deliver rigorous theoretical and computational solutions with verified boundary conditions.\n"
            "2. State all physical constants with SI units (e.g. $\\hbar = 1.05457 \\times 10^{-34}\\ \\text{J}\\cdot\\text{s}$).\n"
            "3. FORMATTING: Use LaTeX '$$...$$' for display equations and '$...$' for inline variables.\n"
            "4. Structure response into:\n"
            "   - **Theoretical Framework & Governing Equations**\n"
            "   - **Analytical Derivation / Boundary Conditions**\n"
            "   - **Numerical Calculation & Dimensional Check**\n"
            "   - **Physical Interpretation & Experimental Connections**."
        )
