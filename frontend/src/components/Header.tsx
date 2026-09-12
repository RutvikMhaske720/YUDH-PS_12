'use client';

import React from 'react';

interface HeaderProps {
  bwMode: boolean;
  onToggleBwMode: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
  onExport: (format: 'docx' | 'pptx' | 'xlsx' | 'zip') => void;
}

export default function Header({
  bwMode,
  onToggleBwMode,
  language,
  onChangeLanguage,
  onExport
}: HeaderProps) {
  return (
    <header style={{
      height: 64,
      background: bwMode ? '#111111' : '#FFFFFF',
      borderBottom: `1px solid ${bwMode ? '#333333' : '#E8E2D8'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      gap: 16,
      flexWrap: 'nowrap',
      zIndex: 100
    }}>
      {/* Left: Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <img
          src="/logo.png"
          alt="Phoenix Logo"
          style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 8, background: bwMode ? '#222' : '#F5EFE6', padding: 2, border: `1px solid ${bwMode ? '#444' : '#E8E2D8'}` }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Newsreader, Georgia, serif', fontWeight: 700, fontSize: '1.25rem', color: bwMode ? '#FFFFFF' : '#23493D', whiteSpace: 'nowrap' }}>
              Phoenix AI
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', background: bwMode ? '#222' : '#EAF0EC', color: bwMode ? '#FFF' : '#23493D', border: `1px solid ${bwMode ? '#444' : '#C2D6CA'}`, borderRadius: 9999, whiteSpace: 'nowrap' }}>
              Multi-Agent Architecture
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: bwMode ? '#A8A8A8' : '#526058', whiteSpace: 'nowrap' }}>
            Agentic Academic Intelligence & Research Platform
          </span>
        </div>
      </div>

      {/* Center: Clean Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px',
        background: bwMode ? '#1C1C1C' : '#F5EFE6',
        border: `1px solid ${bwMode ? '#333' : '#E8E2D8'}`,
        borderRadius: 9999,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: bwMode ? '#FFF' : '#23493D' }}></span>
        <span style={{ fontSize: '0.76rem', color: bwMode ? '#FFF' : '#23493D', fontWeight: 600 }}>
          Academic Research Engine
        </span>
      </div>

      {/* Controls: Language & B&W Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: bwMode ? '#1C1C1C' : '#FFFFFF',
          border: `1px solid ${bwMode ? '#333' : '#E8E2D8'}`,
          borderRadius: 8,
          padding: '4px 8px'
        }}>
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: bwMode ? '#FFF' : '#18221D',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <button
          onClick={onToggleBwMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: bwMode ? '#FFFFFF' : '#FFFFFF',
            border: `1px solid ${bwMode ? '#FFFFFF' : '#E8E2D8'}`,
            color: bwMode ? '#000000' : '#18221D',
            borderRadius: 8,
            padding: '5px 10px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {bwMode ? 'Color Mode' : 'B&W Mode'}
        </button>
      </div>

      {/* Right: Modern Segmented Export Hub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onExport('zip')}
          style={{
            background: bwMode ? '#FFFFFF' : '#23493D',
            color: bwMode ? '#000000' : '#FFFFFF',
            padding: '6px 13px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.78rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap'
          }}
        >
          Export ZIP
        </button>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: bwMode ? '#1E1E1E' : '#F5EFE6',
          border: `1px solid ${bwMode ? '#444' : '#E8E2D8'}`,
          borderRadius: 8,
          padding: 2,
          gap: 2
        }}>
          {(['docx', 'pptx', 'xlsx'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onExport(fmt)}
              style={{
                background: 'transparent',
                border: 'none',
                color: bwMode ? '#CCCCCC' : '#526058',
                padding: '5px 9px',
                borderRadius: 6,
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {fmt === 'docx' ? 'Word' : fmt === 'pptx' ? 'PPT' : 'Excel'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
