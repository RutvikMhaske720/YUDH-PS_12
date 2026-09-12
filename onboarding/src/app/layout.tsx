import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Phoenix · Agentic Tutor Orchestrating Subject-Specialist Sub-Agents",
  description: "An agentic tutoring platform where a coordinator agent routes student questions to specialized subject agents while maintaining a unified student profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FAF7F2] text-[#1C2B27] min-h-screen flex flex-col antialiased">
        <div className="grain" />
        <Navbar />
        <main className="flex-1 pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
