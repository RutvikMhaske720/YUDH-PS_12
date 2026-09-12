import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

export default function SpecialistsPage() {
  const agents = [
    {
      name: 'Coordinator Routing Agent',
      type: 'Primary System Orchestrator',
      description: 'Parses multi-disciplinary student prompts, evaluates context memory and slider parameters (Socratic style, rigor depth), and dynamically delegates sub-tasks to specialist agents while maintaining a unified profile.',
    },
    {
      name: 'Mathematics & Calculus Specialist',
      type: 'Subject Sub-Agent',
      description: 'Delivers rigorous step-by-step mathematical proofs, calculus derivations, matrix algebra, and formal LaTeX equations tailored from foundational board levels to competitive Olympiad and university standards.',
    },
    {
      name: 'Computer Science & Code Sub-Agent',
      type: 'Subject Sub-Agent',
      description: 'Executes symbolic math, data structure algorithms, and tensor operations inside interactive Python (SymPy/NumPy) & JavaScript execution sandboxes with live console output.',
    },
    {
      name: 'Physics & Natural Sciences Sub-Agent',
      type: 'Subject Sub-Agent',
      description: 'Models physical phenomena including Newtonian mechanics, optics, quantum principles, and chemical thermodynamics, auto-triggering interactive Desmos plotters and dynamic vector diagrams.',
    },
    {
      name: 'Research & Sourcing Agent',
      type: 'Context & Sourcing Sub-Agent',
      description: 'Interfaces with NCERT curricula, CBSE/ICSE board frameworks, and scholarly databases (arXiv) to validate academic facts and supply exact textbook citations.',
    },
  ];

  return (
    <div className="py-12 space-y-12 bg-[#FAF7F2] min-h-screen">
      <div className="wrap space-y-8">
        <div className="max-w-3xl space-y-4">
          <div className="eyebrow">Multi-Agent Architecture</div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#1C2B27]">
            Subject-Specialist <em>Sub-Agents</em> Directory
          </h1>
          <p className="text-base text-[#3E4F49] leading-relaxed">
            The Coordinator Agent orchestrates incoming student questions across specialized domain sub-agents, keeping every subject explanation synchronized under a single unified student memory profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((ag) => (
            <div
              key={ag.name}
              className="bg-white p-6 rounded-3xl border border-[#1C2B27]/10 shadow-sm flex flex-col justify-between space-y-5 hover:border-[#3D6B5E]/40 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-[#3D6B5E]/10 text-[#3D6B5E] border border-[#3D6B5E]/20 uppercase tracking-wider">
                    {ag.type}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#43BD92] animate-pulse" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1C2B27]">{ag.name}</h3>
                  <p className="text-xs text-[#3E4F49] leading-relaxed mt-2.5">{ag.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C2B27]/10 flex items-center justify-between text-xs font-mono text-[#6A7872]">
                <span className="flex items-center gap-1.5 text-[#3E4F49]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43BD92]" />
                  Status: Ready
                </span>
                <span className="text-[#3D6B5E] font-semibold">Interactive Tools Enabled</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 text-center">
          <Link href="/onboarding" className="btn btn-primary text-sm font-semibold px-8 py-3.5 shadow-md">
            <span>Test Agentic Routing in Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
