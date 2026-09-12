import { OnboardingProfile } from '@/data/demoAccounts';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agentName?: string;
  agentColor?: string;
  routingTrace?: string[];
  interactiveTool?: {
    type: 'desmos' | 'code' | 'concept_map' | 'proof' | 'citation';
    title: string;
    data: any;
  };
  followUps?: string[];
}

export interface StudentProgressState {
  xp: number;
  level: number;
  masteredTopics: string[];
  activeWeaknesses: string[];
  verifiedFactBadges: string[];
  history: ChatMessage[];
}

export function initializeProgressState(profile: Partial<OnboardingProfile>): StudentProgressState {
  return {
    xp: profile.instituteVerified ? 250 : 100,
    level: 2,
    masteredTopics: profile.primaryInterests || ['General Science', 'Mathematics'],
    activeWeaknesses: profile.weakOrComplexTopics || ['Trigonometric Identities'],
    verifiedFactBadges: profile.instituteVerified
      ? ['SheerID Verified', profile.institution || 'Verified Institute', profile.gradeOrDegree || 'Enrolled Student']
      : ['Self-Reported Profile'],
    history: [],
  };
}

export function updateStudentMastery(
  currentState: StudentProgressState,
  topicToMaster: string
): StudentProgressState {
  const updatedMastered = Array.from(new Set([...currentState.masteredTopics, topicToMaster]));
  const updatedWeaknesses = currentState.activeWeaknesses.filter(
    (w) => w.toLowerCase() !== topicToMaster.toLowerCase()
  );
  const newXp = currentState.xp + 25;
  const newLevel = Math.floor(newXp / 100) + 1;

  return {
    ...currentState,
    xp: newXp,
    level: newLevel,
    masteredTopics: updatedMastered,
    activeWeaknesses: updatedWeaknesses,
  };
}
