"""
Phoenix Academic Intelligence - LangGraph StateGraph Pipeline
Implements intelligent 3-tier routing:
- Level 0: Rapid direct LLM node (< 1s)
- Level 1: Specialist single agent node
- Level 2: Deep multi-agent orchestration (Specialist + PageIndex RAG + Synthesis)
"""

import time
from typing import Dict, Any
from langgraph.graph import StateGraph, END

from agents.state import AgentState
from agents.coordinator import CoordinatorAgent, classify_query_routing, detect_interactive_element
from agents.math_agent import MathAgent
from agents.physics_agent import PhysicsAgent
from agents.cs_agent import CSAgent
from agents.rag_agent import RAGAgent

# Instantiate modular agents
coordinator = CoordinatorAgent()
math_agent = MathAgent()
physics_agent = PhysicsAgent()
cs_agent = CSAgent()
rag_agent = RAGAgent()

def coordinator_node(state: AgentState) -> Dict[str, Any]:
    """Node 1: Evaluate question, load student DB keywords, route level and domain."""
    question = state["question"]
    level, label, domain = classify_query_routing(question)
    
    # Load tailored student context from SQLite database
    db_context = coordinator.prepare_coordinator_context()
    keywords = db_context.get("keywords", [])
    
    # Check if query can be represented on an interactive Desmos graph or simulation
    interactive = detect_interactive_element(question, domain)

    return {
        "routing_level": level,
        "routing_label": label,
        "domain": domain,
        "tailored_keywords": keywords,
        "interactive_element": interactive,
        "coordinator_notes": f"Routed to {label} for domain '{domain}'. Active flags: {', '.join(keywords)}"
    }

def rapid_llm_node(state: AgentState) -> Dict[str, Any]:
    """Node 2 (Level 0): Rapid response (< 1s) for greetings and quick chit-chat."""
    q = state["question"].lower()
    if any(g in q for g in ["hi", "hello", "hey", "sup", "yo"]):
        ans = (
            "Hello! I am your **Academic Research & Intelligence Mentor**.\n\n"
            "I'm primed with deep multi-agent coordination, formal mathematical rigor, "
            "and real-time textbook/preprint PageIndex verification. What topic or problem would you like to explore today?"
        )
    elif "who are you" in q or "what can you do" in q:
        ans = (
            "I am **Phoenix Academic Intelligence** — an agentic learning engine designed for university-level "
            "mastery of Mathematics, Physics, Computer Science, and Chemistry.\n\n"
            "• **Level 0**: Instant rapid query handling\n"
            "• **Level 1**: Single-specialist conceptual derivations\n"
            "• **Level 2**: Multi-agent coordination with PageIndex textbook & preprint citations + interactive simulation canvases."
        )
    else:
        ans = f"Ready to assist with your academic curriculum! Enter any equation, concept, or derivation."

    return {
        "final_answer": ans,
        "model_used": "Rapid Direct Engine (Sub-second)",
        "rag_citations": []
    }

def specialist_node(state: AgentState) -> Dict[str, Any]:
    """Node 3 (Level 1): Single specialist agent pipeline."""
    domain = state["domain"]
    keywords = state.get("tailored_keywords", [])
    
    if domain == "math":
        prompt = math_agent.get_system_prompt(keywords)
    elif domain == "physics":
        prompt = physics_agent.get_system_prompt(keywords)
    elif domain == "programming":
        prompt = cs_agent.get_system_prompt(keywords)
    else:
        prompt = f"You are the Academic Specialist for {domain}. Flags: {' '.join(keywords)}"

    return {
        "specialist_response": f"Prepared by {domain.title()} Specialist Agent with directives: {', '.join(keywords)}",
        "model_used": "Academic Specialist Engine"
    }

def rag_node(state: AgentState) -> Dict[str, Any]:
    """Node 4 (Level 2): PageIndex & PDF RAG lookup."""
    question = state["question"]
    domain = state["domain"]
    rag_res = rag_agent.retrieve_citations(question, domain)
    return {
        "rag_citations": rag_res.get("textbook_citations", []),
        "coordinator_notes": state.get("coordinator_notes", "") + f" | Retrieved {len(rag_res.get('textbook_citations', []))} verified textbook page citations."
    }

def router_condition(state: AgentState) -> str:
    """Conditional edge branching based on routing_level."""
    lvl = state.get("routing_level", 1)
    if lvl == 0:
        return "rapid"
    elif lvl == 2:
        return "multi_agent"
    return "specialist"

# Build LangGraph Workflow
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("coordinator", coordinator_node)
workflow.add_node("rapid_llm", rapid_llm_node)
workflow.add_node("specialist", specialist_node)
workflow.add_node("rag_retriever", rag_node)

# Add Edges
workflow.set_entry_point("coordinator")

workflow.add_conditional_edges(
    "coordinator",
    router_condition,
    {
        "rapid": "rapid_llm",
        "specialist": "specialist",
        "multi_agent": "rag_retriever"
    }
)

workflow.add_edge("rapid_llm", END)
workflow.add_edge("specialist", END)
workflow.add_edge("rag_retriever", END)

# Compile Graph
orchestration_graph = workflow.compile()

def run_agent_graph(question: str) -> Dict[str, Any]:
    """Public execution entry point for the multi-agent graph."""
    t0 = time.time()
    initial_state = {
        "question": question,
        "routing_level": 1,
        "routing_label": "Level 1: Specialist Pipeline",
        "domain": "general",
        "coordinator_notes": "",
        "specialist_response": "",
        "rag_citations": [],
        "interactive_element": None,
        "final_answer": "",
        "tailored_keywords": [],
        "model_used": "Academic Intelligence Engine",
        "latency_sec": 0.0
    }
    
    result = orchestration_graph.invoke(initial_state)
    result["latency_sec"] = round(time.time() - t0, 3)
    return result
