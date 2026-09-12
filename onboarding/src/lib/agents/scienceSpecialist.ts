import { OnboardingProfile } from '@/data/demoAccounts';
import { ChatMessage } from '@/lib/memoryStore';

export function runScienceSpecialist(
  query: string,
  profile: Partial<OnboardingProfile>
): Partial<ChatMessage> {
  const isSocratic = (profile.sliders?.teachingStyle || 1) <= 2;
  const isHighRigor = (profile.sliders?.rigorAndDepth || 3) >= 4;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('light') || lowerQuery.includes('refraction') || lowerQuery.includes('snell') || lowerQuery.includes('lens')) {
    return {
      agentName: 'Physics & Optics Sub-Agent',
      agentColor: 'bg-[#2C5044]',
      text: `Welcome to Optics & Refraction!

**Core Physical Principle (Snell's Law):**
When light passes from a rarer medium (like Air, $n_1 = 1.0$) into a denser medium (like Glass, $n_2 = 1.5$), the ray bends **towards the normal line**.

$$n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$$

${isSocratic ? `**Guiding Question:**
If light travels from water ($n_1 = 1.33$) into air ($n_2 = 1.0$), does the incident angle $\\theta_1$ bend away from or towards the normal line? What happens when $\\theta_1$ exceeds the **Critical Angle**?` : 'When $\\theta_1$ exceeds the critical angle $\\theta_c = \\arcsin(n_2/n_1)$, total internal reflection occurs!'}`,
      interactiveTool: {
        type: 'concept_map',
        title: 'Optics Ray Refraction & Total Internal Reflection Map',
        data: {
          nodes: [
            { id: 'incident', label: 'Incident Light Ray (Angle θ1)', type: 'source' },
            { id: 'boundary', label: 'Medium Boundary (n1 vs n2)', type: 'process' },
            { id: 'refracted', label: 'Refracted Ray (n1 sin θ1 = n2 sin θ2)', type: 'result' },
            { id: 'critical', label: 'Critical Angle & Total Internal Reflection', type: 'special' },
          ],
        },
      },
      followUps: [
        'Explain Total Internal Reflection applications in Optical Fibers.',
        'Calculate the Critical Angle for glass (n = 1.5) to air.',
        'Show NCERT Class 10 Light Refraction textbook reference.',
      ],
    };
  }

  // Physics / Mechanics default
  return {
    agentName: 'Physics & Natural Sciences Sub-Agent',
    agentColor: 'bg-[#2C5044]',
    text: `Analyzing physical mechanics and vector dynamics for **${profile.gradeOrDegree || 'Physics Student'}**...

**Newton's Second Law:**
$$\\vec{F}_{net} = m \\cdot \\vec{a} = \\frac{d\\vec{p}}{dt}$$

Every force acts along a vector component ($F_x = F \\cos\\theta$, $F_y = F \\sin\\theta$).`,
    interactiveTool: {
      type: 'desmos',
      title: 'Free Body Force Vector Plotter',
      data: {
        latexExpression: 'f(x) = 9.8 * x',
        xLabel: 'Mass m (kg)',
        yLabel: 'Weight Force F_g (N)',
      },
    },
    followUps: [
      'Draw the Free-Body Diagram for an inclined plane.',
      'Show kinetic vs potential energy conversion.',
    ],
  };
}
