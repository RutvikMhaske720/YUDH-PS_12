# NCERT / Balbharati Textbook Fetcher

Ask for a class, subject and medium — get back one merged PDF on disk.
No links, no zip files left lying around.

## Setup

```bash
pip install -r requirements.txt
```

## Usage

Interactive:
```bash
python get_textbook.py
```

Direct:
```bash
python get_textbook.py --class 9 --subject Maths --medium English
python get_textbook.py --class 10 --subject Science --medium Hindi
```

See everything it knows about:
```bash
python get_textbook.py --list
```

The finished file is printed at the end, e.g.:
```
✅ Done. Merged textbook PDF at:
   /home/you/ncert_textbook_fetcher/textbooks/Class_9_Maths_English.pdf
```

## What's inside

- `get_textbook.py` — the CLI, and `get_textbook_pdf(class_num, subject, medium)`,
  a plain function you can import and call from your own agent/backend if you're
  wiring this into a bigger project. It returns a file path, not a URL.
- `catalog_data.py` — the real class 1–12 × subject × medium → NCERT zip-URL
  catalog, vendored unmodified from
  [dileeppandey/ncert-book-downloader](https://github.com/dileeppandey/ncert-book-downloader)
  (MIT license, preserved in `LICENSE_ncert_downloader.txt`).

## Why your last version gave you a broken `.zip`

A `.zip` that won't open almost always means the server didn't actually send
you a zip. Government servers under load or rate-limiting will often answer
a scripted request with an HTML error/redirect page instead of the file —
and if the code only checks the HTTP status code and file size, that HTML
page sails through disguised as a "successful download."

This version checks the **first few bytes** of whatever it downloaded before
trusting it: a real zip always starts with `PK`. If it doesn't, you get a
clear error and a snippet of what actually came back, instead of a silently
corrupted file. It also verifies the zip actually opens and contains PDF
chapters before calling it a success, and retries with backoff on network
errors.

## Balbharati / eBalbharati — honest limitation

NCERT works because its books live at fixed, predictable URLs
(`ncert.nic.in/textbook/pdf/<code>.zip`) — that's what makes automated
fetching possible.

**Balbharati doesn't have that.** Its portal
(`cart.ebalbharati.in/BalBooks/ebook.aspx`) is a dynamic ASP.NET form: you
pick class/medium/subject from dropdowns and it generates the download
server-side. There's no stable file-URL pattern to hit directly, and no
open, maintained catalog of one like there is for NCERT.

Running `--board balbharati` won't silently produce a broken file — it
prints you the exact page and the selections to make there by hand instead.
If you find (e.g. via your browser's Network tab while downloading a book
manually) that a particular book *does* sit behind a stable direct link,
add it to `catalog_data.py` as a `Book(...)` entry in the same shape as the
NCERT ones, and this script will download/verify/merge it identically.

## Before a live demo

Pre-warm whatever class/subject you'll actually query on stage — run the
command once yourself beforehand so the merged PDF already exists locally
and nothing depends on a live download succeeding in front of judges.
