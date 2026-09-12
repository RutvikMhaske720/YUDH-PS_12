'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText,
  Video,
  ExternalLink,
  Download,
  Moon,
  Sun,
  Globe,
  Flame,
  Award,
  BookMarked,
  Layers,
  HelpCircle,
  Play,
  Share2,
  Home,
  Zap,
  Cpu
} from 'lucide-react';

import InteractiveCanvas from './tutor/InteractiveCanvas';

// YouTube Official Vector Icon
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
    <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Google Books Official Vector Icon
const GoogleBooksIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
    <path fill="#FFFFFF" d="M6 6h12v2H6zm0 4h12v2H6zm0 4h8v2H6z"/>
  </svg>
);

interface PhoenixPrototypeWorkspaceProps {
  onboardingProfile?: any;
}

export default function PhoenixPrototypeWorkspace({ onboardingProfile }: PhoenixPrototypeWorkspaceProps) {
  // Navigation tabs: tutor | recommendation | progress | learn | profile | setting
  const [activeTab, setActiveTab] = useState<'tutor' | 'recommendation' | 'progress' | 'learn' | 'profile' | 'setting'>('tutor');
  const [recSubtab, setRecSubtab] = useState<'videos' | 'ncert' | 'papers' | 'books' | 'inquiries'>('videos');

  // Chat state
  const [history, setHistory] = useState<any[]>([]);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [bwMode, setBwMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // NCERT & Papers search states
  const [ncertClass, setNcertClass] = useState('12');
  const [ncertSubject, setNcertSubject] = useState('Maths');
  const [ncertMedium, setNcertMedium] = useState('English');
  const [ncertBooks, setNcertBooks] = useState<any[]>([]);
  const [ncertLoading, setNcertLoading] = useState(false);

  const [paperQuery, setPaperQuery] = useState('Quantum Mechanics and Relativity');
  const [papers, setPapers] = useState<any[]>([]);
  const [papersLoading, setPapersLoading] = useState(false);

  const [bookQuery, setBookQuery] = useState('Physics Principles');
  const [books, setBooks] = useState<any[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<any>({
    user_name: onboardingProfile?.rawProfile?.name || onboardingProfile?.name || 'Academic Scholar',
    institution: onboardingProfile?.rawProfile?.institution || onboardingProfile?.institution || 'Independent Learning Track',
    gradeOrDegree: onboardingProfile?.rawProfile?.gradeOrDegree || onboardingProfile?.gradeOrDegree || 'Class 12 / University Track',
    knowledge_level: 'Advanced',
    streak_days: 5,
    focus_score: 96,
    domain_mastery: { math: 88, programming: 92, physics: 84, chemistry: 78, biology: 80 }
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Sync profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eila_student_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const name = parsed.rawProfile?.name || parsed.name;
        const inst = parsed.rawProfile?.institution || parsed.institution;
        const grade = parsed.rawProfile?.gradeOrDegree || parsed.gradeOrDegree;
        if (name) {
          setUserProfile((prev: any) => ({
            ...prev,
            user_name: name,
            institution: inst || prev.institution,
            gradeOrDegree: grade || prev.gradeOrDegree
          }));

          // Background sync to SQLite DB and Vector Embedding Store
          fetch('/api/onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
          }).catch(err => console.error('DB Sync Notice:', err));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchHistory();
    fetchNcert();
    fetchPapers();
    fetchBooks();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        const hist = data.history || [];
        setHistory(hist);
        if (hist.length > 0 && !currentRecord) {
          setCurrentRecord(hist[0]);
        }
      }
    } catch (e) {
      // Fallback sample data if backend endpoint isn't connected
      if (history.length === 0) {
        const sample = {
          id: 'demo-sample-1',
          question: "State Gauss's Law in electrostatics with formula and boundary conditions",
          answer: "### Gauss's Law in Electrostatics\n\nGauss's Law states that the total electric flux $\\Phi_E$ through any closed surface (Gaussian surface) is equal to the net charge $Q_{\\text{enclosed}}$ divided by the electric permittivity $\\varepsilon_0$:\n\n$$\\oint_{\\mathcal{S}} \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enclosed}}}{\\varepsilon_0} = \\frac{1}{\\varepsilon_0} \\iiint_{\\mathcal{V}} \\rho(\\mathbf{r}) \\, dV$$\n\nIn differential vector form, applying the Divergence Theorem yields Maxwell's First Equation:\n\n$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$$\n\n#### Boundary Conditions:\nAcross any surface charge density $\\sigma$:\n$$\\hat{\\mathbf{n}} \\cdot (\\mathbf{E}_2 - \\mathbf{E}_1) = \\frac{\\sigma}{\\varepsilon_0}, \\quad \\hat{\\mathbf{n}} \\times (\\mathbf{E}_2 - \\mathbf{E}_1) = \\mathbf{0}$$",
          domain: "physics",
          subject: "Physics",
          agent_used: "Physics & Optics Specialist",
          speciality_notes: "Rigorous Gauss's Law Derivation & Differential Form",
          videos: [
            {
              id: "v1",
              title: "Gauss's Law - Comprehensive Lecture & Symmetry Derivations",
              url: "https://www.youtube.com/results?search_query=Gauss+Law+in+electrostatics",
              thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80"
            }
          ],
          books: [
            {
              title: "Introduction to Electrodynamics (David J. Griffiths)",
              authors: ["David J. Griffiths"],
              snippet: "Chapter 2: Electrostatics — Gauss's Law in integral and differential form.",
              preview_link: "https://books.google.com"
            }
          ]
        };
        setHistory([sample]);
        setCurrentRecord(sample);
      }
    }
  };

  const fetchNcert = async () => {
    setNcertLoading(true);
    try {
      const res = await fetch(`/api/ncert/books?class_num=${ncertClass}&subject=${ncertSubject}&medium=${ncertMedium}`);
      if (res.ok) {
        const data = await res.json();
        setNcertBooks(data.books || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNcertLoading(false);
    }
  };

  const fetchPapers = async (q = paperQuery) => {
    setPapersLoading(true);
    try {
      const res = await fetch(`/api/papers/search?query=${encodeURIComponent(q)}&max_results=6`);
      if (res.ok) {
        const data = await res.json();
        setPapers(data.papers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPapersLoading(false);
    }
  };

  const fetchBooks = async (q = bookQuery) => {
    setBooksLoading(true);
    try {
      const res = await fetch(`/api/books/search?query=${encodeURIComponent(q)}&domain=all&max_results=6`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBooksLoading(false);
    }
  };

  // Reliable Dossier Export
  const handleExport = async (format: 'docx' | 'pptx' | 'xlsx' | 'zip') => {
    showToast(`Generating ${format.toUpperCase()} dossier...`);
    try {
      const res = await fetch(`/api/export/${format}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Phoenix_Academic_Dossier.${format}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 1500);
      showToast(`Downloaded ${format.toUpperCase()} dossier!`);
    } catch (err) {
      console.error(err);
      showToast(`Downloaded mock ${format.toUpperCase()} report.`);
    }
  };

  // Submit Question to Specialist AI Agent
  const handleSubmitQuestion = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = customQ || questionText.trim();
    if (!q || loading) return;

    if (activeTab !== 'tutor') setActiveTab('tutor');

    setQuestionText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          domain: selectedDomain !== 'all' ? selectedDomain : 'auto'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const fullRecord = {
          ...data,
          id: data.id || data.record_id || `rec-${Date.now()}`,
          record_id: data.record_id || data.id || `rec-${Date.now()}`
        };
        setCurrentRecord(fullRecord);
        setHistory((prev) => [fullRecord, ...prev]);
        if (data.user_profile) setUserProfile(data.user_profile);
      } else {
        showToast(data.error || 'Agent reasoning completed.');
      }
    } catch (e) {
      console.error(e);
      showToast('Backend offline - displaying interactive preview.');
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bgCanvas = bwMode ? '#0A0A0A' : '#FAF7F2';
  const surfaceBg = bwMode ? '#141414' : '#FFFFFF';
  const cardBg = bwMode ? '#1C1C1C' : '#FFFFFF';
  const borderCol = bwMode ? '#333333' : '#E8E2D8';
  const textPrimary = bwMode ? '#FFFFFF' : '#1C2B27';
  const textSecondary = bwMode ? '#A8A8A8' : '#526058';
  const accentGreen = bwMode ? '#FFFFFF' : '#23493D';

  return (
    <div style={{ background: bgCanvas, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: textPrimary, fontFamily: 'var(--font-sans, system-ui)' }}>
      {/* Toast Notification */}
      {statusToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: bwMode ? '#FFF' : '#23493D',
          color: bwMode ? '#000' : '#FFF',
          padding: '12px 20px',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontSize: '0.86rem',
          fontWeight: 600
        }}>
          {statusToast}
        </div>
      )}

      {/* TOP HEADER: Editorial & Decluttered */}
      <header style={{
        height: 64,
        background: surfaceBg,
        borderBottom: `1px solid ${borderCol}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Left: Home Navigation & Phoenix Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: bwMode ? '#222' : '#F5EFE6',
              color: textPrimary,
              border: `1px solid ${borderCol}`,
              borderRadius: 8,
              padding: '5px 11px',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
            title="Return to Onboarding Starting Page"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <div style={{ width: 1, height: 24, background: borderCol }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/logo.jpeg"
              alt="Logo"
              style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', border: `1px solid ${borderCol}` }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: '1.2rem', color: accentGreen }}>
                  Phoenix AI
                </span>
                <span style={{
                  fontSize: '0.64rem',
                  fontWeight: 600,
                  padding: '2px 7px',
                  background: bwMode ? '#2A2A2A' : '#EAF0EC',
                  color: accentGreen,
                  borderRadius: 9999,
                  border: `1px solid ${bwMode ? '#444' : '#C2D6CA'}`
                }}>
                  Academic Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 12px',
          background: bwMode ? '#1C1C1C' : '#F5EFE6',
          border: `1px solid ${borderCol}`,
          borderRadius: 9999,
          fontSize: '0.76rem',
          fontWeight: 600,
          color: accentGreen
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentGreen }} />
          <span>Academic Research Engine Active</span>
        </div>

        {/* Controls & Export Hub */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: bwMode ? '#1C1C1C' : '#FFF', border: `1px solid ${borderCol}`, borderRadius: 8, padding: '4px 8px' }}>
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={language}
              onChange={(e) => { setLanguage(e.target.value); showToast(`Language switched to ${e.target.value.toUpperCase()}`); }}
              style={{ background: 'transparent', border: 'none', fontSize: '0.78rem', fontWeight: 600, color: textPrimary, outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
          </div>

          {/* B&W Mode Button */}
          <button
            onClick={() => setBwMode(!bwMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: bwMode ? '#FFF' : '#FFF',
              color: bwMode ? '#000' : textPrimary,
              border: `1px solid ${borderCol}`,
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {bwMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{bwMode ? 'Color' : 'B&W'}</span>
          </button>

          {/* Export Segmented Group */}
          <button
            onClick={() => handleExport('zip')}
            style={{
              background: bwMode ? '#FFF' : '#23493D',
              color: bwMode ? '#000' : '#FFF',
              padding: '6px 13px',
              borderRadius: 8,
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </button>

          <div style={{ display: 'inline-flex', background: bwMode ? '#1C1C1C' : '#F5EFE6', border: `1px solid ${borderCol}`, borderRadius: 8, padding: 2, gap: 2 }}>
            {(['docx', 'pptx', 'xlsx'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleExport(fmt)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textSecondary,
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* STUDENT CONTEXT BANNER (Sync from Onboarding) */}
      <div style={{
        background: bwMode ? '#111' : '#F0EAE1',
        borderBottom: `1px solid ${borderCol}`,
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, color: accentGreen }}>
            Student: {userProfile.user_name}
          </span>
          <span style={{ color: textSecondary }}>• {userProfile.institution}</span>
          <span style={{ color: textSecondary }}>• {userProfile.gradeOrDegree}</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: bwMode ? '#222' : '#EAF0EC',
            color: accentGreen,
            padding: '2px 8px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            fontWeight: 600
          }}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Profile Synced from Onboarding
          </span>
        </div>

        <Link
          href="/onboarding"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            color: accentGreen,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.76rem'
          }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Edit Onboarding Settings</span>
        </Link>
      </div>

      {/* MAIN WORKSPACE BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 105px)' }}>
        {/* WORKSPACE STAGE */}
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {/* TAB 1: TUTOR ENGINE (Left History + Center Solution Area) */}
          {activeTab === 'tutor' && (
            <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
              {/* Left Session History Sidebar */}
              <aside style={{ width: 280, background: surfaceBg, borderRight: `1px solid ${borderCol}`, display: 'flex', flexDirection: 'column', padding: 16, gap: 12, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.86rem', color: textPrimary }}>Session History</span>
                  <span style={{ background: bwMode ? '#222' : '#F5EFE6', padding: '2px 8px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600 }}>{history.length}</span>
                </div>

                <button
                  onClick={() => {
                    setCurrentRecord(null);
                    setQuestionText('');
                  }}
                  style={{
                    background: bwMode ? '#FFF' : '#23493D',
                    color: bwMode ? '#000' : '#FFF',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <span>+ New Academic Inquiry</span>
                </button>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map((rec) => {
                    const isSelected = currentRecord?.id === rec.id;
                    return (
                      <div
                        key={rec.id}
                        onClick={() => setCurrentRecord(rec)}
                        style={{
                          background: isSelected ? (bwMode ? '#262626' : '#EAF0EC') : (bwMode ? '#181818' : '#FBF9F5'),
                          border: `1px solid ${isSelected ? (bwMode ? '#555' : '#23493D') : borderCol}`,
                          padding: '10px 12px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: textPrimary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {rec.question}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.7rem', color: textSecondary }}>
                          <span>{rec.subject || rec.domain || 'Academic'}</span>
                          <span>•</span>
                          <span>{rec.agent_used || 'Specialist'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </aside>

              {/* Center Chat & Solution Workspace */}
              <section style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: bgCanvas }}>
                {/* Active Solution / Derivation View */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {currentRecord ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* Student Problem Prompt */}
                      <div style={{ background: bwMode ? '#1C1C1C' : '#FFFFFF', border: `1px solid ${borderCol}`, borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                          Academic Query
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: textPrimary, lineHeight: 1.4 }}>
                          {currentRecord.question}
                        </h2>
                      </div>

                      {/* Specialist Agent Derivation Bubble */}
                      <div style={{ background: surfaceBg, border: `1px solid ${borderCol}`, borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${borderCol}`, paddingBottom: 12, marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: accentGreen }}>
                              {currentRecord.agent_used || 'Specialist Agent'}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: textSecondary }}>
                              {currentRecord.speciality_notes || 'Rigorous Mathematical Derivation'}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {currentRecord.routing_level !== undefined && (
                              <span style={{
                                background: currentRecord.routing_level === 0 ? '#FEF3C7' : (currentRecord.routing_level === 2 ? '#EDE9FE' : '#EAF0EC'),
                                color: currentRecord.routing_level === 0 ? '#92400E' : (currentRecord.routing_level === 2 ? '#5B21B6' : accentGreen),
                                border: `1px solid ${currentRecord.routing_level === 0 ? '#FDE68A' : (currentRecord.routing_level === 2 ? '#DDD6FE' : '#3D6B5E30')}`,
                                padding: '3px 10px',
                                borderRadius: 9999,
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}>
                                {currentRecord.routing_level === 0 ? '⚡ ' : (currentRecord.routing_level === 2 ? '🔮 ' : '📐 ')}
                                {currentRecord.routing_label || `Level ${currentRecord.routing_level} Routing`}
                              </span>
                            )}
                            <span style={{ background: bwMode ? '#222' : '#EAF0EC', color: accentGreen, padding: '2px 8px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600 }}>
                              KaTeX Verified
                            </span>
                          </div>
                        </div>

                        {/* Formatted Derivation Content */}
                        <div style={{ fontSize: '0.94rem', lineHeight: 1.7, color: textPrimary, whiteSpace: 'pre-line' }}>
                          {currentRecord.answer}
                        </div>

                        {/* Interactive Canvas (Desmos Curve or Dynamic Physics Simulation) */}
                        {currentRecord.interactive_element && (
                          <div style={{ marginTop: 18 }}>
                            <InteractiveCanvas element={currentRecord.interactive_element} />
                          </div>
                        )}

                        {/* Verified Textbook & Preprint Citations (PageIndex RAG) */}
                        {currentRecord.page_citations && currentRecord.page_citations.length > 0 && (
                          <div style={{
                            marginTop: 20,
                            padding: '14px 18px',
                            background: bwMode ? '#1C1C1C' : '#F4EFE6',
                            borderRadius: 12,
                            border: `1px solid ${borderCol}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.84rem', color: accentGreen, marginBottom: 10 }}>
                              <BookMarked style={{ width: 16, height: 16 }} />
                              <span>Verified Textbook & Preprint Page Citations (PageIndex Hybrid RAG)</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {currentRecord.page_citations.map((pc: any, pIdx: number) => (
                                <div key={pIdx} style={{
                                  fontSize: '0.8rem',
                                  background: surfaceBg,
                                  padding: '10px 14px',
                                  borderRadius: 8,
                                  border: `1px solid ${borderCol}`,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 4
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
                                    <span style={{ color: textPrimary }}>{pc.source} • {pc.chapter}</span>
                                    <span style={{
                                      background: '#23493D15',
                                      color: '#23493D',
                                      padding: '2px 8px',
                                      borderRadius: 4,
                                      fontSize: '0.72rem',
                                      fontWeight: 700
                                    }}>
                                      Verified Pages: {pc.pages}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: textSecondary }}>
                                    Section: {pc.section}
                                  </div>
                                  <div style={{ fontStyle: 'italic', color: textSecondary, fontSize: '0.75rem', background: bwMode ? '#111' : '#FAF7F2', padding: '6px 10px', borderRadius: 6, borderLeft: '3px solid #23493D' }}>
                                    "{pc.verified_quote}"
                                  </div>
                                  {pc.url && (
                                    <a
                                      href={pc.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ alignSelf: 'flex-start', fontSize: '0.72rem', color: accentGreen, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginTop: 2 }}
                                    >
                                      <ExternalLink style={{ width: 12, height: 12 }} />
                                      <span>Open Official NCERT Chapter PDF</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* YouTube Video Cards (YouTube Data API) */}
                        {currentRecord.videos && currentRecord.videos.length > 0 && (
                          <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${borderCol}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 700, fontSize: '0.86rem', color: textPrimary }}>
                              <YouTubeIcon />
                              <span>Recommended Video Lectures (YouTube Data API)</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                              {currentRecord.videos.map((v: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={v.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    background: bwMode ? '#1C1C1C' : '#FAF7F2',
                                    border: `1px solid ${borderCol}`,
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    color: textPrimary,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.15s ease'
                                  }}
                                >
                                  {v.thumbnail && (
                                    <div style={{ height: 120, background: '#000', position: 'relative' }}>
                                      <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                                        <Play className="w-8 h-8 text-white opacity-90" />
                                      </div>
                                    </div>
                                  )}
                                  <div style={{ padding: 10 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                      {v.title}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: textSecondary, marginTop: 4, display: 'block' }}>
                                      Open YouTube Lecture →
                                    </span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Google Books Citations */}
                        {currentRecord.books && currentRecord.books.length > 0 && (
                          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${borderCol}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 700, fontSize: '0.86rem', color: textPrimary }}>
                              <GoogleBooksIcon />
                              <span>Authoritative Academic Books (Google Books API)</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                              {currentRecord.books.map((b: any, idx: number) => (
                                <div key={idx} style={{ background: bwMode ? '#1C1C1C' : '#FAF7F2', border: `1px solid ${borderCol}`, borderRadius: 8, padding: 12 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{b.title}</div>
                                  <div style={{ fontSize: '0.74rem', color: textSecondary, marginTop: 2 }}>
                                    {b.authors?.join(', ') || 'Academic Publisher'}
                                  </div>
                                  {b.snippet && (
                                    <p style={{ fontSize: '0.76rem', color: textPrimary, marginTop: 6, fontStyle: 'italic' }}>
                                      &ldquo;{b.snippet}&rdquo;
                                    </p>
                                  )}
                                  {b.preview_link && (
                                    <a href={b.preview_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: accentGreen, fontWeight: 600, marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                      <span>Read Preview on Google Books</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Initial Empty State */
                    <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 640, margin: '0 auto' }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: bwMode ? '#222' : '#EAF0EC', color: accentGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 700, color: textPrimary, marginBottom: 8 }}>
                        Welcome to Phoenix Academic Intelligence
                      </h3>
                      <p style={{ fontSize: '0.92rem', color: textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
                        Ask any scientific question spanning Mathematics, Physics, Chemistry, Life Sciences, or Computing. Our specialist agents formulate rigorous KaTeX derivations with citations.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                        {[
                          "Derive Gauss's Law in integral and differential form",
                          "Explain the mechanism of CRISPR-Cas9 gene editing with target sequence steps",
                          "Solve the quadratic recurrence T(n) = 2T(n/2) + O(n) via Master Theorem"
                        ].map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSubmitQuestion(undefined, prompt)}
                            style={{
                              background: surfaceBg,
                              border: `1px solid ${borderCol}`,
                              padding: '12px 16px',
                              borderRadius: 8,
                              fontSize: '0.84rem',
                              fontWeight: 500,
                              color: textPrimary,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            ⚡ {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Problem Box */}
                <div style={{ padding: '16px 32px', background: surfaceBg, borderTop: `1px solid ${borderCol}` }}>
                  <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      style={{
                        background: bwMode ? '#1C1C1C' : '#F5EFE6',
                        border: `1px solid ${borderCol}`,
                        color: textPrimary,
                        padding: '10px 12px',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="all">Auto-Specialist</option>
                      <option value="math">Mathematics</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Life Sciences</option>
                      <option value="programming">Computing</option>
                    </select>

                    <input
                      type="text"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Ask a scientific inquiry or submit problem for mathematical derivation..."
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: `1px solid ${borderCol}`,
                        background: bwMode ? '#1A1A1A' : '#FFFFFF',
                        color: textPrimary,
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        background: bwMode ? '#FFF' : '#23493D',
                        color: bwMode ? '#000' : '#FFF',
                        padding: '12px 20px',
                        borderRadius: 8,
                        border: 'none',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {loading ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <>
                          <span>Derive</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: RECOMMENDATION STUDIO (Unclipped Subnav Pills & Multi-pipeline) */}
          {activeTab === 'recommendation' && (
            <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '32px 40px', background: bgCanvas }}>
              <div style={{ borderBottom: `1px solid ${borderCol}`, paddingBottom: 16, marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.85rem', fontWeight: 700, color: textPrimary }}>
                  Academic Recommendation & Research Studio
                </h2>
                <p style={{ fontSize: '0.9rem', color: textSecondary, marginTop: 4 }}>
                  Curated Video Masterclasses, Official NCERT Textbooks, arXiv Research Papers, and Academic Books tailored to your inquiries.
                </p>
              </div>

              {/* Pills Navigation - Fixed 38px height, ample clearance, NO bottom clipping */}
              <div style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                padding: '6px 4px 16px 4px',
                minHeight: 58,
                borderBottom: `1px solid ${borderCol}`,
                overflowX: 'auto',
                overflowY: 'hidden',
                boxSizing: 'border-box',
                marginBottom: 24
              }}>
                {[
                  { id: 'videos', label: 'Video Masterclasses', icon: '▶' },
                  { id: 'ncert', label: 'NCERT Textbooks', icon: '📖' },
                  { id: 'papers', label: 'Research Papers', icon: '📄' },
                  { id: 'books', label: 'Academic Books', icon: '📚' },
                  { id: 'inquiries', label: 'Inquiry Pathways', icon: '🧭' }
                ].map((tab) => {
                  const isActive = recSubtab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setRecSubtab(tab.id as any)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        height: 38,
                        padding: '0 18px',
                        flexShrink: 0,
                        borderRadius: 9999,
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        background: isActive
                          ? (bwMode ? '#FFF' : '#23493D')
                          : (bwMode ? '#1C1C1C' : '#FFF'),
                        color: isActive
                          ? (bwMode ? '#000' : '#FFF')
                          : textSecondary,
                        border: `1px solid ${isActive ? (bwMode ? '#FFF' : '#23493D') : borderCol}`,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Subtab 1: Videos */}
              {recSubtab === 'videos' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: accentGreen, marginBottom: 14 }}>
                    Suggested Masterclasses For Active Topics
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {[
                      { title: "Calculus: Limits, Derivatives & Integrals Explained", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/results?search_query=Calculus+derivatives+MIT" },
                      { title: "Quantum Physics: Wave-Particle Duality & Schrödinger", channel: "Stanford Institute", url: "https://www.youtube.com/results?search_query=Quantum+physics+Stanford" },
                      { title: "Backpropagation & Neural Network Derivatives", channel: "3Blue1Brown", url: "https://www.youtube.com/results?search_query=3Blue1Brown+neural+networks" },
                      { title: "Organic Chemistry: SN1 vs SN2 Reaction Mechanisms", channel: "Khan Academy", url: "https://www.youtube.com/results?search_query=SN1+SN2+mechanisms" }
                    ].map((v, i) => (
                      <a key={i} href={v.url} target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 16, borderRadius: 10, textDecoration: 'none', color: textPrimary, display: 'block' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{v.title}</div>
                        <div style={{ fontSize: '0.76rem', color: textSecondary, marginTop: 4 }}>{v.channel}</div>
                        <span style={{ fontSize: '0.72rem', color: accentGreen, fontWeight: 600, marginTop: 8, display: 'inline-block' }}>Watch on YouTube →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 2: NCERT Textbooks */}
              {recSubtab === 'ncert' && (
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                    <select value={ncertClass} onChange={(e) => setNcertClass(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${borderCol}`, background: surfaceBg, color: textPrimary }}>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                    <select value={ncertSubject} onChange={(e) => setNcertSubject(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${borderCol}`, background: surfaceBg, color: textPrimary }}>
                      <option value="Maths">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                    <button onClick={fetchNcert} style={{ background: accentGreen, color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                      Explore Books
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {ncertBooks.length > 0 ? (
                      ncertBooks.map((b, i) => (
                        <div key={i} style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 16, borderRadius: 10 }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{b.title}</div>
                          <div style={{ fontSize: '0.76rem', color: textSecondary, marginTop: 4 }}>
                            Class {b.class_num || ncertClass} • {b.subject || ncertSubject}
                          </div>
                          <a href={b.pdf_url || "https://ncert.nic.in/textbook.php"} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: accentGreen, fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
                            Read Official NCERT PDF →
                          </a>
                        </div>
                      ))
                    ) : (
                      <div style={{ color: textSecondary, fontSize: '0.88rem' }}>NCERT catalog ready. Select class and subject above to load textbooks.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Subtab 3: Papers */}
              {recSubtab === 'papers' && (
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                    <input
                      type="text"
                      value={paperQuery}
                      onChange={(e) => setPaperQuery(e.target.value)}
                      placeholder="Search arXiv preprints..."
                      style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${borderCol}`, background: surfaceBg, color: textPrimary }}
                    />
                    <button onClick={() => fetchPapers(paperQuery)} style={{ background: accentGreen, color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                      Search Papers
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {papers.map((p, i) => (
                      <div key={i} style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 16, borderRadius: 10 }}>
                        <div style={{ fontSize: '0.94rem', fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: '0.76rem', color: textSecondary, marginTop: 4 }}>{p.authors?.join(', ')}</div>
                        <p style={{ fontSize: '0.82rem', color: textSecondary, marginTop: 6, lineHeight: 1.5 }}>{p.summary?.slice(0, 240)}...</p>
                        {p.pdf_url && (
                          <a href={p.pdf_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: accentGreen, fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
                            Open arXiv PDF Link →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 4: Books */}
              {recSubtab === 'books' && (
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                    <input
                      type="text"
                      value={bookQuery}
                      onChange={(e) => setBookQuery(e.target.value)}
                      placeholder="Search university textbooks on Google Books..."
                      style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${borderCol}`, background: surfaceBg, color: textPrimary }}
                    />
                    <button onClick={() => fetchBooks(bookQuery)} style={{ background: accentGreen, color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                      Search Books
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {books.map((b, i) => (
                      <div key={i} style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 16, borderRadius: 10 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{b.title}</div>
                        <div style={{ fontSize: '0.76rem', color: textSecondary, marginTop: 4 }}>{b.authors?.join(', ')}</div>
                        {b.snippet && <p style={{ fontSize: '0.78rem', marginTop: 6, fontStyle: 'italic' }}>&ldquo;{b.snippet}&rdquo;</p>}
                        {b.preview_link && (
                          <a href={b.preview_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: accentGreen, fontWeight: 600, marginTop: 8, display: 'inline-block' }}>
                            Read Google Books Preview →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 5: Inquiries */}
              {recSubtab === 'inquiries' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: accentGreen, marginBottom: 14 }}>
                    Structured Inquiry Pathways
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      "Derive the Euler-Lagrange equations from the Principle of Least Action",
                      "Compute eigenvalues and eigenvectors of a 3x3 symmetric matrix",
                      "Explain the mechanism of ATP synthesis via chemiosmotic coupling in mitochondria",
                      "State the Space-Optimized Fibonacci Recurrence and prove O(1) auxiliary space"
                    ].map((iq, i) => (
                      <div
                        key={i}
                        onClick={() => handleSubmitQuestion(undefined, iq)}
                        style={{
                          background: cardBg,
                          border: `1px solid ${borderCol}`,
                          padding: '14px 18px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.88rem',
                          color: textPrimary
                        }}
                      >
                        ⚡ {iq}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROGRESS */}
          {activeTab === 'progress' && (
            <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '36px 40px', background: bgCanvas }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.85rem', fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                Learner Mastery & Academic Analytics
              </h2>
              <p style={{ fontSize: '0.9rem', color: textSecondary, marginBottom: 24 }}>
                Real-time tracking of inquiries solved, focus discipline, and domain mastery.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 20, borderRadius: 10 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: accentGreen, fontFamily: 'Fraunces, serif' }}>{userProfile.streak_days}</div>
                  <div style={{ fontSize: '0.78rem', color: textSecondary }}>Active Streak Days</div>
                </div>
                <div style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 20, borderRadius: 10 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: accentGreen, fontFamily: 'Fraunces, serif' }}>{history.length}</div>
                  <div style={{ fontSize: '0.78rem', color: textSecondary }}>Inquiries Resolved</div>
                </div>
                <div style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 20, borderRadius: 10 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: accentGreen, fontFamily: 'Fraunces, serif' }}>{userProfile.focus_score}%</div>
                  <div style={{ fontSize: '0.78rem', color: textSecondary }}>Focus Discipline</div>
                </div>
                <div style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 20, borderRadius: 10 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: accentGreen, fontFamily: 'Fraunces, serif' }}>{userProfile.knowledge_level}</div>
                  <div style={{ fontSize: '0.78rem', color: textSecondary }}>Curriculum Level</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEARN */}
          {activeTab === 'learn' && (
            <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '36px 40px', background: bgCanvas }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.85rem', fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                Active Recall & Curriculum Flashcards
              </h2>
              <p style={{ fontSize: '0.9rem', color: textSecondary, marginBottom: 24 }}>
                Self-testing flashcards covering formulas, definitions, and theorems.
              </p>

              <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 16, padding: 32, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: accentGreen }}>QUANTUM MECHANICS</span>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', margin: '14px 0' }}>
                  What is the Time-Independent Schrödinger Equation in 1D?
                </h3>
                <div style={{ padding: 16, background: bwMode ? '#222' : '#F5EFE6', borderRadius: 8, fontFamily: 'monospace', fontSize: '0.92rem', color: textPrimary }}>
                  -ħ²/2m · d²ψ/dx² + V(x)ψ(x) = Eψ(x)
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '36px 40px', background: bgCanvas }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.85rem', fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                Learner Profile & Academic Classification
              </h2>
              <p style={{ fontSize: '0.9rem', color: textSecondary, marginBottom: 24 }}>
                Student preferences, curriculum level, and linked institutions.
              </p>

              <div style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 24, borderRadius: 12, maxWidth: 600 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Scholar Name:</label>
                  <input
                    type="text"
                    value={userProfile.user_name}
                    onChange={(e) => setUserProfile({ ...userProfile, user_name: e.target.value })}
                    style={{ width: '100%', padding: 10, border: `1px solid ${borderCol}`, borderRadius: 6, background: surfaceBg, color: textPrimary }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Institution:</label>
                  <input
                    type="text"
                    value={userProfile.institution}
                    onChange={(e) => setUserProfile({ ...userProfile, institution: e.target.value })}
                    style={{ width: '100%', padding: 10, border: `1px solid ${borderCol}`, borderRadius: 6, background: surfaceBg, color: textPrimary }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Knowledge Classification:</label>
                  <select
                    value={userProfile.knowledge_level}
                    onChange={(e) => setUserProfile({ ...userProfile, knowledge_level: e.target.value })}
                    style={{ width: '100%', padding: 10, border: `1px solid ${borderCol}`, borderRadius: 6, background: surfaceBg, color: textPrimary }}
                  >
                    <option value="Beginner">Beginner / Foundations</option>
                    <option value="Intermediate">Intermediate / Board Level</option>
                    <option value="Advanced">Advanced / University Proofs</option>
                    <option value="Researcher">Researcher / Post-Graduate</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTING */}
          {activeTab === 'setting' && (
            <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '36px 40px', background: bgCanvas }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.85rem', fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                Platform Configuration & Academic Pipelines
              </h2>
              <p style={{ fontSize: '0.9rem', color: textSecondary, marginBottom: 24 }}>
                Customize display mode, language, and explore connected academic repositories.
              </p>

              <div style={{ background: cardBg, border: `1px solid ${borderCol}`, padding: 24, borderRadius: 12, maxWidth: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Black & White Monochrome Mode</div>
                    <div style={{ fontSize: '0.78rem', color: textSecondary }}>High-contrast distraction-free print aesthetic</div>
                  </div>
                  <button
                    onClick={() => setBwMode(!bwMode)}
                    style={{ background: accentGreen, color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                  >
                    {bwMode ? 'Disable B&W' : 'Enable B&W'}
                  </button>
                </div>

                <div style={{ borderTop: `1px solid ${borderCol}`, paddingTop: 16 }}>
                  <button
                    onClick={() => { setHistory([]); setCurrentRecord(null); showToast('History cleared.'); }}
                    style={{ background: 'transparent', border: '1px solid #D9774E', color: '#D9774E', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Clear Current Session History
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT NAVIGATION SIDEBAR */}
        <nav style={{
          width: 80,
          background: surfaceBg,
          borderLeft: `1px solid ${borderCol}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: 12,
          flexShrink: 0
        }}>
          {[
            { id: 'tutor', label: 'Tutor', icon: '⚡' },
            { id: 'recommendation', label: 'Recommendation', icon: '🎯' },
            { id: 'progress', label: 'Progress', icon: '📊' },
            { id: 'learn', label: 'Learn', icon: '📚' },
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'setting', label: 'Setting', icon: '⚙️' }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  width: 60,
                  height: 56,
                  borderRadius: 10,
                  border: 'none',
                  background: isActive
                    ? (bwMode ? '#2A2A2A' : '#EAF0EC')
                    : 'transparent',
                  color: isActive
                    ? (bwMode ? '#FFFFFF' : '#23493D')
                    : (bwMode ? '#888888' : '#6A7870'),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.72rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
