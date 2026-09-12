'use client';

import React from 'react';

export type ActiveMode = 'tutor' | 'recommendation' | 'progress' | 'learn' | 'profile' | 'setting';

interface SidebarProps {
  activeMode: ActiveMode;
  onSelectMode: (mode: ActiveMode) => void;
  bwMode: boolean;
}

const NAV_ITEMS: { id: ActiveMode; label: string; icon: string }[] = [
  { id: 'tutor', label: 'Tutor', icon: '⚡' },
  { id: 'recommendation', label: 'Recommendation', icon: '🎯' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'learn', label: 'Learn', icon: '📚' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'setting', label: 'Setting', icon: '⚙️' }
];

export default function Sidebar({ activeMode, onSelectMode, bwMode }: SidebarProps) {
  return (
    <nav style={{
      width: 80,
      background: bwMode ? '#141414' : '#FFFFFF',
      borderLeft: `1px solid ${bwMode ? '#333333' : '#E8E2D8'}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      gap: 12,
      flexShrink: 0
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeMode === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectMode(item.id)}
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
  );
}
