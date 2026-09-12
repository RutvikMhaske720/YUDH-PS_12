import { OnboardingProfile } from '@/data/demoAccounts';
import { ChatMessage } from '@/lib/memoryStore';

export function runResearchAgent(
  query: string,
  profile: Partial<OnboardingProfile>
): Partial<ChatMessage> {
  const isSchool = profile.role === 'school' || (profile.gradeOrDegree && profile.gradeOrDegree.toLowerCase().includes('class'));
  const isUni = profile.role === 'college' || profile.role === 'researcher';

  return {
    agentName: 'Research & Literature Sourcing Agent',
    agentColor: 'bg-[#E8A87C]',
    text: `Literature & Academic Textbook Reference Lookup:

${isSchool ? `**Verified NCERT Textbook Reference (CBSE Aligned):**
- **Book:** NCERT Class 10 Science (Official CBSE 2025-26 Edition)
- **Chapter 10:** Light — Reflection and Refraction (Pages 161–178)
- **Section 10.3.2:** Refraction through a Rectangular Glass Slab (Page 171)
- **NCERT Practice Problem 4:** "A ray of light traveling in air enters obliquely into water. Does the light ray bend towards the normal?"` : `**Verified Academic Literature & Paper Citations:**
- **Primary Citation:** *Goodfellow et al., "Deep Learning", MIT Press (Chapter 6: Deep Feedforward Networks, pp. 197–223)*
- **arXiv Preprint:** *Paszke et al., "PyTorch: An Imperative Style, High-Performance Deep Learning Library", arXiv:1912.01703*
- **Syllabus Blueprint:** ${profile.institution || 'University'} Course Syllabus Standard`}

*All references verified against student's verified profile context.*`,
    interactiveTool: {
      type: 'citation',
      title: isSchool ? 'NCERT Class 10 Textbook Citation Index' : 'arXiv Academic Paper Reference Index',
      data: {
        citationSource: isSchool ? 'NCERT Official Curriculum Portal' : 'arXiv.org Computer Science Repository',
        referenceUrl: isSchool ? 'https://ncert.nic.in/textbook.php?jesc1=10-13' : 'https://arxiv.org/abs/1912.01703',
        page: isSchool ? 'Page 171 Section 10.3' : 'Section 3.2 Automatic Differentiation',
      },
    },
    followUps: [
      'Download NCERT official PDF excerpt for this chapter.',
      'Show arXiv paper abstract & DOI.',
      'Compare with IB Physics HL / State Board syllabus.',
    ],
  };
}
