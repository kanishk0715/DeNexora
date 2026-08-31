export const DEMO_OPPORTUNITIES = [
  {
    _id: 'opp-1',
    title: 'Panchakarma Clinical Intern',
    type: 'internship',
    organization: 'All India Institute of Ayurveda',
    location: 'New Delhi',
    workMode: 'onsite',
    duration: '6 months',
    stipend: '₹18,000 / month',
    matchScore: 92,
    numberOfPositions: 12,
    applicantCount: 48,
    applicationDeadline: '2026-10-15',
    requiredSkills: [
      { name: 'Panchakarma protocols', requiredScore: 75 },
      { name: 'Nadi Pariksha', requiredScore: 60 },
      { name: 'Clinical documentation', requiredScore: 65 },
    ],
    description:
      'Hands-on internship in Panchakarma theatres and OPD under AIIA consultants. Includes case documentation aligned to CCRAS internship guidelines.',
  },
  {
    _id: 'opp-2',
    title: 'Yoga Therapy Assistant',
    type: 'internship',
    organization: 'Morarji Desai National Institute of Yoga',
    location: 'New Delhi',
    workMode: 'hybrid',
    duration: '3 months',
    stipend: '₹12,000 / month',
    matchScore: 88,
    numberOfPositions: 8,
    applicantCount: 31,
    applicationDeadline: '2026-09-30',
    requiredSkills: [
      { name: 'Yoga therapy', requiredScore: 80 },
      { name: 'Patient counselling', requiredScore: 55 },
    ],
    description: 'Support therapeutic yoga modules for NCD clinics and document outcomes for ministry skill mapping.',
  },
  {
    _id: 'opp-3',
    title: 'Unani Pharmacy Trainee',
    type: 'job',
    organization: 'CCRUM — Central Council for Research in Unani Medicine',
    location: 'Hyderabad',
    workMode: 'onsite',
    duration: 'Full-time',
    stipend: '₹28,000 / month',
    matchScore: 74,
    numberOfPositions: 4,
    applicantCount: 19,
    applicationDeadline: '2026-11-01',
    requiredSkills: [
      { name: 'Unani pharmacy', requiredScore: 70 },
      { name: 'GMP documentation', requiredScore: 60 },
    ],
    description: 'Entry-level role in classical Unani formulation units with GMP and batch-record training.',
  },
  {
    _id: 'opp-4',
    title: 'Homoeopathy OPD Intern',
    type: 'internship',
    organization: 'National Institute of Homoeopathy',
    location: 'Kolkata',
    workMode: 'onsite',
    duration: '4 months',
    stipend: '₹10,000 / month',
    matchScore: 81,
    numberOfPositions: 16,
    applicantCount: 22,
    applicationDeadline: '2026-10-05',
    requiredSkills: [
      { name: 'Case taking', requiredScore: 70 },
      { name: 'Repertory', requiredScore: 65 },
    ],
    description: 'OPD case taking, repertorisation support and community outreach camps.',
  },
  {
    _id: 'opp-5',
    title: 'Siddha Clinical Observer',
    type: 'internship',
    organization: 'National Institute of Siddha',
    location: 'Chennai',
    workMode: 'onsite',
    duration: '3 months',
    stipend: '₹11,000 / month',
    matchScore: 69,
    numberOfPositions: 6,
    applicantCount: 14,
    applicationDeadline: '2026-09-28',
    requiredSkills: [
      { name: 'Siddha diagnostics', requiredScore: 68 },
      { name: 'Herbal pharmacology', requiredScore: 55 },
    ],
    description: 'Observership across NIS OPDs with emphasis on Envagai Thervu and herbal pharmacology.',
  },
  {
    _id: 'opp-6',
    title: 'Wellness Centre Therapist',
    type: 'job',
    organization: 'Kerala Ayurveda Ltd.',
    location: 'Kochi',
    workMode: 'onsite',
    duration: 'Full-time',
    stipend: '₹32,000 / month',
    matchScore: 85,
    numberOfPositions: 5,
    applicantCount: 40,
    applicationDeadline: '2026-10-20',
    requiredSkills: [
      { name: 'Abhyanga', requiredScore: 75 },
      { name: 'Panchakarma protocols', requiredScore: 70 },
      { name: 'Guest relations', requiredScore: 50 },
    ],
    description: 'Industry posting at a licensed AYUSH wellness centre. Verified clinical hours count toward placement.',
  },
];

export const DEMO_SKILLS = [
  { name: 'Panchakarma protocols', score: 78, benchmark: 75, verified: true },
  { name: 'Yoga therapy', score: 88, benchmark: 70, verified: true },
  { name: 'Nadi Pariksha', score: 62, benchmark: 70, verified: false },
  { name: 'Dravyaguna', score: 71, benchmark: 68, verified: true },
  { name: 'Clinical documentation', score: 54, benchmark: 72, verified: false },
  { name: 'Patient counselling', score: 80, benchmark: 65, verified: true },
];

export const DEMO_APPLICATIONS = [
  {
    _id: 'app-1',
    title: 'Panchakarma Clinical Intern',
    organization: 'AIIA, New Delhi',
    matchScore: 92,
    status: 'shortlisted',
    appliedAt: '2026-08-12',
    history: ['applied', 'under_review', 'shortlisted'],
  },
  {
    _id: 'app-2',
    title: 'Yoga Therapy Assistant',
    organization: 'MDNIY',
    matchScore: 88,
    status: 'interview',
    appliedAt: '2026-08-18',
    history: ['applied', 'under_review', 'shortlisted', 'interview'],
  },
  {
    _id: 'app-3',
    title: 'Wellness Centre Therapist',
    organization: 'Kerala Ayurveda Ltd.',
    matchScore: 85,
    status: 'applied',
    appliedAt: '2026-08-24',
    history: ['applied'],
  },
];

export const DEMO_INDUSTRY_APPLICANTS = [
  { name: 'Ananya Sharma', college: 'NIA Jaipur', match: 92, skills: 'Panchakarma, Yoga therapy', status: 'shortlisted' },
  { name: 'Rahul Menon', college: 'AIIA Delhi', match: 86, skills: 'Abhyanga, Documentation', status: 'interview' },
  { name: 'Fatima Noor', college: 'NIUM Bengaluru', match: 81, skills: 'Unani pharmacy', status: 'under_review' },
  { name: 'Karthik Selvam', college: 'NIS Chennai', match: 74, skills: 'Siddha diagnostics', status: 'applied' },
];

export const DEMO_STUDENTS = [
  { name: 'Ananya Sharma', stream: 'BAMS', year: 2026, readiness: 84, status: 'Shortlisted' },
  { name: 'Priya Nair', stream: 'BNYS', year: 2026, readiness: 79, status: 'Placed' },
  { name: 'Imran Qureshi', stream: 'BUMS', year: 2027, readiness: 71, status: 'Applied' },
  { name: 'Meera Iyer', stream: 'BSMS', year: 2026, readiness: 68, status: 'Gap: documentation' },
  { name: 'Arjun Patel', stream: 'BHMS', year: 2027, readiness: 73, status: 'Interview' },
];

export const SKILL_DEMAND = [
  { skill: 'Panchakarma', demand: 142, supply: 96 },
  { skill: 'Yoga therapy', demand: 118, supply: 130 },
  { skill: 'Clinical documentation', demand: 121, supply: 54 },
  { skill: 'Unani pharmacy', demand: 67, supply: 41 },
  { skill: 'Siddha diagnostics', demand: 38, supply: 29 },
  { skill: 'Homoeopathy repertory', demand: 52, supply: 48 },
];

export const STATE_PLACEMENTS = [
  { state: 'Kerala', internships: 186, jobs: 94 },
  { state: 'Karnataka', internships: 142, jobs: 71 },
  { state: 'Maharashtra', internships: 128, jobs: 63 },
  { state: 'Delhi', internships: 121, jobs: 88 },
  { state: 'Tamil Nadu', internships: 109, jobs: 52 },
  { state: 'Rajasthan', internships: 87, jobs: 41 },
  { state: 'West Bengal', internships: 74, jobs: 33 },
  { state: 'Uttar Pradesh', internships: 96, jobs: 44 },
];

export const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    text: 'Which of the following is a Poorva Karma of Panchakarma?',
    options: ['Vamana', 'Snehana', 'Virechana', 'Basti'],
  },
  {
    id: 'q2',
    text: 'Nadi Pariksha primarily assesses which clinical dimension?',
    options: ['Dosha imbalance through pulse', 'Only blood pressure', 'Bone density', 'Visual acuity'],
  },
  {
    id: 'q3',
    text: 'A Yoga therapy intern in an NCD clinic should document:',
    options: ['Asana names only', 'Baseline vitals, protocol and outcomes', 'Billing codes only', 'Staff attendance'],
  },
  {
    id: 'q4',
    text: 'CCRAS short-term training typically requires:',
    options: ['Unsupervised practice', 'Guideship and documented exposure', 'No case records', 'Only online MCQs'],
  },
  {
    id: 'q5',
    text: 'Clinical documentation for AYUSH internships should include:',
    options: ['Social media posts', 'Consent, diagnosis, procedures and follow-up', 'Password lists', 'Unverified certificates'],
  },
];
