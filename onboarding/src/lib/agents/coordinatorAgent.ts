import { OnboardingProfile } from '@/data/demoAccounts';
import { ChatMessage } from '@/lib/memoryStore';
import { runMathSpecialist } from './mathSpecialist';
import { runScienceSpecialist } from './scienceSpecialist';
import { runCsSpecialist } from './csSpecialist';
import { runResearchAgent } from './researchAgent';

export function routeAndExecuteQuery(
  query: string,
  profile: Partial<OnboardingProfile>
): ChatMessage {
  const lowerQuery = query.toLowerCase();

  // Routing Decision Logic
  let targetAgent: 'math' | 'science' | 'cs' | 'research' = 'math';
  let reasoning = 'Query involves mathematical equations and calculus differentiation.';

  if (lowerQuery.includes('python') || lowerQuery.includes('code') || lowerQuery.includes('backprop') || lowerQuery.includes('algorithm') || lowerQuery.includes('pytorch')) {
    targetAgent = 'cs';
    reasoning = 'Query detected code sandbox / machine learning algorithmic intent.';
  } else if (lowerQuery.includes('light') || lowerQuery.includes('refraction') || lowerQuery.includes('optics') || lowerQuery.includes('force') || lowerQuery.includes('physics')) {
    targetAgent = 'science';
    reasoning = 'Query detected physical optics / natural sciences phenomena.';
  } else if (lowerQuery.includes('ncert') || lowerQuery.includes('textbook') || lowerQuery.includes('paper') || lowerQuery.includes('citation') || lowerQuery.includes('arxiv')) {
    targetAgent = 'research';
    reasoning = 'Query requested verified textbook reference / academic citation sourcing.';
  }

  // Construct Routing Trace
  const routingTrace = [
    `[Coordinator] Analyzed query: "${query.slice(0, 45)}..."`,
    `[Coordinator] Filtered against Student Context: ${profile.gradeOrDegree || 'Student'} (${profile.instituteVerified ? 'Verified via SheerID' : 'Self-Reported'})`,
    `[Coordinator] Parameter Sliders: Rigor=${profile.sliders?.rigorAndDepth || 3}/5, Style=${(profile.sliders?.teachingStyle || 1) <= 2 ? 'Socratic' : 'Direct'}, Visual=${profile.sliders?.visualVsText || 4}/5`,
    `[Coordinator] ${reasoning}`,
    `[Delegated Action] Handed off execution to ${
      targetAgent === 'math' ? 'Mathematics & Calculus Specialist' :
      targetAgent === 'science' ? 'Physics & Optics Sub-Agent' :
      targetAgent === 'cs' ? 'Computer Science & Code Sub-Agent' : 'Research & Literature Sourcing Agent'
    }`,
  ];

  // Execute Sub-Agent
  let resultPartial: Partial<ChatMessage>;

  switch (targetAgent) {
    case 'cs':
      resultPartial = runCsSpecialist(query, profile);
      break;
    case 'science':
      resultPartial = runScienceSpecialist(query, profile);
      break;
    case 'research':
      resultPartial = runResearchAgent(query, profile);
      break;
    case 'math':
    default:
      resultPartial = runMathSpecialist(query, profile);
      break;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: resultPartial.text || 'Answer generated.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentName: resultPartial.agentName,
    agentColor: resultPartial.agentColor,
    routingTrace,
    interactiveTool: resultPartial.interactiveTool,
    followUps: resultPartial.followUps,
  };
}
