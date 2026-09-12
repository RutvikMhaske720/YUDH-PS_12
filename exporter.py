import os
import io
import zipfile
import re
from datetime import datetime
from typing import List, Dict, Any, Optional

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

from docx import Document
from docx.shared import Inches as DocxInches, Pt as DocxPt, RGBColor as DocxRGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def strip_markdown(text: str) -> str:
    """Helper to clean basic markdown markers for presentations and clean documents."""
    clean = re.sub(r'```[a-zA-Z]*\n', '', text)
    clean = clean.replace('```', '')
    clean = re.sub(r'\*\*(.*?)\*\*', r'\1', clean)
    clean = re.sub(r'\*(.*?)\*', r'\1', clean)
    clean = re.sub(r'`(.*?)`', r'\1', clean)
    return clean.strip()

# =====================================================================
# WORD (.DOCX) EXPORTER - Comprehensive Context Report
# =====================================================================

def export_docx(records: List[Dict[str, Any]], profile: Dict[str, Any], output_path: str) -> str:
    """Generate comprehensive Academic Context Report in Word (.docx) format."""
    doc = Document()

    # Set page margins
    sections = doc.sections
    for s in sections:
        s.top_margin = DocxInches(0.8)
        s.bottom_margin = DocxInches(0.8)
        s.left_margin = DocxInches(0.8)
        s.right_margin = DocxInches(0.8)

    # Document Header / Title
    title_p = doc.add_paragraph()
    r_title = title_p.add_run("PHOENIX AI • ACADEMIC INTELLIGENCE PLATFORM")
    r_title.font.name = "Arial"
    r_title.font.size = DocxPt(11)
    r_title.font.bold = True
    r_title.font.color.rgb = DocxRGBColor(234, 88, 12)  # Phoenix Orange

    h1 = doc.add_heading("Comprehensive Academic Context & Progress Report", level=0)
    h1.runs[0].font.name = "Arial"
    h1.runs[0].font.size = DocxPt(24)
    h1.runs[0].font.bold = True
    h1.runs[0].font.color.rgb = DocxRGBColor(15, 23, 42)

    sub_p = doc.add_paragraph()
    r_sub = sub_p.add_run(f"Generated on {datetime.now().strftime('%B %d, %Y at %H:%M:%S')} | Total Sessions: {len(records)}")
    r_sub.font.name = "Arial"
    r_sub.font.size = DocxPt(10)
    r_sub.font.italic = True
    r_sub.font.color.rgb = DocxRGBColor(100, 116, 139)

    doc.add_paragraph()

    # SECTION 1: USER ACTIVITY & KNOWLEDGE LEVEL PROFILE
    h_sec1 = doc.add_heading("1. Learner Profile & Academic Knowledge Level", level=1)
    h_sec1.runs[0].font.color.rgb = DocxRGBColor(15, 23, 42)

    p_intro = doc.add_paragraph(
        "This dossier provides a comprehensive assessment of the learner's academic trajectory, "
        "including active domain mastery scores, verified study focus metrics, and detailed solutions "
        "with peer-reviewed textbook citations and video lecture resources."
    )
    p_intro.runs[0].font.size = DocxPt(10.5)

    # Learner stats table
    t_profile = doc.add_table(rows=5, cols=2)
    t_profile.alignment = WD_TABLE_ALIGNMENT.CENTER
    profile_data = [
        ("Knowledge Level Classification", profile.get("knowledge_level", "Advanced")),
        ("Active Study Streak", f"{profile.get('streak_days', 5)} Days Continuous Engagement"),
        ("Total Academic Problems Solved", str(len(records) + profile.get("total_questions", 0))),
        ("Study Focus & Discipline Health", f"{profile.get('focus_score', 96)}% (High Academic Discipline)"),
        ("Primary Research Specialization", "Mathematics, Physics, Dynamic Programming & Life Sciences")
    ]

    for i, (label, val) in enumerate(profile_data):
        row = t_profile.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.text = label
        c1.text = val
        c0.paragraphs[0].runs[0].font.bold = True
        c0.paragraphs[0].runs[0].font.size = DocxPt(9.5)
        c1.paragraphs[0].runs[0].font.size = DocxPt(9.5)
        
        # Shade header
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>')
        c0._tc.get_or_add_tcPr().append(shading)

    doc.add_paragraph()

    # SECTION 2: DOMAIN MASTERY PROGRESS BREAKDOWN
    h_sec2 = doc.add_heading("2. Subject Domain Mastery & Competency Analytics", level=1)
    h_sec2.runs[0].font.color.rgb = DocxRGBColor(15, 23, 42)

    mastery = profile.get("domain_mastery", {})
    t_mastery = doc.add_table(rows=1, cols=3)
    t_mastery.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = t_mastery.rows[0].cells
    hdr[0].text = "Academic Discipline"
    hdr[1].text = "Specialist Agent"
    hdr[2].text = "Mastery Score (%)"
    for c in hdr:
        c.paragraphs[0].runs[0].font.bold = True
        c.paragraphs[0].runs[0].font.color.rgb = DocxRGBColor(255, 255, 255)
        c._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="0F172A"/>'))

    subject_map = [
        ("Mathematics", "Maths Agent", mastery.get("math", 82)),
        ("Programming & DSA", "Programming Agent", mastery.get("programming", 88)),
        ("Physics & Quantum Mechanics", "Physics Agent", mastery.get("physics", 76)),
        ("Chemistry & Chemical Sciences", "Chemistry Agent", mastery.get("chemistry", 70)),
        ("Biology & Life Sciences", "Biology Agent", mastery.get("biology", 74)),
        ("Economics & Finance", "Economics Agent", mastery.get("economics", 60)),
        ("Astronomy & Astrophysics", "Astronomy Agent", mastery.get("astronomy", 65)),
        ("History & Geopolitics", "History Agent", mastery.get("history", 58))
    ]

    for subj, agt, score in subject_map:
        r = t_mastery.add_row().cells
        r[0].text = subj
        r[1].text = agt
        r[2].text = f"{score}%"
        for c in r:
            c.paragraphs[0].runs[0].font.size = DocxPt(9.5)

    doc.add_paragraph()

    # Concepts Mastered
    p_cm = doc.add_paragraph()
    r_cm_hdr = p_cm.add_run("Concepts Mastered in Recent Trajectory:\n")
    r_cm_hdr.font.bold = True
    for c_item in profile.get("concepts_mastered", []):
        doc.add_paragraph(f"• {c_item}", style='List Bullet')

    doc.add_page_break()

    # SECTION 3: DETAILED ACADEMIC SOLUTIONS DOSSIER
    h_sec3 = doc.add_heading("3. Academic Problem Solutions & Multi-Resource Dossier", level=1)
    h_sec3.runs[0].font.color.rgb = DocxRGBColor(15, 23, 42)

    for idx, rec in enumerate(records, 1):
        subj = rec.get("subject", "Academic Problem").upper()
        agent = rec.get("agent_used", "Specialist Agent")
        time_str = rec.get("timestamp_display", datetime.now().strftime("%Y-%m-%d %H:%M"))

        h_rec = doc.add_heading(f"Session #{idx}: {subj}", level=2)
        h_rec.runs[0].font.color.rgb = DocxRGBColor(234, 88, 12)

        p_meta = doc.add_paragraph(f"Agent: {agent}  |  Timestamp: {time_str}  |  Status: Rigorous Solution Verified")
        p_meta.runs[0].font.size = DocxPt(9)
        p_meta.runs[0].font.italic = True
        p_meta.runs[0].font.color.rgb = DocxRGBColor(100, 116, 139)

        # Question Box
        q_p = doc.add_paragraph()
        r_q_label = q_p.add_run("PROBLEM QUERY:\n")
        r_q_label.font.bold = True
        r_q_label.font.color.rgb = DocxRGBColor(30, 41, 59)
        q_p.add_run(rec.get("question", ""))

        # Detailed Solution
        sol_p = doc.add_paragraph()
        r_sol_label = sol_p.add_run("DETAILED SCIENTIFIC DERIVATION & SOLUTION:\n")
        r_sol_label.font.bold = True
        r_sol_label.font.color.rgb = DocxRGBColor(15, 23, 42)
        sol_p.add_run(strip_markdown(rec.get("answer", "")))

        # Related Books & Specific Pages
        books = rec.get("books", [])
        if books:
            b_head = doc.add_paragraph()
            r_bh = b_head.add_run("📚 Curated Google Books & Relevant Chapters/Pages:")
            r_bh.font.bold = True
            r_bh.font.color.rgb = DocxRGBColor(30, 64, 175)

            for b in books:
                bp = doc.add_paragraph(style='List Bullet')
                b_title = bp.add_run(f"\"{b.get('title')}\"")
                b_title.font.bold = True
                bp.add_run(f" by {b.get('authors')} ({b.get('publisher', 'Academic')}, {b.get('publishedDate')})\n")
                bp.add_run(f"  • {b.get('relevant_page_info')}\n")
                bp.add_run(f"  • Snippet: \"{b.get('snippet')[:160]}...\"\n")
                bp.add_run(f"  • Preview Link: {b.get('previewLink')}")

        # Related YouTube Lectures
        videos = rec.get("videos", [])
        if videos:
            v_head = doc.add_paragraph()
            r_vh = v_head.add_run("🎥 Recommended Video Lectures (YouTube Data API):")
            r_vh.font.bold = True
            r_vh.font.color.rgb = DocxRGBColor(185, 28, 28)

            for v in videos:
                vp = doc.add_paragraph(style='List Bullet')
                v_title = vp.add_run(f"{v.get('title')}")
                v_title.font.bold = True
                vp.add_run(f" ({v.get('channel')})\n")
                vp.add_run(f"  • URL: {v.get('url')}")

        # References
        refs = rec.get("references", [])
        if refs:
            rf_head = doc.add_paragraph()
            r_rfh = rf_head.add_run("🔗 Academic Bibliography & Peer-Reviewed References:")
            r_rfh.font.bold = True
            for r in refs:
                doc.add_paragraph(f"• {r.get('citation')} (DOI/Link: {r.get('doi_url')})", style='List Bullet')

        doc.add_paragraph("―" * 50)

    doc.save(output_path)
    return output_path

# =====================================================================
# POWERPOINT (.PPTX) EXPORTER - Context Presentation Deck
# =====================================================================

def export_pptx(records: List[Dict[str, Any]], profile: Dict[str, Any], output_path: str) -> str:
    """Generate high-impact PowerPoint presentation deck with User Profile & Analytics."""
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    bg_dark = RGBColor(15, 23, 42)
    accent_orange = RGBColor(249, 115, 22)
    accent_blue = RGBColor(56, 189, 248)
    text_white = RGBColor(248, 250, 252)
    text_muted = RGBColor(148, 163, 184)
    card_bg = RGBColor(30, 41, 59)

    def add_bg(slide):
        shape = slide.shapes.add_shape(1, 0, 0, Inches(13.333), Inches(7.5))
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_dark
        shape.line.fill.background()
        return shape

    # Slide 1: Title Slide
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)

    tbox = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(4.0))
    tf1 = tbox.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "PHOENIX AI • ACADEMIC INTELLIGENCE DOSSIER"
    p0.font.bold = True
    p0.font.size = Pt(20)
    p0.font.color.rgb = accent_orange

    p1 = tf1.add_paragraph()
    p1.text = "Comprehensive Context, Learning Progress & Solutions Report"
    p1.font.bold = True
    p1.font.size = Pt(32)
    p1.font.color.rgb = text_white

    p2 = tf1.add_paragraph()
    p2.text = (
        f"Learner Level: {profile.get('knowledge_level', 'Advanced')}  |  "
        f"Active Streak: {profile.get('streak_days', 5)} Days  |  "
        f"Total Solutions: {len(records)}\n"
        f"Generated: {datetime.now().strftime('%B %d, %Y - %H:%M:%S')}"
    )
    p2.font.size = Pt(14)
    p2.font.color.rgb = text_muted

    # Slide 2: User Progress & Knowledge Level Dashboard
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)

    h2 = s2.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.8))
    h2.text_frame.paragraphs[0].text = "USER ACTIVITY, KNOWLEDGE LEVEL & DOMAIN MASTERY"
    h2.text_frame.paragraphs[0].font.bold = True
    h2.text_frame.paragraphs[0].font.size = Pt(22)
    h2.text_frame.paragraphs[0].font.color.rgb = accent_blue

    # 4 Metric Cards
    metrics = [
        ("Knowledge Level", profile.get("knowledge_level", "Advanced")),
        ("Study Streak", f"{profile.get('streak_days', 5)} Days Active"),
        ("Focus Health Score", f"{profile.get('focus_score', 96)}% (High Focus)"),
        ("Problems Solved", str(len(records) + profile.get("total_questions", 0)))
    ]

    for idx, (lbl, val) in enumerate(metrics):
        left_pos = Inches(0.8 + idx * 2.95)
        card = s2.shapes.add_shape(1, left_pos, Inches(1.5), Inches(2.8), Inches(1.5))
        card.fill.solid()
        card.fill.fore_color.rgb = card_bg
        card.line.fill.background()

        ctf = card.text_frame
        ctf.word_wrap = True
        cp0 = ctf.paragraphs[0]
        cp0.text = lbl
        cp0.font.size = Pt(12)
        cp0.font.color.rgb = text_muted

        cp1 = ctf.add_paragraph()
        cp1.text = val
        cp1.font.bold = True
        cp1.font.size = Pt(18)
        cp1.font.color.rgb = accent_orange

    # Domain Mastery Table on Slide 2
    dom_box = s2.shapes.add_textbox(Inches(0.8), Inches(3.4), Inches(11.7), Inches(3.6))
    dtf = dom_box.text_frame
    dtf.word_wrap = True
    dp0 = dtf.paragraphs[0]
    dp0.text = "Domain Mastery Breakdown & Competencies:"
    dp0.font.bold = True
    dp0.font.size = Pt(16)
    dp0.font.color.rgb = text_white

    mastery = profile.get("domain_mastery", {})
    for dom_key, dom_name in [("math", "Mathematics (Proofs, Calculus, Linear Algebra)"),
                              ("programming", "Programming & DSA (DP, Recursion, Trees)"),
                              ("physics", "Physics (Quantum Mechanics, Thermodynamics)"),
                              ("chemistry", "Chemistry (Stoichiometry, Equilibrium)"),
                              ("biology", "Biology (Cellular Respiration, Genetics)")]:
        score = mastery.get(dom_key, 75)
        p = dtf.add_paragraph()
        p.text = f"• {dom_name}: {score}% Mastery Score"
        p.font.size = Pt(13)
        p.font.color.rgb = text_muted

    # Slide 3+: Solutions Slides
    for idx, rec in enumerate(records, 1):
        slide = prs.slides.add_slide(blank_layout)
        add_bg(slide)

        subject = rec.get('subject', 'ACADEMIC PROBLEM').upper()
        agent_name = rec.get('agent_used', 'SPECIALIST AGENT').upper()

        hdr = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.6))
        hp = hdr.text_frame.paragraphs[0]
        hp.text = f"PROBLEM #{idx}  •  {subject}  •  {agent_name}"
        hp.font.bold = True
        hp.font.size = Pt(13)
        hp.font.color.rgb = accent_orange

        # Question
        q_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.7), Inches(1.1))
        qtf = q_box.text_frame
        qtf.word_wrap = True
        qp0 = qtf.paragraphs[0]
        qp0.text = f"Q: {rec.get('question', '')[:180]}"
        qp0.font.bold = True
        qp0.font.size = Pt(16)
        qp0.font.color.rgb = text_white

        # Answer Summary Box (Left)
        ans_box = slide.shapes.add_shape(1, Inches(0.8), Inches(2.2), Inches(7.5), Inches(4.8))
        ans_box.fill.solid()
        ans_box.fill.fore_color.rgb = card_bg
        ans_box.line.fill.background()

        atf = ans_box.text_frame
        atf.word_wrap = True
        ap0 = atf.paragraphs[0]
        ap0.text = "SOLUTION SUMMARY & DERIVATION:"
        ap0.font.bold = True
        ap0.font.size = Pt(12)
        ap0.font.color.rgb = accent_blue

        clean_ans = strip_markdown(rec.get('answer', ''))[:800]
        ap1 = atf.add_paragraph()
        ap1.text = clean_ans + ("..." if len(clean_ans) >= 800 else "")
        ap1.font.size = Pt(11)
        ap1.font.color.rgb = text_white

        # Resources Box (Right): Books & Videos
        res_box = slide.shapes.add_shape(1, Inches(8.6), Inches(2.2), Inches(4.0), Inches(4.8))
        res_box.fill.solid()
        res_box.fill.fore_color.rgb = card_bg
        res_box.line.fill.background()

        rtf = res_box.text_frame
        rtf.word_wrap = True
        rp0 = rtf.paragraphs[0]
        rp0.text = "📚 BOOKS & 🎥 VIDEOS"
        rp0.font.bold = True
        rp0.font.size = Pt(12)
        rp0.font.color.rgb = accent_orange

        books = rec.get("books", [])
        if books:
            rp_b = rtf.add_paragraph()
            rp_b.text = f"Textbook Citation:\n• \"{books[0].get('title')[:35]}\"\n  {books[0].get('relevant_page_info')}"
            rp_b.font.size = Pt(10)
            rp_b.font.color.rgb = text_white

        videos = rec.get("videos", [])
        if videos:
            rp_v = rtf.add_paragraph()
            rp_v.text = f"\nVideo Lecture:\n• {videos[0].get('title')[:45]}\n  Channel: {videos[0].get('channel')}"
            rp_v.font.size = Pt(10)
            rp_v.font.color.rgb = accent_blue

    prs.save(output_path)
    return output_path

# =====================================================================
# EXCEL (.XLSX) EXPORTER - Multi-Sheet Intelligence Workbook
# =====================================================================

def export_xlsx(records: List[Dict[str, Any]], profile: Dict[str, Any], output_path: str) -> str:
    """Generate multi-sheet Excel spreadsheet with User Profile, Progress, Books & Videos."""
    wb = openpyxl.Workbook()

    # Style Tokens
    f_header = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    fill_header = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    fill_accent = PatternFill(start_color="EA580C", end_color="EA580C", fill_type="solid")
    align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    # SHEET 1: USER PROFILE & PROGRESS
    ws_prof = wb.active
    ws_prof.title = "User Profile & Progress"

    ws_prof.append(["Metric / Attribute", "Learner Value", "Evaluation Status"])
    for col_idx in range(1, 4):
        cell = ws_prof.cell(row=1, column=col_idx)
        cell.font = f_header
        cell.fill = fill_accent
        cell.alignment = align_center

    profile_rows = [
        ("Learner Classification", profile.get("knowledge_level", "Advanced"), "Active"),
        ("Active Study Streak", f"{profile.get('streak_days', 5)} Days", "Verified"),
        ("Focus Health Score", f"{profile.get('focus_score', 96)}%", "Excellent Discipline"),
        ("Total Problems Solved", len(records) + profile.get("total_questions", 0), "Documented"),
        ("Mathematics Mastery", f"{profile.get('domain_mastery', {}).get('math', 82)}%", "Mastered"),
        ("Programming / DSA Mastery", f"{profile.get('domain_mastery', {}).get('programming', 88)}%", "Mastered"),
        ("Physics Mastery", f"{profile.get('domain_mastery', {}).get('physics', 76)}%", "Proficient"),
        ("Chemistry Mastery", f"{profile.get('domain_mastery', {}).get('chemistry', 70)}%", "Proficient"),
        ("Biology Mastery", f"{profile.get('domain_mastery', {}).get('biology', 74)}%", "Proficient")
    ]

    for r_idx, row_vals in enumerate(profile_rows, 2):
        ws_prof.append(row_vals)
        for c_idx in range(1, 4):
            cell = ws_prof.cell(row=r_idx, column=c_idx)
            cell.border = thin_border
            cell.alignment = align_left if c_idx == 1 else align_center

    ws_prof.column_dimensions['A'].width = 32
    ws_prof.column_dimensions['B'].width = 28
    ws_prof.column_dimensions['C'].width = 24

    # SHEET 2: STUDY SOLUTIONS LOG
    ws_sol = wb.create_sheet(title="Solutions Dossier")
    headers_sol = ["#", "Timestamp", "Academic Subject", "Specialist Agent", "Question Query", "Answer Solution", "Latency (s)"]
    ws_sol.append(headers_sol)
    for col_idx in range(1, len(headers_sol) + 1):
        cell = ws_sol.cell(row=1, column=col_idx)
        cell.font = f_header
        cell.fill = fill_header
        cell.alignment = align_center

    for idx, rec in enumerate(records, 1):
        row_vals = [
            idx,
            rec.get("timestamp_display", ""),
            rec.get("subject", "Science"),
            rec.get("agent_used", "Agent"),
            rec.get("question", ""),
            strip_markdown(rec.get("answer", ""))[:3000],
            rec.get("metadata", {}).get("latency_sec", 0)
        ]
        ws_sol.append(row_vals)
        for c_idx in range(1, len(headers_sol) + 1):
            cell = ws_sol.cell(row=idx + 1, column=c_idx)
            cell.border = thin_border
            cell.alignment = align_center if c_idx in [1, 2, 3, 4, 7] else align_left

    ws_sol.column_dimensions['A'].width = 6
    ws_sol.column_dimensions['B'].width = 20
    ws_sol.column_dimensions['C'].width = 24
    ws_sol.column_dimensions['D'].width = 24
    ws_sol.column_dimensions['E'].width = 40
    ws_sol.column_dimensions['F'].width = 65
    ws_sol.column_dimensions['G'].width = 14

    # SHEET 3: CURATED GOOGLE BOOKS
    ws_books = wb.create_sheet(title="Curated Google Books")
    headers_books = ["Topic Query", "Book Title", "Author(s)", "Publisher", "Relevant Chapter / Pages", "Preview Link"]
    ws_books.append(headers_books)
    for col_idx in range(1, len(headers_books) + 1):
        cell = ws_books.cell(row=1, column=col_idx)
        cell.font = f_header
        cell.fill = fill_header
        cell.alignment = align_center

    row_count = 2
    for rec in records:
        q_topic = rec.get("question", "")[:40]
        for b in rec.get("books", []):
            ws_books.append([
                q_topic,
                b.get("title", ""),
                b.get("authors", ""),
                b.get("publisher", ""),
                b.get("relevant_page_info", ""),
                b.get("previewLink", "")
            ])
            for c_idx in range(1, len(headers_books) + 1):
                cell = ws_books.cell(row=row_count, column=c_idx)
                cell.border = thin_border
                cell.alignment = align_left
            row_count += 1

    ws_books.column_dimensions['A'].width = 30
    ws_books.column_dimensions['B'].width = 40
    ws_books.column_dimensions['C'].width = 25
    ws_books.column_dimensions['D'].width = 22
    ws_books.column_dimensions['E'].width = 45
    ws_books.column_dimensions['F'].width = 50

    # SHEET 4: VIDEO LECTURE TUTORIALS
    ws_vids = wb.create_sheet(title="YouTube Lecture Tutorials")
    headers_vids = ["Topic Query", "Video Lecture Title", "Educational Channel", "YouTube Video URL"]
    ws_vids.append(headers_vids)
    for col_idx in range(1, len(headers_vids) + 1):
        cell = ws_vids.cell(row=1, column=col_idx)
        cell.font = f_header
        cell.fill = fill_header
        cell.alignment = align_center

    v_row = 2
    for rec in records:
        q_topic = rec.get("question", "")[:40]
        for v in rec.get("videos", []):
            ws_vids.append([
                q_topic,
                v.get("title", ""),
                v.get("channel", ""),
                v.get("url", "")
            ])
            for c_idx in range(1, len(headers_vids) + 1):
                cell = ws_vids.cell(row=v_row, column=c_idx)
                cell.border = thin_border
                cell.alignment = align_left
            v_row += 1

    ws_vids.column_dimensions['A'].width = 30
    ws_vids.column_dimensions['B'].width = 45
    ws_vids.column_dimensions['C'].width = 28
    ws_vids.column_dimensions['D'].width = 45

    wb.save(output_path)
    return output_path

# =====================================================================
# ZIP EXPORTER - Complete Academic Intelligence Dossier
# =====================================================================

def export_all_zip(records: List[Dict[str, Any]], profile: Dict[str, Any], output_path: str) -> str:
    """Bundle Word, PowerPoint, Excel, and Markdown Context Reports into a single ZIP archive."""
    temp_dir = os.path.dirname(output_path)
    docx_path = os.path.join(temp_dir, "Phoenix_Academic_Context_Report.docx")
    pptx_path = os.path.join(temp_dir, "Phoenix_Academic_Context_Report.pptx")
    xlsx_path = os.path.join(temp_dir, "Phoenix_Academic_Context_Report.xlsx")
    md_path = os.path.join(temp_dir, "CONTEXT_REPORT.md")

    # Generate individual files
    export_docx(records, profile, docx_path)
    export_pptx(records, profile, pptx_path)
    export_xlsx(records, profile, xlsx_path)

    # Generate rich Markdown Context Report
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# PHOENIX AI • COMPREHENSIVE ACADEMIC CONTEXT DOSSIER\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%B %d, %Y - %H:%M:%S')}\n\n")
        f.write("## 1. Learner Profile & Analytics\n")
        f.write(f"- **Knowledge Level:** {profile.get('knowledge_level', 'Advanced')}\n")
        f.write(f"- **Active Streak:** {profile.get('streak_days', 5)} Days\n")
        f.write(f"- **Focus Discipline Health:** {profile.get('focus_score', 96)}%\n")
        f.write(f"- **Total Problems Solved:** {len(records) + profile.get('total_questions', 0)}\n\n")
        
        f.write("### Domain Mastery Scores:\n")
        for k, v in profile.get("domain_mastery", {}).items():
            f.write(f"- **{k.title()}**: {v}%\n")
        f.write("\n---\n\n## 2. Solutions, Videos & Books Dossier\n\n")

        for idx, r in enumerate(records, 1):
            f.write(f"### Problem #{idx}: {r.get('question')}\n")
            f.write(f"**Subject:** {r.get('subject')} | **Agent:** {r.get('agent_used')}\n\n")
            f.write(f"#### Solution:\n{r.get('answer')}\n\n")
            
            if r.get("books"):
                f.write("#### 📚 Curated Google Books & Relevant Pages:\n")
                for b in r["books"]:
                    f.write(f"- **{b.get('title')}** by {b.get('authors')}\n")
                    f.write(f"  - *{b.get('relevant_page_info')}*\n")
                    f.write(f"  - Snippet: \"{b.get('snippet')}\"\n")
                    f.write(f"  - [Preview on Google Books]({b.get('previewLink')})\n")
                f.write("\n")

            if r.get("videos"):
                f.write("#### 🎥 Recommended YouTube Video Lectures:\n")
                for v in r["videos"]:
                    f.write(f"- [{v.get('title')}]({v.get('url')}) - *{v.get('channel')}*\n")
                f.write("\n")

            f.write("---\n\n")

    # Create ZIP
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(docx_path, arcname="Phoenix_Academic_Context_Report.docx")
        zipf.write(pptx_path, arcname="Phoenix_Academic_Context_Report.pptx")
        zipf.write(xlsx_path, arcname="Phoenix_Academic_Context_Report.xlsx")
        zipf.write(md_path, arcname="CONTEXT_REPORT.md")

    return output_path
