"""
Phoenix Academic Intelligence - LangGraph State Definition
"""

from typing import Dict, Any, List, Optional, TypedDict

class AgentState(TypedDict):
    question: str
    routing_level: int              # 0: rapid LLM, 1: specialist, 2: multi-agent
    routing_label: str
    domain: str                     # math, physics, programming, chemistry, biology, general
    coordinator_notes: str
    specialist_response: str
    rag_citations: List[Dict[str, Any]]
    interactive_element: Optional[Dict[str, Any]]
    final_answer: str
    tailored_keywords: List[str]
    model_used: str
    latency_sec: float
