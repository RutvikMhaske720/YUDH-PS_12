'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Cpu, RefreshCw, MessageSquare, BookOpen, ArrowRight } from 'lucide-react';
import { ChatMessage, StudentProgressState, updateStudentMastery } from '@/lib/memoryStore';
import { ProcessedOnboardingPayload } from '@/lib/onboardingProcessor';
import RoutingTraceBadge from './RoutingTraceBadge';
import DesmosGrapher from './DesmosGrapher';
import CodeSandbox from './CodeSandbox';
import ConceptMapDiagram from './ConceptMapDiagram';
import VoiceSpeechController from './VoiceSpeechController';
import FollowUpSuggestions from './FollowUpSuggestions';
import StudentMemoryPanel from './StudentMemoryPanel';

interface ChatInterfaceProps {
  payload: ProcessedOnboardingPayload;
  progress: StudentProgressState;
  onUpdateProgress: (newProgress: StudentProgressState) => void;
}

export default function ChatInterface({
  payload,
  progress,
  onUpdateProgress,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello ${payload.rawProfile.name}! I am your **Coordinator Tutor Agent**. 

I have loaded your profile context (${payload.facts.gradeOrDegree} at ${payload.facts.institution}). Any question you ask will be routed to specialized sub-agents while maintaining your unified progress profile.`,
      timestamp: 'Just now',
      agentName: 'Coordinator Routing Agent',
      agentColor: 'bg-[#3D6B5E]',
      followUps: [
        'Why does d/dt [½mv²] equal m·v·a? Show math proof & Desmos graph.',
        'How does Backpropagation compute gradients in PyTorch?',
        'Explain Snell\'s Law of refraction with NCERT textbook citations.',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          profile: payload.rawProfile,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        const aiMsg: ChatMessage = data.message;
        setMessages((prev) => [...prev, aiMsg]);

        // Award XP and update shared student memory
        const updatedProgress = updateStudentMastery(progress, textToSend.slice(0, 20));
        onUpdateProgress(updatedProgress);
      }
    } catch (err) {
      console.error('Error fetching tutor response:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* MAIN CHAT AREA (LG 8 COLS) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Sample Demo Queries Bar */}
        <div className="p-4 bg-white rounded-2xl border border-[#1C2B27]/10 shadow-sm space-y-2">
          <div className="font-mono text-[11px] font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E8A87C]" />
            Quick Demo Starter Questions (Click to test multi-agent routing):
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <button
              onClick={() => handleSendQuery('Why does the derivative of kinetic energy ½mv² equal m·v·a? Show proof and plot graph.')}
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#3E4F49] border border-[#1C2B27]/15 hover:bg-[#3D6B5E] hover:text-white transition-all text-left"
            >
              📐 Calculus &amp; Physics: Derivation &amp; Desmos Graph
            </button>
            <button
              onClick={() => handleSendQuery('How does backpropagation compute gradients for neural networks in PyTorch? Show code.')}
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#3E4F49] border border-[#1C2B27]/15 hover:bg-[#3D6B5E] hover:text-white transition-all text-left"
            >
              💻 CS &amp; PyTorch: Backprop Code Sandbox
            </button>
            <button
              onClick={() => handleSendQuery('Explain Snell\'s law of refraction with NCERT Class 10 textbook citations.')}
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#3E4F49] border border-[#1C2B27]/15 hover:bg-[#3D6B5E] hover:text-white transition-all text-left"
            >
              📚 Science &amp; Research: NCERT Citation Index
            </button>
          </div>
        </div>

        {/* DIALOGUE MESSAGES WINDOW */}
        <div className="bg-white rounded-3xl border border-[#1C2B27]/10 shadow-xl p-6 sm:p-8 space-y-6 min-h-[480px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              {/* Message Header */}
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#3D6B5E] font-bold">
                  <div className={`w-6 h-6 rounded-lg ${msg.agentColor || 'bg-[#3D6B5E]'} text-white flex items-center justify-center text-[10px]`}>
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span>{msg.agentName || 'Coordinator Agent'}</span>
                  <span className="text-gray-400 font-normal">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Body Bubble */}
              <div
                className={`inline-block p-5 rounded-2xl text-sm leading-relaxed max-w-[92%] ${
                  msg.sender === 'user'
                    ? 'bg-[#3D6B5E] text-white rounded-br-none shadow-md font-medium text-left'
                    : 'bg-[#F2EBDF] text-[#1C2B27] rounded-bl-none shadow-sm border border-[#1C2B27]/5'
                }`}
              >
                {/* Routing Trace if present */}
                {msg.routingTrace && (
                  <RoutingTraceBadge trace={msg.routingTrace} agentName={msg.agentName} />
                )}

                {/* Main Text Content */}
                <div className="whitespace-pre-line text-[14.5px]">
                  {msg.text}
                </div>

                {/* Interactive Tool Renders */}
                {msg.interactiveTool && (
                  <div className="mt-4">
                    {msg.interactiveTool.type === 'desmos' && (
                      <DesmosGrapher data={msg.interactiveTool.data} />
                    )}
                    {msg.interactiveTool.type === 'code' && (
                      <CodeSandbox data={msg.interactiveTool.data} />
                    )}
                    {msg.interactiveTool.type === 'concept_map' && (
                      <ConceptMapDiagram data={msg.interactiveTool.data} />
                    )}
                    {msg.interactiveTool.type === 'citation' && (
                      <div className="p-4 bg-white rounded-2xl border border-[#3D6B5E]/30 text-xs font-mono text-[#3E4F49] space-y-1">
                        <div className="font-bold text-[#3D6B5E] flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#D48A55]" />
                          {msg.interactiveTool.title}
                        </div>
                        <div>Source: {msg.interactiveTool.data.citationSource}</div>
                        <div>Reference: {msg.interactiveTool.data.page}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Follow-up suggestions */}
                {msg.followUps && (
                  <FollowUpSuggestions
                    suggestions={msg.followUps}
                    onSelectSuggestion={(q) => handleSendQuery(q)}
                  />
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 text-xs font-mono text-[#3D6B5E] animate-pulse">
              <span className="w-4 h-4 rounded-full border-2 border-[#3D6B5E] border-t-transparent animate-spin" />
              Coordinator Agent evaluating prompt &amp; routing to Specialist Sub-Agent...
            </div>
          )}
        </div>

        {/* INPUT CONTROLS BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#1C2B27]/15 shadow-xl"
        >
          {/* Voice Input & Speech Synthesis Controller */}
          <VoiceSpeechController
            onSpeechResult={(text) => handleSendQuery(text)}
            lastAiResponseText={lastAiMessage?.text}
          />

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Phoenix Tutor a question across math, physics, or code..."
            className="flex-1 bg-transparent px-2 text-sm font-medium focus:outline-none text-[#1C2B27]"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="btn btn-primary px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-30"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* STUDENT PROFILE & SHARED MEMORY SIDEBAR (LG 4 COLS) */}
      <div className="lg:col-span-4">
        <StudentMemoryPanel progress={progress} payload={payload} />
      </div>
    </div>
  );
}
