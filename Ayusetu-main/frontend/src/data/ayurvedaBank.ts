export type BankQuestion = {
  id: string;
  skill: string;
  text: string;
  options: string[];
  correct: number;
};

export const BAMS_SUBJECTS = [
  { id: 'Kayachikitsa', label: 'Kayachikitsa', hint: 'Internal Medicine' },
  { id: 'Shalya Tantra', label: 'Shalya Tantra', hint: 'Ayurvedic Surgery' },
  { id: 'Shalakya Tantra', label: 'Shalakya Tantra', hint: 'ENT, Eye & Head/Neck' },
  { id: 'Prasuti Tantra & Stri Roga', label: 'Prasuti Tantra & Stri Roga', hint: 'Obstetrics & Gynecology' },
  { id: 'Kaumarabhritya', label: 'Kaumarabhritya', hint: 'Pediatrics' },
  { id: 'Panchakarma', label: 'Panchakarma', hint: 'Detoxification & Therapeutic Procedures' },
  { id: 'Dravyaguna', label: 'Dravyaguna', hint: 'Ayurvedic Pharmacology & Medicinal Plants' },
  { id: 'Rasashastra & Bhaishajya Kalpana', label: 'Rasashastra & Bhaishajya Kalpana', hint: 'Ayurvedic Pharmaceutics' },
  { id: 'Swasthavritta', label: 'Swasthavritta', hint: 'Preventive & Community Health' },
  { id: 'Agada Tantra', label: 'Agada Tantra', hint: 'Toxicology' },
] as const;

type Row = [string, string, string, string, string, number];

function pack(skill: string, rows: Row[]): BankQuestion[] {
  return rows.map((row, i) => ({
    id: `${skill}-${i + 1}`,
    skill,
    text: row[0],
    options: [row[1], row[2], row[3], row[4]],
    correct: row[5],
  }));
}

const KAYACHIKITSA: Row[] = [
  ['What are the three Doshas in Ayurveda?', 'Vata, Pitta and Kapha', 'Rasa, Rakta and Mamsa', 'Sattva, Rajas and Tamas', 'Agni, Ama and Ojas', 0],
  ['What is the Ayurvedic concept of Agni?', "The body's digestive and metabolic power", 'A type of body tissue', 'A type of Dosha', 'A type of medicine', 0],
  [
    'What is the difference between Ama and properly digested food?',
    'Ama is properly digested food, while digested food is toxic',
    'Ama refers to improperly processed metabolic material, while properly digested food is adequately processed',
    'Both are exactly the same',
    'Ama is a type of Dosha',
    1,
  ],
  ['Which Dosha is primarily associated with movement in the body?', 'Pitta', 'Kapha', 'Vata', 'Ama', 2],
  ['What is Dinacharya and why is it important?', 'A surgical procedure', 'A daily routine intended to support health and balance', 'A type of medicine', 'A diagnostic laboratory test', 1],
  [
    'What is the Ayurvedic approach to managing Jwara (fever)?',
    "Treatment is selected after assessing the patient's condition and the underlying factors",
    'Give the same medicine to every patient',
    "Ignore the patient's symptoms",
    'Always perform Panchakarma immediately',
    0,
  ],
  [
    'What is Panchakarma, and when may it be considered?',
    "A group of therapeutic procedures considered according to the patient's condition and suitability",
    'A type of Dosha',
    'A daily exercise routine',
    'A diagnostic test',
    0,
  ],
  ['What is the role of Rasayana therapy?', 'Supporting health, vitality and longevity', 'Performing surgery', 'Diagnosing fractures', 'Measuring blood pressure', 0],
  [
    'What is the relationship between Dosha imbalance and disease?',
    'Dosha imbalance can contribute to the development of disease',
    'Doshas have no relationship with health',
    'Only Vata can cause disease',
    'Doshas are microorganisms',
    0,
  ],
  [
    'How would you assess a patient before planning an Ayurvedic treatment?',
    "Consider the patient's history, symptoms, constitution and overall condition",
    'Select medicine randomly',
    "Only check the patient's age",
    'Only ask what medicine the patient wants',
    0,
  ],
];

const SHALYA: Row[] = [
  ['What does Shalya Tantra deal with?', 'Ayurvedic surgical procedures and management of surgical conditions', 'Only mental health disorders', 'Only dietary planning', 'Only herbal identification', 0],
  ['What is meant by Shalya in Ayurveda?', 'A type of Dosha', 'A foreign body or object that causes discomfort or injury', 'A type of medicinal plant', 'A daily health routine', 1],
  ['What is Marma and why is it clinically important?', 'A type of medicine used for fever', 'A vital anatomical point where important structures are concentrated', 'A type of surgical instrument', 'A method of preparing medicines', 1],
  ['What is Kshara Karma?', 'A therapeutic procedure using alkaline preparations', 'A method of meditation', 'A type of massage', 'A dietary therapy', 0],
  ['What is Agnikarma?', 'A therapeutic procedure involving controlled application of heat', 'A method of preparing herbal tea', 'A breathing exercise', 'A diagnostic blood test', 0],
  [
    'What is the Ayurvedic concept of wound management?',
    'Assessment and appropriate management of the wound to support healing and prevent complications',
    'Applying the same treatment to every wound',
    'Ignoring the wound until it heals naturally',
    "Only treating the patient's diet",
    0,
  ],
  ['What is Vrana?', 'A wound or ulcer', 'A type of Dosha', 'A medicinal plant', 'A surgical instrument', 0],
  [
    'What factors should be considered before performing a surgical procedure?',
    'Patient condition, diagnosis, suitability and possible risks',
    "Only the patient's age",
    'Only the cost of the procedure',
    "Only the patient's preference",
    0,
  ],
  [
    'What is the importance of maintaining aseptic conditions during procedures?',
    'To reduce the risk of infection and maintain patient safety',
    'To increase the duration of the procedure',
    'To reduce the need for diagnosis',
    'To make medicines taste better',
    0,
  ],
  [
    'How would you assess a wound before selecting a treatment?',
    "Examine its location, size, depth, appearance, discharge and the patient's overall condition",
    'Select treatment randomly',
    "Only measure the patient's temperature",
    'Only ask how old the patient is',
    0,
  ],
];

const SHALAKYA: Row[] = [
  ['What areas of the body are covered under Shalakya Tantra?', 'Eyes, ears, nose, throat, head and neck', 'Only the digestive system', 'Only the bones and joints', 'Only the skin', 0],
  ['What is Netra Roga?', 'A disease or disorder affecting the eyes', 'A disorder of the digestive system', 'A disease of the bones', 'A disorder of the kidneys', 0],
  ['What is the Ayurvedic concept of Tarpana?', 'A therapeutic procedure involving the eyes', 'A surgical procedure for the stomach', 'A type of exercise', 'A method of preparing herbal medicine', 0],
  ['What is Nasya, and what is its general purpose?', 'Administration of medicine through the nasal route for therapeutic purposes', 'A surgical procedure on the stomach', 'A type of physical exercise', 'A method of preparing food', 0],
  [
    'What are common factors associated with eye disorders according to Ayurveda?',
    'Dosha imbalance, improper diet and lifestyle factors',
    'Only lack of exercise',
    'Only environmental temperature',
    'Only genetic factors',
    0,
  ],
  ['What is Karna Roga?', 'A disease or disorder affecting the ear', 'A disorder of the stomach', 'A disease of the skin', 'A disorder of the joints', 0],
  [
    'What is the role of Doshas in disorders of the eyes and ears?',
    'Imbalance of Doshas can contribute to the development of disorders',
    'Doshas have no relationship with these disorders',
    'Only Kapha can affect the eyes and ears',
    'Doshas are microorganisms that cause infection',
    0,
  ],
  ['What is Kavala or Gandusha?', 'A procedure involving holding substances in the mouth', 'A surgical procedure for the eye', 'A type of nasal medicine', 'A method of preparing Bhasma', 0],
  [
    'How would you examine a patient with an eye-related complaint?',
    "Take the patient's history and perform an appropriate eye examination",
    'Select medicine without examination',
    "Only check the patient's age",
    'Only ask about their diet',
    0,
  ],
  [
    'What precautions should be considered before an Ayurvedic eye procedure?',
    'Proper patient assessment, cleanliness, suitability and appropriate procedure selection',
    'Perform the procedure without examination',
    'Use the same procedure for every patient',
    'Ignore existing eye conditions',
    0,
  ],
];

const PRASUTI: Row[] = [
  ['What does Prasuti Tantra deal with?', 'Pregnancy, childbirth and related maternal care', 'Treatment of eye disorders', 'Treatment of skin diseases', 'Identification of medicinal plants', 0],
  [
    'What does Stri Roga deal with?',
    "Disorders and health conditions related to women's reproductive health",
    'Disorders of the nervous system only',
    'Surgical treatment of bones',
    'Treatment of poisoning',
    0,
  ],
  ['What is the Ayurvedic concept of Garbhini Paricharya?', 'Care and regimen recommended during pregnancy', 'Treatment after surgery', 'Treatment of childhood diseases', 'Preparation of herbal medicines', 0],
  [
    'Why is antenatal care important?',
    'To monitor the health of the mother and developing fetus and identify potential problems',
    "Only to determine the baby's gender",
    'Only to prescribe medicines',
    'It is not necessary during pregnancy',
    0,
  ],
  ['What is Artava in Ayurveda?', 'A term associated with the female reproductive system and menstrual function', 'A type of Dosha', 'A type of bone tissue', 'A surgical instrument', 0],
  [
    'What factors are considered important for healthy conception?',
    'Health of both partners, reproductive health, appropriate timing and overall wellbeing',
    'Only the age of the woman',
    'Only physical exercise',
    'Only dietary supplements',
    0,
  ],
  [
    'What is the role of diet during pregnancy according to Ayurveda?',
    'Appropriate nutrition supports the health of the mother and developing fetus',
    'Pregnant women should avoid all food',
    'Diet has no importance during pregnancy',
    'Only herbal medicines should be consumed',
    0,
  ],
  ['What is Sutika Paricharya?', 'Postpartum care and regimen for the mother', 'Care of newborns only', 'A surgical procedure', 'A method of preparing medicine', 0],
  [
    'How would you assess a pregnant woman before providing Ayurvedic advice?',
    'Review her medical and pregnancy history, current condition and relevant clinical findings',
    'Give the same advice to every pregnant woman',
    'Only ask her age',
    'Only check her diet',
    0,
  ],
  [
    'What precautions are necessary when treating a pregnant patient?',
    'Consider pregnancy stage, patient condition, treatment suitability and safety',
    'Use the same treatment used for non-pregnant adults',
    'Ignore existing medical conditions',
    'Give treatment without assessment',
    0,
  ],
];

const KAUMARA: Row[] = [
  ['What does Kaumarabhritya deal with?', 'Child health, development and pediatric care', 'Surgical procedures only', 'Treatment of adult patients', 'Medicinal plant classification', 0],
  [
    'Why is pediatric care different from adult care?',
    'Children have age-dependent physiological, developmental and dosing requirements',
    'Children never require medical assessment',
    'Children can always receive adult doses',
    'Children have the same physiological needs as adults',
    0,
  ],
  [
    'What is Swarna Prashana?',
    'A traditional Ayurvedic practice involving administration of processed gold preparations',
    'A surgical procedure',
    'A diagnostic test',
    'A type of massage',
    0,
  ],
  [
    'What is the Ayurvedic concept of childhood immunity?',
    'It considers immunity and strength to develop with age and overall health',
    'Children automatically have stronger immunity than adults',
    'Immunity has no relationship with nutrition',
    'Immunity only depends on medication',
    0,
  ],
  [
    'What is the importance of breastfeeding in infant care?',
    'It provides nutrition and supports growth and development',
    'It has no nutritional value',
    'It should always be replaced by herbal medicines',
    'It is only important after one year',
    0,
  ],
  ['What is Bala in the context of pediatric assessment?', 'Strength or physical capacity of the child', 'A type of medicine', 'A Dosha', 'A surgical procedure', 0],
  [
    'How does age influence Ayurvedic treatment?',
    'Age can influence treatment selection, dosage and suitability',
    'Age has no influence on treatment',
    'Only adults require dosage considerations',
    'Every child receives the same treatment',
    0,
  ],
  [
    'What dietary factors are important for children?',
    'Adequate nutrition, age-appropriate food and balanced dietary habits',
    'Avoiding all nutritious foods',
    'Giving only herbal preparations',
    'Giving the same diet regardless of age',
    0,
  ],
  [
    'How would you assess the health of a child before treatment?',
    'Consider age, growth, development, symptoms, medical history and overall condition',
    "Only check the child's weight",
    'Only ask the parents about food',
    'Give treatment without assessment',
    0,
  ],
  [
    'What precautions should be taken when administering medicines to children?',
    'Consider age, weight, dosage, formulation and safety',
    'Give adult doses',
    "Ignore the child's weight",
    'Use any medicine without checking its suitability',
    0,
  ],
];

const PANCHAKARMA: Row[] = [
  ['What does Panchakarma mean?', 'A group of five major Ayurvedic therapeutic procedures', 'Five types of Doshas', 'Five medicinal plants', 'Five types of exercise', 0],
  [
    'Which group represents the five procedures traditionally associated with Panchakarma?',
    'Vamana, Virechana, Basti, Nasya and Raktamokshana',
    'Yoga, Pranayama, Dhyana, Asana and Dharana',
    'Abhyanga, Swedana, Tarpana, Gandusha and Kavala',
    'Rasa, Guna, Virya, Vipaka and Prabhava',
    0,
  ],
  ['What is Vamana?', 'Therapeutic emesis', 'Therapeutic purgation', 'Nasal therapy', 'Oil massage', 0],
  ['What is Virechana?', 'Therapeutic emesis', 'Therapeutic purgation', 'Nasal therapy', 'Oil massage', 1],
  ['What is Basti?', 'A therapeutic procedure involving administration through the rectal route', 'A type of eye therapy', 'A surgical operation', 'A breathing exercise', 0],
  ['What is Nasya?', 'Administration of appropriate medicine through the nasal route', 'Administration of medicine through the ear', 'A surgical procedure', 'A type of exercise', 0],
  ['What is Raktamokshana?', 'A traditional therapeutic procedure involving bloodletting', 'A type of massage', 'A dietary procedure', 'A breathing technique', 0],
  [
    'What is the purpose of Purva Karma?',
    'Preparatory procedures performed before the main Panchakarma procedure',
    'Procedures performed only after treatment',
    'Diagnosis of infectious diseases',
    'Preparation of herbal medicines',
    0,
  ],
  [
    'What is Paschat Karma?',
    'Post-procedure care and dietary/regimen measures after the main therapy',
    'Preparation before treatment',
    'A type of surgical instrument',
    'A diagnostic procedure',
    0,
  ],
  [
    'Why should Panchakarma procedures be performed after proper patient assessment?',
    'To determine suitability, precautions and appropriate procedure for the individual',
    'Because every patient requires all five procedures',
    "To avoid taking the patient's history",
    'Because assessment is optional',
    0,
  ],
];

const DRAVYAGUNA: Row[] = [
  ['What is Dravyaguna?', 'The study of medicinal substances, their properties and actions', 'The study of surgery', 'The study of childbirth only', 'The study of anatomy only', 0],
  ['What is meant by Rasa of a drug?', 'Its taste', 'Its color', 'Its weight', 'Its temperature', 0],
  ['What is Guna?', 'The qualities or properties of a substance', 'The taste of a substance', 'The dosage of a medicine', 'The name of a disease', 0],
  ['What is Virya?', 'The potency or active energy of a substance', 'The taste of a substance', 'The physical shape of a plant', 'The color of a medicine', 0],
  ['What is Vipaka?', 'The post-digestive effect of a substance', 'The physical appearance of a plant', 'The manufacturing cost of a medicine', 'The smell of a drug', 0],
  [
    'What is Prabhava?',
    'A specific action or effect of a substance that cannot be fully explained by its other properties',
    'The taste of a drug',
    'The weight of a medicine',
    'The color of a plant',
    0,
  ],
  [
    'How are medicinal plants identified and classified?',
    'By considering their botanical characteristics and Ayurvedic properties',
    'Only by their color',
    'Only by their smell',
    'Only by their market price',
    0,
  ],
  [
    'Why is correct identification of a medicinal plant important?',
    'To ensure the correct medicinal substance is used and reduce the risk of substitution or misuse',
    'To make the plant look better',
    'To increase its market price',
    'Identification is unnecessary',
    0,
  ],
  [
    'How can the quality of a medicinal drug affect treatment?',
    'Poor quality can affect its safety, effectiveness and consistency',
    'Quality has no effect',
    'Only the packaging matters',
    'Poor quality always makes the medicine stronger',
    0,
  ],
  [
    'What factors should be considered before selecting an Ayurvedic drug for a patient?',
    'Patient condition, Dosha, drug properties, dosage and suitability',
    'Only the price of the medicine',
    "Only the patient's age",
    'Only the color of the medicine',
    0,
  ],
];

const RASASHASTRA: Row[] = [
  [
    'What is Rasashastra?',
    'A branch of Ayurveda dealing with processing and use of certain mineral and metallic substances in medicines',
    'A branch dealing only with surgery',
    'A branch dealing only with exercise',
    'A branch dealing only with pregnancy',
    0,
  ],
  ['What is Bhaishajya Kalpana?', 'The science of preparing and processing Ayurvedic medicines', 'The science of surgery', 'The study of anatomy', 'The study of yoga', 0],
  ['What is meant by Shodhana?', 'A purification or processing procedure used for certain substances', 'A surgical procedure', 'A breathing exercise', 'A diagnostic test', 0],
  [
    'What is Marana?',
    'A traditional process used to prepare certain substances into a fine ash-like medicinal form',
    'A method of diagnosing disease',
    'A type of massage',
    'A dietary routine',
    0,
  ],
  ['What is Bhasma?', 'A traditionally prepared fine ash-like medicinal preparation', 'A type of Dosha', 'A surgical instrument', 'A type of exercise', 0],
  [
    'What is the importance of proper drug processing?',
    'It helps ensure appropriate quality, consistency and safety of the formulation',
    'It only changes the color',
    'It makes quality control unnecessary',
    'Processing has no importance',
    0,
  ],
  [
    'Which of the following are common Ayurvedic dosage forms?',
    'Churna, Vati, Kwatha, Asava and Arishta',
    'Tablets, syringes and vaccines only',
    'X-rays and scans',
    'Bandages and casts',
    0,
  ],
  [
    'Why is quality control important in Ayurvedic medicine preparation?',
    'To ensure identity, quality, consistency and safety of the medicine',
    'Only to improve packaging',
    'To increase the price',
    'Quality control is unnecessary',
    0,
  ],
  [
    'What precautions should be followed when handling mineral-based substances?',
    'Proper identification, processing, quality control and safety procedures should be followed',
    'They can be handled without precautions',
    'They should always be consumed directly',
    'Processing is unnecessary',
    0,
  ],
  [
    'How would you ensure the quality and safety of an Ayurvedic formulation?',
    'Follow standardized preparation procedures, quality testing and appropriate storage',
    'Only check the color',
    'Only check the price',
    'Skip quality testing',
    0,
  ],
];

const SWASTHAVRITTA: Row[] = [
  ['What is Swasthavritta?', 'The Ayurvedic branch concerned with maintaining health and preventing disease', 'The branch of surgery', 'The branch of toxicology', 'The study of medicinal minerals', 0],
  ['What is Dinacharya?', 'A recommended daily routine for maintaining health', 'A surgical procedure', 'A medicine preparation technique', 'A diagnostic test', 0],
  ['What is Ritucharya?', 'Seasonal regimen and lifestyle practices according to Ayurveda', 'A surgical procedure', 'A type of medicine', 'A method of wound treatment', 0],
  [
    'Why is proper sleep important according to Ayurveda?',
    'Proper sleep supports physical and mental wellbeing',
    'Sleep has no effect on health',
    'Sleep is only important for children',
    'Sleeping should always be avoided during the day and night',
    0,
  ],
  [
    'What is the Ayurvedic approach to a balanced diet?',
    'Choose appropriate, nutritious food according to individual needs and digestive capacity',
    'Eat only one type of food',
    'Avoid all carbohydrates',
    'Eat without considering digestion',
    0,
  ],
  [
    'What role does exercise play in maintaining health?',
    'Appropriate exercise supports physical fitness and overall wellbeing',
    'Exercise always causes disease',
    'Exercise has no health benefits',
    'Exercise should be avoided by healthy people',
    0,
  ],
  [
    'What is the importance of personal hygiene?',
    'It helps maintain health and reduce the risk of disease',
    'It has no effect on health',
    'It is only important for children',
    'It only improves appearance',
    0,
  ],
  [
    'How can lifestyle influence Dosha balance?',
    'Diet, sleep, activity and daily habits may influence Dosha balance',
    'Lifestyle has no relationship with health',
    'Only medicines affect Doshas',
    'Only weather affects Doshas',
    0,
  ],
  [
    'How can Ayurveda contribute to preventive healthcare?',
    'Through healthy diet, lifestyle, daily routines, seasonal practices and health awareness',
    'Only through surgery',
    'Only through emergency treatment',
    'Only through laboratory testing',
    0,
  ],
  [
    'How would you design a healthy daily routine for a person?',
    'Consider individual needs, sleep, diet, exercise, hygiene and daily activities',
    'Give exactly the same routine to everyone',
    'Focus only on exercise',
    'Focus only on diet',
    0,
  ],
];

const AGADA: Row[] = [
  ['What is Agada Tantra?', 'The Ayurvedic branch concerned with toxicology and management of poisoning', 'The branch of pediatrics', 'The branch of surgery', 'The study of healthy diet only', 0],
  ['What is Visha in Ayurveda?', 'A poisonous or toxic substance', 'A type of Dosha', 'A medicinal plant only', 'A type of exercise', 0],
  [
    'What is the difference between natural and artificial toxins?',
    'Natural toxins originate from natural sources, while artificial toxins may result from human-made substances',
    'There is no difference',
    'Natural toxins are always harmless',
    'Artificial toxins are always harmless',
    0,
  ],
  [
    'What are common routes through which toxins can enter the body?',
    'Ingestion, inhalation, injection and absorption through skin or mucous membranes',
    'Only through eating',
    'Only through breathing',
    'Only through the eyes',
    0,
  ],
  [
    'What are general signs of poisoning?',
    'Symptoms may include vomiting, abdominal pain, breathing difficulties, altered consciousness or other abnormal signs depending on the toxin',
    'Only increased appetite',
    'Only improved sleep',
    'Poisoning always has no symptoms',
    0,
  ],
  [
    'Why is rapid identification of poisoning important?',
    'It helps enable timely and appropriate medical management',
    'It makes treatment unnecessary',
    'It prevents the need for assessment',
    'It has no importance',
    0,
  ],
  [
    'What is the Ayurvedic concept of Vishahara treatment?',
    'Traditional approaches intended to counteract or manage the effects of poison',
    'A method of treating fractures',
    'A type of exercise',
    'A method of preparing food',
    0,
  ],
  [
    'How should a suspected poisoning case be assessed?',
    "Assess the patient's condition, possible toxin, route and timing of exposure and relevant symptoms",
    'Give medicine immediately without assessment',
    "Only ask the patient's age",
    'Ignore the exposure history',
    0,
  ],
  [
    'Why should severe poisoning cases receive emergency medical attention?',
    'Poisoning can rapidly become life-threatening and may require urgent supportive and specialized treatment',
    'Emergency care is unnecessary',
    'Poisoning always resolves by itself',
    'Only mild cases require medical attention',
    0,
  ],
  [
    'What precautions should be taken while handling potentially toxic substances?',
    'Use appropriate protective measures, proper labeling, safe storage and careful handling',
    'Store them without labels',
    'Keep them accessible to children',
    'Handle them without protection',
    0,
  ],
];

export const AYURVEDA_BANK: BankQuestion[] = [
  ...pack('Kayachikitsa', KAYACHIKITSA),
  ...pack('Shalya Tantra', SHALYA),
  ...pack('Shalakya Tantra', SHALAKYA),
  ...pack('Prasuti Tantra & Stri Roga', PRASUTI),
  ...pack('Kaumarabhritya', KAUMARA),
  ...pack('Panchakarma', PANCHAKARMA),
  ...pack('Dravyaguna', DRAVYAGUNA),
  ...pack('Rasashastra & Bhaishajya Kalpana', RASASHASTRA),
  ...pack('Swasthavritta', SWASTHAVRITTA),
  ...pack('Agada Tantra', AGADA),
];

export const ONBOARDING_KEY = 'ayusetu-onboarding';

export function questionsForSkills(skills: string[]): BankQuestion[] {
  const set = new Set(skills);
  return AYURVEDA_BANK.filter(q => set.has(q.skill));
}

export function loadOnboarding(): { role?: string; answers?: Record<string, string | string[]> } {
  try {
    return JSON.parse(sessionStorage.getItem(ONBOARDING_KEY) || '{}');
  } catch {
    return {};
  }
}
