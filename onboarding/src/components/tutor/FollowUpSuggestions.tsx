'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FollowUpSuggestionsProps {
  suggestions?: string[];
  onSelectSuggestion: (question: string) => void;
}

export default function FollowUpSuggestions({ suggestions, onSelectSuggestion }: FollowUpSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="pt-2 space-y-2">
      <div className="font-mono text-[11px] font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#E8A87C]" />
        Suggested Follow-Up Questions:
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(q)}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-white text-[#3E4F49] border border-[#3D6B5E]/20 hover:bg-[#3D6B5E] hover:text-white transition-all text-left flex items-center gap-1.5 shadow-sm group"
          >
            <span>{q}</span>
            <ArrowRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
