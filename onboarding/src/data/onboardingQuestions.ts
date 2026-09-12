export interface InterestOption {
  id: string;
  name: string;
  category: 'Stem' | 'Humanities' | 'Tech' | 'Frontier';
  icon: string;
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'math', name: 'Mathematics & Calculus', category: 'Stem', icon: 'π' },
  { id: 'physics', name: 'Physics & Optics', category: 'Stem', icon: '⚡' },
  { id: 'chemistry', name: 'Organic & Inorganic Chemistry', category: 'Stem', icon: '🧪' },
  { id: 'bio', name: 'Biology & Genetics', category: 'Stem', icon: '🧬' },
  { id: 'cs', name: 'Computer Science & Coding', category: 'Tech', icon: '💻' },
  { id: 'ai', name: 'Artificial Intelligence & ML', category: 'Tech', icon: '🤖' },
  { id: 'quantum', name: 'Quantum Information & Physics', category: 'Frontier', icon: '⚛️' },
  { id: 'economics', name: 'Economics & Finance', category: 'Humanities', icon: '📈' },
  { id: 'history', name: 'History & Philosophy', category: 'Humanities', icon: '🏛️' },
  { id: 'literature', name: 'Literature & Linguistics', category: 'Humanities', icon: '📚' },
];

export interface SliderConfig {
  key: string;
  title: string;
  minLabel: string;
  maxLabel: string;
  description: string;
  levelLabels: Record<number, { title: string; badge: string }>;
}

export const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'rigorAndDepth',
    title: 'Explanation Rigor & Depth',
    minLabel: 'Intuitive Analogies',
    maxLabel: 'Formal Proofs & LaTeX',
    description: 'Controls whether explanations use intuitive real-world examples or rigorous formal proofs.',
    levelLabels: {
      1: { title: 'Intuitive Real-World Analogies & Stories', badge: 'Level 1 · Analogy Mode' },
      2: { title: 'Conceptual Breakdown + Core Formulas', badge: 'Level 2 · Conceptual' },
      3: { title: 'Standard Academic & Board Rigor', badge: 'Level 3 · Standard' },
      4: { title: 'Mathematical Derivations & LaTeX Notation', badge: 'Level 4 · Mathematical' },
      5: { title: 'Formal Proofs, Axioms & Frontier Rigor', badge: 'Level 5 · Axiomatic' },
    },
  },
  {
    key: 'teachingStyle',
    title: 'Teaching Interaction Style',
    minLabel: 'Socratic Questions',
    maxLabel: 'Direct Solutions',
    description: 'Determines whether the coordinator asks clarifying questions to nudge you or provides direct answers.',
    levelLabels: {
      1: { title: 'Pure Socratic (Guided Questions First)', badge: 'Level 1 · Socratic' },
      2: { title: 'Guided Discovery with Socratic Hints', badge: 'Level 2 · Guided' },
      3: { title: 'Balanced Questioning & Direct Guidance', badge: 'Level 3 · Hybrid' },
      4: { title: 'Structured Step-by-Step Breakdown', badge: 'Level 4 · Structured' },
      5: { title: 'Direct Solutions & Full Answer Derivation', badge: 'Level 5 · Direct' },
    },
  },
  {
    key: 'visualVsText',
    title: 'Visual & Tool Interactive Preference',
    minLabel: 'Text & Formulations',
    maxLabel: 'Desmos & Sandboxes',
    description: 'Specifies if answers should automatically embed interactive graphs, code execution panels, or diagrams.',
    levelLabels: {
      1: { title: 'Pure Text & Markdown Explanations', badge: 'Level 1 · Textual' },
      2: { title: 'Text + Static Concept Diagrams', badge: 'Level 2 · Diagrams' },
      3: { title: 'Balanced Text & Dynamic Tool Triggers', badge: 'Level 3 · Hybrid' },
      4: { title: 'Auto-Trigger Interactive Desmos Graphs', badge: 'Level 4 · Desmos' },
      5: { title: 'Full Desmos Plotter + Executable Code Sandbox', badge: 'Level 5 · Interactive' },
    },
  },
  {
    key: 'challengePace',
    title: 'Learning Pace & Challenge Intensity',
    minLabel: 'Gentle Refinement',
    maxLabel: 'Hard Olympiad',
    description: 'Sets the level of difficulty and speed of progression during tutoring sessions.',
    levelLabels: {
      1: { title: 'Gentle Pace & Foundational Refinement', badge: 'Level 1 · Gentle' },
      2: { title: 'Gradual Progression with Reinforcement', badge: 'Level 2 · Reinforced' },
      3: { title: 'Standard Exam & Board Level Pace', badge: 'Level 3 · Standard' },
      4: { title: 'Advanced JEE & Olympiad Problem Solving', badge: 'Level 4 · Advanced' },
      5: { title: 'Frontier Hard Competition Challenges', badge: 'Level 5 · Olympiad' },
    },
  },
];
