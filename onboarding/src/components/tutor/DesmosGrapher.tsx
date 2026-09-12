'use client';

import React, { useState } from 'react';
import { LineChart, Sliders, RefreshCw, Layers } from 'lucide-react';

interface DesmosData {
  latexExpression: string;
  derivativeExpression?: string;
  xLabel?: string;
  yLabel?: string;
  mass?: number;
}

export default function DesmosGrapher({ data }: { data: DesmosData }) {
  const [mass, setMass] = useState(data.mass || 2);
  const [showDerivative, setShowDerivative] = useState(true);

  // Generate curve data points for canvas rendering
  const points: { x: number; y: number }[] = [];
  for (let x = -5; x <= 5; x += 0.2) {
    // E = 0.5 * m * v^2
    const y = 0.5 * mass * Math.pow(x, 2);
    points.push({ x, y });
  }

  return (
    <div className="bg-[#FAF7F2] border border-[#3D6B5E]/30 rounded-2xl p-4 space-y-3 shadow-md">
      <div className="flex items-center justify-between border-b border-[#1C2B27]/10 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#3D6B5E]">
          <LineChart className="w-4 h-4 text-[#E8A87C]" />
          Desmos Interactive Function Canvas
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#3D6B5E]/10 text-[#3D6B5E]">
          Interactive Plotter
        </span>
      </div>

      {/* SVG Canvas Plot */}
      <div className="relative h-44 bg-white rounded-xl border border-[#1C2B27]/10 p-2 flex flex-col justify-between overflow-hidden">
        {/* Grid Overlay Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c2b270a_1px,transparent_1px),linear-gradient(to_bottom,#1c2b270a_1px,transparent_1px)] bg-[size:16px_16px]" />

        {/* SVG Curve */}
        <svg viewBox="-6 -2 12 30" className="w-full h-full relative z-10 overflow-visible">
          {/* Axes */}
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#1C2B27" strokeWidth="0.15" opacity="0.3" />
          <line x1="0" y1="-2" x2="0" y2="30" stroke="#1C2B27" strokeWidth="0.15" opacity="0.3" />

          {/* Function Curve f(v) = 0.5 * m * v^2 */}
          <path
            d={points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')}
            fill="none"
            stroke="#3D6B5E"
            strokeWidth="0.8"
          />

          {/* Derivative Tangent Line if enabled */}
          {showDerivative && (
            <line x1="-4" y1="-4" x2="4" y2="20" stroke="#D48A55" strokeWidth="0.6" strokeDasharray="0.6 0.6" />
          )}

          {/* Highlight Dot */}
          <circle cx="2" cy={0.5 * mass * 4} r="0.6" fill="#E8A87C" />
        </svg>

        <div className="flex justify-between items-center text-[10px] font-mono text-[#6A7872] relative z-20 bg-white/80 px-2 py-0.5 rounded">
          <span>Formula: E_k(v) = 0.5 · {mass}kg · v²</span>
          <span>Derivative: dE/dt = {mass}·v·a</span>
        </div>
      </div>

      {/* Interactive Parameter Controls */}
      <div className="flex items-center justify-between text-xs font-mono pt-1">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[#3E4F49]">
            <Sliders className="w-3.5 h-3.5 text-[#3D6B5E]" />
            Mass m: {mass} kg
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-24 accent-[#3D6B5E] cursor-pointer"
          />
        </div>

        <button
          onClick={() => setShowDerivative(!showDerivative)}
          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
            showDerivative ? 'bg-[#D48A55] text-white border-[#D48A55]' : 'bg-white text-[#3E4F49] border-gray-300'
          }`}
        >
          {showDerivative ? 'Derivative Tangent ON' : 'Show Tangent'}
        </button>
      </div>
    </div>
  );
}
