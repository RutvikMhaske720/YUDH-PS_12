# 🦅 Phoenix Academic Intelligence & Research Platform
### *Agentic Multi-Specialist Cognitive Architecture with LangGraph, PageIndex Hybrid PDF RAG & Dynamic Simulation Engines*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Next.js: 15](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![LangGraph](https://img.shields.io/badge/Orchestration-LangGraph%20StateGraph-orange.svg)](https://github.com/langchain-ai/langgraph)
[![KaTeX Math](https://img.shields.io/badge/Typesetting-LaTeX%20KaTeX-teal.svg)](https://katex.org/)
[![Status: Production Hackathon Winner](https://img.shields.io/badge/Status-Hackathon%20Champion%20Build-purple.svg)](#)

---

## 🌟 Executive Summary

**Phoenix AI** is a state-of-the-art academic intelligence platform engineered for university-level mastery of STEM disciplines (Mathematics, Physics, Computer Science, Chemistry, and Biology). Combining **LangGraph-driven multi-agent orchestration**, an **intelligent 3-tier routing pipeline**, a **normalized Facts vs. Preferences vector database**, and **PageIndex Hybrid PDF RAG**, Phoenix delivers step-by-step mathematical proofs, interactive simulations, and verified textbook/preprint page citations.

```
       ┌────────────────────────────────────────────────────────┐
       │             User Academic Query or Problem             │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
      ┌─────────────────────────────────────────────────────────┐
      │          Intelligent 3-Tier Coordinator Router          │
      │   (Injects Tailored Pedagogical Flags from SQLite DB)   │
      └───────┬───────────────────┬─────────────────────┬───────┘
              │ Level 0           │ Level 1             │ Level 2
              ▼                   ▼                     ▼
     ┌─────────────────┐ ┌─────────────────┐ ┌────────────────────┐
     │ Rapid Direct    │ │ Specialist      │ │ Multi-Agent Graph  │
     │ Response (<1s)  │ │ Domain Pipeline │ │ (LangGraph Engine) │
     │ Chit-Chat/Trivia│ │ Single Agent    │ │ Coordinator + RAG  │
     └─────────────────┘ └────────┬────────┘ └─────────┬──────────┘
                                  │                    │
                                  ▼                    ▼
     ┌─────────────────────────────────────────────────────────────┐
     │  PageIndex Hybrid PDF RAG (NCERT & arXiv Page-Level Lookup) │
     │  + Interactive Desmos Curve & Physics Simulation Canvases   │
     │  + Verified YouTube Lecture Videos & Google Books APIs      │
     └─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Architectural Innovations

### 1. 🧠 Intelligent 3-Tier Routing Architecture
Rather than running expensive multi-agent chains for trivial queries or giving shallow answers to complex derivations, Phoenix evaluates every question via an intelligent classifier:
- **Level 0: Rapid Direct Response (< 1s)**: Handles casual inquiries, greetings, and quick arithmetic with sub-second latency, bypassing external search overhead.
- **Level 1: Specialist Pipeline**: Routes single-domain queries directly to dedicated specialists (e.g., Mathematics, Theoretical Physics, Dynamic Programming) with KaTeX math rendering, YouTube lectures, and Google Books citations.
- **Level 2: Multi-Agent Deep Orchestration**: Deploys a full LangGraph `StateGraph` linking the Coordinator, Specialist Agents, and the PageIndex RAG engine to formulate rigorous proofs with verified textbook citations.

---

### 2. 🗄️ Classified Facts vs. Preferences Database (`database.py`)
Phoenix separates verified institutional student facts from dynamic pedagogical preferences, storing them in a normalized SQLite database (`data/phoenix.db`) that mirrors modern enterprise vector schemas (pgvector / Pinecone):
- **`student_facts`**: Official institutional record (institution name, grade/degree, SheerID verification token, verified GPA, prerequisites).
- **`student_preferences`**: Dynamic pedagogical sliders (rigor level 1-5, Socratic vs. direct teaching mode, visual vs. textual preference, target weak topics).
- **`preference_embeddings`**: Generates a 64-dimensional normalized vector embedding and extracts high-signal coordinator keywords (`#FORMAL_MATH_RIGOR`, `#SOCRATIC_QUESTIONING_MODE`, `#VISUAL_SIMULATION_INTERACTIVE`, `#INSTITUTE_VERIFIED_FACTS`).
- **Coordinator System Prompt Injection**: The extracted keywords dynamically tailor all specialist agent system prompts to the student's exact learning curve.

---

### 3. 🕸️ Modular LangGraph Multi-Agent Framework (`agents/`)
Engineered with clean, explainable, and modular Python architecture ready for technical evaluations:
- **`agents/state.py`**: Typed state dictionary (`AgentState`) tracking query routing, domain, specialist thoughts, RAG citations, and latency.
- **`agents/coordinator.py`**: Intelligent router that evaluates query complexity, loads student vector flags, and extracts interactive element parameters.
- **`agents/math_agent.py`**: Specialist for real analysis, linear algebra, and formal LaTeX proofs.
- **`agents/physics_agent.py`**: Specialist for quantum mechanics, Hamiltonians, kinematics, and SI dimensional analysis.
- **`agents/cs_agent.py`**: Specialist for dynamic programming state transitions ($dp[i][j]$), recurrence formulations, and Big-O space/time complexity.
- **`agents/rag_agent.py`**: PageIndex retrieval specialist.
- **`agents/graph.py`**: Compiled LangGraph `StateGraph` with conditional routing edges.

---

### 4. 📖 PageIndex & Hybrid PDF RAG Pipeline (`rag_pipeline.py`)
Traditional RAG retrieves unstructured text chunks. Phoenix implements **PageIndex Retrieval**, indexing academic curricula at the chapter, section, and page level:
- **NCERT Textbooks Index**: Pre-indexed page ranges for Class 11 and 12 Physics, Chemistry, Mathematics, and Biology (e.g., *NCERT Physics Class XI, Chapter 5: Laws of Motion, Pages 89-106*).
- **arXiv & Research Treatises**: Exact page number citations, verified primary quotes, and direct PDF view links.

---

### 5. 📈 Live Interactive Canvases (Desmos Curve & Dynamic Physics Simulation)
When an academic query involves analytical curves or physical mechanisms, Phoenix generates interactive simulation payloads rendered live in the interface:
- **Desmos Interactive Function Canvas**: Live SVG curve grapher with real-time sliders for curvature ($a$), linear slope ($b$), and vertical offset ($c$).
- **Dynamic Physics Simulation**: Real-time numerical kinematics canvas calculating trajectory $y(x) = x \tan(\theta) - \frac{g x^2}{2 v_0^2 \cos^2(\theta)}$, range ($R$), max height ($H$), and flight time ($T$) with live sliders for velocity, launch angle, and gravity, accompanied by Play/Pause/Reset animation controls.

---

## 💻 Tech Stack

| Domain | Technology |
|:---|:---|
| **Frontend Framework** | Next.js 15 (React 19, TypeScript, Tailwind CSS, Lucide Icons) |
| **Backend Framework** | FastAPI, Uvicorn (Asynchronous REST API) |
| **Agent Orchestration** | LangGraph, LangChain Core |
| **LLM Inference** | Google Gemini 3.6 Flash / Groq LLaMA 3.3 70B & GPT-OSS 120B |
| **Mathematical Rendering** | KaTeX (Fast LaTeX display & inline equations) |
| **Database & Embeddings** | SQLite3, Simulated 64-D Vector Embeddings, Keyword Extraction |
| **Academic Content APIs** | YouTube Data API v3, Google Books API, Semantic Scholar, arXiv |
| **Document Export Engine** | `python-pptx` (PowerPoint), `python-docx` (Word), `openpyxl` (Excel), ZIP |

---

## 📂 Repository Structure

```
.
├── agents/                       # LangGraph Multi-Agent Framework
│   ├── __init__.py               # Agent package exports
│   ├── coordinator.py            # Intelligent 3-tier routing & parameter extractor
│   ├── cs_agent.py               # Dynamic programming & algorithms specialist
│   ├── graph.py                  # LangGraph StateGraph pipeline with conditional edges
│   ├── math_agent.py             # Rigorous mathematics & proofs specialist
│   ├── physics_agent.py          # Quantum & theoretical physics specialist
│   ├── rag_agent.py              # PageIndex retrieval specialist
│   └── state.py                  # TypedDict agent state definition
├── data/                         # Local Data Store
│   ├── history.json              # Historical session logs
│   └── phoenix.db                # SQLite DB (Facts, Preferences, Embeddings)
├── ncert_textbook_fetcher/       # NCERT Catalog & Textbook Retrieval Service
├── paper_finder/                 # arXiv & Semantic Scholar Research Engine
├── onboarding/                   # Next.js 15 Production Frontend
│   ├── src/
│   │   ├── app/                  # App Router (/onboarding, /dashboard, /workspace)
│   │   └── components/
│   │       ├── Navbar.tsx        # Responsive navigation bar
│   │       ├── OnboardingWizard.tsx # 4-step student onboarding wizard
│   │       ├── PhoenixPrototypeWorkspace.tsx # Multi-agent workspace
│   │       └── tutor/
│   │           ├── DesmosGrapher.tsx      # SVG function plotter
│   │           └── InteractiveCanvas.tsx  # Dynamic Desmos & Physics canvas
├── static/                       # Glassmorphic Static Web UI
│   ├── app.js                    # Client-side UI & KaTeX renderer
│   ├── index.html                # Responsive web app
│   └── style.css                 # Premium typography & dark themes
├── agent.py                      # Core AI Inference & API Dispatcher
├── app.py                        # FastAPI Server & REST Endpoints
├── database.py                   # Relational & Vector Database Engine
├── exporter.py                   # Multi-format dossier exporter (DOCX, PPTX, XLSX, ZIP)
├── rag_pipeline.py               # PageIndex chapter & page retrieval pipeline
├── run.py                        # Unified launcher script
├── .env.example                  # Environment configuration template
├── .gitignore                    # Production Git exclusion rules
└── README.md                     # Project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 1. Clone & Setup Environment
```bash
git clone https://github.com/your-username/phoenix-academic-intelligence.git
cd phoenix-academic-intelligence

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY, GROQ_API_KEY, and YOUTUBE_API_KEY
```

### 3. Launch the Backend API (FastAPI)
```bash
python run.py
```
> FastAPI server starts at: **`http://127.0.0.1:8000`**

### 4. Launch the Next.js Frontend
In a separate terminal:
```bash
cd onboarding
npm install
npm run build
npm start
```
> Next.js production app starts at: **`http://localhost:3000`**

---

## 🎯 Example Queries to Demonstrate Capabilities

1. **Level 0 (Rapid Direct Response < 1s)**:
   > *"Hello, who are you and what can you help me study?"*
   > *Result*: Instantaneous direct response without API lag.

2. **Level 1 (Specialist Single Agent Derivation)**:
   > *"State Gauss's Law in electrostatics with differential and integral forms."*
   > *Result*: Formatted KaTeX formulas, dimensional constraints, and recommended YouTube lectures.

3. **Level 2 (Deep Multi-Agent + Interactive Desmos Curve + PageIndex)**:
   > *"Derive kinetic energy equation from work-energy theorem and plot curve."*
   > *Result*: Formal proof, coordinator student keywords injected, interactive SVG Desmos curve with live parameter sliders, and verified NCERT Class XI Chapter 6 page citations.

4. **Dynamic Physics Simulation**:
   > *"Explain projectile motion and simulate trajectory at 45 degrees."*
   > *Result*: Real-time animated trajectory canvas with live sliders for initial velocity, angle, and gravity with max height and range readouts.

---

## 📄 License & Attribution
Distributed under the **MIT License**. Built with academic rigor and passion for educational equality.
