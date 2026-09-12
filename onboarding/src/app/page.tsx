import React from 'react';
import Link from 'next/link';
import HeroOrbit from '@/components/HeroOrbit';
import HowItWorksSection from '@/components/HowItWorksSection';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Building2,
  BookOpen,
  CheckCircle2,
  Zap,
  UserCheck,
  LineChart,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <header className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(60%_55%_at_82%_14%,rgba(232,168,124,0.25),transparent_62%),radial-gradient(54%_60%_at_8%_80%,rgba(197,221,214,0.45),transparent_62%),radial-gradient(72%_50%_at_50%_-5%,rgba(244,217,198,0.40),transparent_60%)]" />

        <div className="wrap relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-white border border-[#1C2B27]/10 shadow-sm text-[#3D6B5E]">
                <span className="w-2 h-2 rounded-full bg-[#3D6B5E] animate-ping" />
                Multi-Agent Architecture · PS12 Prototype Live
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-[#1C2B27] leading-[1.08]">
                Agentic Tutor, <br />
                built for <em>every</em> student &amp; institute.
              </h1>

              <p className="text-xl text-[#3E4F49] max-w-xl leading-relaxed">
                Phoenix pairs a <strong>Coordinator Agent</strong> with specialized subject sub-agents. Routing complex questions across <strong>Multi-disciplinary &amp; cross-domain subjects</strong> while maintaining a unified student context across all learning stages.
              </p>

              {/* Main Landing CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/onboarding?mode=individual" className="btn btn-primary text-base font-semibold px-8 py-4 shadow-xl">
                  <span>Individual Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link href="/onboarding?mode=institute" className="btn btn-ghost text-base font-semibold px-8 py-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#D48A55]" />
                  <span>Connect to Institute</span>
                </Link>

                <Link href="/dashboard" className="btn btn-ghost border-[#3D6B5E]/30 text-[#3D6B5E] text-base font-semibold px-6 py-4 flex items-center gap-2 hover:bg-[#3D6B5E]/10">
                  <Sparkles className="w-5 h-5 text-[#3D6B5E]" />
                  <span>Academic Workspace</span>
                </Link>
              </div>

              {/* Ecosystem Highlight */}
              <div className="pt-6 border-t border-[#1C2B27]/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#6A7872]">
                <span className="flex items-center gap-1.5 text-[#3D6B5E] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#D48A55]" />
                  Institute Verified Facts
                </span>
                <span>• School &amp; Board Aligned</span>
                <span>• University &amp; PhD Level Proofs</span>
              </div>
            </div>

            {/* Hero Right: Multi-Agent Orbit Graphic */}
            <div className="lg:col-span-5">
              <HeroOrbit />
            </div>
          </div>
        </div>
      </header>

      {/* TICKER MARQUEE */}
      <section className="border-y border-[#1C2B27]/10 bg-white/40 py-5 overflow-hidden">
        <div className="animate-ticker space-x-12">
          {[
            'Coordinator Routing Agent',
            'Math & Calculus Sub-Agent',
            'Physics & Optics Sub-Agent',
            'Computer Science & Code Sandbox',
            'SheerID Institute Verifier',
            'Claimed vs Verified Facts',
            'Socratic Tutoring Engine',
            'Desmos Interactive Grapher',
          ].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 font-mono text-xs font-bold tracking-wider text-[#3E4F49] uppercase whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A87C]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM & MULTI-AGENT SOLUTION SECTION */}
      <section className="py-20 bg-[#1C2B27] text-[#FAF7F2] relative">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="eyebrow text-[#F4D9C6] justify-center">The Challenge</div>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-white">
              Why single chatbots fail, and how <em>multi-agent orchestration</em> solves it.
            </h2>
            <p className="text-lg text-[#FAF7F2]/70">
              Students ask questions spanning multiple subjects. A generic LLM lacks subject depth and loses track of the student’s long-term learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#243530] p-8 rounded-3xl border border-white/10 space-y-4 hover:border-[#E8A87C]/50 transition-colors">
              <div className="font-serif text-5xl font-medium text-[#F4D9C6]/30">01</div>
              <h3 className="text-2xl font-serif font-medium text-white">Intelligent Routing</h3>
              <p className="text-sm text-[#FAF7F2]/70 leading-relaxed">
                The Coordinator Agent analyzes incoming queries and routes them to dedicated sub-agents trained on specific domain knowledge.
              </p>
            </div>

            <div className="bg-[#243530] p-8 rounded-3xl border border-white/10 space-y-4 hover:border-[#E8A87C]/50 transition-colors">
              <div className="font-serif text-5xl font-medium text-[#F4D9C6]/30">02</div>
              <h3 className="text-2xl font-serif font-medium text-white">Specialist Execution</h3>
              <p className="text-sm text-[#FAF7F2]/70 leading-relaxed">
                Subject specialist sub-agents deliver deep, rigorous explanations and generate interactive Desmos graphs or executable code.
              </p>
            </div>

            <div className="bg-[#243530] p-8 rounded-3xl border border-white/10 space-y-4 hover:border-[#E8A87C]/50 transition-colors">
              <div className="font-serif text-5xl font-medium text-[#F4D9C6]/30">03</div>
              <h3 className="text-2xl font-serif font-medium text-white">Shared Context</h3>
              <p className="text-sm text-[#FAF7F2]/70 leading-relaxed">
                Every sub-agent reads from and updates a single unified student profile, preserving mastery status, weaknesses, and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* INSTITUTE VS INDIVIDUAL ECOSYSTEM HIGHLIGHT */}
      <section className="py-20 bg-gradient-to-b from-[#FAF7F2] to-[#F2EBDF]">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="eyebrow">Ecosystem Upgrade</div>
              <h2 className="text-4xl font-serif font-medium text-[#1C2B27] leading-tight">
                Institutes act as <em>Verifiers of Truth</em>, not competitors.
              </h2>
              <p className="text-base text-[#3E4F49] leading-relaxed">
                Existing platforms rely on self-reported student claims. Phoenix introduces a dual-layer data architecture that distinguishes between self-reported goals and institute-verified academic facts via SheerID SSO.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#1C2B27]/10 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#D48A55]/10 text-[#D48A55] flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-[#1C2B27]">Claimed Student Preferences</h4>
                    <p className="text-xs text-[#3E4F49]">Target exam scores, preferred learning styles, weak topics, and slider preferences.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#3D6B5E]/30 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#3D6B5E]/10 text-[#3D6B5E] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-[#1C2B27] flex items-center gap-2">
                      Institute Verified Facts
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#43BD92]/20 text-[#2C8866]">SheerID Verified</span>
                    </h4>
                    <p className="text-xs text-[#3E4F49]">Official course enrollments, verified prerequisites, official transcripts, and institution details.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/onboarding?mode=institute" className="btn btn-solid text-sm font-semibold inline-flex items-center gap-2">
                  <span>Try Institute Verification Flow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Card: Fact vs Preference Inspector Graphic */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-[#1C2B27]/10 shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#1C2B27]/10">
                  <div className="font-mono text-xs font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#D48A55]" />
                    Dual-Layer Student Profile Store
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#3D6B5E]/10 text-[#3D6B5E]">
                    Phoenix Core DB
                  </span>
                </div>

                {/* Claimed Fact Block */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#D48A55] uppercase">
                    Layer 1: Claimed Preferences (Vector Embedded)
                  </div>
                  <div className="font-mono text-xs text-[#3E4F49] space-y-1">
                    <div>• &quot;I find Trigonometric identities challenging&quot;</div>
                    <div>• &quot;Prefers Socratic question-driven tutoring&quot;</div>
                    <div>• &quot;Targeting 98% in Class 10 Board Exams&quot;</div>
                  </div>
                </div>

                {/* Verified Fact Block */}
                <div className="p-4 bg-[#C5DDD6]/30 rounded-2xl border border-[#3D6B5E]/40 space-y-2">
                  <div className="text-xs font-mono font-bold text-[#2C5044] uppercase flex items-center justify-between">
                    <span>Layer 2: Institute Verified Facts (Exact Facts)</span>
                    <span className="text-[#2C8866]">✓ SheerID Authenticated</span>
                  </div>
                  <div className="font-mono text-xs text-[#2C5044] space-y-1">
                    <div>• Institution: Delhi Public School, R.K. Puram</div>
                    <div>• Official Enrolled Syllabus: CBSE Class 10 Standard Mathematics</div>
                    <div>• Verified Prerequisite: Grade 9 Math (Score: 94%)</div>
                  </div>
                </div>

                <div className="p-3 bg-[#1C2B27] text-white rounded-xl font-mono text-[11px] flex items-center justify-between">
                  <span className="text-[#F4D9C6]">System Prompt Keywords Derived:</span>
                  <span className="text-[#43BD92]">#CBSE_10 #INSTITUTE_VERIFIED #SOCRATIC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="wrap pb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D48A55] via-[#E8A87C] to-[#3D6B5E] p-10 sm:p-16 text-center text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-white">
              Ready to experience Phoenix Agentic Tutor?
            </h2>
            <p className="text-lg text-white/90">
              Start individual onboarding or connect your institute to initialize the Coordinator Agent and test the prototype.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/onboarding" className="btn btn-light text-base font-semibold px-8 py-4 shadow-lg text-[#2C5044]">
                <span>Let&apos;s Learn</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
