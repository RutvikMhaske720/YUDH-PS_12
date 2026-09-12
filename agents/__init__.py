"""
Phoenix Academic Intelligence - Multi-Agent LangGraph Framework
"""

from agents.graph import orchestration_graph, run_agent_graph
from agents.coordinator import CoordinatorAgent, classify_query_routing, detect_interactive_element
from agents.math_agent import MathAgent
from agents.physics_agent import PhysicsAgent
from agents.cs_agent import CSAgent
from agents.rag_agent import RAGAgent

__all__ = [
    "orchestration_graph",
    "run_agent_graph",
    "CoordinatorAgent",
    "classify_query_routing",
    "detect_interactive_element",
    "MathAgent",
    "PhysicsAgent",
    "CSAgent",
    "RAGAgent"
]
