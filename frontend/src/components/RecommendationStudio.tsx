'use client';

import React, { useState } from 'react';

interface RecommendationStudioProps {
  bwMode: boolean;
  onLoadInquiryToTutor: (inquiry: string) => void;
}

export default function RecommendationStudio({ bwMode, onLoadInquiryToTutor }: RecommendationStudioProps) {
  const [subtab, setSubtab] = useState<'videos' | 'ncert' | 'papers' | 'books' | 'inquiries'>('videos');

  const tabs: { id: typeof subtab; label: string; icon: string }[] = [
    { id: 'videos', label: 'Video Masterclasses', icon: '▶' },
    { id: 'ncert', label: 'NCERT Textbooks', icon: '📖' },
    { id: 'papers', label: 'Research Papers', icon: '📄' },
    { id: 'books', label: 'Academic Books', icon: '📚' },
    { id: 'inquiries', label: 'Inquiry Pathways', icon: '🧭' }
  ];

  return (
    <div style={{
      flex: 1,
      height: '100%',
      overflowY: 'auto',
      padding: '32px 40px',
      background: bwMode ? '#0A0A0A' : '#FAF7F2'
    }}>
      {/* Studio Header */}
      <div style={{ borderBottom: `1px solid ${bwMode ? '#333' : '#E8E2D8'}`, paddingBottom: 16, marginBottom: 20 }}>
        <h2 style={{
          fontFamily: 'Newsreader, Georgia, serif',
          fontSize: '1.85rem',
          fontWeight: 700,
          color: bwMode ? '#FFFFFF' : '#18221D'
        }}>
          Academic Recommendation & Research Studio
        </h2>
        <p style={{ fontSize: '0.92rem', color: bwMode ? '#A8A8A8' : '#526058', marginTop: 4 }}>
          Curated Video Masterclasses, Official NCERT Textbooks, arXiv Research Papers, and Academic Books tailored to your academic inquiries.
        </p>
      </div>

      {/* Pill Navigation (Fixed Height & Clearance - No Clipping) */}
      <div style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '6px 4px 16px 4px',
        minHeight: 58,
        borderBottom: `1px solid ${bwMode ? '#333' : '#E8E2D8'}`,
        overflowX: 'auto',
        overflowY: 'hidden',
        boxSizing: 'border-box',
        marginBottom: 24
      }}>
        {tabs.map((t) => {
          const isActive = subtab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSubtab(t.id)}
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
                  ? (bwMode ? '#FFFFFF' : '#23493D')
                  : (bwMode ? '#1C1C1C' : '#FFFFFF'),
                color: isActive
                  ? (bwMode ? '#000000' : '#FFFFFF')
                  : (bwMode ? '#A8A8A8' : '#526058'),
                border: `1px solid ${isActive ? (bwMode ? '#FFF' : '#23493D') : (bwMode ? '#333' : '#E8E2D8')}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab Content Panels */}
      {subtab === 'videos' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: bwMode ? '#FFF' : '#23493D', marginBottom: 14 }}>
            Suggested For Your Active Inquiries
          </h3>
          <p style={{ fontSize: '0.88rem', color: bwMode ? '#A8A8A8' : '#6A7870' }}>
            Connected to YouTube Data API v3 academic channel indexes for Physics, Chemistry, Mathematics, and Computing.
          </p>
        </div>
      )}

      {subtab === 'ncert' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: bwMode ? '#FFF' : '#23493D', marginBottom: 14 }}>
            Official NCERT Textbook Repository
          </h3>
          <p style={{ fontSize: '0.88rem', color: bwMode ? '#A8A8A8' : '#6A7870' }}>
            Direct access to Classes IX-XII Mathematics, Physics, Chemistry, and Biology curriculum chapters.
          </p>
        </div>
      )}

      {subtab === 'papers' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: bwMode ? '#FFF' : '#23493D', marginBottom: 14 }}>
            arXiv & Academic Research Papers
          </h3>
          <p style={{ fontSize: '0.88rem', color: bwMode ? '#A8A8A8' : '#6A7870' }}>
            Peer-reviewed scientific preprints, abstracts, and PDF links for advanced academic exploration.
          </p>
        </div>
      )}

      {subtab === 'books' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: bwMode ? '#FFF' : '#23493D', marginBottom: 14 }}>
            Google Books Academic Volume Index
          </h3>
          <p style={{ fontSize: '0.88rem', color: bwMode ? '#A8A8A8' : '#6A7870' }}>
            Authoritative university textbooks, page citations, and preview links.
          </p>
        </div>
      )}

      {subtab === 'inquiries' && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: bwMode ? '#FFF' : '#23493D', marginBottom: 14 }}>
            Structured Inquiry Pathways
          </h3>
          <p style={{ fontSize: '0.88rem', color: bwMode ? '#A8A8A8' : '#6A7870', marginBottom: 16 }}>
            Click an inquiry to immediately begin step-by-step rigorous derivation:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              "Derive the Euler-Lagrange equations from the Principle of Least Action",
              "Compute eigenvalues and eigenvectors of a 3x3 symmetric matrix",
              "Explain the mechanism of ATP synthesis via chemiosmotic coupling"
            ].map((iq, i) => (
              <div
                key={i}
                onClick={() => onLoadInquiryToTutor(iq)}
                style={{
                  background: bwMode ? '#181818' : '#FFFFFF',
                  padding: '12px 18px',
                  borderRadius: 8,
                  border: `1px solid ${bwMode ? '#333' : '#E8E2D8'}`,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: bwMode ? '#FFF' : '#18221D'
                }}
              >
                ⚡ {iq}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
