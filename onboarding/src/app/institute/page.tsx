import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, UserCheck, Database, Award } from 'lucide-react';
import { INSTITUTE_DATABASE } from '@/data/instituteDatabase';

export default function InstitutePage() {
  return (
    <div className="py-12 space-y-16">
      <div className="wrap space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="eyebrow">Institute Verification Hub</div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#1C2B27]">
            Empowering Institutes as <em>Verifiers of Truth</em>.
          </h1>
          <p className="text-lg text-[#3E4F49]">
            Institutes do not compete with Phoenix. Instead, they act as verifiers of facts—distinguishing between self-reported student claims and institute-verified academic history via SheerID SSO.
          </p>
        </div>

        {/* CTA Card */}
        <div className="p-8 bg-gradient-to-r from-[#2C5044] to-[#3D6B5E] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold text-[#F4D9C6] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E8A87C]" />
              SheerID OAuth Partner Integration
            </div>
            <h2 className="text-2xl font-serif font-bold">Connect your School or College Credentials</h2>
            <p className="text-sm text-white/80 max-w-xl">
              Verification pre-fills verified course prerequisites, official syllabus blueprints, and official academic records into the Coordinator Agent context.
            </p>
          </div>

          <Link href="/onboarding?mode=institute" className="btn btn-solid text-sm font-semibold whitespace-nowrap px-6 py-3">
            <span>Start Institute Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Partner Institutes Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-medium text-[#1C2B27]">
            Participating Partner Institutions (Prototype Registry)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSTITUTE_DATABASE.map((inst) => (
              <div key={inst.id} className="p-6 bg-white rounded-3xl border border-[#1C2B27]/10 shadow-lg space-y-4 hover:border-[#3D6B5E] transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#3D6B5E]/10 text-[#3D6B5E] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#43BD92]/20 text-[#2C8866] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    SheerID Enabled
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-[#1C2B27]">{inst.name}</h4>
                  <p className="text-xs text-[#6A7872] font-mono">{inst.location} · Code: {inst.code}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1C2B27]/10 text-xs text-[#3E4F49]">
                  <div className="font-mono font-bold text-[#D48A55] uppercase text-[11px]">
                    Verified Courses Framework:
                  </div>
                  <ul className="space-y-1 list-disc list-inside">
                    {inst.verifiedCourses.map((c) => (
                      <li key={c.courseCode}>{c.courseName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
