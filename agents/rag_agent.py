"""
Phoenix Academic Intelligence - Specialist RAG & Citation Agent
Retrieves verified chapter, section, and page citations from NCERT and arXiv.
"""

from typing import Dict, Any, List
from rag_pipeline import rag_pipeline_instance

class RAGAgent:
    """Retrieval specialist for chapter & page-level verified academic citations."""

    def __init__(self):
        self.rag = rag_pipeline_instance

    def retrieve_citations(self, query: str, domain: str) -> Dict[str, Any]:
        """Queries the PageIndex and returns verified citations."""
        return self.rag.retrieve_verified_citations(query, domain)
