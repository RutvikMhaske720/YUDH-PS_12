export interface OnboardingProfile {
  id: string;
  role: 'school' | 'college' | 'researcher';
  name: string;
  age: number;
  gradeOrDegree: string;
  institution: string;
  instituteVerified: boolean;
  sheerIdVerificationId?: string;
  claimedVsVerified: {
    verifiedGpaOrScore?: string;
    verifiedEnrollmentYear?: string;
    verifiedPrerequisites?: string[];
    claimedGoals: string;
  };
  primaryInterests: string[];
  weakOrComplexTopics: string[];
  sliders: {
    rigorAndDepth: number; // 1 (intuitive) to 5 (rigorous mathematical proof)
    teachingStyle: number; // 1 (guided Socratic questions) to 5 (direct step-by-step)
    visualVsText: number;  // 1 (text & equations) to 5 (interactive graphs & Desmos/code)
    challengePace: number; // 1 (gentle pace) to 5 (hard challenge problems)
  };
  externalIntegrations: {
    chatGptOrGeminiHistoryUrl?: string;
    syllabusNotesSnippet?: string;
    preferredTools: string[];
  };
  inferredKeywords: string[];
  systemPromptPreview: string;
}

export const DEMO_ACCOUNTS: Record<'school' | 'college' | 'researcher', OnboardingProfile> = {
  school: {
    id: 'demo-school-aarav',
    role: 'school',
    name: 'Aarav Sharma',
    age: 16,
    gradeOrDegree: 'Class 10 CBSE Board',
    institution: 'Delhi Public School, R.K. Puram',
    instituteVerified: true,
    sheerIdVerificationId: 'SH-DPS-2026-8841',
    claimedVsVerified: {
      verifiedGpaOrScore: 'Grade 9 Science & Math: 94%',
      verifiedEnrollmentYear: 'Enrolled 2023 - 2026 (Active Student)',
      verifiedPrerequisites: ['Class 9 Mathematics', 'Class 9 Physics & Chemistry'],
      claimedGoals: 'Aiming for 98%+ in Class 10 Board Exams & JEE Foundation',
    },
    primaryInterests: ['Physics (Electricity & Optics)', 'Quadratic Equations', 'Chemical Reactions', 'Robotics'],
    weakOrComplexTopics: ['Trigonometric Identities', 'Refraction Ray Diagrams', 'Carbon & Its Compounds'],
    sliders: {
      rigorAndDepth: 2, // Intuitive with moderate formulas
      teachingStyle: 1, // Highly Socratic & interactive questioning
      visualVsText: 5,  // Heavy reliance on Desmos graphs & interactive ray optics diagrams
      challengePace: 3, // Balanced board level to JEE foundation
    },
    externalIntegrations: {
      chatGptOrGeminiHistoryUrl: 'https://gemini.google.com/share/c8f2910a34b2',
      syllabusNotesSnippet: 'NCERT Class 10 Science & Mathematics Syllabus 2025-26. Focus areas: Light Reflection, Metals & Non-metals, Arithmetic Progressions.',
      preferredTools: ['Desmos Grapher', 'Interactive Ray Simulator', 'Mermaid Concept Maps'],
    },
    inferredKeywords: [
      '#CBSE_Class10',
      '#NCERT_Aligned',
      '#Socratic_Guidance',
      '#Visual_Desmos_Grapher',
      '#Trigonometry_Weakness',
      '#JEE_Foundation',
    ],
    systemPromptPreview: `[SYSTEM CONTEXT - EILA COORDINATOR]
Student: Aarav Sharma (Class 10 CBSE - Verified via DPS RK Puram / SheerID)
Routing Rules:
- Primary Coordinator: Route Math to MathSpecialist, Physics to ScienceSpecialist.
- Teaching Style: Socratic questioning mode enabled. Do NOT dump raw answers immediately; ask guiding questions first.
- Visual Mode: Trigger interactive Desmos widget for trigonometric & quadratic equations.
- Verified Fact Context: Student scored 94% in Grade 9 Math. Build upon verified quadratic factoring prerequisites.`,
  },
  college: {
    id: 'demo-college-priya',
    role: 'college',
    name: 'Priya Patel',
    age: 21,
    gradeOrDegree: 'B.Tech Computer Science (3rd Year)',
    institution: 'Indian Institute of Technology (IIT) Bombay',
    instituteVerified: true,
    sheerIdVerificationId: 'SH-IITB-2026-9932',
    claimedVsVerified: {
      verifiedGpaOrScore: 'Verified CGPA: 8.9 / 10.0',
      verifiedEnrollmentYear: 'Enrolled Aug 2023 (Expected Grad May 2027)',
      verifiedPrerequisites: ['Linear Algebra (CS201)', 'Data Structures & Algos (CS204)', 'Probability Theory'],
      claimedGoals: 'Master Machine Learning Algorithms & Neural Network Math from scratch',
    },
    primaryInterests: ['Deep Learning', 'Graph Neural Networks', 'Distributed Systems', 'Python & PyTorch'],
    weakOrComplexTopics: ['Backpropagation Gradient Calculus', 'Eigenvalue Decomposition in SVD', 'Dynamic Programming Optimization'],
    sliders: {
      rigorAndDepth: 4, // Formal mathematical proofs & LaTeX equations
      teachingStyle: 3, // Balanced: Explain intuition then show exact derivation
      visualVsText: 4,  // Code Sandboxes + Python PyTorch Snippets + Math Graphs
      challengePace: 4, // Fast pace with tough algorithmic edge cases
    },
    externalIntegrations: {
      chatGptOrGeminiHistoryUrl: 'https://chatgpt.com/share/678910ab-cd12-ef34',
      syllabusNotesSnippet: 'IIT Bombay CS302 Machine Learning Syllabus: Matrix Calculus, Convex Optimization, Loss Surfaces, GNN Embeddings.',
      preferredTools: ['Python Code Sandbox', 'PyTorch Tensor Visualizer', 'LaTeX Equation Renderer'],
    },
    inferredKeywords: [
      '#IIT_Bombay_Undergrad',
      '#Machine_Learning',
      '#PyTorch_Code_Sandbox',
      '#Linear_Algebra_Rigor',
      '#Backprop_Gradient_Calculus',
      '#SVD_Matrix_Decomposition',
    ],
    systemPromptPreview: `[SYSTEM CONTEXT - EILA COORDINATOR]
Student: Priya Patel (3rd Year B.Tech CS - Verified via IIT Bombay SheerID)
Routing Rules:
- Primary Coordinator: Route Calculus & Tensor math to MathSpecialist, Neural Net architecture to CSSpecialist.
- Rigor Level: High (Level 4/5). Provide rigorous linear algebra proofs in LaTeX format alongside Python code.
- Interactive Tools: Render PyTorch tensor shape visualizers and executable code sandboxes.
- Verified Fact Context: Enrolled in CS302 ML. Prerequisites in Linear Algebra CS201 verified.`,
  },
  researcher: {
    id: 'demo-researcher-vikram',
    role: 'researcher',
    name: 'Dr. Vikram Sen',
    age: 28,
    gradeOrDegree: 'PhD Scholar / Postdoc Fellow',
    institution: 'Indian Institute of Science (IISc) Bangalore',
    instituteVerified: true,
    sheerIdVerificationId: 'SH-IISC-2026-1102',
    claimedVsVerified: {
      verifiedGpaOrScore: 'Verified PhD Candidate, Dept of Computational Data Sciences',
      verifiedEnrollmentYear: 'Fellowship Active (Grant Ref #DST-SERB-2024)',
      verifiedPrerequisites: ['Quantum Mechanics II', 'Advanced Real Analysis', 'Information Theory'],
      claimedGoals: 'Publishing paper on Neuro-Symbolic AI & Quantum Error Mitigation',
    },
    primaryInterests: ['Neuro-Symbolic AI', 'Quantum Computing Circuits', 'Category Theory in CS', 'Formal Verification'],
    weakOrComplexTopics: ['Fault-Tolerant Quantum Surface Codes', 'Non-Abelian Anyon Braiding', 'Theorem Proving with Lean 4'],
    sliders: {
      rigorAndDepth: 5, // Maximum formal mathematical & research paper rigor
      teachingStyle: 5, // Direct academic synthesis with arXiv citations & proofs
      visualVsText: 2,  // Symbolic LaTeX notation, formal proof trees & paper abstracts
      challengePace: 5, // Research-level frontier challenge
    },
    externalIntegrations: {
      chatGptOrGeminiHistoryUrl: 'https://arxiv.org/abs/2401.09912',
      syllabusNotesSnippet: 'IISc PhD Research Notes: Topological Quantum Computation, Surface Code Thresholds, Symbolic Knowledge Graph Integration.',
      preferredTools: ['arXiv Literature Search Agent', 'Lean 4 Formal Proof Verifier', 'Quantum Circuit Simulator'],
    },
    inferredKeywords: [
      '#IISc_PhD_Researcher',
      '#Quantum_Computing',
      '#Neuro_Symbolic_AI',
      '#arXiv_Search_Routing',
      '#Lean4_Formal_Proof',
      '#Maximum_Academic_Rigor',
    ],
    systemPromptPreview: `[SYSTEM CONTEXT - EILA COORDINATOR]
Student: Dr. Vikram Sen (PhD Researcher - Verified via IISc Bangalore SheerID)
Routing Rules:
- Primary Coordinator: Delegate literature queries to ResearchAgent, quantum circuits to PhysicsSpecialist.
- Rigor Level: Frontier Research (Level 5/5). Cite peer-reviewed arXiv & IEEE papers with DOIs.
- Tool Integration: Activate arXiv API lookup and Lean 4 formal proof verifier.
- Verified Fact Context: IISc CDS PhD Candidate. Direct synthesis without basic explanations.`,
  },
};
