import type { Lang } from './languages';
import { OFFICIAL_CHATBOT } from './chatbotOfficial';

export type ChatTopic =
  | 'bams'
  | 'internship'
  | 'job'
  | 'skill'
  | 'panchakarma'
  | 'research'
  | 'salary'
  | 'aiia'
  | 'ministry'
  | 'fdp'
  | 'portfolio'
  | 'hello'
  | 'help'
  | 'fallback';

export type ChatbotCopy = {
  title: string;
  subtitle: string;
  greeting: string;
  placeholder: string;
  openAria: string;
  closeAria: string;
  sendAria: string;
  langAria: string;
  suggestions: string[];
  replies: Record<ChatTopic, string>;
};

const RTL = new Set<Lang>(['ur', 'ks', 'sd']);

export function isChatRtl(lang: Lang) {
  return RTL.has(lang);
}

const EN: ChatbotCopy = {
  title: 'AYUSH assistant',
  subtitle: '22 official languages of India',
  greeting:
    'Namaste! I am the AyuSetu AYUSH assistant. Ask about BAMS, internships, Panchakarma, skills, careers or Ministry of AYUSH schemes.',
  placeholder: 'Ask in your language…',
  openAria: 'Open AYUSH assistant',
  closeAria: 'Close chat',
  sendAria: 'Send message',
  langAria: 'Chat language',
  suggestions: ['BAMS course', 'Internships', 'Panchakarma', 'Skill assessment'],
  replies: {
    bams: 'BAMS (Bachelor of Ayurvedic Medicine and Surgery) is a 5.5-year programme including internship. Students study Ayurveda with modern medical sciences. After BAMS you can pursue MD/MS in Ayurveda or practise.',
    internship:
      'AYUSH internships include clinical rotations in Panchakarma, Kayachikitsa, Shalya Tantra and specialty departments. AyuSetu connects students with AIIA, state hospitals and wellness centres.',
    job: 'AYUSH careers include government hospitals, private clinics, wellness centres, pharmacies, research institutes, teaching and Panchakarma units. Open Opportunities in your workspace for current posts.',
    skill: 'Skill assessment maps Ayurvedic principles, clinical diagnosis, Panchakarma and medicinal plants. Complete it to get a private skill map and ranked internship matches.',
    panchakarma:
      'Panchakarma is Ayurveda’s five-fold detox: Vamana, Virechana, Basti, Nasya and Raktamokshana. Hospitals hire trained therapists — supervised clinical hours matter.',
    research:
      'Research paths include MD/MS, PhD, CCRAS fellowships and joint trials. Focus areas: drug development, clinical evidence and traditional knowledge documentation.',
    salary:
      'Typical ranges: ₹3–8 lakh/year for government freshers, ₹4–12 lakh in private practice, and higher for experienced Panchakarma or Ksharsutra specialists. Figures vary by state and posting.',
    aiia: 'All India Institute of Ayurveda (AIIA), New Delhi, offers BAMS, MD/MS, PhD and specialised training under the Ministry of AYUSH, with strong clinical and research exposure.',
    ministry:
      'The Ministry of AYUSH supports education, research and practice across Ayurveda, Yoga, Unani, Siddha and Homoeopathy. In the student workspace open Exams & schemes for AIAPGET, AACCC counselling, NAM, CCRAS SPARK and National Scholarship Portal links.',
    fdp: 'Faculty Development Programmes help AYUSH teachers strengthen pedagogy, research methods and clinical teaching. Open the Faculty workspace for upcoming FDPs.',
    portfolio:
      'Your AyuSetu portfolio shows verified skills, certificates and clinical hours. Unverified items stay private until an institute attests them — that is what hospitals rank on.',
    hello: 'Namaste! How can I help with AYUSH education or careers today?',
    help: 'I can help with BAMS, internships, jobs, skill assessment, Panchakarma, faculty programmes, portfolios, exams (AIAPGET) and Ministry of AYUSH schemes. Ask in any of India’s 22 official languages, or English.',
    fallback:
      'I can help with AYUSH education and careers. Try: BAMS course, internships, Panchakarma, skill assessment, or exams and government schemes.',
  },
};

export const CHATBOT: Record<Lang, ChatbotCopy> = {
  en: EN,
  ...OFFICIAL_CHATBOT,
};

export function getChatbotCopy(lang: Lang): ChatbotCopy {
  return CHATBOT[lang] ?? EN;
}

/** Topic keywords in English plus common Eighth Schedule forms so intent works across scripts. */
const KEYWORDS: Record<Exclude<ChatTopic, 'fallback'>, string[]> = {
  panchakarma: [
    'panchakarma',
    'vamana',
    'virechana',
    'basti',
    'nasya',
    'पंचकर्म',
    'পঞ্চকর্ম',
    'પંચકર્મ',
    'பஞ்சகர்மா',
    'పంచకర్మ',
    'ಪಂಚಕರ್ಮ',
    'പഞ്ചകർമ്മ',
    'ପଞ୍ଚକର୍ମ',
    'ਪੰਚਕਰਮ',
    'پنچکرم',
  ],
  salary: ['salary', 'pay', 'income', 'वेतन', 'तनख्वाह', 'சம்பளம்', 'జీతం', 'ವೇತನ', 'ശമ്പളം', 'પગાર', 'বেতন', 'تنخواہ'],
  research: ['research', 'phd', 'ccras', 'शोध', 'পিএইচডি', 'ஆராய்ச்சி', 'పరిశోధన', 'ಸಂಶೋಧನೆ', 'ഗവേഷണം', 'સંશોધન', 'تحقیق'],
  internship: [
    'internship',
    'intern',
    'clinical training',
    'इंटर्नशिप',
    'ইন্টার্ন',
    'ઇન્ટર્નશિપ',
    'இன்டர்ன்',
    'ఇంటర్న్',
    'ಇಂಟರ್ನ್',
    'ഇന്റേൺ',
    'ଇଣ୍ଟର୍ନ',
    'ਇੰਟਰਨਸ਼ਿਪ',
    'انٹرن شپ',
  ],
  aiia: ['aiia', 'all india institute'],
  fdp: ['fdp', 'faculty development', 'फैकल्टी', 'ஆசிரியர்', 'అధ్యాపక', 'ಅಧ್ಯಾಪಕ', 'അധ്യാപക'],
  bams: [
    'bams',
    'degree',
    'course',
    'बीएएमएस',
    'ডিগ্রি',
    'पाठ्यक्रम',
    'பாடநெறி',
    'కోర్సు',
    'ಕೋರ್ಸ್',
    'കോഴ്‌സ്',
    'અભ્યાસક્રમ',
  ],
  skill: ['skill', 'assessment', 'evaluate', 'कौशल', 'आकलन', 'দক্ষতা', 'திறன்', 'నైపుణ్యం', 'ಕೌಶಲ', 'കഴിവ്', 'કૌશલ્ય', 'مہارت'],
  portfolio: ['portfolio', 'profile', 'पोर्टफोलियो', 'प्रोफ़ाइल', 'প্রোফাইল', 'சுயவிவரம்', 'ప్రొఫైల్', 'پروفائل'],
  ministry: [
    'ministry',
    'ayush',
    'आयुष',
    'मंत्रालय',
    'আয়ুষ',
    'ஆயுஷ்',
    'ఆయుష్',
    'ಆಯುಷ್',
    'ആയുഷ്',
    'આયુષ',
    'آیوش',
    'aiapget',
    'aaccc',
    'namayush',
    'scheme',
    'scholarship',
    'nmpb',
    'ycb',
  ],
  job: ['job', 'career', 'opportunity', 'नौकरी', 'कैरियर', 'চাকরি', 'வேலை', 'ఉద్యోగం', 'ಉದ್ಯೋಗ', 'ജോലി', 'નોકરી', 'ਨੌਕਰੀ', 'نوکری'],
  hello: ['hello', 'hi', 'namaste', 'नमस्ते', 'নমস্কার', 'வணக்கம்', 'నమస్కారం', 'ನಮಸ್ಕಾರ', 'നമസ്കാരം', 'નમસ્તે', 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'السلام'],
  help: ['help', 'what can you do', 'मदद', 'সাহায্য', 'உதவி', 'సహాయం', 'ಸಹಾಯ', 'സഹായം', 'મદદ', 'مدد'],
};

const TOPIC_ORDER: Exclude<ChatTopic, 'fallback'>[] = [
  'panchakarma',
  'salary',
  'research',
  'internship',
  'aiia',
  'fdp',
  'bams',
  'skill',
  'portfolio',
  'ministry',
  'job',
  'hello',
  'help',
];

export function detectChatTopic(question: string): ChatTopic {
  const lower = question.toLowerCase();
  for (const topic of TOPIC_ORDER) {
    if (KEYWORDS[topic].some(k => lower.includes(k.toLowerCase()))) return topic;
  }
  return 'fallback';
}
