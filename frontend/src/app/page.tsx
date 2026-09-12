'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Sidebar, { ActiveMode } from '../components/Sidebar';
import RecommendationStudio from '../components/RecommendationStudio';

// Official SVG Logos
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22">
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
    <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const GoogleBooksIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22">
    <path fill="#4285F4" d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
    <path fill="#FFFFFF" d="M6 6h12v2H6zm0 4h12v2H6zm0 4h8v2H6z"/>
  </svg>
);

export default function PhoenixApp() {
  const [activeMode, setActiveMode] = useState<ActiveMode>('tutor');
  const [history, setHistory] = useState<any[]>([]);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [bwMode, setBwMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState<any>({
    user_name: 'Academic Scholar',
    knowledge_level: 'Advanced',
    streak_days: 5,
    focus_score: 96,
    domain_mastery: { math: 82, programming: 88, physics: 76, chemistry: 70, biology: 74 }
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load history & profile on mount
  useEffect(() => {
    fetchHistory();
    fetchProfile();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reliable Blob-based download for Word, PPTX, Excel, and ZIP Context Reports
  const handleExport = async (format: string) => {
    try {
      const res = await fetch(`/api/export/${format}`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Phoenix_Academic_Context_Report.${format}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 1000);
    } catch (e) {
      console.error(e);
      alert('Export generation failed. Please try again.');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionText.trim()) return;

    const q = questionText.trim();
    setQuestionText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, domain: selectedDomain !== 'all' ? selectedDomain : 'auto' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const fullRecord = {
          ...data,
          id: data.id || data.record_id,
          record_id: data.record_id || data.id
        };
        setCurrentRecord(fullRecord);
        setHistory(prev => [fullRecord, ...prev]);
        if (data.user_profile) setUserProfile(data.user_profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: bwMode ? '#0A0A0A' : '#FAF7F2' }}>
      {/* App Header */}
      <Header
        bwMode={bwMode}
        onToggleBwMode={() => setBwMode(!bwMode)}
        language={language}
        onChangeLanguage={setLanguage}
        onExport={handleExport}
      />

      {/* App Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main Stage Workspace */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {activeMode === 'tutor' && (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              {/* Left Chat History */}
              <aside style={{ width: 290, background: '#F4EFE6', borderRight: '1px solid #E8E2D8', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 18, borderBottom: '1px solid #E8E2D8', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: '1.15rem' }}>Session History</h3>
                    <span style={{ fontSize: '0.72rem', background: '#EAF0EC', color: '#23493D', padding: '2px 8px', borderRadius: 9999 }}>{history.length}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search past inquiries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', background: '#FFF', border: '1px solid #E8E2D8', borderRadius: 6, fontSize: '0.82rem' }}
                  />
                  <button onClick={() => setCurrentRecord(null)} style={{ padding: 9, background: '#23493D', color: '#FFF', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}>+ New Inquiry</button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setCurrentRecord(item)}
                      style={{
                        padding: 11,
                        background: currentRecord?.id === item.id ? '#EAF0EC' : '#FFF',
                        border: currentRecord?.id === item.id ? '1px solid #23493D' : '1px solid #E8E2D8',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '0.68rem', color: '#23493D', fontWeight: 700 }}>{item.subject || item.domain}</span>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.question}</div>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Middle Chat Stream */}
              <section style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 140px 24px' }}>
                  {currentRecord ? (
                    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div style={{ alignSelf: 'flex-end', background: '#23493D', color: '#FFF', padding: '14px 20px', borderRadius: 16, maxWidth: '80%' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F3D5C7' }}>PROBLEM QUERY</span>
                        <div style={{ fontSize: '0.94rem', marginTop: 4 }}>{currentRecord.question}</div>
                      </div>

                      <div style={{ background: '#FFF', border: '1px solid #E8E2D8', borderRadius: 16, padding: '28px 30px', boxShadow: '0 4px 16px rgba(35, 73, 61, 0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E8E2D8', paddingBottom: 14, marginBottom: 18 }}>
                          <span style={{ fontFamily: 'Newsreader, serif', fontWeight: 700, fontSize: '1.15rem' }}>{currentRecord.agent_used}</span>
                          <span style={{ fontSize: '0.72rem', background: '#EAF0EC', color: '#23493D', padding: '3px 9px', borderRadius: 9999 }}>{currentRecord.subject}</span>
                        </div>

                        <div style={{ fontSize: '0.96rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                          {currentRecord.answer}
                        </div>

                        {/* YouTube Lectures */}
                        {currentRecord.videos?.length > 0 && (
                          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E8E2D8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Newsreader, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>
                              <YouTubeIcon />
                              <span>Recommended Video Lectures</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              {currentRecord.videos.map((v: any) => (
                                <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: 10, padding: 10, background: '#FAF7F2', borderRadius: 8, textDecoration: 'none', color: '#18221D', border: '1px solid #E8E2D8' }}>
                                  <img src={v.thumbnail} alt={v.title} style={{ width: 100, height: 65, objectFit: 'cover', borderRadius: 4 }} />
                                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{v.title}</div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Google Books Citations */}
                        {currentRecord.books?.length > 0 && (
                          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E8E2D8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Newsreader, serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>
                              <GoogleBooksIcon />
                              <span>Curated Textbooks & Relevant Pages</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              {currentRecord.books.map((b: any) => (
                                <div key={b.id} style={{ display: 'flex', gap: 12, padding: 12, background: '#FAF7F2', borderRadius: 8, border: '1px solid #E8E2D8' }}>
                                  <img src={b.thumbnail} alt={b.title} style={{ width: 55, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                                  <div>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{b.title}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#7E8C84' }}>{b.authors}</div>
                                    <div style={{ fontSize: '0.68rem', color: '#23493D', background: '#EAF0EC', padding: '2px 6px', borderRadius: 4, width: 'fit-content', marginTop: 4 }}>{b.relevant_page_info}</div>
                                    <a href={b.previewLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#D9774E', fontWeight: 600, display: 'block', marginTop: 4 }}>Preview on Google Books →</a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxWidth: 780, margin: '40px auto', background: '#FFF', padding: 36, borderRadius: 16, border: '1px solid #E8E2D8' }}>
                      <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '1.85rem', color: '#18221D', marginBottom: 8 }}>Agentic Tutor, built for every student & institute.</h2>
                      <p style={{ color: '#526058', fontSize: '0.94rem' }}>Enter any academic inquiry in Mathematics, Dynamic Programming, Quantum Physics, or Biology below to begin.</p>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Floating Docked Bottom Input Bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 24px 18px 24px', background: 'linear-gradient(180deg, rgba(250,247,242,0) 0%, rgba(250,247,242,1) 40%)' }}>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 860, margin: '0 auto', background: '#FFF', border: '1px solid #D5CCC0', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 32px rgba(24,34,29,0.1)' }}>
                    <input
                      type="text"
                      placeholder="Ask any academic problem in Maths, Physics, Code, Chemistry, Bio... (Press Enter)"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.94rem', color: '#18221D' }}
                    />
                    <button type="submit" disabled={loading} style={{ width: 38, height: 38, borderRadius: '50%', background: '#23493D', color: '#FFF', border: 'none', cursor: 'pointer' }}>
                      {loading ? '...' : '▶'}
                    </button>
                  </form>
                </div>
              </section>
            </div>
          )}

          {/* Full-Screen Recommendation Workspace */}
          {activeMode === 'recommendation' && (
            <RecommendationStudio
              bwMode={bwMode}
              onLoadInquiryToTutor={(iq) => {
                setActiveMode('tutor');
                setQuestionText(iq);
              }}
            />
          )}

          {/* Full-Screen Progress Workspace */}
          {activeMode === 'progress' && (
            <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '2rem', color: '#18221D' }}>Learner Progress & Domain Analytics</h2>
              <p style={{ color: '#526058', marginBottom: 24 }}>Comprehensive mastery scores across academic disciplines.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 24 }}>
                <div style={{ background: '#FFF', padding: 20, borderRadius: 8, border: '1px solid #E8E2D8' }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontSize: '2.2rem', fontWeight: 700, color: '#23493D' }}>{userProfile.streak_days}</div>
                  <div style={{ fontSize: '0.8rem', color: '#7E8C84' }}>Active Streak Days</div>
                </div>
                <div style={{ background: '#FFF', padding: 20, borderRadius: 8, border: '1px solid #E8E2D8' }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontSize: '2.2rem', fontWeight: 700, color: '#23493D' }}>{history.length}</div>
                  <div style={{ fontSize: '0.8rem', color: '#7E8C84' }}>Problems Solved</div>
                </div>
                <div style={{ background: '#FFF', padding: 20, borderRadius: 8, border: '1px solid #E8E2D8' }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontSize: '2.2rem', fontWeight: 700, color: '#23493D' }}>{userProfile.focus_score}%</div>
                  <div style={{ fontSize: '0.8rem', color: '#7E8C84' }}>Focus Discipline Health</div>
                </div>
                <div style={{ background: '#FFF', padding: 20, borderRadius: 8, border: '1px solid #E8E2D8' }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontSize: '2.2rem', fontWeight: 700, color: '#23493D' }}>{userProfile.knowledge_level}</div>
                  <div style={{ fontSize: '0.8rem', color: '#7E8C84' }}>Knowledge Level</div>
                </div>
              </div>
            </div>
          )}

          {/* Full-Screen Learn Workspace */}
          {activeMode === 'learn' && (
            <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '2rem', color: '#18221D' }}>Active Recall & Curriculum Studio</h2>
              <p style={{ color: '#526058', marginBottom: 24 }}>Formulas, derivations, and practice quizzes.</p>
              <div style={{ background: '#FFF', padding: 32, borderRadius: 16, border: '1px solid #E8E2D8', maxWidth: 650, margin: '0 auto', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#23493D' }}>QUANTUM PHYSICS</span>
                <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: '1.4rem', margin: '14px 0' }}>What is the Time-Independent Schrödinger Equation in 1D?</h3>
                <div style={{ padding: 16, background: '#F5EFE6', borderRadius: 8, fontFamily: 'Fira Code, monospace', fontSize: '0.9rem' }}>
                  -ħ²/2m · d²ψ/dx² + V(x)ψ = Eψ
                </div>
              </div>
            </div>
          )}

          {/* Full-Screen Profile Workspace */}
          {activeMode === 'profile' && (
            <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '2rem', color: '#18221D' }}>Learner Profile & Academic Classification</h2>
              <div style={{ background: '#FFF', padding: 24, borderRadius: 12, border: '1px solid #E8E2D8', maxWidth: 600, marginTop: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>Scholar Name:</label>
                  <input type="text" value={userProfile.user_name} readOnly style={{ width: '100%', padding: 10, border: '1px solid #E8E2D8', borderRadius: 6 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>Knowledge Classification:</label>
                  <select value={userProfile.knowledge_level} onChange={(e) => setUserProfile({ ...userProfile, knowledge_level: e.target.value })} style={{ width: '100%', padding: 10, border: '1px solid #E8E2D8', borderRadius: 6 }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Researcher">Researcher</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Full-Screen Setting Workspace */}
          {activeMode === 'setting' && (
            <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '2rem', color: '#18221D' }}>Platform Configuration & Academic Pipelines</h2>
              <div style={{ background: '#FFF', padding: 24, borderRadius: 12, border: '1px solid #E8E2D8', maxWidth: 600, marginTop: 24 }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>Display Mode:</label>
                  <button onClick={() => setBwMode(!bwMode)} style={{ padding: '8px 16px', background: bwMode ? '#000' : '#23493D', color: '#FFF', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {bwMode ? 'Monochrome Active' : 'Toggle Black & White Mode'}
                  </button>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>Platform Language:</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid #E8E2D8', borderRadius: 6 }}>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Navigation Sidebar */}
        <Sidebar
          activeMode={activeMode}
          onSelectMode={setActiveMode}
          bwMode={bwMode}
        />
      </div>
    </div>
  );
}
