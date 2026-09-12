import { OnboardingProfile } from '@/data/demoAccounts';
import { ChatMessage } from '@/lib/memoryStore';

export function runMathSpecialist(
  query: string,
  profile: Partial<OnboardingProfile>
): Partial<ChatMessage> {
  const isSocratic = (profile.sliders?.teachingStyle || 1) <= 2;
  const isHighRigor = (profile.sliders?.rigorAndDepth || 3) >= 4;
  const isVisual = (profile.sliders?.visualVsText || 4) >= 4;

  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('kinetic energy') || lowerQuery.includes('derivative') || lowerQuery.includes('momentum')) {
    return {
      agentName: 'Mathematics & Calculus Specialist',
      agentColor: 'bg-[#D48A55]',
      text: isSocratic
        ? `Let's break down the calculus connection between Kinetic Energy and Momentum!

**Socratic Question:**
Consider the kinetic energy equation $E_k(v) = \\frac{1}{2}m[v(t)]^2$.
If we differentiate $E_k$ with respect to time $t$, how does the **Chain Rule** apply to the $[v(t)]^2$ term?

${isHighRigor ? `**Formal Derivation:**
By the Chain Rule:
$$\\frac{dE_k}{dt} = \\frac{d}{dt}\\left(\\frac{1}{2}m v^2\\right) = \\frac{1}{2}m \\cdot 2v \\cdot \\frac{dv}{dt} = m \\cdot v \\cdot a$$
Notice that since Momentum $p = m \\cdot v$ and Acceleration $a = \\frac{dv}{dt}$, the rate of change of Kinetic Energy equals **Force times Velocity** ($F \\cdot v$), which is Mechanical Power!` : ''}`
        : `Here is the mathematical proof connecting Kinetic Energy, Momentum, and Acceleration:

Let $E_k = \\frac{1}{2}mv^2$.
Differentiating with respect to time $t$:
$$\\frac{dE_k}{dt} = m \\cdot v \\cdot \\frac{dv}{dt} = m \\cdot v \\cdot a$$

Since $F = m \\cdot a$, we find $\\frac{dE_k}{dt} = F \\cdot v$, which proves Mechanical Power equals the derivative of Kinetic Energy!`,
      interactiveTool: isVisual
        ? {
            type: 'desmos',
            title: 'Interactive Desmos Graph: Kinetic Energy vs Velocity',
            data: {
              latexExpression: 'f(x) = 0.5 * 2 * x^2',
              derivativeExpression: 'g(x) = 2 * x',
              xLabel: 'Velocity v (m/s)',
              yLabel: 'Kinetic Energy E_k (Joules)',
              mass: 2,
            },
          }
        : {
            type: 'proof',
            title: 'LaTeX Step-by-Step Chain Rule Proof',
            data: {
              steps: [
                'E_k = (1/2) * m * v(t)^2',
                'd/dt [E_k] = (1/2) * m * 2*v(t) * v\'(t)',
                'd/dt [E_k] = m * v(t) * a(t) = F * v',
              ],
            },
          },
      followUps: [
        'How does this connect to the Work-Energy Theorem?',
        'Can we plot the derivative curve g(v) = m*v in Desmos?',
        'Show me a relativistic kinetic energy proof for high velocities.',
      ],
    };
  }

  // Default Math response for quadratic / trigonometry / calculus queries
  return {
    agentName: 'Mathematics & Calculus Specialist',
    agentColor: 'bg-[#D48A55]',
    text: `Analyzing mathematical structure for **${profile.gradeOrDegree || 'Student'}** level...

Let's solve this step-by-step:
1. Identify target functions and variables.
2. Apply fundamental algebraic or calculus transformations.
3. Verify boundary conditions.

${isHighRigor ? `$$\\int f(x) dx = F(x) + C \\quad \\text{where } F'(x) = f(x)$$` : ''}`,
    interactiveTool: {
      type: 'desmos',
      title: 'Interactive Desmos Plot: Quadratic Curve',
      data: {
        latexExpression: 'f(x) = x^2 - 4*x + 3',
        xLabel: 'x',
        yLabel: 'y',
      },
    },
    followUps: [
      'Show the step-by-step factoring derivation.',
      'Plot the roots and vertex in Desmos.',
      'Explain intuitive real-world applications.',
    ],
  };
}
