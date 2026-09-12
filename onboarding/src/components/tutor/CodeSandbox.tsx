'use client';

import React, { useState } from 'react';
import { Play, Code, CheckCircle2, Terminal } from 'lucide-react';

interface CodeData {
  language: string;
  code: string;
  output?: string;
}

export default function CodeSandbox({ data }: { data: CodeData }) {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(data.output || 'Code executed with return code 0.');
    }, 600);
  };

  return (
    <div className="bg-[#1C2B27] text-white rounded-2xl overflow-hidden border border-white/10 shadow-lg text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 font-mono">
        <div className="flex items-center gap-2 text-[#43BD92] font-bold">
          <Code className="w-4 h-4 text-[#E8A87C]" />
          <span>Interactive {data.language || 'Python'} Code Sandbox</span>
        </div>

        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="btn btn-solid text-[11px] px-3 py-1 flex items-center gap-1.5 shadow-sm"
        >
          {isRunning ? (
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Play className="w-3 h-3 fill-current" />
          )}
          <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 font-mono text-[12px] text-[#C5DDD6] bg-black/50 overflow-x-auto leading-relaxed whitespace-pre">
        {data.code}
      </div>

      {/* Output Terminal Console */}
      {consoleOutput && (
        <div className="p-3 bg-[#0d1513] border-t border-white/10 font-mono text-[11px] space-y-1 animate-in fade-in duration-200">
          <div className="text-gray-400 flex items-center gap-1 text-[10px]">
            <Terminal className="w-3 h-3 text-[#43BD92]" />
            <span>Terminal Execution Output:</span>
          </div>
          <div className="text-[#43BD92] whitespace-pre-wrap">{consoleOutput}</div>
        </div>
      )}
    </div>
  );
}
