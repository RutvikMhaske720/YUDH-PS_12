'use client';

import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2, LineChart, Code, Sparkles, BookOpen, Layers, Terminal } from 'lucide-react';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Student Asks Cross-Disciplinary Question',
      description: 'A student poses a complex problem spanning math, physics, or code (e.g., "Why does the derivative of kinetic energy equal momentum times acceleration, and how do I plot this in Desmos?").',
      agent: 'Coordinator Agent',
      agentColor: 'bg-[#3D6B5E]',
      messageUser: 'Why does the derivative of Kinetic Energy ½mv² equal m·v·a? Can you show me the math proof and plot the curve?',
      responseAi: 'Great question! This connects calculus with Newtonian mechanics. Let me delegate the mathematical proof to our Mathematics Specialist and generate an interactive Desmos graph for visual intuition.',
      outputType: 'graph',
    },
    {
      num: '02',
      title: 'Coordinator Routes to Subject Specialists',
      description: 'The Coordinator Agent evaluates student profile preferences (e.g. Socratic style, Level 4 Rigor) and hands off sub-tasks to specialized sub-agents.',
      agent: 'Mathematics & Calculus Specialist',
      agentColor: 'bg-[#D48A55]',
      messageUser: 'How is the chain rule applied here step-by-step?',
      responseAi: 'Let E_k(t) = ½m[v(t)]². By applying the Chain Rule:\n\nWe differentiate kinetic energy with respect to time to prove that mechanical power equals Force times Velocity:',
      outputType: 'proof',
    },
    {
      num: '03',
      title: 'Specialists Generate Interactive Tools',
      description: 'Sub-agents do not just output plain text; when relevant, they trigger dynamic Desmos graph renders, code sandboxes, or concept maps tailored to the student.',
      agent: 'Visual Grapher & Code Sandbox Sub-Agent',
      agentColor: 'bg-[#5A8C7C]',
      messageUser: 'Can we verify this symbolic derivative programmatically in Python?',
      responseAi: 'Yes! Below is an executable Python verification script using SymPy to compute the symbolic derivative automatically:',
      outputType: 'code',
    },
    {
      num: '04',
      title: 'Unified Memory & Learning Progress Update',
      description: 'All sub-agent interactions update the student\'s shared memory context, building an evolving knowledge graph across all subjects.',
      agent: 'Context Memory Manager',
      agentColor: 'bg-[#2C5044]',
      messageUser: 'Saved to my Physics & Calculus progress graph.',
      responseAi: 'Updated Phoenix Student Context Memory: Mastered Kinetic Energy Differentiation & Chain Rule. Recommended next topic: Work-Energy Theorem.',
      outputType: 'memory',
    },
  ];

  return (
    <section id="how" className="py-24 bg-[#FAF7F2] relative">
      <div className="wrap">
        <div className="max-w-2xl mb-16">
          <div className="eyebrow mb-4">Orchestrated Tutoring</div>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#1C2B27] mb-6">
            How the <em>Coordinator &amp; Specialist</em> agents work together
          </h2>
          <p className="text-lg text-[#3E4F49]">
            A single generic chatbot fails on specialized questions. Phoenix routes your prompt to dedicated subject agents while keeping a single unified student memory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Steps List */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-white border-[#3D6B5E] shadow-lg scale-[1.02]'
                    : 'bg-white/50 border-[#1C2B27]/10 hover:bg-white hover:border-[#1C2B27]/20 opacity-70'
                }`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-mono text-sm font-bold text-[#D48A55]">{step.num}</span>
                  <h3 className={`text-xl font-medium font-serif ${activeStep === idx ? 'text-[#3D6B5E]' : 'text-[#1C2B27]'}`}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-[#3E4F49] leading-relaxed pl-9">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Live Simulated Agent Chat Window */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="bg-white rounded-3xl border border-[#1C2B27]/10 shadow-2xl p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1C2B27]/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${steps[activeStep].agentColor} flex items-center justify-center text-white shadow-md`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-base text-[#1C2B27]">{steps[activeStep].agent}</div>
                    <div className="font-mono text-xs text-[#3D6B5E] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#43BD92] animate-pulse"></span>
                      Active Sub-Agent Routing
                    </div>
                  </div>
                </div>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#3D6B5E]/10 text-[#3D6B5E] border border-[#3D6B5E]/20">
                  Step {steps[activeStep].num} / 04
                </span>
              </div>

              {/* Chat Dialogue */}
              <div className="space-y-4 min-h-[260px]">
                {/* User Message */}
                <div className="bg-[#3D6B5E] text-white p-4 rounded-2xl rounded-br-none max-w-[85%] ml-auto text-sm leading-relaxed shadow-sm font-medium">
                  {steps[activeStep].messageUser}
                </div>

                {/* AI Specialist Response */}
                <div className="bg-[#F2EBDF] text-[#1C2B27] p-5 rounded-2xl rounded-bl-none max-w-[95%] text-sm leading-relaxed space-y-4 shadow-sm border border-[#1C2B27]/5">
                  <div className="font-semibold text-xs font-mono text-[#3D6B5E] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {steps[activeStep].agent}
                  </div>

                  <div className="whitespace-pre-line text-[14.5px]">
                    {steps[activeStep].responseAi}
                  </div>

                  {/* PROPERLY STYLED INTERACTIVE TOOL CARDS */}
                  {steps[activeStep].outputType === 'graph' && (
                    <div className="mt-3 p-4 bg-white rounded-2xl border border-[#3D6B5E]/30 space-y-3 shadow-md">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-[#3D6B5E]">
                        <span className="flex items-center gap-2">
                          <LineChart className="w-4 h-4 text-[#E8A87C]" />
                          Desmos Graph Sandbox Generated
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#3D6B5E]/10 text-[#3D6B5E] text-[10px]">Interactive</span>
                      </div>
                      <div className="relative h-32 bg-[#FAF7F2] rounded-xl border border-[#3D6B5E]/20 overflow-hidden p-3 shadow-inner flex flex-col justify-between">
                        {/* Grid Lines Background */}
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3D6B5E_1px,transparent_1px)] [background-size:12px_12px]" />
                        
                        {/* SVG Parabola Curve */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          <path
                            d="M 20 80 Q 150 75 280 15"
                            fill="none"
                            stroke="#3D6B5E"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="150" cy="56" r="4" fill="#E8A87C" />
                        </svg>

                        <div className="relative z-10 flex justify-between items-center">
                          <span className="font-mono text-[11px] font-bold px-2 py-1 rounded bg-white/90 text-[#3D6B5E] border border-[#3D6B5E]/20 shadow-xs">
                            E_k(v) = ½ · m · v²
                          </span>
                          <span className="font-mono text-[10px] text-[#6A7872] bg-white/80 px-2 py-0.5 rounded">
                            v → Velocity (m/s)
                          </span>
                        </div>
                        <div className="relative z-10 text-right">
                          <span className="font-mono text-[10px] text-[#3D6B5E] font-bold">
                            dE_k/dt = m · v · a
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {steps[activeStep].outputType === 'proof' && (
                    <div className="mt-3 p-4 bg-white rounded-2xl border border-[#D48A55]/40 space-y-3 font-mono text-xs text-[#2C5044] shadow-md">
                      <div className="font-bold text-[#D48A55] uppercase tracking-wider text-[11px] pb-2 border-b border-[#1C2B27]/10 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D48A55]" />
                          LaTeX Mathematical Derivation
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#D48A55]/10 text-[#D48A55] text-[10px]">Chain Rule</span>
                      </div>
                      
                      {/* Formatted LaTeX Equation Box */}
                      <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#D48A55]/20 space-y-3 text-center">
                        <div className="font-serif italic text-base md:text-lg tracking-wide text-[#1C2B27] py-2 bg-white rounded-lg border border-[#1C2B27]/10 shadow-2xs space-y-1.5">
                          <div className="text-[#1C2B27]">
                            <span className="font-sans not-italic text-xs font-bold text-[#D48A55]">d/dt</span>
                            <span> [½ m · v(t)²] = ½ m · 2v(t) · a(t)</span>
                          </div>
                          <div className="text-[#3D6B5E] font-bold text-base md:text-lg pt-1 border-t border-[#1C2B27]/5 flex items-center justify-center gap-1.5 flex-wrap">
                            <span>= m · v(t) · a(t) =</span>
                            <span className="text-[#D48A55] font-extrabold">F · v</span>
                            <span className="text-[#43BD92] font-bold text-sm">✓</span>
                            <span className="text-xs font-mono text-[#6A7872] not-italic">(Q.E.D.)</span>
                          </div>
                        </div>
                        <p className="text-[11px] font-sans text-[#5C6B64]">
                          Proves that the rate of change of Kinetic Energy equals mechanical power (Force × Velocity).
                        </p>
                      </div>
                    </div>
                  )}

                  {steps[activeStep].outputType === 'code' && (
                    <div className="mt-3 bg-[#1C2B27] text-white rounded-2xl overflow-hidden border border-white/10 shadow-lg text-xs font-mono">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-[11px] text-[#43BD92] font-bold">
                        <span className="flex items-center gap-2">
                          <Code className="w-3.5 h-3.5 text-[#E8A87C]" />
                          Python SymPy Verification Script
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">Executable</span>
                      </div>
                      <div className="p-4 text-[#C5DDD6] leading-relaxed whitespace-pre bg-black/40 text-[12.5px]">
<span className="text-[#6A7872]"># Python SymPy Symbolic Verification</span>
<span className="text-[#E8A87C]">import</span> sympy <span className="text-[#E8A87C]">as</span> sp

v, m, t = sp.symbols(<span className="text-[#A5D6A7]">'v m t'</span>)
E_k = <span className="text-[#80CBC4]">0.5</span> * m * v(t)**<span className="text-[#80CBC4]">2</span>
dE_dt = sp.diff(E_k, t)  <span className="text-[#6A7872]"># Computes d/dt [½mv(t)²] -&gt; m*v*a</span>
                      </div>
                      <div className="p-2.5 bg-[#0d1513] border-t border-white/10 text-[11px] text-[#43BD92] flex items-center justify-between flex-wrap gap-2">
                        <span>Console Output: m * v(t) * Derivative(v(t), t)</span>
                        <span className="text-[#E8A87C] font-bold">Return Code: 0 (Success)</span>
                      </div>
                    </div>
                  )}

                  {steps[activeStep].outputType === 'memory' && (
                    <div className="mt-3 p-4 bg-white rounded-2xl border border-[#43BD92]/40 flex items-center justify-between text-xs font-mono shadow-md text-[#3D6B5E]">
                      <span className="flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#43BD92]" />
                        Unified Student Memory Graph Updated
                      </span>
                      <span className="font-bold px-3 py-1 rounded-full bg-[#43BD92]/20 text-[#2C8866]">
                        +25 XP Mastery Earned
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1C2B27]/10">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-mono font-bold text-[#3E4F49] disabled:opacity-30 hover:text-[#3D6B5E]"
                >
                  ← Previous Step
                </button>
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                        activeStep === idx ? 'bg-[#3D6B5E] w-6' : 'bg-[#1C2B27]/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="text-xs font-mono font-bold text-[#3D6B5E] disabled:opacity-30 hover:text-[#2C5044] flex items-center gap-1"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
