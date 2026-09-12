import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Phoenix AI • Agentic Academic Intelligence',
  description: 'Agentic Tutor & Multi-Agent Architecture for Mathematics, Physics, Computing & Life Sciences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
