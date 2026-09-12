'use client';

import React from 'react';

export default function HeroOrbit() {
  return (
    <div className="relative aspect-square max-w-[500px] mx-auto w-full">
      <svg viewBox="0 0 540 540" role="img" aria-label="Eila Coordinator Agent routing to subject specialist sub-agents" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="cg" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#5A8C7C" />
            <stop offset="58%" stopColor="#3D6B5E" />
            <stop offset="100%" stopColor="#2C5044" />
          </radialGradient>
        </defs>

        {/* Orbit Rings */}
        <circle className="stroke-[#3D6B5E] opacity-15 fill-none [stroke-dasharray:3_8]" cx="270" cy="270" r="160" />
        <circle className="stroke-[#D48A55] opacity-25 fill-none [stroke-dasharray:4_10]" cx="270" cy="270" r="222" />

        {/* Floating Student Badges */}
        <g className="fa-float">
          <circle cx="86" cy="208" r="26" fill="#C5DDD6" />
          <circle cx="86" cy="200" r="9" fill="#3D6B5E" />
          <path d="M72 222c0-9 6-15 14-15s14 6 14 15z" fill="#3D6B5E" />
        </g>
        <g className="fa-float">
          <circle cx="466" cy="332" r="26" fill="#F4D9C6" />
          <circle cx="466" cy="324" r="9" fill="#D48A55" />
          <path d="M452 346c0-9 6-15 14-15s14 6 14 15z" fill="#D48A55" />
        </g>
        <g className="fa-float">
          <circle cx="422" cy="120" r="22" fill="#C5DDD6" />
          <circle cx="422" cy="114" r="7.5" fill="#3D6B5E" />
          <path d="M410 132c0-7 5-12 12-12s12 5 12 12z" fill="#3D6B5E" />
        </g>

        {/* Core Coordinator Node */}
        <g className="orbit-core">
          <circle cx="270" cy="270" r="88" fill="url(#cg)" className="shadow-2xl" />
          <path d="M270 208c-23 19-23 105 0 124M270 208c23 19 23 105 0 124" stroke="#F4D9C6" strokeWidth="2.4" fill="none" opacity="0.5" strokeLinecap="round" />
          <path d="M222 250c31-10 65-10 96 0M222 290c31 10 65 10 96 0" stroke="#C5DDD6" strokeWidth="2.2" fill="none" opacity="0.48" strokeLinecap="round" />
          
          <circle cx="270" cy="270" r="15" fill="#F4D9C6" />
          <text x="270" y="274" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2C5044" fontFamily="Space Mono">AGI</text>

          <circle cx="242" cy="244" r="5" fill="#C5DDD6" />
          <circle cx="300" cy="254" r="5" fill="#C5DDD6" />
          <circle cx="250" cy="298" r="5" fill="#C5DDD6" />
          <circle cx="296" cy="294" r="5" fill="#C5DDD6" />
        </g>

        {/* Orbiting Specialist Sub-Agent Chips (Outer Orbit) */}
        <g className="o1">
          {/* Math Specialist Chip */}
          <g className="chip-ic1" transform="translate(270,110)">
            <circle r="30" fill="#ffffff" className="shadow-lg" />
            <text x="0" y="9" textAnchor="middle" fontSize="25" fontFamily="Fraunces, serif" fontWeight="600" fill="#3D6B5E">π</text>
          </g>
          {/* Physics Specialist Chip */}
          <g className="chip-ic1" transform="translate(430,270)">
            <circle r="30" fill="#ffffff" className="shadow-lg" />
            <text x="0" y="9" textAnchor="middle" fontSize="22" fill="#D48A55">⚡</text>
          </g>
        </g>

        <g className="o2">
          {/* CS Specialist Chip */}
          <g className="chip-ic2" transform="translate(270,490)">
            <circle r="30" fill="#ffffff" className="shadow-lg" />
            <text x="0" y="8" textAnchor="middle" fontSize="20" fill="#3D6B5E">💻</text>
          </g>
          {/* Literature / Research Specialist Chip */}
          <g className="chip-ic2" transform="translate(110,270)">
            <circle r="30" fill="#ffffff" className="shadow-lg" />
            <text x="0" y="8" textAnchor="middle" fontSize="20" fill="#D48A55">📚</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
