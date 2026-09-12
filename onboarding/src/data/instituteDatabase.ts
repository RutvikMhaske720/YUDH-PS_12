export interface InstituteRecord {
  id: string;
  name: string;
  code: string;
  type: 'school' | 'university' | 'research';
  location: string;
  verifiedSyllabus: string[];
  sheerIdSupported: boolean;
  verifiedCourses: Array<{
    courseCode: string;
    courseName: string;
    prerequisites: string[];
  }>;
}

export const INSTITUTE_DATABASE: InstituteRecord[] = [
  {
    id: 'dps-rkp',
    name: 'Delhi Public School, R.K. Puram',
    code: 'DPS-RKP-DELHI',
    type: 'school',
    location: 'New Delhi, India',
    verifiedSyllabus: ['CBSE Class 9-12 Science', 'CBSE Class 9-12 Mathematics', 'JEE Foundation Track'],
    sheerIdSupported: true,
    verifiedCourses: [
      { courseCode: 'CBSE-10-SCI', courseName: 'Class 10 General Science (Physics, Chem, Bio)', prerequisites: ['Class 9 Science'] },
      { courseCode: 'CBSE-10-MATH', courseName: 'Class 10 Standard Mathematics', prerequisites: ['Class 9 Mathematics'] },
    ],
  },
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology (IIT) Bombay',
    code: 'IITB-MUMBAI',
    type: 'university',
    location: 'Mumbai, Maharashtra, India',
    verifiedSyllabus: ['B.Tech Computer Science & Engineering', 'B.Tech Electrical Eng', 'M.Tech AI'],
    sheerIdSupported: true,
    verifiedCourses: [
      { courseCode: 'CS201', courseName: 'Linear Algebra & Matrix Computation', prerequisites: ['Calculus II'] },
      { courseCode: 'CS302', courseName: 'Machine Learning & Pattern Recognition', prerequisites: ['CS201', 'Probability'] },
      { courseCode: 'CS310', courseName: 'Operating Systems & Distributed Architecture', prerequisites: ['Data Structures'] },
    ],
  },
  {
    id: 'iisc-bangalore',
    name: 'Indian Institute of Science (IISc) Bangalore',
    code: 'IISC-BLR',
    type: 'research',
    location: 'Bengaluru, Karnataka, India',
    verifiedSyllabus: ['PhD Computational Data Sciences', 'M.Tech Quantum Technology', 'BS Research'],
    sheerIdSupported: true,
    verifiedCourses: [
      { courseCode: 'DS301', courseName: 'Advanced Deep Learning & Neuro-Symbolic AI', prerequisites: ['Linear Algebra', 'Convex Optimization'] },
      { courseCode: 'QT502', courseName: 'Quantum Information Theory & Error Correction', prerequisites: ['Quantum Mechanics II'] },
    ],
  },
  {
    id: 'st-xaviers-mumbai',
    name: 'St. Xavier\'s College, Mumbai',
    code: 'XAV-MUMBAI',
    type: 'university',
    location: 'Mumbai, India',
    verifiedSyllabus: ['B.Sc Mathematics', 'B.Sc Physics', 'B.A. Economics'],
    sheerIdSupported: true,
    verifiedCourses: [
      { courseCode: 'MATH-301', courseName: 'Real Analysis & Differential Equations', prerequisites: ['Calculus I'] },
    ],
  },
  {
    id: 'stanford-univ',
    name: 'Stanford University',
    code: 'STANFORD-USA',
    type: 'university',
    location: 'California, USA',
    verifiedSyllabus: ['BS Computer Science', 'MS Artificial Intelligence', 'PhD Quantum Physics'],
    sheerIdSupported: true,
    verifiedCourses: [
      { courseCode: 'CS229', courseName: 'Machine Learning (Stanford CS229)', prerequisites: ['Multivariable Calculus', 'Linear Algebra'] },
    ],
  },
];
