#!/usr/bin/env python3
"""
get_papers.py — given a topic or question, return REAL, verifiable research
papers: title, authors, year, abstract, and a working link — straight from
the source's own official search API. Nothing is guessed, scraped, or
fabricated; every link is one the API itself returned for that query.

Sources used (both free, no API key required, no scraping):
  - arXiv API           https://export.arxiv.org/api/query
  - Semantic Scholar API https://api.semanticscholar.org/graph/v1

CLI:
    python get_papers.py
    paper-finder> What is photosynthesis?
    paper-finder> exit
  python get_papers.py --query "black hole information paradox"
  python get_papers.py --query "transformer attention mechanism" --max 8
            (available open-access PDFs are verified and saved locally automatically)

Python API (for wiring into an agent / MCP tool):
  from get_papers import find_papers
  papers = find_papers("black hole information paradox", max_results=5)
  # -> list[Paper], each with .title .authors .year .url .pdf_url .abstract .source
"""
import argparse
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import requests

STORAGE = Path(__file__).parent / "downloaded_papers"

HEADERS = {
    "User-Agent": "paper-finder/1.0 (educational hackathon tool; contact: user)"
}

ARXIV_API = "https://export.arxiv.org/api/query"
SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1/paper/search"
ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}


@dataclass
class Paper:
    title: str
    authors: list
    year: Optional[str]
    abstract: str
    url: str            # the paper's real landing/abstract page
    pdf_url: Optional[str]  # a real, direct PDF link, if one exists
    source: str          # "arXiv" or "Semantic Scholar"
    citation_count: Optional[int] = None

    def pretty(self) -> str:
        authors_str = ", ".join(self.authors[:4]) + (" et al." if len(self.authors) > 4 else "")
        year_str = f" ({self.year})" if self.year else ""
        cite_str = f" · {self.citation_count} citations" if self.citation_count is not None else ""
        abstract_snip = (self.abstract[:280] + "…") if len(self.abstract) > 280 else self.abstract
        lines = [
            f"[{self.source}] {self.title}{year_str}",
            f"  Authors: {authors_str or 'unknown'}{cite_str}",
            f"  {abstract_snip}",
            f"  Link: {self.url}",
        ]
        if self.pdf_url:
            lines.append(f"  PDF:  {self.pdf_url}")
        return "\n".join(lines)


# --------------------------------------------------------------------------
# topic cleanup — strip question filler so the search query is on-topic
# --------------------------------------------------------------------------

_FILLER_PATTERNS = [
    r"^(what is|what are|who is|who are|explain|tell me about|how does|how do|"
    r"why does|why do|can you explain|could you explain|i want to know about|"
    r"give me info(?:rmation)? on|please explain)\s+",
]


def clean_query(user_text: str) -> str:
    q = user_text.strip().rstrip("?").strip()
    for pat in _FILLER_PATTERNS:
        q = re.sub(pat, "", q, flags=re.IGNORECASE)
    return q or user_text.strip()


# --------------------------------------------------------------------------
# arXiv
# --------------------------------------------------------------------------

def search_arxiv(query: str, max_results: int = 5) -> list:
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "relevance",
        "sortOrder": "descending",
    }
    resp = requests.get(ARXIV_API, params=params, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return parse_arxiv_atom(resp.text)


def parse_arxiv_atom(atom_text: str) -> list:
    """Parse arXiv's Atom XML response into Paper objects. Pure function so
    it can be unit-tested without hitting the network."""
    root = ET.fromstring(atom_text)
    papers = []
    for entry in root.findall("atom:entry", ATOM_NS):
        title = (entry.findtext("atom:title", default="", namespaces=ATOM_NS) or "").strip()
        title = re.sub(r"\s+", " ", title)
        if not title:
            continue
        summary = (entry.findtext("atom:summary", default="", namespaces=ATOM_NS) or "").strip()
        summary = re.sub(r"\s+", " ", summary)
        authors = [
            (a.findtext("atom:name", default="", namespaces=ATOM_NS) or "").strip()
            for a in entry.findall("atom:author", ATOM_NS)
        ]
        published = entry.findtext("atom:published", default="", namespaces=ATOM_NS) or ""
        year = published[:4] if published else None

        abs_url, pdf_url = None, None
        for link in entry.findall("atom:link", ATOM_NS):
            href = link.get("href")
            if link.get("type") == "application/pdf":
                pdf_url = href
            elif link.get("rel") == "alternate":
                abs_url = href
        if not abs_url:
            abs_url = entry.findtext("atom:id", default="", namespaces=ATOM_NS)

        papers.append(Paper(
            title=title, authors=authors, year=year, abstract=summary,
            url=abs_url, pdf_url=pdf_url, source="arXiv",
        ))
    return papers


# --------------------------------------------------------------------------
# Semantic Scholar
# --------------------------------------------------------------------------

def search_semantic_scholar(query: str, max_results: int = 5) -> list:
    params = {
        "query": query,
        "limit": max_results,
        "fields": "title,authors,year,abstract,url,openAccessPdf,citationCount",
    }
    resp = requests.get(SEMANTIC_SCHOLAR_API, params=params, headers=HEADERS, timeout=30)
    if resp.status_code == 429:
        # shared free-tier rate limit — not fatal, arXiv results still stand
        return []
    resp.raise_for_status()
    data = resp.json().get("data", [])
    papers = []
    for item in data:
        authors = [a.get("name", "") for a in (item.get("authors") or [])]
        oa = item.get("openAccessPdf") or {}
        papers.append(Paper(
            title=item.get("title") or "",
            authors=authors,
            year=str(item.get("year")) if item.get("year") else None,
            abstract=item.get("abstract") or "",
            url=item.get("url") or "",
            pdf_url=oa.get("url"),
            source="Semantic Scholar",
            citation_count=item.get("citationCount"),
        ))
    return papers


# --------------------------------------------------------------------------
# combine + dedupe
# --------------------------------------------------------------------------

def _norm_title(t: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", t.lower())


_QUERY_STOPWORDS = {
    "a", "an", "and", "are", "about", "be", "does", "how", "in", "is",
    "of", "on", "or", "the", "to", "what", "why", "with",
}


def _relevance_score(query: str, paper: Paper) -> int:
    query_terms = {
        term for term in re.findall(r"[a-z0-9]+", query.lower())
        if term not in _QUERY_STOPWORDS and len(term) > 1
    }
    title_terms = set(re.findall(r"[a-z0-9]+", paper.title.lower()))
    abstract_terms = set(re.findall(r"[a-z0-9]+", paper.abstract.lower()))
    title_matches = len(query_terms & title_terms)
    abstract_matches = len(query_terms & abstract_terms)
    phrase_match = query.lower() in paper.title.lower()
    return (title_matches * 10) + (abstract_matches * 2) + (8 if phrase_match else 0)


def find_papers(topic: str, max_results: int = 5) -> list:
    query = clean_query(topic)

    arxiv_results, ss_results = [], []
    try:
        arxiv_results = search_arxiv(query, max_results)
    except Exception as e:
        print(f"(arXiv search failed: {e})", file=sys.stderr)
    try:
        ss_results = search_semantic_scholar(query, max_results)
    except Exception as e:
        print(f"(Semantic Scholar search failed: {e})", file=sys.stderr)

    if not arxiv_results and not ss_results:
        raise SystemExit(
            f"No results from either source for '{query}'. "
            "Both are live official APIs — this means the query genuinely "
            "returned nothing, not that a link was omitted."
        )

    combined, seen = [], set()
    for p in arxiv_results + ss_results:
        key = _norm_title(p.title)
        if key and key not in seen:
            seen.add(key)
            combined.append(p)

    combined.sort(
        key=lambda p: (_relevance_score(query, p), p.citation_count or 0),
        reverse=True,
    )
    return combined[:max_results]


# --------------------------------------------------------------------------
# download the real PDF for a result
# --------------------------------------------------------------------------

def download_pdf(paper: Paper) -> Optional[Path]:
    if not paper.pdf_url:
        print(f"  (no open-access PDF available for: {paper.title})")
        return None

    STORAGE.mkdir(exist_ok=True)
    safe_name = re.sub(r"[^A-Za-z0-9]+", "_", paper.title)[:80].strip("_") or "paper"
    out_path = STORAGE / f"{safe_name}.pdf"
    if out_path.exists():
        print(f"  Already cached: {out_path}")
        return out_path

    resp = requests.get(paper.pdf_url, headers=HEADERS, timeout=60)
    resp.raise_for_status()
    data = resp.content
    if data[:5] != b"%PDF-":
        print(f"  WARNING: response for '{paper.title}' was not a real PDF — skipping save.")
        return None

    out_path.write_bytes(data)
    print(f"  Saved: {out_path}")
    return out_path


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def print_papers(query: str, max_results: int, download: bool = True) -> None:
    papers = find_papers(query, max_results)
    print(f"\nFound {len(papers)} real paper(s) for: {clean_query(query)}\n")
    for i, paper in enumerate(papers, 1):
        if download:
            print(f"{i}. {paper.source}: {paper.title}")
            print(f"  Authors: {', '.join(paper.authors[:4]) or 'unknown'}")
            download_pdf(paper)
            print(f"  Paper page: {paper.url}\n")
        else:
            print(f"{i}. {paper.pretty()}\n")


def interactive_session(max_results: int, download: bool = True) -> None:
    print("Paper Finder is ready. Ask research questions one at a time.")
    print("Type 'exit' or 'quit' to end the session.\n")
    while True:
        try:
            question = input("paper-finder> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye.")
            return

        if question.lower() in {"exit", "quit"}:
            print("Goodbye.")
            return
        if not question:
            continue

        try:
            print_papers(question, max_results, download)
        except SystemExit as error:
            print(f"\n{error}\n")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("question", nargs="?", help="Topic or question, e.g. 'black hole information paradox'")
    p.add_argument("--query", dest="query_option", help="Topic or question (alternative to the positional form)")
    p.add_argument("--max", type=int, default=5, help="Max results to return (default 5)")
    download_group = p.add_mutually_exclusive_group()
    download_group.add_argument(
        "--download", dest="download", action="store_true", default=True,
        help="Download open-access PDFs automatically (default)",
    )
    download_group.add_argument(
        "--no-download", dest="download", action="store_false",
        help="Do not download PDFs; show paper metadata only",
    )
    args = p.parse_args()

    if args.question and args.query_option:
        p.error("provide the question either as an argument or with --query, not both")
    query = args.query_option or args.question
    if not query:
        interactive_session(args.max, args.download)
        return

    print_papers(query, args.max, args.download)


if __name__ == "__main__":
    main()
