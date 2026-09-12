'use client';

import React from 'react';
import { ShieldCheck, Award, Zap, CheckCircle2, AlertCircle, BookOpen, Layers } from 'lucide-react';
import { StudentProgressState } from '@/lib/memoryStore';
import { ProcessedOnboardingPayload } from '@/lib/onboardingProcessor';

interface StudentMemoryPanelProps {
  progress: StudentProgressState;
  payload: ProcessedOnboardingPayload;
}

export default function StudentMemoryPanel({ progress, payload }: StudentMemoryPanelProps) {
  const { rawProfile } = payload;

  return (
    <div className="bg-white rounded-3xl border border-[#1C2B27]/10 p-6 space-y-6 shadow-xl sticky top-28">
      {/* Header Profile Badge */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1C2B27]/10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3D6B5E] to-[#2C5044] text-[#F4D9C6] flex items-center justify-center font-serif font-bold text-xl shadow-md">
          {rawProfile.name ? rawProfile.name.charAt(0) : 'S'}
        </div>
        <div>
          <div className="font-bold text-base text-[#1C2B27] flex items-center gap-1.5">
            {rawProfile.name}
            {rawProfile.instituteVerified && (
              <ShieldCheck className="w-4 h-4 text-[#43BD92]" />
            )}
          </div>
          <div className="text-xs text-[#6A7872] font-mono">{rawProfile.gradeOrDegree}</div>
        </div>
      </div>

      {/* Mastery Level & XP Bar */}
      <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[#3D6B5E] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#E8A87C]" />
            Level {progress.level} Mastery
          </span>
          <span className="font-bold text-[#D48A55]">{progress.xp} XP</span>
        </div>
        <div className="h-2.5 bg-[#EDE4D5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D48A55] to-[#3D6B5E] transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, (progress.xp % 100))}%` }}
          />
        </div>
      </div>

      {/* Verified Academic Facts */}
      <div className="space-y-2">
        <div className="font-mono text-xs font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center justify-between">
          <span>Verified Fact Context</span>
          {rawProfile.instituteVerified && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#43BD92]/20 text-[#2C8866]">SheerID SSO</span>
          )}
        </div>
        <div className="text-xs space-y-1 bg-[#FAF7F2] p-3 rounded-xl border border-[#1C2B27]/10 font-mono text-[#3E4F49]">
          <div>• Institution: {rawProfile.institution}</div>
          <div>• Verified Record: {payload.facts.verifiedGpaOrScore || 'Active Record'}</div>
        </div>
      </div>

      {/* Mastered Topics */}
      <div className="space-y-2">
        <div className="font-mono text-xs font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#43BD92]" />
          Mastered Topics ({progress.masteredTopics.length})
        </div>
        <div className="flex flex-wrap gap-1.5">
          {progress.masteredTopics.map((t, i) => (
            <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#3D6B5E]/10 text-[#3D6B5E] border border-[#3D6B5E]/20">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Active Weaknesses Target */}
      <div className="space-y-2 pt-2 border-t border-[#1C2B27]/10">
        <div className="font-mono text-xs font-bold text-[#D48A55] uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#D48A55]" />
          Target Weaknesses ({progress.activeWeaknesses.length})
        </div>
        <div className="flex flex-wrap gap-1.5">
          {progress.activeWeaknesses.map((w, i) => (
            <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E8A87C]/20 text-[#D48A55] border border-[#E8A87C]/30">
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
