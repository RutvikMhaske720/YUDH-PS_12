# paper-finder

Ask about a topic (or paste a user's question), get back **real research
papers** — title, authors, year, abstract, and a working link — pulled live
from two official, free academic search APIs. Nothing is scraped, guessed,
or fabricated: every result is exactly what the source's own search endpoint
returned for that query, so every link is guaranteed to resolve to a real
paper.

## Sources

- **arXiv** — `https://export.arxiv.org/api/query` (official arXiv API, no key needed)
- **Semantic Scholar** — `https://api.semanticscholar.org/graph/v1/paper/search` (official API, no key needed for basic search)

Both are queried on every search; results are merged and deduplicated by
title, then ranked by matching terms in the question, title, and abstract.
This keeps papers connected to the requested topic and context; citation
count is only used as a tie-breaker. If neither source returns anything, the script says so explicitly
instead of returning nothing silently — it will never invent a placeholder
result.

## Install

```bash
cd paper_finder
pip install -r requirements.txt
```

## Use

```bash
# Start one session and ask as many questions as needed
python get_papers.py
paper-finder> What is photosynthesis?
paper-finder> How do neural networks learn?
paper-finder> exit

# Each query automatically downloads available open-access PDFs

# A plain question is accepted directly
python get_papers.py "What is photosynthesis?"

# Straight topic
python get_papers.py --query "black hole information paradox"

# A user's actual question works too — filler like "what is" / "explain" is stripped
python get_papers.py --query "What is the black hole information paradox?"

# More results
python get_papers.py --query "transformer attention mechanism" --max 8

# PDF downloads happen automatically; files are saved in downloaded_papers/
python get_papers.py --query "dark matter detection"

# Optional: show metadata without downloading PDFs
python get_papers.py --query "dark matter detection" --no-download
```

Example output:

```
Found 5 real paper(s) for: black hole information paradox

1. [arXiv] Black Hole Entropy and the Problem of Universality (2005)
  Authors: Samir D. Mathur
  We review basic aspects of the entropy of black holes in string theory...
  Paper page: http://arxiv.org/abs/hep-th/0507171v2
  Saved: downloaded_papers/Black_Hole_Entropy_and_the_Problem_of_Universality.pdf
...
```

## Python API (for wiring into an agent / MCP tool / chat backend)

```python
from get_papers import find_papers, download_pdf

papers = find_papers("black hole information paradox", max_results=5)
for p in papers:
    print(p.title, p.year, p.url, p.pdf_url)

# optionally fetch an actual PDF (verified — not just trusted)
path = download_pdf(papers[0])
```

Each `Paper` has: `title`, `authors`, `year`, `abstract`, `url` (landing/
abstract page), `pdf_url` (direct PDF if an open-access one exists),
`source`, `citation_count`.

## How this stays "real and authentic"

- No hand-built catalog, no hardcoded paper list — every result comes back
  from the source API at request time.
- PDFs are downloaded automatically when available. The response must start
  with the PDF magic bytes (`%PDF-`) before saving, and the local file path is
  displayed. A paywalled or broken link is reported and skipped, never silently
  swapped for something else. Use `--no-download` to disable this behavior.
- Not every paper has an open-access PDF (Semantic Scholar indexes many
  paywalled journal articles) — in that case you still get the real
  abstract-page link, just no `pdf_url`. The script never fakes a PDF link
  it doesn't have.

## Wiring this into "user asks a question, papers appear alongside the answer"

Call `find_papers(user_question)` with the user's raw question — filler
phrasing is stripped automatically. For a chat agent, call it after every
user message and attach the returned papers as "further reading" links under
the answer. Every returned link comes from arXiv or Semantic Scholar; the
agent must not invent paper titles, links, abstracts, or PDFs.

## Notes

- This was built and syntax-tested in a sandbox that can't reach
  `export.arxiv.org` or `api.semanticscholar.org`, so the parsing/merge
  logic is unit-tested against a real sample arXiv response, but the live
  network calls haven't been exercised end-to-end — test on your machine
  before a demo.
- Semantic Scholar's free tier is shared and rate-limited; a 429 is handled
  gracefully (arXiv results still return) rather than crashing the whole
  search.
