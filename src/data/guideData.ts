import { Language } from '../types';

export interface GuideCategory {
  id: 'photo' | 'organic' | 'chemical' | 'weather' | 'manual' | 'architecture' | 'helpline';
  titleEn: string;
  titleHi: string;
  icon: string;
  badgeEn?: string;
  badgeHi?: string;
}

export interface PhotoTip {
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  isDo: boolean; // true = DO, false = DON'T
}

export interface OrganicRecipe {
  nameEn: string;
  nameHi: string;
  targetEn: string;
  targetHi: string;
  ingredientsEn: string[];
  ingredientsHi: string[];
  stepsEn: string[];
  stepsHi: string[];
  dosageEn: string;
  dosageHi: string;
  cautionEn: string;
  cautionHi: string;
}

export interface ChemicalRule {
  ruleEn: string;
  ruleHi: string;
  explanationEn: string;
  explanationHi: string;
  iconType: 'mask' | 'time' | 'wind' | 'wash' | 'storage' | 'water';
}

export interface AppStep {
  stepNumber: number;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  featureEn: string;
  featureHi: string;
}

export interface HelplineInfo {
  nameEn: string;
  nameHi: string;
  contact: string;
  hoursEn: string;
  hoursHi: string;
  purposeEn: string;
  purposeHi: string;
  link?: string;
}

export const GUIDE_CATEGORIES: GuideCategory[] = [
  { id: 'photo', titleEn: 'Photography Tips', titleHi: 'पत्ती की फोटो लेने के नियम', icon: 'Camera', badgeEn: 'Crucial for Accuracy', badgeHi: 'सटीक जांच के लिए जरूरी' },
  { id: 'organic', titleEn: 'Organic Recipes', titleHi: 'जैविक कीटनाशक व घोल', icon: 'Leaf', badgeEn: '100% Eco-Friendly', badgeHi: '100% प्राकृतिक' },
  { id: 'chemical', titleEn: 'Chemical Safety', titleHi: 'दवा छिड़काव सुरक्षा', icon: 'ShieldAlert', badgeEn: 'Farmer Health', badgeHi: 'सुरक्षा नियम' },
  { id: 'weather', titleEn: 'Weather Disease Risk', titleHi: 'मौसम और रोग सूचकांक', icon: 'CloudRain', badgeEn: 'Early Warning', badgeHi: 'अग्रिम चेतावनी' },
  { id: 'manual', titleEn: 'App Usage Guide', titleHi: 'ऐप इस्तेमाल का तरीका', icon: 'BookOpen', badgeEn: '5 Easy Steps', badgeHi: '5 आसान चरण' },
  { id: 'helpline', titleEn: 'Kisan Helplines', titleHi: 'किसान हेल्पलाइन व मदद', icon: 'PhoneCall', badgeEn: 'Toll-Free Support', badgeHi: 'मुफ्त सहायता' },
  { id: 'architecture', titleEn: 'System Architecture', titleHi: 'सिस्टम व एआई संरचना', icon: 'Server', badgeEn: 'Tech Specs', badgeHi: 'तकनीकी विवरण' },
];

export const PHOTO_TIPS: PhotoTip[] = [
  {
    titleEn: 'Close-Up on Diseased Leaf Lesions',
    titleHi: 'रोगग्रस्त पत्ती और धब्बों पर सीधा फोकस',
    descEn: 'Focus closely on the spots, yellowing rings, powdery mildew, or rust pustules so the AI can analyze fungal spore structures.',
    descHi: 'पत्ती पर बने काले-भूरे धब्बे, पीलापन, फफूंद या झुलसा के लक्षणों पर कैमरा बिल्कुल पास ले जाकर साफ फोकस करें।',
    isDo: true
  },
  {
    titleEn: 'Soft Natural Daylight',
    titleHi: 'पर्याप्त प्राकृतिक रोशनी (सुबह या शाम)',
    descEn: 'Capture photos under indirect, even daylight. Avoid harsh direct sun reflections or pitch-dark shadows.',
    descHi: 'फोटो दिन के प्राकृतिक उजाले में लें। तेज धूप की चमक या रात के अंधेरे की छाया से बचें ताकि असली रंग दिख सके।',
    isDo: true
  },
  {
    titleEn: 'Check Both Upper & Lower Leaf Sides',
    titleHi: 'पत्ती की दोनों सतह (ऊपरी व निचली) की जांच',
    descEn: 'Many pathogens like Downy Mildew and Spider Mites colonize the underside of leaves first. Flip the leaf and photograph if symptoms appear below.',
    descHi: 'डाउनी मिल्ड्यू या माहू जैसे कीट पत्ती की निचली सतह पर पहले आते हैं। लक्षण दिखने पर पत्ती पलटकर भी फोटो लें।',
    isDo: true
  },
  {
    titleEn: 'Single Leaf Centered in Frame',
    titleHi: 'एक समय में एक ही पत्ती फ्रेम में रखें',
    descEn: 'Hold the diseased leaf against your hand, soil, or neutral ground so the background does not distract the computer vision model.',
    descHi: 'पत्ती को हथेली या जमीन के सहारे स्थिर रखें ताकि पृष्ठभूमि में बहुत सारे पौधे मॉडल को भ्रमित न करें।',
    isDo: true
  },
  {
    titleEn: "Don't Take Blurry or Shaky Photos",
    titleHi: 'धुंधली या हिलती हुई तस्वीर न लें',
    descEn: 'A blurred image hides vein patterns and chlorosis borders, leading to lower confidence scores.',
    descHi: 'हिलते हाथ या हवा में हिलती पत्ती की धुंधली फोटो लेने से एआई बीमारी पहचानने में गलती कर सकता है।',
    isDo: false
  },
  {
    titleEn: "Don't Photograph the Whole Tree/Field from Afar",
    titleHi: 'दूर से पूरे खेत या पेड़ की फोटो न लें',
    descEn: 'Wide field views show distant foliage without microscopic leaf details. Always take individual leaf macro shots.',
    descHi: 'दूर से खींची गई फोटो में पत्ती के सूक्ष्म धब्बे नहीं दिखते। हमेशा पास जाकर केवल पत्ती की फोटो लें।',
    isDo: false
  },
  {
    titleEn: "Don't Photograph Heavily Muddy or Torn Leaves",
    titleHi: 'मिट्टी से सनी या कुचली हुई पत्ती न लें',
    descEn: 'Wash off thick caked mud or choose a representative intact leaf showing active disease symptoms for best results.',
    descHi: 'यदि पत्ती पर बहुत ज्यादा कीचड़ या धूल जमी हो तो उसे हल्के से पोंछ लें ताकि बीमारी के वास्तविक लक्षण दिखें।',
    isDo: false
  },
  {
    titleEn: "Don't Use Flash in Harsh Glare",
    titleHi: 'कैमरा फ्लैश की तेज चमक से बचें',
    descEn: 'Direct camera flash overexposes green chlorophyll, washing out yellow halos and brown fungal necrosis.',
    descHi: 'बहुत पास से तेज फ्लैश जलाने से पत्ती का रंग उड़ जाता है और बीमारी के पीले व भूरे घेरे छिप जाते हैं।',
    isDo: false
  }
];

export const ORGANIC_RECIPES: OrganicRecipe[] = [
  {
    nameEn: 'Pure Cold-Pressed Neem Oil Spray (10,000 PPM)',
    nameHi: 'शुद्ध नीम का तेल स्प्रे (10,000 PPM)',
    targetEn: 'Fungal leaf spots, powdery mildew, aphids, whiteflies, thrips, caterpillars',
    targetHi: 'फफूंद रोग, पत्ती के धब्बे, सफेद मक्खी, माहू, थ्रिप्स और कीट',
    ingredientsEn: ['5ml Cold-Pressed Pure Neem Oil', '1ml Liquid Bio-Soap or Mild Shampoo (as emulsifier)', '1 Liter Clean Lukewarm Water'],
    ingredientsHi: ['5 मिली शुद्ध कोल्ड-प्रेस्ड नीम का तेल', '1 मिली लिक्विड साबुन या हल्का शैम्पू (घोलक के रूप में)', '1 लीटर गुनगुना साफ पानी'],
    stepsEn: [
      'Mix 5ml neem oil with 1ml liquid soap in a small bowl until it turns milky white (emulsified).',
      'Pour the milky mixture into 1 liter of lukewarm water and shake vigorously.',
      'Fill in sprayer and spray thoroughly on both upper and lower leaf surfaces.',
      'Repeat every 7-10 days in early morning or late evening.'
    ],
    stepsHi: [
      'एक कटोरी में 5 मिली नीम तेल और 1 मिली तरल साबुन मिलाकर तब तक हिलाएं जब तक वह दूधिया सफेद न हो जाए।',
      'अब इसे 1 लीटर गुनगुने पानी में डालकर अच्छी तरह हिलाएं ताकि तेल पानी में पूरी तरह घुल जाए।',
      'स्प्रेयर में भरकर पत्तियों के ऊपर और नीचे दोनों तरफ अच्छी तरह छिड़कें।',
      'हर 7 से 10 दिन के अंतराल पर सुबह या शाम के समय छिड़काव दोहराएं।'
    ],
    dosageEn: '5 ml per Liter of water (750ml - 1 Liter per acre)',
    dosageHi: '5 मिली प्रति लीटर पानी (750 मिली - 1 लीटर प्रति एकड़)',
    cautionEn: 'Never spray in hot afternoon sun (>32°C) to prevent leaf scorching.',
    cautionHi: 'कड़क धूप में दोपहर के समय छिड़काव न करें, पत्तियां झुलस सकती हैं।'
  },
  {
    nameEn: 'Trichoderma Viride / Harzianum Bio-Fungicide Solution',
    nameHi: 'ट्राइकोडरमा विरिडी जैविक फफूंदनाशक घोल',
    targetEn: 'Root rot, damping-off, wilt (Fusarium), early/late blight, collar rot',
    targetHi: 'जड़ सड़न, उकठा (मुरझान) रोग, झुलसा रोग, तना सड़न व फफूंद',
    ingredientsEn: ['5g Trichoderma Viride powder (or 5ml liquid)', '10g Jaggery (Gur) as microbial food', '1 Liter Water'],
    ingredientsHi: ['5 ग्राम ट्राइकोडरमा विरिडी पाउडर (या 5 मिली तरल)', '10 ग्राम पुराना गुड़ (जीवाणु खुराक हेतु)', '1 लीटर पानी'],
    stepsEn: [
      'Dissolve 10g jaggery in 1 liter water and let it sit for 2 hours.',
      'Add 5g Trichoderma powder and stir well. Keep in shade for 24 hours to multiply beneficial fungi.',
      'Drench around the root zone or spray on leaves during high humidity conditions.'
    ],
    stepsHi: [
      '1 लीटर पानी में 10 ग्राम गुड़ घोलकर 2 घंटे के लिए रख दें।',
      'अब इसमें 5 ग्राम ट्राइकोडरमा मिलाएं और 24 घंटे छाया में ढककर रखें ताकि मित्र फफूंद तेजी से बढ़े।',
      'पौधों की जड़ों में डालें (ड्रेन्चिंग) या पत्तियों पर छिड़काव करें।'
    ],
    dosageEn: '5g / Liter for foliar spray, or 2.5 kg / acre mixed with compost for soil application',
    dosageHi: '5 ग्राम प्रति लीटर पानी छिड़काव हेतु, अथवा 2.5 किग्रा प्रति एकड़ सड़े गोबर की खाद में मिलाकर',
    cautionEn: 'Do not mix with chemical fungicides or copper-based sprays (it kills the beneficial fungus).',
    cautionHi: 'इसे किसी भी रासायनिक कीटनाशक या कॉपर फफूंदनाशी के साथ कभी न मिलाएं।'
  },
  {
    nameEn: 'Sour Buttermilk & Copper Decoction (Chaach Spray)',
    nameHi: 'खट्टी छाछ (मट्ठा) व तांबा कवकनाशी स्प्रे',
    targetEn: 'Bacterial blight, rust, leaf curl, downy mildew',
    targetHi: 'जीवाणु झुलसा, रतुआ, पत्ती मरोड़ रोग, डाउनी मिल्ड्यू',
    ingredientsEn: ['2 Liters Sour Buttermilk (3-5 days old sour curd)', '1 Copper wire/vessel immersed for 4 days', '10 Liters Water'],
    ingredientsHi: ['2 लीटर पुरानी खट्टी छाछ (3-5 दिन पुरानी)', '1 तांबे का बर्तन या तांबे का तार (4 दिन तक छाछ में डुबोया हुआ)', '10 लीटर पानी'],
    stepsEn: [
      'Take 2 liters of sour buttermilk and immerse a clean piece of copper in a clay or plastic pot for 4-5 days.',
      'The liquid will turn greenish-blue (producing natural copper lactate).',
      'Filter through a clean muslin cloth and dilute with 10 liters of clean water.',
      'Spray on affected leaves to halt bacterial and fungal proliferation.'
    ],
    stepsHi: [
      '2 लीटर खट्टी छाछ में तांबे का टुकड़ा डालकर 4-5 दिन मिट्टी या प्लास्टिक के बर्तन में रखें।',
      'छाछ का रंग हरा-नीला हो जाएगा (प्राकृतिक कॉपर लैक्टेट)।',
      'इसे महीन कपड़े से छान लें और 10 लीटर पानी में मिलाकर घोल तैयार करें।',
      'प्रभावित फसल पर तुरंत छिड़कें, यह फफूंद और जीवाणुओं को तुरंत रोकता है।'
    ],
    dosageEn: '10% solution (1 Liter Chaach in 10 Liters water)',
    dosageHi: '10% घोल (1 लीटर तैयार खट्टी छाछ को 10 लीटर पानी में मिलाएं)',
    cautionEn: 'Filter thoroughly through fine cloth so sprayer nozzles do not clog.',
    cautionHi: 'महीन कपड़े से अच्छी तरह छानें ताकि स्प्रेयर का नोजल जाम न हो।'
  },
  {
    nameEn: 'Jeevamrutha Organic Bio-Stimulant',
    nameHi: 'जीवामृत जैविक पोषण एवं रोग प्रतिरोधक घोल',
    targetEn: 'Soil health restoration, systemic disease immunity, leaf vitality',
    targetHi: 'मिट्टी की उर्वरता, पौधों की रोग प्रतिरोधक क्षमता व समग्र विकास',
    ingredientsEn: ['10 kg Fresh Desi Cow Dung', '10 Liters Desi Cow Urine', '2 kg Jaggery (Gur)', '2 kg Gram Flour (Besan)', '1 Handful Fertile Forest/Farm Soil', '200 Liters Water'],
    ingredientsHi: ['10 किग्रा देसी गाय का ताजा गोबर', '10 लीटर देसी गाय का गोमूत्र', '2 किग्रा पुराना गुड़', '2 किग्रा बेसन (चने का आटा)', '1 मुट्ठी खेत की मेड़ की उपजाऊ मिट्टी', '200 लीटर पानी'],
    stepsEn: [
      'Mix cow dung and cow urine in a 200-liter drum with 190 liters of water.',
      'Add jaggery and besan along with 1 handful of virgin soil. Stir clockwise with a wooden stick.',
      'Cover with jute gunny bag in shade. Stir twice daily for 4 to 6 days.',
      'Apply to soil via irrigation or filter for foliar spraying.'
    ],
    stepsHi: [
      '200 लीटर के ड्रम में 190 लीटर पानी लेकर उसमें गोबर और गोमूत्र अच्छी तरह मिलाएं।',
      'गुड़, बेसन और एक मुट्ठी मिट्टी डालकर लकड़ी के डंडे से घड़ी की दिशा में 2 मिनट घुमाएं।',
      'ड्रम को छाया में बोरी से ढककर रखें और रोजाना सुबह-शाम 2 मिनट चलाएं। 5-7 दिन में जीवामृत तैयार हो जाएगा।',
      'सिंचाई के पानी के साथ खेत में दें या छानकर फसल पर 10% छिड़काव करें।'
    ],
    dosageEn: '200 Liters per acre with irrigation, or 10% spray (100ml per liter)',
    dosageHi: '200 लीटर प्रति एकड़ सिंचाई के साथ, अथवा 10% घोल (100 मिली प्रति लीटर) छिड़काव',
    cautionEn: 'Use within 10 days of fermentation. Keep away from direct sun.',
    cautionHi: 'बनने के 7-10 दिनों के भीतर उपयोग करें और हमेशा छाया में रखें।'
  }
];

export const CHEMICAL_SAFETY_RULES: ChemicalRule[] = [
  {
    ruleEn: 'Personal Protective Equipment (PPE)',
    ruleHi: 'व्यक्तिगत सुरक्षा उपकरण (मास्क व दस्ताने)',
    explanationEn: 'Always wear a protective N95 mask, rubber gloves, goggles, full-sleeve clothing, and boots during chemical mixing and spraying.',
    explanationHi: 'दवा मिलाते और छिड़कते समय हमेशा मास्क, रबर के दस्ताने, चश्मा और पूरे बाजू के कपड़े पहनें ताकि रसायन त्वचा व सांस में न जाए।',
    iconType: 'mask'
  },
  {
    ruleEn: 'Ideal Spray Timing (Early Morning / Evening)',
    ruleHi: 'छिड़काव का सही समय (सुबह 7-10 बजे या शाम 4-6 बजे)',
    explanationEn: 'Never spray in mid-day peak sun (>30°C) or strong wind. High heat causes chemical volatilization and leaf scorch, while wind drifts toxins onto nearby crops.',
    explanationHi: 'दोपहर की तेज धूप या तेज हवा में छिड़काव कभी न करें। तेज धूप में पत्तियां जल सकती हैं और दवा हवा में उड़कर व्यर्थ हो जाती है।',
    iconType: 'time'
  },
  {
    ruleEn: 'Spray Direction with the Wind',
    ruleHi: 'हवा की दिशा में छिड़काव (पीठ की तरफ हवा)',
    explanationEn: 'Always walk with the wind at your back. Never spray facing into the wind to prevent inhaling airborne chemical droplets.',
    explanationHi: 'हमेशा हवा की दिशा में आगे बढ़ें। हवा के विपरीत कभी छिड़काव न करें ताकि दवा का स्प्रे आपके चेहरे पर न आए।',
    iconType: 'wind'
  },
  {
    ruleEn: 'Water Sources & Bee Protection',
    ruleHi: 'जलस्रोतों व मधुमक्खियों की सुरक्षा',
    explanationEn: 'Never spray near open ponds, wells, or rivers (toxic to aquatic life). Avoid spraying flowering crops during peak pollinator hours to protect honeybees.',
    explanationHi: 'कुएं, तालाब या पानी के स्रोतों के पास छिड़काव न करें। फूल आने पर दोपहर में छिड़काव न करें ताकि मधुमक्खियों व मित्र कीटों को नुकसान न हो।',
    iconType: 'water'
  },
  {
    ruleEn: 'Hygiene & Equipment Washing',
    ruleHi: 'छिड़काव के बाद हाथ-मुंह धोना व स्नान',
    explanationEn: 'Wash spraying equipment thoroughly far from drinking water sources. Take a bath with soap and wash spraying clothes separately immediately after application.',
    explanationHi: 'छिड़काव के तुरंत बाद साबुन से अच्छी तरह नहाएं और छिड़काव वाले कपड़े अलग धोएं। स्प्रेयर को साफ पानी से धोकर रखें।',
    iconType: 'wash'
  },
  {
    ruleEn: 'Safe Storage Out of Children’s Reach',
    ruleHi: 'बच्चों व मवेशियों की पहुंच से दूर सुरक्षित भंडारण',
    explanationEn: 'Store chemical bottles in locked cupboards in original labeled containers. Never store near food grains, animal fodder, or drinking water.',
    explanationHi: 'कीटनाशक दवाओं को हमेशा ताला लगे बक्से में बच्चों, पालतू जानवरों और अनाज-चारे से बहुत दूर रखें। खाली डिब्बों को नष्ट करें।',
    iconType: 'storage'
  }
];

export const APP_STEPS: AppStep[] = [
  {
    stepNumber: 1,
    titleEn: 'Upload or Capture Leaf Photo',
    titleHi: 'पत्ती की तस्वीर अपलोड या कैप्चर करें',
    descEn: 'Click "Scan Crop Leaf Now" or use the camera to take a clear, high-resolution photo of the diseased leaf.',
    descHi: '"अभी पत्ती स्कैन करें" पर क्लिक करें या कैमरे से रोगग्रस्त पत्ती की साफ और स्पष्ट फोटो खींचें।',
    featureEn: 'Instant Camera & Drag-and-Drop',
    featureHi: 'कैमरा व ड्रैग-एंड-ड्रॉप सुविधा'
  },
  {
    stepNumber: 2,
    titleEn: 'Artificial Intelligence Vision Pathology',
    titleHi: 'आर्टिफिशियल इंटेलिजेंस विजन द्वारा त्वरित जांच',
    descEn: 'Our neural vision models analyze leaf texture, chlorosis patterns, necrotic lesions, and fungal spore distribution within seconds.',
    descHi: 'हमारा एआई मॉडल पत्ती के धब्बों, फफूंद और रंग के बदलाव का विश्लेषण करके बीमारी का नाम व गंभीरता तय करता है।',
    featureEn: '90%+ Diagnostic Accuracy',
    featureHi: '90%+ सटीक रोग पहचान'
  },
  {
    stepNumber: 3,
    titleEn: 'Eco-Friendly & Chemical Remedies',
    titleHi: 'जैविक व रासायनिक उपचार सलाह',
    descEn: 'Receive tailor-made organic remedies (Neem, Trichoderma) and chemical fungicides with exact dosages and application timing.',
    descHi: 'अपनी फसल के अनुसार जैविक घोल (नीम, ट्राइकोडरमा) और जरूरत पड़ने पर सुरक्षित रासायनिक दवाओं की सही खुराक प्राप्त करें।',
    featureEn: 'Dosages & Direct Store Links',
    featureHi: 'सटीक खुराक व ऑनलाइन खरीद लिंक'
  },
  {
    stepNumber: 4,
    titleEn: 'Download Official PDF Pathology Report',
    titleHi: 'आधिकारिक पीडीएफ स्वास्थ्य रिपोर्ट डाउनलोड करें',
    descEn: 'Click the "Download Health Report (PDF)" button to generate a certified agricultural health report to print or save offline.',
    descHi: '"स्वास्थ्य रिपोर्ट डाउनलोड करें" बटन दबाकर प्रमाणिक पीडीएफ रिपोर्ट अपने फोन में सुरक्षित रखें या प्रिंट करें।',
    featureEn: 'Offline-Ready Printable Report',
    featureHi: 'ऑफ़लाइन प्रिंट-योग्य रिपोर्ट'
  },
  {
    stepNumber: 5,
    titleEn: 'Kisan Saathi Voice Assistant Support',
    titleHi: 'किसान साथी वॉइस सहायक से बात करें',
    descEn: 'Use your voice in Hindi or English to ask questions about fertilizer dosage, spray preparation, or weather advisories.',
    descHi: 'माइक पर क्लिक करके हिंदी में बोलकर पूछें और एआई से आवाज में ही अपनी भाषा में जवाब सुनें।',
    featureEn: 'Bilingual Voice In & Out',
    featureHi: 'दोतरफा हिंदी/अंग्रेजी वॉइस'
  }
];

export const HELPLINES: HelplineInfo[] = [
  {
    nameEn: 'Kisan Call Centre (Govt. of India)',
    nameHi: 'किसान कॉल सेंटर (भारत सरकार)',
    contact: '1800-180-1551',
    hoursEn: '6:00 AM - 10:00 PM (All 7 Days)',
    hoursHi: 'सुबह 6:00 से रात 10:00 बजे (सातों दिन)',
    purposeEn: 'Free agricultural scientist consultation in 22 local languages including Hindi.',
    purposeHi: 'सभी क्षेत्रीय भाषाओं (हिंदी सहित) में कृषि वैज्ञानिकों से निशुल्क सलाह।',
    link: 'tel:18001801551'
  },
  {
    nameEn: 'PM Kisan Helpline',
    nameHi: 'पीएम किसान हेल्पलाइन',
    contact: '155261 / 011-24300606',
    hoursEn: '24x7 Automated / Office Hours',
    hoursHi: '24x7 स्वचालित एवं कार्यालय समय',
    purposeEn: 'Assistance regarding farmer registrations, installment tracking, and government benefits.',
    purposeHi: 'किसान पंजीकरण, सम्मान निधि और सरकारी योजनाओं से संबंधित सहायता।',
    link: 'tel:155261'
  },
  {
    nameEn: 'ICAR - Indian Council of Agricultural Research',
    nameHi: 'भारतीय कृषि अनुसंधान परिषद (ICAR)',
    contact: '011-23388991',
    hoursEn: '9:30 AM - 5:30 PM (Mon-Fri)',
    hoursHi: 'सुबह 9:30 से शाम 5:30 (सोम-शुक्र)',
    purposeEn: 'National apex body for coordinating, guiding and managing agriculture research and education.',
    purposeHi: 'कृषि अनुसंधान, उन्नत बीज, कीट प्रबंधन व वैज्ञानिक परामर्श हेतु मुख्य राष्ट्रीय संस्थान।',
    link: 'https://icar.org.in'
  },
  {
    nameEn: 'Emergency Poison Control Centre (AIIMS)',
    nameHi: 'राष्ट्रीय विष नियंत्रण केंद्र (AIIMS)',
    contact: '1800-116-117 / 011-26589391',
    hoursEn: '24x7 Toll-Free Emergency',
    hoursHi: '24 घंटे आपातकालीन सेवा',
    purposeEn: 'Immediate medical assistance in case of accidental pesticide inhalation or exposure.',
    purposeHi: 'कीटनाशक के आकस्मिक संपर्क या सांस में जाने पर तुरंत चिकित्सीय आपातकालीन सहायता।',
    link: 'tel:1800116117'
  }
];
