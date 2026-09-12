import React from 'react';
import Link from 'next/link';
import { LineChart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="py-12 space-y-12">
      <div className="wrap space-y-8">
        <div className="max-w-3xl space-y-4">
          <div className="eyebrow">Student Mastery & Progress</div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#1C2B27]">
            Learning Progress &amp; <em>Knowledge Graph</em>
          </h1>
          <p className="text-lg text-[#3E4F49]">
            Tracks concept mastery, persistent weaknesses, and multi-agent interaction history across subjects.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-[#1C2B27]/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1C2B27]/10">
            <div className="font-mono text-xs font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center gap-2">
              <LineChart className="w-4 h-4 text-[#D48A55]" />
              Unified Learning Memory Graph
            </div>
            <span className="font-mono text-xs text-gray-500">Live Memory Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 space-y-2">
              <div className="text-3xl font-serif font-bold text-[#3D6B5E]">94%</div>
              <div className="text-xs font-mono font-bold text-[#3E4F49]">Verified Science & Math Baseline</div>
              <p className="text-[11px] text-gray-500">Synced via SheerID Institute Credentials</p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 space-y-2">
              <div className="text-3xl font-serif font-bold text-[#D48A55]">14</div>
              <div className="text-xs font-mono font-bold text-[#3E4F49]">Mastered Specialist Topics</div>
              <p className="text-[11px] text-gray-500">Chain Rule, Quadratic Equations, PyTorch</p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 space-y-2">
              <div className="text-3xl font-serif font-bold text-[#2C5044]">Level 3</div>
              <div className="text-xs font-mono font-bold text-[#3E4F49]">Socratic Rigor Tier</div>
              <p className="text-[11px] text-gray-500">Auto-tunes based on slider parameters</p>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link href="/onboarding" className="btn btn-primary text-sm font-semibold px-8 py-3.5">
            <span>Configure Onboarding Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
