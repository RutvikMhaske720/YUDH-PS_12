#!/usr/bin/env python3
"""
NCERT / Balbharati textbook fetcher.

Give it a class, subject and medium (language) and it hands you back a single
merged PDF on disk — no links, no leftover zips.

Usage
-----
Interactive (just answer the prompts):
    python get_textbook.py

Direct:
    python get_textbook.py --class 9 --subject Maths --medium English
    python get_textbook.py --class 10 --subject Science --medium Hindi
    python get_textbook.py --list                      # see every class/subject/medium it knows

Notes
-----
- NCERT support is fully automated: it downloads the official chapter-wise
  ZIP straight from ncert.nic.in, verifies the file is really a ZIP (not an
  HTML error page in disguise — see WHY THE OLD VERSION BROKE below),
  extracts every chapter PDF, sorts them into the correct book order, and
  merges them into one PDF.
- Balbharati (Maharashtra State Board / eBalbharati) is NOT auto-downloadable
  the same way. Its portal (cart.ebalbharati.in) is a dynamic ASP.NET form —
  there is no stable, predictable file URL to fetch the way NCERT has one.
  Passing --board balbharati prints the exact page + selections to make
  there instead of silently producing a broken file.

WHY THE OLD VERSION BROKE
--------------------------
A ".zip" that won't open almost always means the server didn't send you a
real zip — a slow/blocked/rate-limited government server often answers a
scripted request with an HTML page instead of the file, and if the code
only checks the HTTP status code / response size, that HTML page sails
through disguised as a "successful download". This script instead checks
the first few bytes of whatever it downloaded (a real zip always starts
with the bytes 'PK') before treating it as one, and shows you a snippet of
what actually came back if it didn't.
"""

import argparse
import difflib
import io
import os
import re
import sys
import time
import zipfile
from pathlib import Path
from typing import Optional

try:
    import requests
except ImportError:
    sys.exit("Missing dependency 'requests'. Run: pip install -r requirements.txt")

from catalog_data import NCERT_BOOKS, Book  # vendored catalog (see catalog_data.py)

# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------

OUTPUT_DIR = Path("textbooks")           # final merged PDFs land here
WORK_DIR = Path(".cache_ncert")          # scratch space for raw zips / extracted chapters
MAX_RETRIES = 3
REQUEST_TIMEOUT = 60

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/zip, application/octet-stream, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://ncert.nic.in/textbook.php",
}

ZIP_MAGIC_PREFIXES = (b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08")

BALBHARATI_NOTE = """
Balbharati (eBalbharati / Maharashtra State Board) can't be auto-downloaded
the way NCERT can — its portal is a dynamic form, not a fixed file URL:

    1. Open: https://cart.ebalbharati.in/BalBooks/ebook.aspx
    2. Select: Class {class_num}, Medium: {medium}, Subject: {subject}
    3. Click "Download" on the book you need.

If you find (e.g. via your browser's Network tab) that a given book DOES
sit behind a stable direct link, you can add it to catalog_data.py as a
Book(...) entry the same shape as the NCERT ones and this script will
download/merge it exactly the same way.
""".strip()


# --------------------------------------------------------------------------
# Catalog helpers
# --------------------------------------------------------------------------

def _norm(s: str) -> str:
    return re.sub(r"[\s_-]+", "", s).lower()


def available_classes() -> list[int]:
    return sorted({b.class_num for b in NCERT_BOOKS})


def available_subjects(class_num: int) -> list[str]:
    return sorted({b.subject for b in NCERT_BOOKS if b.class_num == class_num})


def available_mediums(class_num: int, subject: str) -> list[str]:
    return sorted({
        b.language for b in NCERT_BOOKS
        if b.class_num == class_num and _norm(b.subject) == _norm(subject)
    })


def find_books(class_num: int, subject: str, medium: str) -> list[Book]:
    """All Book entries (parts) matching class/subject/medium, in part order."""
    matches = [
        b for b in NCERT_BOOKS
        if b.class_num == class_num
        and _norm(b.subject) == _norm(subject)
        and _norm(b.language) == _norm(medium)
    ]
    matches.sort(key=lambda b: (b.part or 0))
    return matches


def suggest_subject(class_num: int, subject: str) -> Optional[str]:
    choices = available_subjects(class_num)
    hit = difflib.get_close_matches(subject, choices, n=1, cutoff=0.4)
    return hit[0] if hit else None


# --------------------------------------------------------------------------
# Download with real verification
# --------------------------------------------------------------------------

class DownloadError(RuntimeError):
    pass


def download_zip_bytes(url: str) -> bytes:
    """Download url, verify the response is actually a ZIP, return raw bytes."""
    last_err: Optional[Exception] = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            if attempt > 1:
                time.sleep(2 ** (attempt - 1))  # 2s, 4s
            resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, stream=True)
            resp.raise_for_status()

            content_type = resp.headers.get("Content-Type", "")
            data = resp.content

            if not data.startswith(ZIP_MAGIC_PREFIXES):
                snippet = data[:200]
                try:
                    snippet_text = snippet.decode("utf-8", errors="replace")
                except Exception:
                    snippet_text = repr(snippet)
                raise DownloadError(
                    f"Server did not return a real ZIP file (Content-Type: "
                    f"{content_type or 'unknown'}, {len(data)} bytes).\n"
                    f"First bytes of what it actually sent:\n{snippet_text[:200]!r}"
                )

            return data

        except (requests.exceptions.RequestException, DownloadError) as e:
            last_err = e
            continue

    raise DownloadError(f"Failed after {MAX_RETRIES} attempts: {last_err}") from last_err


def _chapter_sort_key(filename: str) -> int:
    stem = Path(filename).stem.lower()
    if "ps" in stem:
        return -10
    if "intro" in stem:
        return -5
    if "an" in stem:
        return 1000
    m = re.search(r"(\d+)$", stem)
    if m:
        return int(m.group(1))
    if stem.endswith("a1") or "app1" in stem:
        return 1001
    if stem.endswith("a2") or "app2" in stem:
        return 1002
    return 100


def extract_chapter_pdfs(zip_bytes: bytes, extract_to: Path) -> list[Path]:
    if extract_to.exists():
        for old_file in extract_to.rglob("*"):
            if old_file.is_file():
                old_file.unlink()
    extract_to.mkdir(parents=True, exist_ok=True)
    try:
        with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
            zf.extractall(extract_to)
    except zipfile.BadZipFile as e:
        raise DownloadError(f"Downloaded file claimed to be a zip but failed to open: {e}") from e

    pdfs = sorted(extract_to.rglob("*.pdf"), key=lambda p: _chapter_sort_key(p.name))
    if not pdfs:
        raise DownloadError("ZIP downloaded and opened fine, but it contained no PDF chapters.")

    try:
        from pypdf import PdfReader
        for pdf in pdfs:
            if not pdf.stat().st_size or not PdfReader(str(pdf)).pages:
                raise DownloadError(f"Downloaded chapter is empty: {pdf.name}")
    except ImportError:
        sys.exit("Missing dependency 'pypdf'. Run: pip install -r requirements.txt")
    return pdfs


def merge_pdfs(pdf_paths: list[Path], out_path: Path) -> Path:
    try:
        from pypdf import PdfWriter
    except ImportError:
        sys.exit("Missing dependency 'pypdf'. Run: pip install -r requirements.txt")

    writer = PdfWriter()
    for p in pdf_paths:
        writer.append(str(p))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "wb") as f:
        writer.write(f)
    if not out_path.stat().st_size or not writer.pages:
        raise DownloadError("The merged PDF is empty; no textbook content was written.")
    return out_path


# --------------------------------------------------------------------------
# Main flow
# --------------------------------------------------------------------------

def get_textbook_pdf(class_num: int, subject: str, medium: str) -> str:
    """
    Download, verify, extract and merge the requested NCERT textbook.
    Returns the absolute path to the final merged PDF.
    """
    books = find_books(class_num, subject, medium)
    if not books:
        hint = suggest_subject(class_num, subject)
        msg = f"No NCERT catalog entry for Class {class_num} / {subject} / {medium}."
        if hint:
            msg += f" Did you mean '{hint}'?"
        msg += f"\nAvailable subjects for Class {class_num}: {', '.join(available_subjects(class_num))}"
        raise DownloadError(msg)

    all_chapter_pdfs: list[Path] = []
    for book in books:
        print(f"  -> downloading: {book}")
        zip_bytes = download_zip_bytes(book.url)
        part_dir = WORK_DIR / f"class{class_num}_{_norm(subject)}_{_norm(medium)}_part{book.part or 1}"
        chapters = extract_chapter_pdfs(zip_bytes, part_dir)
        print(f"     {len(chapters)} chapter PDF(s) found")
        all_chapter_pdfs.extend(chapters)

    safe_subject = re.sub(r"[^\w\-]+", "_", subject)
    safe_medium = re.sub(r"[^\w\-]+", "_", medium)
    out_path = OUTPUT_DIR / f"Class_{class_num}_{safe_subject}_{safe_medium}.pdf"
    merge_pdfs(all_chapter_pdfs, out_path)
    return str(out_path.resolve())


def list_catalog() -> None:
    for class_num in available_classes():
        print(f"Class {class_num}:")
        for subject in available_subjects(class_num):
            mediums = available_mediums(class_num, subject)
            print(f"   {subject:<20} [{', '.join(mediums)}]")
    print(f"\n{len(NCERT_BOOKS)} catalog entries total (NCERT, classes 1-12).")


def interactive() -> tuple[int, str, str, str]:
    board = input("Board [ncert/balbharati] (default: ncert): ").strip().lower() or "ncert"
    class_num = int(input("Class (1-12): ").strip())
    if board == "ncert":
        subjects = available_subjects(class_num)
        print(f"Subjects available for Class {class_num}: {', '.join(subjects)}")
    subject = input("Subject: ").strip()
    medium = input("Medium/Language (English/Hindi): ").strip() or "English"
    return class_num, subject, medium, board


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch an NCERT/Balbharati textbook as one merged PDF.")
    parser.add_argument("--class", dest="class_num", type=int, help="Class number, e.g. 9")
    parser.add_argument("--subject", help="Subject, e.g. Maths, Science, Social_Science")
    parser.add_argument("--medium", default="English", help="Medium/language, e.g. English, Hindi")
    parser.add_argument("--board", default="ncert", choices=["ncert", "balbharati"], help="Which board's catalog to use")
    parser.add_argument("--list", action="store_true", help="List every class/subject/medium in the catalog and exit")
    args = parser.parse_args()

    if args.list:
        list_catalog()
        return

    if args.class_num and args.subject:
        class_num, subject, medium, board = args.class_num, args.subject, args.medium, args.board
    else:
        class_num, subject, medium, board = interactive()

    if board == "balbharati":
        print(BALBHARATI_NOTE.format(class_num=class_num, medium=medium, subject=subject))
        return

    try:
        path = get_textbook_pdf(class_num, subject, medium)
    except DownloadError as e:
        sys.exit(f"\n❌ {e}")

    print(f"\n✅ Done. Merged textbook PDF at:\n   {path}")


if __name__ == "__main__":
    main()
