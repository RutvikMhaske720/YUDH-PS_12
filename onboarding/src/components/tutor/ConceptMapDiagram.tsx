'use client';

import React from 'react';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

interface ConceptNode {
  id: string;
  label: string;
  type: string;
}

interface ConceptData {
  nodes: ConceptNode[];
}

export default function ConceptMapDiagram({ data }: { data: ConceptData }) {
  if (!data?.nodes) return null;

  return (
    <div className="bg-[#FAF7F2] border border-[#3D6B5E]/30 rounded-2xl p-4 space-y-3 shadow-md">
      <div className="flex items-center justify-between border-b border-[#1C2B27]/10 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#3D6B5E]">
          <Layers className="w-4 h-4 text-[#D48A55]" />
          Concept Dependency &amp; Knowledge Flow Map
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#3D6B5E]/10 text-[#3D6B5E]">
          Generated Map
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 py-3">
        {data.nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <div className="px-3.5 py-2 rounded-xl bg-white border border-[#3D6B5E]/20 shadow-sm font-mono text-xs text-[#1C2B27] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D48A55]" />
              <span>{node.label}</span>
            </div>
            {i < data.nodes.length - 1 && (
              <ArrowRight className="w-4 h-4 text-[#3D6B5E]/50 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
