"""
Phoenix Academic Intelligence - Specialist Computer Science & DSA Agent
Handles algorithms, dynamic programming, recurrence relations, and Big-O complexity.
"""

from typing import Dict, Any

class CSAgent:
    """Specialist agent for algorithms, dynamic programming, and systems analysis."""

    def __init__(self):
        self.role = "Senior Algorithmist & Software Architect"

    def get_system_prompt(self, tailored_keywords: list = None) -> str:
        kw_str = " ".join(tailored_keywords or [])
        return (
            f"You are the elite Programming & CS Agent. Tailored Student Flags: {kw_str}\n"
            "1. Deconstruct algorithmic problems via optimal substructure and state transitions.\n"
            "2. Explicit DP State Definition: State $dp[i][j]$ formally in LaTeX.\n"
            "3. Recurrence Relation: Provide mathematical recurrence with base cases.\n"
            "4. Production Code: Clean Python with type hints and edge-case handling.\n"
            "5. Big-O Complexity: Detailed time and space complexity derivation ($O(N)$, $O(2^n)$)."
        )
