import { OnboardingProfile } from '@/data/demoAccounts';

export interface ProcessedOnboardingPayload {
  rawProfile: OnboardingProfile;
  facts: {
    institution: string;
    gradeOrDegree: string;
    instituteVerified: boolean;
    sheerIdVerificationId?: string;
    verifiedGpaOrScore?: string;
    verifiedPrerequisites?: string[];
    claimedGoals: string;
  };
  preferences: {
    sliders: OnboardingProfile['sliders'];
    primaryInterests: string[];
    weakOrComplexTopics: string[];
    preferredTools: string[];
  };
  inferredKeywords: string[];
  systemPrompt: string;
  processedAt: string;
}

export function processOnboardingData(input: Partial<OnboardingProfile>): ProcessedOnboardingPayload {
  const profile: OnboardingProfile = {
    id: input.id || `user-${Date.now()}`,
    role: input.role || 'school',
    name: input.name || 'Anonymous Student',
    age: Number(input.age) || 18,
    gradeOrDegree: input.gradeOrDegree || 'General Student',
    institution: input.institution || 'Independent Learner',
    instituteVerified: Boolean(input.instituteVerified),
    sheerIdVerificationId: input.sheerIdVerificationId || (input.instituteVerified ? `SH-VERIFIED-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
    claimedVsVerified: input.claimedVsVerified || {
      claimedGoals: 'Master core subjects and clear upcoming exams.',
      verifiedGpaOrScore: input.instituteVerified ? 'Verified Official Record Active' : undefined,
    },
    primaryInterests: input.primaryInterests || ['General Science', 'Mathematics'],
    weakOrComplexTopics: input.weakOrComplexTopics || ['Problem Solving'],
    sliders: input.sliders || {
      rigorAndDepth: 3,
      teachingStyle: 2,
      visualVsText: 4,
      challengePace: 3,
    },
    externalIntegrations: input.externalIntegrations || {
      preferredTools: ['Interactive Grapher', 'Concept Map'],
    },
    inferredKeywords: [],
    systemPromptPreview: '',
  };

  // Generate automated system keywords for Coordinator Agent routing
  const keywords: string[] = [];

  // Track / Grade keyword
  const normalizedGrade = profile.gradeOrDegree.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  keywords.push(`#${normalizedGrade.slice(0, 20)}`);

  // Institute Verification status
  if (profile.instituteVerified) {
    keywords.push('#INSTITUTE_VERIFIED_FACTS');
    keywords.push(`#INSTITUTION_${profile.institution.split(' ')[0].toUpperCase()}`);
  } else {
    keywords.push('#SELF_CLAIMED_STUDENT');
  }

  // Sliders keywords
  if (profile.sliders.teachingStyle <= 2) keywords.push('#SOCRATIC_QUESTIONING_MODE');
  else keywords.push('#DIRECT_STEP_BY_STEP');

  if (profile.sliders.rigorAndDepth >= 4) keywords.push('#FORMAL_MATH_RIGOR');
  else keywords.push('#INTUITIVE_ANALOGIES');

  if (profile.sliders.visualVsText >= 4) keywords.push('#VISUAL_DESMOS_GRAPHING');

  // Topics
  profile.weakOrComplexTopics.slice(0, 3).forEach((topic) => {
    const clean = topic.replace(/[^a-zA-Z0-9]/g, '_');
    keywords.push(`#WEAKNESS_${clean.toUpperCase()}`);
  });

  profile.inferredKeywords = keywords;

  // Construct System Prompt for Coordinator Agent
  const systemPrompt = `[SYSTEM CONTEXT - PHOENIX COORDINATOR AGENT]
Student Profile: ${profile.name} (${profile.gradeOrDegree} - ${profile.institution})
Verification Status: ${profile.instituteVerified ? `VERIFIED (SheerID: ${profile.sheerIdVerificationId})` : 'Self-Claimed Student'}

[FACT STORE - UN-EMBEDDED EXACT FACTS]
- Institution: ${profile.institution}
- Grade/Degree: ${profile.gradeOrDegree}
- Verified Academic Records: ${profile.claimedVsVerified.verifiedGpaOrScore || 'N/A'}
- Verified Prerequisites: ${profile.claimedVsVerified.verifiedPrerequisites?.join(', ') || 'Self-reported'}
- Stated Learning Goal: ${profile.claimedVsVerified.claimedGoals}

[PREFERENCE STORE - SYSTEM PROMPT KEYWORDS & SLIDERS]
- Inferred Routing Flags: ${keywords.join(' ')}
- Rigor Level: ${profile.sliders.rigorAndDepth}/5
- Teaching Style: ${profile.sliders.teachingStyle}/5 (${profile.sliders.teachingStyle <= 2 ? 'Ask Socratic questions first' : 'Provide direct step-by-step solution'})
- Interactive Tools Preference: ${profile.sliders.visualVsText}/5 (${profile.sliders.visualVsText >= 4 ? 'Trigger interactive graph/code canvas automatically' : 'Standard text and markdown'})
- Primary Subject Interests: ${profile.primaryInterests.join(', ')}
- Target Weak Topics to Strengthen: ${profile.weakOrComplexTopics.join(', ')}`;

  profile.systemPromptPreview = systemPrompt;

  return {
    rawProfile: profile,
    facts: {
      institution: profile.institution,
      gradeOrDegree: profile.gradeOrDegree,
      instituteVerified: profile.instituteVerified,
      sheerIdVerificationId: profile.sheerIdVerificationId,
      verifiedGpaOrScore: profile.claimedVsVerified.verifiedGpaOrScore,
      verifiedPrerequisites: profile.claimedVsVerified.verifiedPrerequisites,
      claimedGoals: profile.claimedVsVerified.claimedGoals,
    },
    preferences: {
      sliders: profile.sliders,
      primaryInterests: profile.primaryInterests,
      weakOrComplexTopics: profile.weakOrComplexTopics,
      preferredTools: profile.externalIntegrations.preferredTools,
    },
    inferredKeywords: keywords,
    systemPrompt,
    processedAt: new Date().toISOString(),
  };
}
