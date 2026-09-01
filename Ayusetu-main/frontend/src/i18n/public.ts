import type { Lang } from './languages';
import type { PublicCopy } from './copyTypes';
import { OFFICIAL_COPY } from './official';

export type { PublicCopy };

const EN: PublicCopy = {
  nav: {
    how: 'How it works',
    forYou: 'For you',
    features: 'Features',
    about: 'About',
    workspaces: 'Workspaces',
    login: 'Login',
    getStarted: 'Get started',
    openWorkspace: 'Open workspace',
  },
  footer: {
    blurb: 'The AYUSH skill bridge — verified profiles, AI matching, internships and placements.',
    platform: 'Platform',
    getIn: 'Get in',
    aligned: 'Aligned with',
    login: 'Login',
    register: 'Create account',
    portfolio: 'Sample portfolio',
    about: 'About matching',
    ministry: 'Ministry of AYUSH',
    institutes: 'NIA · AIIA · MDNIY · NIH · NIS',
    consent: 'DPDP consent & verified credentials',
    copyright: 'Skill mapping · internships · placement',
    sih: 'Smart India Hackathon — Ministry of AYUSH',
  },
  hero: {
    badge: 'AYUSH skill bridge',
    title: 'Match real clinical skills to the right internship.',
    body: 'AyuSetu connects AYUSH students, hospitals and institutes — with verified profiles, AI matching and a clear placement pipeline.',
    getStarted: 'Get started',
    how: 'See how it works',
    consent: 'DPDP consent',
    verified: 'Verified credentials',
  },
  stats: [
    { n: '48k+', l: 'Students mapped' },
    { n: '1,042', l: 'Active internships' },
    { n: '186', l: 'Institutes onboarded' },
    { n: '5', l: 'AYUSH streams' },
  ],
  partners: { kicker: 'National AYUSH network', title: 'Built alongside the institutes that train and hire' },
  audience: {
    kicker: 'Who it is for',
    title: 'One bridge, three starting points',
    subtitle: 'Pick your path. The same verified skill map sits underneath.',
    tabs: [
      {
        id: 'students',
        label: 'Students',
        heading: 'Prove clinical hours. Get ranked internships.',
        points: [
          'Assessment scores write into a private skill map',
          'Apply with DPDP consent — hospitals see verified items first',
          'Track apply → interview → offer in one pipeline',
        ],
      },
      {
        id: 'hospitals',
        label: 'Hospitals',
        heading: 'Post a need. See pre-assessed AYUSH talent.',
        points: [
          'Tag required skills from a shared ontology',
          'Rank applicants by match, not only CV keywords',
          'Move shortlist → interview → offer without spreadsheets',
        ],
      },
      {
        id: 'institutes',
        label: 'Institutes',
        heading: 'Verify credentials. Watch placement in real time.',
        points: [
          'Attest internships and certificates so industry can trust them',
          'See skill gaps vs live demand for curriculum review',
          'Export placement snapshots for IQAC and the ministry',
        ],
      },
    ],
  },
  how: {
    title: 'How it works',
    subtitle: 'One loop from profile to placement.',
    steps: [
      { t: 'Profile', b: 'Build a verified AYUSH skill record.' },
      { t: 'Posting', b: 'Industry lists internships and jobs.' },
      { t: 'Match', b: 'AI ranks fit against requirements.' },
      { t: 'Apply', b: 'Consent, apply, and track status.' },
      { t: 'Offer', b: 'Interview, join, and update placement.' },
    ],
  },
  features: {
    title: 'Built for the full AYUSH pathway',
    subtitle: 'Students, hospitals, institutes and the ministry on one map.',
    items: [
      { t: 'Student profiles', b: 'Verified academics, certificates and AYUSH clinical skills in one place.' },
      { t: 'Industry portal', b: 'Hospitals and wellness centres post real internship and hiring needs.' },
      { t: 'AI skill mapping', b: 'Match scores against requirements, with gaps shown clearly.' },
      { t: 'Placement tracker', b: 'Apply, shortlist, interview and confirm offers end to end.' },
      { t: 'Analytics', b: 'Skill-gap and placement reports for institutes and the ministry.' },
    ],
  },
  pathways: {
    title: 'From classroom to clinic, with proof.',
    body: 'Self-declared skills stay private until an institute verifies them. Verified hours, certificates and assessments drive match scores hospitals can trust.',
    points: [
      'Assessment results write into your skill map',
      'Internships ranked by gap-aware AI matching',
      'Public portfolio hides unverified items by default',
    ],
    sample: 'Sample skill map',
  },
  workspaces: { title: 'Open a workspace', subtitle: 'Choose a role, answer a few questions, then enter.', start: 'Start →' },
  modal: {
    kicker: 'Get started',
    choose: 'Choose your role',
    questions: 'A few questions',
    help: 'This helps AyuSetu open the right workspace.',
    then: 'Then we will ask a short set of questions.',
    back: 'Back',
    continue: 'Continue to workspace',
  },
  about: {
    kicker: 'About matching',
    title: 'How AyuSetu ranks a student against an opening',
    lead: 'Hospitals should not guess from a PDF. AyuSetu scores verified AYUSH skills against the posting, then shows the gap so training can catch up.',
    matchTitle: 'What goes into a match score',
    matchBody: 'Technical skill overlap is weighted highest. Soft skills, education stream, career interest, projects and location fill the rest. Unverified self-declared items do not inflate the public score.',
    matchPoints: [
      'Verified clinical hours and institute-attested certificates count first',
      'A gap on documentation or Nadi Pariksha is shown, not hidden',
      'DPDP consent is asked before a profile is shared with an organisation',
      'Placement status moves only when the student accepts an offer',
    ],
    whoTitle: 'Who uses the score',
    who: [
      { t: 'Students', b: 'See why an internship ranks 92% vs 69%, and which module closes the gap.' },
      { t: 'Hospitals', b: 'Shortlist by fit to Panchakarma, yoga therapy or pharmacy — not keyword stuffing.' },
      { t: 'Institutes', b: 'Spot cohort-wide gaps against live industry demand.' },
      { t: 'Ministry', b: 'Read a national snapshot of internships, jobs and verified credentials.' },
    ],
    trustTitle: 'Trust and consent',
    trustBody: 'Public portfolios hide pending items. Applications require explicit consent to share the verified layer with that hospital or wellness centre.',
  },
  roles: {
    student: { label: 'Student', hint: 'Match internships and track applications' },
    academician: { label: 'Faculty', hint: 'FDP, internships and research collabs' },
    industry: { label: 'Hospital', hint: 'Post requirements and rank applicants' },
    institution: { label: 'Institute', hint: 'Verify students and view placements' },
    admin: { label: 'Ministry of AYUSH', hint: 'National skill and placement insights' },
  },
};

export const COPY: Record<Lang, PublicCopy> = {
  en: EN,
  ...OFFICIAL_COPY,
};

export function getCopy(lang: Lang): PublicCopy {
  return COPY[lang] ?? EN;
}

export const PARTNERS = [
  { ab: 'NIA', name: 'National Institute of Ayurveda', city: 'Jaipur' },
  { ab: 'AIIA', name: 'All India Institute of Ayurveda', city: 'New Delhi' },
  { ab: 'MDNIY', name: 'Morarji Desai National Institute of Yoga', city: 'New Delhi' },
  { ab: 'NIH', name: 'National Institute of Homoeopathy', city: 'Kolkata' },
  { ab: 'NIS', name: 'National Institute of Siddha', city: 'Chennai' },
  { ab: 'NIUM', name: 'National Institute of Unani Medicine', city: 'Bengaluru' },
];
