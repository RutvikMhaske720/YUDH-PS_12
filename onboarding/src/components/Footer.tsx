import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1C2B27] text-[#FAF7F2]/60 pt-20 pb-12 mt-20 border-t border-[#FAF7F2]/10">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-[#FAF7F2]/10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold text-white">
              <span className="w-7 h-7 rounded-full bg-[#3D6B5E] flex items-center justify-center text-sm font-bold text-[#F4D9C6]">p</span>
              <span>phoenix</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-[#FAF7F2]/70">
              Agentic tutor orchestrating subject-specialist sub-agents. Maintaining unified student memory across multi-disciplinary &amp; cross-domain subjects.
            </p>
            <div className="pt-2 flex gap-2">
              <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-white/10 text-[#E8A87C] border border-white/10">
                PS12 · Hackathon Prototype
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/40 mb-5">
              Core Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/onboarding?mode=individual" className="hover:text-[#E8A87C] transition-colors">Individual Onboarding</Link></li>
              <li><Link href="/onboarding?mode=institute" className="hover:text-[#E8A87C] transition-colors">Institute Credential Verification</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#E8A87C] transition-colors">Student Tutor Workspace</Link></li>
              <li><Link href="/specialists" className="hover:text-[#E8A87C] transition-colors">Subject Specialist Sub-Agents</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/40 mb-5">
              Specialist Agents
            </h4>
            <ul className="space-y-3 text-sm">
              <li><span className="text-[#FAF7F2]/80">📐 Coordinator Agent (Routing)</span></li>
              <li><span className="text-[#FAF7F2]/80">🧮 Mathematics &amp; Calculus Sub-Agent</span></li>
              <li><span className="text-[#FAF7F2]/80">💻 Computer Science &amp; Code Sub-Agent</span></li>
              <li><span className="text-[#FAF7F2]/80">🔬 Physics &amp; Natural Sciences Sub-Agent</span></li>
              <li><span className="text-[#FAF7F2]/80">📚 Research &amp; Literature Agent</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/40 mb-5">
              Ecosystem Upgrade
            </h4>
            <p className="text-xs text-[#FAF7F2]/60 mb-4 leading-relaxed">
              Institutes act as verifiers of facts. Differentiating self-reported student claims from institute-verified academic history.
            </p>
            <Link href="/institute" className="inline-block text-xs font-mono font-bold text-[#E8A87C] underline hover:text-white transition-colors">
              Explore Institute Verification Hub →
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[#FAF7F2]/40">
          <p>© {new Date().getFullYear()} Phoenix Agentic Tutor. Built for multi-agent educational orchestration.</p>
          <div className="flex gap-6">
            <span>CBSE / ICSE Aligned</span>
            <span>University Level Proofs</span>
            <span>SheerID Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
