'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  UserCheck,
  Building2,
  ShieldCheck,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  Cpu,
  FileCode,
  Link as LinkIcon,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { DEMO_ACCOUNTS, OnboardingProfile } from '@/data/demoAccounts';
import { INTEREST_OPTIONS, SLIDER_CONFIGS } from '@/data/onboardingQuestions';
import { INSTITUTE_DATABASE, InstituteRecord } from '@/data/instituteDatabase';
import SheerIDModal from './SheerIDModal';
import CollegeSearchAutocomplete from './CollegeSearchAutocomplete';

export default function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'institute' ? 'institute' : 'individual';

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'individual' | 'institute'>(initialMode);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>(17);
  const [gradeOrDegree, setGradeOrDegree] = useState('Class 10 CBSE Board');
  const [institution, setInstitution] = useState('Delhi Public School, R.K. Puram');
  const [claimedGoals, setClaimedGoals] = useState('Aiming for 95%+ in Board Exams and mastering Physics & Calculus.');

  // Institute Verification State
  const [instituteVerified, setInstituteVerified] = useState(false);
  const [sheerIdToken, setSheerIdToken] = useState<string | undefined>();
  const [verifiedDetails, setVerifiedDetails] = useState<{
    verifiedGpaOrScore?: string;
    verifiedPrerequisites?: string[];
  }>({});

  // Interests & Topics
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Mathematics & Calculus',
    'Physics & Optics',
    'Computer Science & Coding',
  ]);
  const [weakTopicsInput, setWeakTopicsInput] = useState('Trigonometric Identities, Refraction Diagrams');

  // Parameter Sliders
  const [sliders, setSliders] = useState({
    rigorAndDepth: 3,
    teachingStyle: 1, // Socratic
    visualVsText: 5,  // Heavy Desmos
    challengePace: 3,
  });

  // External Links & Tools
  const [chatGptLink, setChatGptLink] = useState('');
  const [syllabusSnippet, setSyllabusSnippet] = useState('');

  // SheerID Modal & Copy UI
  const [isSheerIdOpen, setIsSheerIdOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Auto-fill from preset persona
  const handleLoadDemoPersona = (key: 'school' | 'college' | 'researcher') => {
    const demo = DEMO_ACCOUNTS[key];
    setName(demo.name);
    setAge(demo.age);
    setGradeOrDegree(demo.gradeOrDegree);
    setInstitution(demo.institution);
    setInstituteVerified(demo.instituteVerified);
    setSheerIdToken(demo.sheerIdVerificationId);
    setVerifiedDetails({
      verifiedGpaOrScore: demo.claimedVsVerified.verifiedGpaOrScore,
      verifiedPrerequisites: demo.claimedVsVerified.verifiedPrerequisites,
    });
    setClaimedGoals(demo.claimedVsVerified.claimedGoals);
    setSelectedInterests(demo.primaryInterests);
    setWeakTopicsInput(demo.weakOrComplexTopics.join(', '));
    setSliders(demo.sliders);
    setChatGptLink(demo.externalIntegrations.chatGptOrGeminiHistoryUrl || '');
    setSyllabusSnippet(demo.externalIntegrations.syllabusNotesSnippet || '');
    if (demo.instituteVerified) setMode('institute');
  };

  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interestName));
    } else {
      setSelectedInterests([...selectedInterests, interestName]);
    }
  };

  const handleSheerIdVerified = (inst: InstituteRecord, studentId: string) => {
    setInstituteVerified(true);
    setInstitution(inst.name);
    setSheerIdToken(`SH-VERIFIED-${inst.code}-9912`);
    setVerifiedDetails({
      verifiedGpaOrScore: inst.type === 'school' ? 'Verified Grade 9 Science & Math: 94%' : 'Verified CGPA: 8.9 / 10.0',
      verifiedPrerequisites: inst.verifiedCourses[0]?.prerequisites || ['Mathematics I', 'Science'],
    });
  };

  const handleSubmitOnboarding = async () => {
    setIsSubmitting(true);
    const weakTopicsList = weakTopicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalInstitution = mode === 'individual' ? 'Independent Self-Learner' : (institution || 'Educational Institute');
    const finalGrade = mode === 'individual' ? 'Independent Learner (Self-Paced)' : (gradeOrDegree || 'Enrolled Student');

    const payload: Partial<OnboardingProfile> = {
      name: name || 'Self-Learner',
      age: Number(age) || 18,
      gradeOrDegree: finalGrade,
      institution: finalInstitution,
      instituteVerified: mode === 'institute' && instituteVerified,
      sheerIdVerificationId: mode === 'institute' ? sheerIdToken : undefined,
      claimedVsVerified: {
        verifiedGpaOrScore: mode === 'institute' ? verifiedDetails.verifiedGpaOrScore : undefined,
        verifiedPrerequisites: mode === 'institute' ? verifiedDetails.verifiedPrerequisites : undefined,
        claimedGoals,
      },
      primaryInterests: selectedInterests,
      weakOrComplexTopics: weakTopicsList,
      sliders,
      externalIntegrations: {
        chatGptOrGeminiHistoryUrl: chatGptLink,
        syllabusNotesSnippet: syllabusSnippet,
        preferredTools: ['Desmos Grapher', 'Python Sandbox'],
      },
    };

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('eila_student_profile', JSON.stringify(data.data));
        window.location.href = '/workspace.html';
      }
    } catch (err) {
      console.error('Error saving onboarding:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute live System Prompt & Keywords preview
  const weakTopicsList = weakTopicsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const keywords = [
    mode === 'individual' ? '#INDIVIDUAL_SELF_LEARNER' : `#${gradeOrDegree.toUpperCase().replace(/[^A-Z0-9]/g, '_').slice(0, 18)}`,
    mode === 'institute' && instituteVerified ? '#INSTITUTE_VERIFIED_FACTS' : '#SELF_CLAIMED_STUDENT',
    sliders.teachingStyle <= 2 ? '#SOCRATIC_QUESTIONING_MODE' : '#DIRECT_STEP_BY_STEP',
    sliders.rigorAndDepth >= 4 ? '#FORMAL_MATH_RIGOR' : '#INTUITIVE_ANALOGIES',
    sliders.visualVsText >= 4 ? '#VISUAL_DESMOS_GRAPHING' : '#TEXTUAL_FORMULATIONS',
    ...weakTopicsList.slice(0, 2).map((t) => `#WEAKNESS_${t.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`),
  ];

  const constructedSystemPrompt = `[SYSTEM CONTEXT - PHOENIX COORDINATOR AGENT]
Student: ${name || 'Learner'} (${mode === 'individual' ? 'Individual Self-Paced Learner' : `${gradeOrDegree} - ${institution}`})
Verification Status: ${mode === 'institute' && instituteVerified ? `VERIFIED (SheerID Token: ${sheerIdToken})` : 'Self-Claimed Profile'}

[FACT STORE - UN-EMBEDDED EXACT FACTS]
- Mode: ${mode === 'individual' ? 'Individual Learning' : 'Institute Enrolled'}
- Institution: ${mode === 'individual' ? 'Independent Self-Learner' : institution}
- Grade/Degree: ${mode === 'individual' ? 'Self-Paced Track' : gradeOrDegree}
- Verified Academic Score: ${mode === 'institute' && verifiedDetails.verifiedGpaOrScore ? verifiedDetails.verifiedGpaOrScore : 'N/A (Self-Reported)'}
- Primary Goal: ${claimedGoals}

[PREFERENCE STORE - SYSTEM PROMPT KEYWORDS & SLIDERS]
- Inferred Routing Flags: ${keywords.join(' ')}
- Rigor Level: ${sliders.rigorAndDepth}/5 (${sliders.rigorAndDepth >= 4 ? 'Formal Proofs & Math Notation' : 'Intuitive Real-World Analogies'})
- Teaching Interaction: ${sliders.teachingStyle}/5 (${sliders.teachingStyle <= 2 ? 'Socratic Questioning First' : 'Direct Step-by-Step Solutions'})
- Visual Preferences: ${sliders.visualVsText}/5 (${sliders.visualVsText >= 4 ? 'Auto-trigger Desmos & Code Canvas' : 'Text Formulations'})
- Target Weak Topics: ${weakTopicsList.join(', ') || 'General Problem Solving'}`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(constructedSystemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* MAIN WIZARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-[#1C2B27]/10 shadow-2xl p-6 sm:p-10 space-y-8">
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C2B27]/10">
          <div>
            <div className="eyebrow text-xs mb-1">Tailored Student Onboarding</div>
            <h2 className="text-2xl font-serif font-bold text-[#1C2B27]">
              {step === 1 && (mode === 'individual' ? 'Step 1: Individual Learning Setup' : 'Step 1: Connect to Educational Institute')}
              {step === 2 && 'Step 2: Subject Interests & Parameter Sliders'}
              {step === 3 && 'Step 3: External Knowledge & SheerID Verification'}
              {step === 4 && 'Step 4: AI Context Synthesis & System Prompt Engine'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                onClick={() => setStep(s)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold cursor-pointer transition-all ${
                  step === s
                    ? 'bg-[#3D6B5E] text-white shadow-md scale-110'
                    : s < step
                    ? 'bg-[#43BD92] text-white'
                    : 'bg-[#FAF7F2] text-[#3E4F49] border border-[#1C2B27]/10'
                }`}
              >
                {s < step ? '✓' : `0${s}`}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: MODE SELECTION & BASICS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Mode Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setMode('individual')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  mode === 'individual'
                    ? 'border-[#3D6B5E] bg-[#FAF7F2] shadow-md'
                    : 'border-[#1C2B27]/10 bg-white hover:border-[#1C2B27]/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#3D6B5E]/10 text-[#3D6B5E] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#1C2B27]">Individual Learning</h3>
                </div>
                <p className="text-xs text-[#3E4F49] leading-relaxed">
                  Self-paced independent learning. No school or institutional details required—just your interests, goals, and parameter sliders.
                </p>
              </div>

              <div
                onClick={() => setMode('institute')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  mode === 'institute'
                    ? 'border-[#D48A55] bg-[#FAF7F2] shadow-md'
                    : 'border-[#1C2B27]/10 bg-white hover:border-[#1C2B27]/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#D48A55]/10 text-[#D48A55] flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg text-[#1C2B27]">Connect to Institute</h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8A87C]/20 text-[#D48A55]">
                    SheerID Verifier
                  </span>
                </div>
                <p className="text-xs text-[#3E4F49] leading-relaxed">
                  Connect your school, college, or university credentials. Institutes act as verifiers of facts (Claimed vs Verified facts).
                </p>
              </div>
            </div>

            {/* CONDITIONAL FORM INPUTS BASED ON MODE */}
            {mode === 'individual' ? (
              /* INDIVIDUAL LEARNING MODE (NO SCHOOL ASKED) */
              <div className="space-y-5 p-6 bg-[#FAF7F2] rounded-3xl border border-[#1C2B27]/10 space-y-4">
                <div className="font-mono text-xs font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D48A55]" />
                  Independent Self-Paced Profile
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="18"
                      className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                    Primary Self-Study Objective / Learning Goal
                  </label>
                  <textarea
                    rows={2}
                    value={claimedGoals}
                    onChange={(e) => setClaimedGoals(e.target.value)}
                    placeholder="e.g. Master Calculus & Physics from scratch for self-learning..."
                    className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              /* CONNECT TO INSTITUTE MODE (FULL INSTITUTE DETAILS ASKED) */
              <div className="space-y-5 p-6 bg-[#FAF7F2] rounded-3xl border border-[#D48A55]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-[#D48A55] uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#3D6B5E]" />
                    Educational Institution Details &amp; Credentials
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSheerIdOpen(true)}
                    className="btn btn-solid text-xs px-3.5 py-1.5 font-mono uppercase"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    SheerID Verification
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                      Full Student Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Patel"
                      className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                      Grade / Degree Level
                    </label>
                    <input
                      type="text"
                      value={gradeOrDegree}
                      onChange={(e) => setGradeOrDegree(e.target.value)}
                      placeholder="Class 10 CBSE / B.Tech CS / PhD"
                      className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                        Institution Name
                      </label>
                      <span className="text-[10px] font-mono font-bold text-[#3D6B5E]">
                        ⚡ Powered by CollegeDB API
                      </span>
                    </div>
                    <CollegeSearchAutocomplete
                      value={institution}
                      onChange={(name) => setInstitution(name)}
                      placeholder="Search 50,000+ Indian Colleges & Schools (e.g. IIT, DPS, BITS)..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                    Academic Objective &amp; Target Exams
                  </label>
                  <textarea
                    rows={2}
                    value={claimedGoals}
                    onChange={(e) => setClaimedGoals(e.target.value)}
                    placeholder="e.g. Target 95%+ in Board Exams & JEE Foundation..."
                    className="w-full bg-white border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: INTERESTS & PARAMETER SLIDERS */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Subject Interest Chips */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                Primary Subject Interests (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {INTEREST_OPTIONS.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.name);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.name)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 border ${
                        isSelected
                          ? 'bg-[#3D6B5E] text-white border-[#3D6B5E] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#3E4F49] border-[#1C2B27]/15 hover:border-[#3D6B5E]'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weak / Complex Topics Input */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                Weak or Complex Topics (Comma-separated)
              </label>
              <input
                type="text"
                value={weakTopicsInput}
                onChange={(e) => setWeakTopicsInput(e.target.value)}
                placeholder="e.g. Trigonometric Identities, Refraction Diagrams, Backpropagation"
                className="w-full bg-[#FAF7F2] border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
              />
            </div>

            {/* 4 INTERACTIVE PARAMETER SLIDERS */}
            <div className="space-y-6 pt-4 border-t border-[#1C2B27]/10">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#3D6B5E]" />
                  <h3 className="font-serif text-xl font-bold text-[#1C2B27]">Tutor Behavior Parameter Sliders</h3>
                </div>
                <span className="text-xs text-[#6A7872] font-medium">
                  Select a level (1–5) to customize tutor reasoning style
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SLIDER_CONFIGS.map((cfg) => {
                  const val = sliders[cfg.key as keyof typeof sliders] || 3;
                  const activeInfo = cfg.levelLabels[val] || { title: `Level ${val} Mode`, badge: `Level ${val}` };

                  return (
                    <div
                      key={cfg.key}
                      className="p-5 sm:p-6 bg-[#FAF7F2] rounded-2xl border border-[#1C2B27]/10 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#3D6B5E]/30 transition-all"
                    >
                      {/* Header Title & Short Description */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm text-[#1C2B27]">{cfg.title}</h4>
                          <span className="shrink-0 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#3D6B5E]/10 text-[#3D6B5E] border border-[#3D6B5E]/20">
                            Level {val} / 5
                          </span>
                        </div>
                        <p className="text-xs text-[#5C6B64] leading-relaxed">{cfg.description}</p>
                      </div>

                      {/* Active Mode Highlight Banner */}
                      <div className="flex items-center gap-2 text-xs text-[#1C2B27] font-medium bg-[#3D6B5E]/8 px-3 py-2.5 rounded-xl border border-[#3D6B5E]/15">
                        <Sparkles className="w-4 h-4 shrink-0 text-[#3D6B5E]" />
                        <span className="font-semibold text-[#2D4E44] leading-snug">{activeInfo.title}</span>
                      </div>

                      {/* Segmented 5-Level Control Bar */}
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[#EAE5DD] rounded-xl">
                          {[1, 2, 3, 4, 5].map((lvl) => {
                            const isActive = val === lvl;
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setSliders({ ...sliders, [cfg.key]: lvl })}
                                className={`py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-0.5 ${
                                  isActive
                                    ? 'bg-[#3D6B5E] text-white shadow-xs font-bold scale-[1.02]'
                                    : 'text-[#5C6B64] hover:text-[#1C2B27] hover:bg-white/60 font-medium'
                                }`}
                              >
                                <span className="text-[10px] font-mono opacity-70">L</span>
                                <span>{lvl}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Spectrum Endpoint Labels */}
                        <div className="flex justify-between items-center text-[11px] text-[#6A7872] font-medium px-0.5 pt-0.5">
                          <span>1 · {cfg.minLabel}</span>
                          <span>5 · {cfg.maxLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: EXTERNAL INTEGRATIONS & VERIFICATION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Institute Verification Status Card */}
            <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-[#1C2B27]/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3D6B5E] text-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C2B27]">
                      {mode === 'institute' && instituteVerified ? 'Institute Verified Credentials' : 'Self-Reported Student Profile'}
                    </h3>
                    <p className="text-xs text-[#3E4F49] font-mono">
                      {mode === 'institute' && instituteVerified ? `SheerID Token: ${sheerIdToken}` : 'Click right button to trigger SheerID verification'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSheerIdOpen(true)}
                  className="btn btn-solid text-xs px-4 py-2 font-mono uppercase tracking-wider"
                >
                  {instituteVerified ? 'Re-Verify SheerID' : 'Connect & Verify'}
                </button>
              </div>

              {/* Claimed vs Verified Comparison Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 bg-white rounded-xl border border-[#1C2B27]/10 space-y-1">
                  <div className="font-mono font-bold text-[#D48A55] uppercase tracking-wider">
                    Student-Claimed Information
                  </div>
                  <div><strong>Goals:</strong> {claimedGoals || 'Not specified'}</div>
                  <div><strong>Mode:</strong> {mode === 'individual' ? 'Individual Self-Learner' : 'Institute Enrolled'}</div>
                  <div><strong>Status:</strong> Self-entered claims</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#3D6B5E]/30 space-y-1">
                  <div className="font-mono font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center justify-between">
                    <span>Institute Verified Facts</span>
                    {mode === 'institute' && instituteVerified && <span className="text-[#43BD92]">✓ VERIFIED</span>}
                  </div>
                  <div><strong>Verified Score:</strong> {mode === 'institute' && verifiedDetails.verifiedGpaOrScore ? verifiedDetails.verifiedGpaOrScore : 'Unverified (Self-Paced)'}</div>
                  <div><strong>Prerequisites:</strong> {mode === 'institute' && verifiedDetails.verifiedPrerequisites?.join(', ') || 'N/A'}</div>
                  <div><strong>Institution:</strong> {mode === 'individual' ? 'Independent Self-Learner' : institution}</div>
                </div>
              </div>
            </div>

            {/* ChatGPT / Gemini History Import */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                Import ChatGPT or Gemini Shared Chat History Link (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={chatGptLink}
                  onChange={(e) => setChatGptLink(e.target.value)}
                  placeholder="https://chatgpt.com/share/..."
                  className="w-full bg-[#FAF7F2] border border-[#1C2B27]/20 rounded-xl p-3.5 pl-10 text-sm font-mono focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
                />
                <LinkIcon className="w-4 h-4 text-[#3D6B5E] absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Syllabus Notes Snippet */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#3E4F49]">
                Syllabus / Course Notes Snippet (Optional)
              </label>
              <textarea
                rows={3}
                value={syllabusSnippet}
                onChange={(e) => setSyllabusSnippet(e.target.value)}
                placeholder="Paste course syllabus topics or exam blueprint here..."
                className="w-full bg-[#FAF7F2] border border-[#1C2B27]/20 rounded-xl p-3.5 text-sm font-mono focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: SYSTEM PROMPT ENGINE (OVERHAULED READABLE UI) */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#1C2B27] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3D6B5E] flex items-center justify-center text-[#43BD92]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#E8A87C] uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#43BD92] animate-pulse" />
                      Phoenix Coordinator System Prompt Engine
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white">Synthesized Agent Context Schema</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="btn btn-ghost text-xs px-3.5 py-1.5 text-white border-white/20 hover:bg-white/10 font-mono flex items-center gap-1.5"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-[#43BD92]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>

              {/* Inferred System Keywords (Extracted Pill Tags) */}
              <div className="space-y-3 bg-[#243530] p-4 sm:p-5 rounded-2xl border border-white/10">
                <div className="font-mono text-xs font-bold text-[#F4D9C6] uppercase tracking-wider">
                  Inferred System Keywords (Routing Flags):
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs px-3 py-1.5 rounded-xl bg-[#3D6B5E] text-[#FAF7F2] border border-[#5A8C7C] shadow-sm font-semibold tracking-wide"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formatted System Prompt Viewport (Spacious Monospace) */}
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Generated System Prompt (Injected into Coordinator Agent):
                </div>
                <div className="bg-black/60 p-5 rounded-2xl font-mono text-xs text-[#C5DDD6] leading-relaxed whitespace-pre-wrap border border-white/10 shadow-inner max-h-[380px] overflow-y-auto space-y-4">
                  {constructedSystemPrompt}
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2 text-center space-y-3">
              <button
                type="button"
                onClick={handleSubmitOnboarding}
                disabled={isSubmitting}
                className="w-full btn btn-primary justify-center py-5 text-base font-semibold shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 font-mono">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Initializing Agentic Workspace...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#F4D9C6]" />
                    Launch Phoenix Agentic Workspace
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
              <p className="text-xs text-[#6A7872] font-mono">
                Saves profile context and initializes Coordinator Agent with Subject Specialists.
              </p>
            </div>
          </div>
        )}

        {/* STEP NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-6 border-t border-[#1C2B27]/10">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="btn btn-ghost text-xs px-5 py-2.5 font-mono uppercase tracking-wider disabled:opacity-30"
          >
            ← Previous
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="btn btn-solid text-xs px-6 py-2.5 font-mono uppercase tracking-wider flex items-center gap-2"
            >
              <span>Continue Step {step + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* SheerID Modal Component */}
      <SheerIDModal
        isOpen={isSheerIdOpen}
        onClose={() => setIsSheerIdOpen(false)}
        onVerified={handleSheerIdVerified}
      />
    </div>
  );
}
