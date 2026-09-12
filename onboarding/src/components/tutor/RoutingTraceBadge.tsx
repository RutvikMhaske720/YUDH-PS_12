'use client';

import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoutingTraceBadgeProps {
  trace: string[];
  agentName?: string;
}

export default function RoutingTraceBadge({ trace, agentName }: RoutingTraceBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="bg-[#1C2B27] text-white rounded-xl overflow-hidden border border-white/10 text-xs shadow-sm mb-3">
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 font-mono text-[11.5px]">
          <Cpu className="w-4 h-4 text-[#43BD92] animate-pulse" />
          <span className="text-[#F4D9C6] font-bold">Coordinator Agent Trace</span>
          <span className="text-gray-400">→</span>
          <span className="text-[#C5DDD6]">{agentName || 'Specialist Sub-Agent'}</span>
        </div>
        <button className="text-gray-400 hover:text-white">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Step Logs */}
      {isOpen && (
        <div className="p-3 bg-black/40 font-mono text-[11px] text-[#C5DDD6] space-y-1.5 border-t border-white/10 leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {trace.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-[#43BD92] shrink-0">✓</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
