import type { Lang } from '../contexts/LocaleContext';

export const COPY: Record<
  Lang,
  {
    nav: Record<string, string>;
    footer: Record<string, string>;
    hero: Record<string, string>;
    stats: { n: string; l: string }[];
    partners: { kicker: string; title: string };
    audience: {
      kicker: string;
      title: string;
      subtitle: string;
      tabs: { id: string; label: string; heading: string; points: string[] }[];
    };
    how: { title: string; subtitle: string; steps: { t: string; b: string }[] };
    features: { title: string; subtitle: string; items: { t: string; b: string }[] };
    pathways: { title: string; body: string; points: string[]; sample: string };
    workspaces: { title: string; subtitle: string; start: string };
    modal: { kicker: string; choose: string; questions: string; help: string; then: string; back: string; continue: string };
    about: {
      kicker: string;
      title: string;
      lead: string;
      matchTitle: string;
      matchBody: string;
      matchPoints: string[];
      whoTitle: string;
      who: { t: string; b: string }[];
      trustTitle: string;
      trustBody: string;
    };
  }
> = {
  en: {
    nav: {
      home: 'Home',
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
  },
  hi: {
    nav: {
      home: 'होम',
      how: 'कैसे काम करता है',
      forYou: 'आपके लिए',
      features: 'विशेषताएँ',
      about: 'परिचय',
      workspaces: 'कार्यक्षेत्र',
      login: 'लॉगिन',
      getStarted: 'शुरू करें',
      openWorkspace: 'कार्यक्षेत्र खोलें',
    },
    footer: {
      blurb: 'आयुष स्किल ब्रिज — सत्यापित प्रोफ़ाइल, एआई मैचिंग, इंटर्नशिप और प्लेसमेंट।',
      platform: 'प्लेटफ़ॉर्म',
      getIn: 'प्रवेश',
      aligned: 'संरेखित',
      login: 'लॉगिन',
      register: 'खाता बनाएँ',
      portfolio: 'नमूना पोर्टफोलियो',
      about: 'मैचिंग के बारे में',
      ministry: 'आयुष मंत्रालय',
      institutes: 'एनआईए · एआईआईए · एमडीएनआईवाई · एनआईएच · एनआईएस',
      consent: 'डीपीडीपी सहमति और सत्यापित प्रमाण',
      copyright: 'स्किल मैपिंग · इंटर्नशिप · प्लेसमेंट',
      sih: 'स्मार्ट इंडिया हैकाथॉन — आयुष मंत्रालय',
    },
    hero: {
      badge: 'आयुष स्किल ब्रिज',
      title: 'वास्तविक नैदानिक कौशल को सही इंटर्नशिप से जोड़ें।',
      body: 'आयुसेतु आयुष विद्यार्थियों, अस्पतालों और संस्थानों को जोड़ता है — सत्यापित प्रोफ़ाइल, एआई मैचिंग और स्पष्ट प्लेसमेंट पाइपलाइन के साथ।',
      getStarted: 'शुरू करें',
      how: 'कैसे काम करता है देखें',
      consent: 'डीपीडीपी सहमति',
      verified: 'सत्यापित प्रमाण',
    },
    stats: [
      { n: '48k+', l: 'मैप किए गए विद्यार्थी' },
      { n: '1,042', l: 'सक्रिय इंटर्नशिप' },
      { n: '186', l: 'जुड़े संस्थान' },
      { n: '5', l: 'आयुष धाराएँ' },
    ],
    partners: { kicker: 'राष्ट्रीय आयुष नेटवर्क', title: 'उन्हीं संस्थानों के साथ जो प्रशिक्षण और नियुक्ति करते हैं' },
    audience: {
      kicker: 'किसके लिए',
      title: 'एक सेतु, तीन शुरुआत',
      subtitle: 'अपना मार्ग चुनें। नीचे वही सत्यापित स्किल मैप है।',
      tabs: [
        {
          id: 'students',
          label: 'विद्यार्थी',
          heading: 'नैदानिक घंटे सिद्ध करें। रैंक की गई इंटर्नशिप पाएँ।',
          points: [
            'आकलन अंक निजी स्किल मैप में लिखे जाते हैं',
            'डीपीडीपी सहमति से आवेदन — अस्पताल पहले सत्यापित वस्तुएँ देखते हैं',
            'आवेदन → साक्षात्कार → ऑफ़र एक ही पाइपलाइन में',
          ],
        },
        {
          id: 'hospitals',
          label: 'अस्पताल',
          heading: 'आवश्यकता पोस्ट करें। पूर्व-आकलित आयुष प्रतिभा देखें।',
          points: [
            'साझा ऑन्टोलॉजी से आवश्यक कौशल टैग करें',
            'केवल सीवी शब्दों से नहीं, मैच से आवेदक रैंक करें',
            'शॉर्टलिस्ट → साक्षात्कार → ऑफ़र बिना स्प्रेडशीट के',
          ],
        },
        {
          id: 'institutes',
          label: 'संस्थान',
          heading: 'प्रमाण सत्यापित करें। प्लेसमेंट लाइव देखें।',
          points: [
            'इंटर्नशिप और प्रमाणपत्र सत्यापित करें ताकि उद्योग विश्वास करे',
            'पाठ्यक्रम समीक्षा के लिए लाइव माँग बनाम स्किल गैप देखें',
            'आईक्यूएसी और मंत्रालय के लिए प्लेसमेंट स्नैपशॉट निर्यात करें',
          ],
        },
      ],
    },
    how: {
      title: 'कैसे काम करता है',
      subtitle: 'प्रोफ़ाइल से प्लेसमेंट तक एक लूप।',
      steps: [
        { t: 'प्रोफ़ाइल', b: 'सत्यापित आयुष स्किल रिकॉर्ड बनाएँ।' },
        { t: 'पोस्टिंग', b: 'उद्योग इंटर्नशिप और नौकरियाँ सूचीबद्ध करता है।' },
        { t: 'मैच', b: 'एआई आवश्यकताओं के विरुद्ध फिट रैंक करता है।' },
        { t: 'आवेदन', b: 'सहमति, आवेदन और स्थिति ट्रैक करें।' },
        { t: 'ऑफ़र', b: 'साक्षात्कार, जुड़ाव और प्लेसमेंट अपडेट।' },
      ],
    },
    features: {
      title: 'पूरी आयुष यात्रा के लिए',
      subtitle: 'विद्यार्थी, अस्पताल, संस्थान और मंत्रालय एक ही मानचित्र पर।',
      items: [
        { t: 'विद्यार्थी प्रोफ़ाइल', b: 'सत्यापित शिक्षा, प्रमाणपत्र और आयुष नैदानिक कौशल एक जगह।' },
        { t: 'उद्योग पोर्टल', b: 'अस्पताल और वेलनेस केंद्र वास्तविक इंटर्नशिप और भर्ती ज़रूरतें पोस्ट करते हैं।' },
        { t: 'एआई स्किल मैपिंग', b: 'आवश्यकताओं के विरुद्ध मैच स्कोर, गैप स्पष्ट दिखाए जाते हैं।' },
        { t: 'प्लेसमेंट ट्रैकर', b: 'आवेदन से ऑफ़र तक पूरी पाइपलाइन।' },
        { t: 'विश्लेषण', b: 'संस्थानों और मंत्रालय के लिए स्किल-गैप और प्लेसमेंट रिपोर्ट।' },
      ],
    },
    pathways: {
      title: 'कक्षा से क्लिनिक तक, प्रमाण के साथ।',
      body: 'स्वयं घोषित कौशल तब तक निजी रहते हैं जब तक संस्थान सत्यापित न करे। सत्यापित घंटे, प्रमाणपत्र और आकलन उन मैच स्कोर को चलाते हैं जिन पर अस्पताल विश्वास कर सकते हैं।',
      points: [
        'आकलन परिणाम आपके स्किल मैप में लिखे जाते हैं',
        'गैप-जागरूक एआई मैचिंग से इंटर्नशिप रैंक',
        'सार्वजनिक पोर्टफोलियो डिफ़ॉल्ट रूप से असत्यापित वस्तुएँ छुपाता है',
      ],
      sample: 'नमूना स्किल मैप',
    },
    workspaces: { title: 'कार्यक्षेत्र खोलें', subtitle: 'भूमिका चुनें, कुछ प्रश्न उत्तर दें, फिर प्रवेश करें।', start: 'शुरू →' },
    modal: {
      kicker: 'शुरू करें',
      choose: 'अपनी भूमिका चुनें',
      questions: 'कुछ प्रश्न',
      help: 'इससे आयुसेतु सही कार्यक्षेत्र खोलता है।',
      then: 'फिर हम संक्षिप्त प्रश्न पूछेंगे।',
      back: 'वापस',
      continue: 'कार्यक्षेत्र पर जाएँ',
    },
    about: {
      kicker: 'मैचिंग के बारे में',
      title: 'आयुसेतु विद्यार्थी को रिक्ति के विरुद्ध कैसे रैंक करता है',
      lead: 'अस्पतालों को पीडीएफ से अनुमान नहीं लगाना चाहिए। आयुसेतु सत्यापित आयुष कौशल को पोस्टिंग से स्कोर करता है, फिर गैप दिखाता है ताकि प्रशिक्षण पूरा हो सके।',
      matchTitle: 'मैच स्कोर में क्या जाता है',
      matchBody: 'तकनीकी कौशल का भार सबसे अधिक है। सॉफ्ट स्किल, शिक्षा धारा, रुचि, परियोजनाएँ और स्थान शेष भरते हैं। असत्यापित स्वयं-घोषित वस्तुएँ सार्वजनिक स्कोर नहीं बढ़ातीं।',
      matchPoints: [
        'सत्यापित नैदानिक घंटे और संस्थान-प्रमाणित प्रमाणपत्र पहले गिने जाते हैं',
        'दस्तावेज़ीकरण या नाड़ी परीक्षा का गैप छुपाया नहीं जाता',
        'प्रोफ़ाइल साझा करने से पहले उस संगठन के लिए डीपीडीपी सहमति माँगी जाती है',
        'प्लेसमेंट स्थिति तभी बदलती है जब विद्यार्थी ऑफ़र स्वीकार करे',
      ],
      whoTitle: 'स्कोर कौन उपयोग करता है',
      who: [
        { t: 'विद्यार्थी', b: 'देखें कोई इंटर्नशिप 92% बनाम 69% क्यों है, और कौन सा मॉड्यूल गैप बंद करता है।' },
        { t: 'अस्पताल', b: 'पंचकर्म, योग चिकित्सा या फार्मेसी के फिट से शॉर्टलिस्ट करें — कीवर्ड नहीं।' },
        { t: 'संस्थान', b: 'लाइव उद्योग माँग के विरुद्ध कोहोर्ट-व्यापी गैप देखें।' },
        { t: 'मंत्रालय', b: 'इंटर्नशिप, नौकरियों और सत्यापित प्रमाण का राष्ट्रीय स्नैपशॉट पढ़ें।' },
      ],
      trustTitle: 'विश्वास और सहमति',
      trustBody: 'सार्वजनिक पोर्टफोलियो लंबित वस्तुएँ छुपाते हैं। आवेदन के लिए उस अस्पताल या वेलनेस केंद्र के साथ सत्यापित परत साझा करने की स्पष्ट सहमति चाहिए।',
    },
  },
};

export const PARTNERS = [
  { ab: 'NIA', name: 'National Institute of Ayurveda', city: 'Jaipur' },
  { ab: 'AIIA', name: 'All India Institute of Ayurveda', city: 'New Delhi' },
  { ab: 'MDNIY', name: 'Morarji Desai National Institute of Yoga', city: 'New Delhi' },
  { ab: 'NIH', name: 'National Institute of Homoeopathy', city: 'Kolkata' },
  { ab: 'NIS', name: 'National Institute of Siddha', city: 'Chennai' },
  { ab: 'NIUM', name: 'National Institute of Unani Medicine', city: 'Bengaluru' },
];
