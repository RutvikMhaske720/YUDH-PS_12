'use client';

import { useEffect } from 'react';

export default function WorkspacePage() {
  useEffect(() => {
    // Seamless instant redirect to the exact working HTML prototype
    window.location.replace('/workspace.html');
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#FAF7F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid #E8E2D8',
        borderTop: '3px solid #23493D',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 16
      }} />
      <p style={{ color: '#23493D', fontWeight: 600, fontSize: '0.95rem' }}>
        Entering Phoenix Academic Intelligence Workspace...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
