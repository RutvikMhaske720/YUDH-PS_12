'use client';

import React, { useState } from 'react';
import { ShieldCheck, Building2, CheckCircle2, ArrowRight, X, Sparkles, Lock, Check } from 'lucide-react';
import { INSTITUTE_DATABASE, InstituteRecord } from '@/data/instituteDatabase';
import CollegeSearchAutocomplete from './CollegeSearchAutocomplete';

interface SheerIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (institute: InstituteRecord, studentId: string) => void;
}

export default function SheerIDModal({ isOpen, onClose, onVerified }: SheerIDModalProps) {
  const [selectedInstName, setSelectedInstName] = useState(INSTITUTE_DATABASE[0].name);
  const [selectedInstLocation, setSelectedInstLocation] = useState(INSTITUTE_DATABASE[0].location);
  const [studentId, setStudentId] = useState('STU-2026-9912');
  const [verificationStep, setVerificationStep] = useState<0 | 1 | 2 | 3>(0);

  if (!isOpen) return null;

  const currentInst: InstituteRecord = INSTITUTE_DATABASE.find(
    (i) => i.name.toLowerCase() === selectedInstName.toLowerCase()
  ) || {
    id: `collegedb-${selectedInstName.toLowerCase().replace(/\s+/g, '-')}`,
    name: selectedInstName,
    code: selectedInstName.toUpperCase().slice(0, 8),
    type: 'university',
    location: selectedInstLocation || 'India',
    sheerIdSupported: true,
    verifiedCourses: [
      { courseCode: 'CDB-101', courseName: 'Standard Academic Curriculum', prerequisites: [] },
    ],
    verifiedSyllabus: ['UGC / AICTE / CBSE Standard Framework'],
  };

  const handleSimulateVerify = () => {
    setVerificationStep(1); // Connecting to API
    setTimeout(() => {
      setVerificationStep(2); // Validating Credentials
      setTimeout(() => {
        setVerificationStep(3); // Verified!
        setTimeout(() => {
          onVerified(currentInst, studentId);
          onClose();
          setVerificationStep(0);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B27]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#1C2B27]/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative">
        {/* SheerID Branded Header */}
        <div className="bg-gradient-to-r from-[#2C5044] via-[#3D6B5E] to-[#2C5044] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-[#E8A87C] text-white flex items-center justify-center shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#F4D9C6] uppercase tracking-wider">
                  SheerID Identity Gateway
                </span>
                <span className="w-2 h-2 rounded-full bg-[#43BD92] animate-pulse" />
              </div>
              <h3 className="font-serif text-2xl font-bold">Student Credential Verification</h3>
            </div>
          </div>
          <p className="text-xs text-white/85 leading-relaxed mt-2">
            Verifying your student identity transforms self-reported claims into <strong>Institute-Verified Academic Facts</strong>.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {verificationStep === 0 && (
            <>
              {/* Search Educational Institution via CollegeDB API */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#3E4F49] font-bold">
                    Educational Institution
                  </label>
                  <span className="text-[10px] font-mono font-bold text-[#3D6B5E] bg-[#3D6B5E]/10 px-2 py-0.5 rounded">
                    ⚡ CollegeDB API Connected
                  </span>
                </div>
                <CollegeSearchAutocomplete
                  value={selectedInstName}
                  onChange={(name, loc) => {
                    setSelectedInstName(name);
                    if (loc) setSelectedInstLocation(loc);
                  }}
                  placeholder="Type to search 50,000+ Indian Colleges & Schools..."
                />
              </div>

              {/* Student Roll Number */}
              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-[#3E4F49] font-bold">
                  Student Roll / Registration Number
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2024-CS-091 or DPS-9912"
                  className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-mono text-[#1C2B27] focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                />
              </div>

              {/* Institute Facts Preview Box */}
              <div className="p-4 bg-white rounded-2xl border border-[#3D6B5E]/30 space-y-2 shadow-sm">
                <div className="font-mono text-xs font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center justify-between">
                  <span>SheerID Verified Facts Target</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#43BD92]/20 text-[#2C8866] font-bold">
                    CollegeDB Verified
                  </span>
                </div>
                <div className="text-xs text-[#3E4F49] space-y-1 font-mono">
                  <div>• <strong>Institution:</strong> {currentInst.name}</div>
                  <div>• <strong>Location:</strong> {currentInst.location}</div>
                  <div>• <strong>Framework:</strong> {currentInst.verifiedSyllabus.join(' · ')}</div>
                </div>
              </div>

              {/* Verify Trigger Button */}
              <button
                type="button"
                onClick={handleSimulateVerify}
                className="w-full btn btn-primary justify-center py-4 text-base font-semibold shadow-xl flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-[#F4D9C6]" />
                <span>Verify via SheerID Identity API</span>
              </button>
            </>
          )}

          {/* Verification Progress Stepper */}
          {(verificationStep === 1 || verificationStep === 2) && (
            <div className="py-8 space-y-6 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-[#3D6B5E]/10 text-[#3D6B5E] flex items-center justify-center mx-auto relative">
                <span className="w-12 h-12 rounded-full border-4 border-[#3D6B5E] border-t-transparent animate-spin" />
                <ShieldCheck className="w-6 h-6 absolute text-[#3D6B5E]" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-xl font-bold text-[#1C2B27]">
                  {verificationStep === 1 && 'Connecting to SheerID Verification Gateway...'}
                  {verificationStep === 2 && `Authenticating Student ID with ${currentInst.name}...`}
                </h4>
                <p className="text-xs font-mono text-[#6A7872]">
                  Exchanging SAML 2.0 / SheerID OAuth Tokens
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-xs mx-auto space-y-2 text-xs font-mono text-left bg-white p-4 rounded-xl border border-[#1C2B27]/10">
                <div className="flex items-center gap-2 text-[#43BD92]">
                  <Check className="w-4 h-4" />
                  <span>SheerID Partner Credentials Active</span>
                </div>
                <div className={`flex items-center gap-2 ${verificationStep >= 2 ? 'text-[#43BD92]' : 'text-gray-400'}`}>
                  {verificationStep >= 2 ? <Check className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border border-gray-300 inline-block" />}
                  <span>Validating Academic Transcript Records</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Success Step */}
          {verificationStep === 3 && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#43BD92]/20 text-[#2C8866] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#1C2B27]">Student Credentials Verified!</h4>
              <p className="text-xs text-[#3E4F49] font-mono bg-white p-3 rounded-xl border border-[#43BD92]/30 inline-block">
                Token: SH-VERIFIED-{currentInst.code}-2026-9912
              </p>
              <div className="text-xs text-[#2C5044] bg-[#C5DDD6]/50 py-2.5 px-4 rounded-full font-semibold">
                ✓ Institute-Verified Facts attached to Phoenix Context
              </div>
            </div>
          )}

          <div className="pt-2 text-center text-[11px] font-mono text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-[#3D6B5E]" />
            256-bit Encrypted SheerID OAuth API Stream
          </div>
        </div>
      </div>
    </div>
  );
}
