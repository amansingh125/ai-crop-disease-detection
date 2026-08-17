import { AnalysisResult } from '../types';

export interface SampleCrop {
  id: string;
  nameEn: string;
  nameHi: string;
  crop: string;
  disease: string;
  imageDataUrl: string;
  presetAnalysis: AnalysisResult;
}

// Crisp leaf SVG data URIs for instant testing
const generateLeafSvg = (bgColor: string, spotColor: string, label: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#f4f7f4"/>
    <g transform="translate(200, 200) rotate(-15)">
      <!-- Leaf main body -->
      <path d="M 0,-160 C 120,-100 160,80 0,170 C -160,80 -120,-100 0,-160 Z" fill="${bgColor}" stroke="#2e6b30" stroke-width="4"/>
      <!-- Main vein -->
      <path d="M 0,-155 Q 5,0 0,175" stroke="#235225" stroke-width="5" fill="none"/>
      <!-- Side veins -->
      <path d="M 0,-100 Q 40,-80 80,-70 M 0,-50 Q 50,-30 100,-20 M 0,0 Q 55,20 100,40 M 0,50 Q 50,70 80,90" stroke="#367a39" stroke-width="2" fill="none"/>
      <path d="M 0,-100 Q -40,-80 -80,-70 M 0,-50 Q -50,-30 -100,-20 M 0,0 Q -55,20 -100,40 M 0,50 Q -50,70 -80,90" stroke="#367a39" stroke-width="2" fill="none"/>
      
      <!-- Disease spots -->
      ${spotColor !== 'none' ? `
      <circle cx="30" cy="-40" r="22" fill="${spotColor}" opacity="0.85" stroke="#3d1e03" stroke-width="2"/>
      <circle cx="-40" cy="20" r="28" fill="${spotColor}" opacity="0.85" stroke="#3d1e03" stroke-width="2"/>
      <circle cx="20" cy="60" r="18" fill="${spotColor}" opacity="0.85" stroke="#3d1e03" stroke-width="2"/>
      <ellipse cx="-20" cy="-90" rx="15" ry="25" fill="${spotColor}" opacity="0.85"/>
      <circle cx="60" cy="10" r="14" fill="${spotColor}" opacity="0.8"/>
      ` : ''}
    </g>
    <!-- Label badge overlay -->
    <rect x="20" y="340" width="360" height="40" rx="8" fill="rgba(15, 30, 18, 0.85)"/>
    <text x="200" y="365" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const sampleCrops: SampleCrop[] = [
  {
    id: 'tomato-early-blight',
    nameEn: 'Tomato - Early Blight',
    nameHi: 'टमाटर - अगेती झुलसा',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    imageDataUrl: generateLeafSvg('#4ea352', '#7a3e1d', 'Tomato - Early Blight Spot'),
    presetAnalysis: {
      cropName: 'Tomato',
      cropNameHindi: 'टमाटर',
      diseaseName: 'Early Blight (Alternaria solani)',
      diseaseNameHindi: 'अगेती झुलसा (अल्टरनेरिया सोलेनाई)',
      isHealthy: false,
      confidence: 94,
      severity: 'Medium',
      symptoms: [
        'Dark brown to black concentric ring spots on older leaves',
        'Yellowing halo around dark lesions',
        'Leaf defoliation starting from the lower canopy',
        'Target-board appearance on spots'
      ],
      symptomsHindi: [
        'पुरानी पत्तियों पर गहरे भूरे से काले संकेंद्री गोलाकार धब्बे',
        'काले घावों के चारों ओर पीला प्रभामंडल',
        'निचले हिस्से से पत्तियों का गिरना',
        'धब्बों पर निशाने की बोर्ड जैसी आकृति'
      ],
      causes: [
        'Pathogen: Alternaria solani fungal spores overwintering in crop debris',
        'Trigger: High humidity (>80%) combined with warm temperatures (24-29°C)',
        'Splashing rainwater transferring fungal spores from soil to lower foliage'
      ],
      causesHindi: [
        'रोगजनक: अल्टरनेरिया सोलेनाई कवक के बीजाणु जो पुरानी फसल के अवशेषों में जीवित रहते हैं',
        'कारण: उच्च आर्द्रता (>80%) और गर्म तापमान (24-29°C) का अनुकूल मेल',
        'बारिश की बूंदों से मिट्टी के बीजाणु निचली पत्तियों पर उछलना'
      ],
      ecoRemedies: [
        {
          name: 'Cold-Pressed Pure Neem Oil (10000 PPM)',
          nameHindi: 'शुद्ध नीम का तेल (10000 PPM)',
          dosage: '5 ml per liter of water + 1 ml liquid soap',
          dosageHindi: '5 मिली प्रति लीटर पानी + 1 मिली तरल साबुन',
          instructions: 'Emulsify neem oil with soap in warm water. Spray thoroughly on upper and lower leaf surfaces during early morning or late evening.',
          instructionsHindi: 'नीम के तेल को गुनगुने पानी में साबुन के साथ घोलें। सुबह या शाम को पत्तियों की दोनों सतहों पर अच्छी तरह छिड़कें।',
          precautions: 'Do not spray under harsh direct afternoon sunlight to prevent leaf scorch.',
          precautionsHindi: 'पत्तियों को झुलसने से बचाने के लिए दोपहर की तेज धूप में छिड़काव न करें।',
          ecoRating: 5,
          safetyBadges: ['100% Organic', 'Pollinator Friendly', 'Zero Residue'],
          safetyBadgesHindi: ['100% जैविक', 'मधुमक्खी सुरक्षित', 'शून्य अवशेष']
        },
        {
          name: 'Trichoderma Viride Bio-Fungicide',
          nameHindi: 'ट्राइकोडरमा विरिडी जैव-कवकनाशी',
          dosage: '5-10 grams per liter of water',
          dosageHindi: '5-10 ग्राम प्रति लीटर पानी',
          instructions: 'Mix with water and spray on foliage as well as drench the root zone. Beneficial fungi parasitize pathogenic Alternaria spores.',
          instructionsHindi: 'पानी में मिलाकर पत्तियों पर छिड़कें और जड़ों के पास डालें। यह लाभकारी कवक रोगजनक बीजाणुओं को नष्ट करता है।',
          precautions: 'Do not mix with chemical fungicides or bactericides simultaneously.',
          precautionsHindi: 'रासायनिक कवकनाशी के साथ मिलाकर एक साथ प्रयोग न करें।',
          ecoRating: 5,
          safetyBadges: ['Bio-Control Agent', 'Soil Microbiome Booster'],
          safetyBadgesHindi: ['जैव नियंत्रण', 'मिट्टी उर्वरता वर्धक']
        },
        {
          name: 'Fermented Sour Buttermilk & Garlic Spray',
          nameHindi: 'खट्टी छाछ और लहसुन का देशी काढ़ा',
          dosage: '100 ml buttermilk + 20 ml garlic extract per liter',
          dosageHindi: '100 मिली छाछ + 20 मिली लहसुन अर्क प्रति लीटर',
          instructions: 'Ferment sour buttermilk for 4-5 days in a copper vessel, strain, and spray every 7 days.',
          instructionsHindi: 'तांबे के बर्तन में 4-5 दिन खट्टी छाछ रखें, छानकर हर 7 दिन में छिड़काव करें।',
          precautions: 'Strain well through fine cloth to prevent nozzle clogging.',
          precautionsHindi: 'स्प्रेयर नोजल जाम होने से बचाने के लिए कपड़े से अच्छी तरह छानें।',
          ecoRating: 5,
          safetyBadges: ['Zero Cost Recipe', 'Safe for All Crops'],
          safetyBadgesHindi: ['शून्य लागत', 'सभी फसलों के लिए सुरक्षित']
        }
      ],
      organicTreatment: [
        'Spray Neem oil extract (5ml per liter of water) every 7-10 days.',
        'Apply Trichoderma viride or Bacillus subtilis bio-fungicide.',
        'Prune and safely destroy lower infected leaves to improve air circulation.'
      ],
      organicTreatmentHindi: [
        'हर 7-10 दिनों में नीम तेल के अर्क (5 मिली प्रति लीटर पानी) का छिड़काव करें।',
        'ट्राइकोडरमा विरिडी या बैसिलस सबटिलिस जैव कवकनाशी का प्रयोग करें।',
        'हवा के संचलन में सुधार के लिए निचले संक्रमित पत्तों को काटकर नष्ट करें।'
      ],
      chemicalTreatment: [
        'Spray Mancozeb 75% WP @ 2.5g/L or Copper Oxychloride 50% WP @ 3g/L.',
        'For severe infections, apply Azoxystrobin 23% SC @ 1ml/L.'
      ],
      chemicalTreatmentHindi: [
        'मैनकोज़ेब 75% डब्लूपी @ 2.5 ग्राम/लीटर या कॉपर ऑक्सीक्लोराइड 50% डब्लूपी @ 3 ग्राम/लीटर का छिड़काव करें।',
        'गंभीर संक्रमण के लिए, एजोक्सीस्ट्रोबिन 23% एससी @ 1 मिली/लीटर लगाएं।'
      ],
      medicines: [
        {
          name: 'Organic Neem Oil 10,000 PPM Bio-Pesticide',
          nameHindi: 'जैविक नीम तेल 10000 PPM',
          type: 'organic',
          purpose: 'Broad spectrum organic anti-fungal and pest deterrent for leaf blight and mites',
          purposeHindi: 'पत्ती झुलसा और कीटों के लिए जैविक कवकनाशी व कीटनाशक',
          dosage: '5 ml / Liter water',
          dosageHindi: '5 मिली / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=organic+neem+oil+10000+ppm+agriculture',
          flipkartUrl: 'https://www.flipkart.com/search?q=neem+oil+agriculture+10000+ppm'
        },
        {
          name: 'Trichoderma Viride Bio-Fungicide Powder',
          nameHindi: 'ट्राइकोडरमा विरिडी बायो फंगीसाइड',
          type: 'organic',
          purpose: 'Biological control agent for root rot, damping off, and foliar fungal blights',
          purposeHindi: 'जड़ सड़न और पत्ती झुलसा रोकने हेतु जैविक फफूंदनाशी',
          dosage: '5 g / Liter water',
          dosageHindi: '5 ग्राम / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=trichoderma+viride+bio+fungicide',
          flipkartUrl: 'https://www.flipkart.com/search?q=trichoderma+viride'
        },
        {
          name: 'Mancozeb 75% WP Contact Fungicide (Indofil M-45)',
          nameHindi: 'मैनकोज़ेब 75% WP कवकनाशी (इंडोफिल M-45)',
          type: 'chemical',
          purpose: 'Protective contact fungicide providing multisite disease control against Early Blight',
          purposeHindi: 'अगेती झुलसा के विरुद्ध प्रभावी सुरक्षात्मक कवकनाशी',
          dosage: '2.5 g / Liter water',
          dosageHindi: '2.5 ग्राम / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=mancozeb+75+wp+fungicide',
          flipkartUrl: 'https://www.flipkart.com/search?q=mancozeb+75+wp',
          safetyWarning: 'Wear protective mask and gloves. Observe 7-day pre-harvest waiting interval.',
          safetyWarningHindi: 'मास्क व दस्ताने पहनें। फसल कटाई से 7 दिन पहले छिड़काव बंद करें।'
        }
      ],
      preventiveMeasures: [
        'Rotate crops with non-solanaceous crops (e.g. legumes or corn) for 2-3 years.',
        'Use drip irrigation instead of overhead watering to keep foliage dry.',
        'Mulch soil with straw or plastic to prevent fungal spores from splashing onto lower foliage.'
      ],
      preventiveMeasuresHindi: [
        '2-3 वर्षों के लिए गैर-सोलनेसी फसलों (जैसे दलहन या मक्का) के साथ फसल चक्र अपनाएं।',
        'पत्तियों को सूखा रखने के लिए फव्वारे के बजाय ड्रिप सिंचाई का प्रयोग करें।',
        'मिट्टी पर पुआल या मल्चिंग करें ताकि बीजाणु निचली पत्तियों पर न उछलें।'
      ],
      weatherAdvisoryEn: 'High humidity (>75%) combined with warm temperatures accelerates Early Blight sporulation. Apply bio-fungicide before rainy forecast.',
      weatherAdvisoryHi: '75% से अधिक आर्द्रता और गर्म मौसम अगेती झुलसा के फैलाव को तेज करता है। बारिश से पहले जैविक कवकनाशी का छिड़काव करें।',
      summary: 'Early Blight is a common fungal leaf spot affecting tomato crops. Timely fungicide application and removal of lower foliage will halt disease spread.',
      summaryHindi: 'अगेती झुलसा टमाटर की फसल को प्रभावित करने वाला एक सामान्य फंगल रोग है। समय पर कवकनाशी छिड़काव और निचली पत्तियों को हटाने से बीमारी का फैलाव रुक जाएगा।'
    }
  },
  {
    id: 'potato-late-blight',
    nameEn: 'Potato - Late Blight',
    nameHi: 'आलू - पछेती झुलसा',
    crop: 'Potato',
    disease: 'Late Blight (Phytophthora infestans)',
    imageDataUrl: generateLeafSvg('#3d8c41', '#281a10', 'Potato - Late Blight Lesions'),
    presetAnalysis: {
      cropName: 'Potato',
      cropNameHindi: 'आलू',
      diseaseName: 'Late Blight (Phytophthora infestans)',
      diseaseNameHindi: 'पछेती झुलसा (फाइटोफ्थोरा इन्फेस्टैन्स)',
      isHealthy: false,
      confidence: 96,
      severity: 'High',
      symptoms: [
        'Water-soaked pale green or dark brown water lesions on leaves',
        'White cottony fungal growth on underside of leaves in humid weather',
        'Rapid wilting and decay of entire foliage stem within days'
      ],
      symptomsHindi: [
        'पत्तियों पर पानी से भीगे हुए हल्के हरे या गहरे भूरे धब्बे',
        'नमी वाले मौसम में पत्तियों के निचले हिस्से पर सफेद रुई जैसा फंगल विकास',
        'कुछ ही दिनों में पूरे तने और पत्तियों का तेजी से मुरझाना और सड़ना'
      ],
      causes: [
        'Oomycete pathogen Phytophthora infestans spreading rapidly in cool wet climates',
        'Free water film on leaves for 6+ hours with relative humidity above 90%',
        'Infected seed tubers carrying latent fungal mycelium'
      ],
      causesHindi: [
        'फाइटोफ्थोरा इन्फेस्टैन्स रोगजनक जो ठंडे और नम मौसम में तेजी से फैलता है',
        'पत्तियों पर 6 घंटे से अधिक समय तक पानी की बूंदें और 90% से अधिक नमी',
        'संक्रमित बीज कंदों में छुपा हुआ कवक'
      ],
      ecoRemedies: [
        {
          name: 'Bordeaux Mixture / Organic Copper Hydroxide',
          nameHindi: 'बोर्डो मिश्रण / कॉपर हाइड्रोक्साइड',
          dosage: '1% solution (10g copper sulfate + 10g lime in 1L water)',
          dosageHindi: '1% घोल (10 ग्राम नीला थोथा + 10 ग्राम चूना प्रति 1L पानी)',
          instructions: 'Prepare fresh Bordeaux mixture and spray immediately covering both sides of foliage.',
          instructionsHindi: 'ताजा बोर्डो मिश्रण तैयार करें और पत्तियों के दोनों तरफ तुरंत छिड़काव करें।',
          precautions: 'Use earthen or plastic containers for mixing; avoid metallic vessels.',
          precautionsHindi: 'घोल बनाने के लिए प्लास्टिक या मिट्टी के बर्तन का प्रयोग करें, लोहे के बर्तन से बचें।',
          ecoRating: 4,
          safetyBadges: ['Certified Organic Fungicide', 'Strong Preventive Film'],
          safetyBadgesHindi: ['प्रमाणित जैविक कवकनाशी', 'मजबूत सुरक्षा कवच']
        },
        {
          name: 'Bacillus Subtilis Bio-Fungicide',
          nameHindi: 'बैसिलस सबटिलिस जैव कवकनाशी',
          dosage: '5 ml / Liter water',
          dosageHindi: '5 मिली / लीटर पानी',
          instructions: 'Beneficial antagonistic bacteria that outcompete Phytophthora zoospores.',
          instructionsHindi: 'यह लाभकारी जीवाणु रोगजनक बीजाणुओं को रोकते हैं।',
          precautions: 'Store in cool dry place away from sunlight.',
          precautionsHindi: 'सीधी धूप से दूर ठंडी व सूखी जगह पर रखें।',
          ecoRating: 5,
          safetyBadges: ['Bio-Friendly', 'Residue Free'],
          safetyBadgesHindi: ['पर्यावरण हितैषी', 'शून्य अवशेष']
        }
      ],
      organicTreatment: [
        'Spray copper-based organic liquid fungicide immediately.',
        'Spray garlic extract or fermented buttermilk solution (10% strength).'
      ],
      organicTreatmentHindi: [
        'तुरंत तांबा आधारित जैविक तरल कवकनाशी का छिड़काव करें।',
        'लहसुन के अर्क या किण्वित छाछ के घोल (10% सांद्रता) का छिड़काव करें।'
      ],
      chemicalTreatment: [
        'Apply Metalaxyl 8% + Mancozeb 64% WP @ 2g/L as a curative systemic spray.',
        'Follow up with Cymoxanil + Mancozeb @ 2g/L after 7 days.'
      ],
      chemicalTreatmentHindi: [
        'सिस्टमिक छिड़काव के रूप में मेटलैक्सिल 8% + मैनकोज़ेब 64% डब्लूपी @ 2 ग्राम/लीटर लगाएं।',
        '7 दिनों के बाद साइमोक्सानिल + मैनकोज़ेब @ 2 ग्राम/लीटर का छिड़काव करें।'
      ],
      medicines: [
        {
          name: 'Ridomil Gold (Metalaxyl-M 4% + Mancozeb 64% WP)',
          nameHindi: 'रिडोमिल गोल्ड (मेटलैक्सिल + मैनकोज़ेब)',
          type: 'chemical',
          purpose: 'High potency systemic and contact curative fungicide against Late Blight',
          purposeHindi: 'पछेती झुलसा के लिए शक्तिशाली उपचारात्मक कवकनाशी',
          dosage: '2 g / Liter water',
          dosageHindi: '2 ग्राम / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=ridomil+gold+fungicide',
          flipkartUrl: 'https://www.flipkart.com/search?q=ridomil+gold',
          safetyWarning: 'Do not spray during flower blooming period. Follow 14-day safety window.',
          safetyWarningHindi: 'फूल आने पर छिड़काव न करें। 14 दिन का सुरक्षा अंतराल रखें।'
        },
        {
          name: 'Copper Oxychloride 50% WP (Blitox / Blue Copper)',
          nameHindi: 'कॉपर ऑक्सीक्लोराइड 50% WP (ब्लाईटॉक्स)',
          type: 'chemical',
          purpose: 'Broad spectrum protective copper fungicide against fungal and bacterial blights',
          purposeHindi: 'कवक और जीवाणु झुलसा के विरुद्ध व्यापक सुरक्षात्मक कवकनाशी',
          dosage: '3 g / Liter water',
          dosageHindi: '3 ग्राम / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=copper+oxychloride+50+wp',
          flipkartUrl: 'https://www.flipkart.com/search?q=copper+oxychloride'
        }
      ],
      preventiveMeasures: [
        'Plant disease-resistant certified seed tubers.',
        'Ensure proper field drainage and avoid overwatering.',
        'Destroy volunteer potato plants and crop debris before planting.'
      ],
      preventiveMeasuresHindi: [
        'रोग प्रतिरोधी प्रमाणित बीज कंद बोएं।',
        'खेत में उचित जल निकासी सुनिश्चित करें और अत्यधिक सिंचाई से बचें।',
        'बुवाई से पहले पुराने आलू के अवशेषों और पौधों को नष्ट कर दें।'
      ],
      weatherAdvisoryEn: 'CRITICAL ALERT: Dense fog and cool temperatures (15-20°C) with RH >85% creates an emergency risk of Late Blight outbreak. Spray systemic fungicide immediately.',
      weatherAdvisoryHi: 'अति-गंभीर चेतावनी: घना कोहरा और 15-20°C तापमान पछेती झुलसा महामारी का तीव्र खतरा पैदा करते हैं। तुरंत प्रणालीगत कवकनाशी का छिड़काव करें।',
      summary: 'Late Blight is a destructive water-mold disease capable of destroying potato fields rapidly in humid cool conditions. Immediate curative systemic fungicide spraying is advised.',
      summaryHindi: 'पछेती झुलसा एक विनाशकारी बीमारी है जो ठंडे व नम मौसम में आलू के खेतों को तेजी से नष्ट कर सकती है। तुरंत प्रणालीगत कवकनाशी छिड़काव की सलाह दी जाती है।'
    }
  },
  {
    id: 'wheat-rust',
    nameEn: 'Wheat - Brown Rust',
    nameHi: 'गेहूं - भूरा रतुआ',
    crop: 'Wheat',
    disease: 'Leaf Rust (Puccinia triticina)',
    imageDataUrl: generateLeafSvg('#6ba33b', '#bf5700', 'Wheat - Leaf Rust Pustules'),
    presetAnalysis: {
      cropName: 'Wheat',
      cropNameHindi: 'गेहूं',
      diseaseName: 'Wheat Leaf Rust (Puccinia triticina)',
      diseaseNameHindi: 'गेहूं का भूरा रतुआ (पुकीनिया ट्रिटिसिना)',
      isHealthy: false,
      confidence: 92,
      severity: 'Medium',
      symptoms: [
        'Small oval orange to reddish-brown pustules scattered on upper leaf surface',
        'Powdery orange dust rubbing off onto fingers when touched',
        'Premature leaf drying and reduced grain weight'
      ],
      symptomsHindi: [
        'पत्ती की ऊपरी सतह पर छोटे अंडाकार नारंगी से लाल-भूरे रंग के फफोले',
        'छूने पर उंगलियों पर नारंगी पाउडर जैसी धूल लगना',
        'समय से पहले पत्तियों का सूखना और दाने का वजन कम होना'
      ],
      causes: [
        'Airborne urediniospores of Puccinia triticina blown across regions',
        'Mild winter temperatures (18-25°C) and persistent dew drops on leaves',
        'Susceptible non-resistant wheat cultivar cultivation'
      ],
      causesHindi: [
        'हवा में उड़ने वाले पुकीनिया ट्रिटिसिना बीजाणु जो दूर-दूर तक फैलते हैं',
        'हल्का गर्म तापमान (18-25°C) और पत्तियों पर रात भर ओस की बूंदें',
        'गैर-प्रतिरोधी गेहूं की किस्मों की बुवाई'
      ],
      ecoRemedies: [
        {
          name: 'Sour Buttermilk & Cow Urine Bio-Formulation',
          nameHindi: 'खट्टी छाछ एवं गोमूत्र का जैव काढ़ा',
          dosage: '50 ml cow urine + 100 ml sour buttermilk per liter',
          dosageHindi: '50 मिली गोमूत्र + 100 मिली खट्टी छाछ प्रति लीटर',
          instructions: 'Mix and spray every 10 days during flag leaf development stage to inhibit urediniospore germination.',
          instructionsHindi: 'झंडा पत्ती आने के समय हर 10 दिन में छिड़कें ताकि बीजाणु अंकुरित न हो सकें।',
          precautions: 'Use fresh cow urine from desi cows if available; filter thoroughly.',
          precautionsHindi: 'देशी गाय का ताजा गोमूत्र उपयोग करें और अच्छी तरह छानें।',
          ecoRating: 5,
          safetyBadges: ['Traditional Organic', 'Zero Chemical Residue'],
          safetyBadgesHindi: ['पारंपरिक जैविक', 'शून्य रासायनिक अवशेष']
        },
        {
          name: 'Pseudomonas Fluorescens Bio-Fungicide',
          nameHindi: 'स्यूडोमोनास फ्लोरेसेंस जैव कवकनाशी',
          dosage: '10 grams / Liter water',
          dosageHindi: '10 ग्राम / लीटर पानी',
          instructions: 'Liquid or talc bio-formulation triggering Systemic Acquired Resistance (SAR) in cereals.',
          instructionsHindi: 'यह फसलों की प्राकृतिक रोग प्रतिरोधक क्षमता को बढ़ाता है।',
          precautions: 'Apply in morning or evening when relative humidity is favorable.',
          precautionsHindi: 'सुबह या शाम के समय छिड़कें जब नमी अच्छी हो।',
          ecoRating: 5,
          safetyBadges: ['SAR Inducer', 'Eco-Friendly'],
          safetyBadgesHindi: ['प्रतिरोधक क्षमता वर्धक', 'पर्यावरण हितैषी']
        }
      ],
      organicTreatment: [
        'Apply neem seed kernel extract (NSKE 5%).',
        'Spray cow urine + sour buttermilk fermented solution.'
      ],
      organicTreatmentHindi: [
        'नीम की खली के अर्क (NSKE 5%) का प्रयोग करें।',
        'गौमूत्र + खट्टी छाछ के किण्वित घोल का छिड़काव करें।'
      ],
      chemicalTreatment: [
        'Spray Propiconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC @ 1.25ml/L.'
      ],
      chemicalTreatmentHindi: [
        'प्रोपिकोनाज़ोल 25% ईसी @ 1 मिली/लीटर या टेबुकोनाज़ोल 25.9% ईसी @ 1.25 मिली/लीटर का छिड़काव करें।'
      ],
      medicines: [
        {
          name: 'Tilt (Propiconazole 25% EC) Triazole Fungicide',
          nameHindi: 'टिल्ट (प्रोपिकोनाज़ोल 25% EC) कवकनाशी',
          type: 'chemical',
          purpose: 'Highly effective triazole fungicide for wheat rust, karnal bunt, and powdery mildew',
          purposeHindi: 'गेहूं के रतुआ और करनाल बंट के लिए अत्यंत प्रभावी कवकनाशी',
          dosage: '1 ml / Liter water (200 ml / acre)',
          dosageHindi: '1 मिली / लीटर पानी (200 मिली / एकड़)',
          amazonUrl: 'https://www.amazon.in/s?k=propiconazole+25+ec',
          flipkartUrl: 'https://www.flipkart.com/search?q=propiconazole+25+ec',
          safetyWarning: 'Highly toxic to aquatic life. Do not discharge into irrigation canals.',
          safetyWarningHindi: 'जलीय जीवों के लिए हानिकारक। तालाब या नहर में न बहाएं।'
        }
      ],
      preventiveMeasures: [
        'Sow rust-resistant varieties recommended for your agro-climatic zone (e.g. HD-2967, PBW-550, DBW-187).',
        'Avoid excessive nitrogen fertilizer application which promotes lush susceptible canopy.'
      ],
      preventiveMeasuresHindi: [
        'अपने कृषि-जलवायु क्षेत्र के लिए अनुशंसित रतुआ-प्रतिरोधी किस्में बोएं (जैसे HD-2967, DBW-187)।',
        'अत्यधिक नाइट्रोजन उर्वरक के प्रयोग से बचें जिससे संवेदनशील पत्तियां अधिक बढ़ती हैं।'
      ],
      weatherAdvisoryEn: 'Moderate temperatures with heavy morning dew facilitate rust germination. Inspect flag leaves weekly.',
      weatherAdvisoryHi: 'सुबह की भारी ओस और सुहावना तापमान रतुआ को बढ़ावा देते हैं। झंडा पत्ती की साप्ताहिक निगरानी करें।',
      summary: 'Wheat leaf rust causes premature defoliation and reduces grain fill. A single spray of Propiconazole effectively controls the disease.',
      summaryHindi: 'गेहूं का पत्ती रतुआ पत्तियों को सुखा देता है और दाने का भराव घटाता है। प्रोपिकोनाज़ोल का एक छिड़काव बीमारी को प्रभावी रूप से नियंत्रित करता है।'
    }
  },
  {
    id: 'rice-brown-spot',
    nameEn: 'Rice - Brown Spot',
    nameHi: 'चावल - भूरा धब्बा',
    crop: 'Rice',
    disease: 'Brown Spot (Bipolaris oryzae)',
    imageDataUrl: generateLeafSvg('#4ea352', '#8c4b18', 'Rice - Brown Spot Lesions'),
    presetAnalysis: {
      cropName: 'Rice',
      cropNameHindi: 'चावल (धान)',
      diseaseName: 'Brown Spot (Bipolaris oryzae)',
      diseaseNameHindi: 'धान का भूरा धब्बा (बाइपोलारिस ओराइजी)',
      isHealthy: false,
      confidence: 91,
      severity: 'Medium',
      symptoms: [
        'Circular to oval dark brown spots with a grey or whitish center on paddy leaves',
        'Discoloration and blighting of panicles and grain hulls',
        'Seedling blight leading to poor crop stand in nursery'
      ],
      symptomsHindi: [
        'धान की पत्तियों पर गोल से अंडाकार गहरे भूरे धब्बे जिनका केंद्र धूसर या सफेद होता है',
        'बालियों और दानों का बदरंग होना और सिकुड़ना',
        'नर्सरी में पौध का झुलसना और कमजोर जमाव'
      ],
      causes: [
        'Soil nutrient stress, particularly potassium and silicon deficiency',
        'Infected paddy seeds and un-decomposed straw left in the field',
        'Intermittent drought or low soil fertility conditions'
      ],
      causesHindi: [
        'मिट्टी में पोषक तत्वों की कमी, विशेषकर पोटाश और सिलिकॉन का अभाव',
        'संक्रमित धान के बीज और खेत में पराली के अवशेष',
        'सूखा या असंतुलित उर्वरक प्रयोग'
      ],
      ecoRemedies: [
        {
          name: 'Pseudomonas Fluorescens Seed & Foliar Treatment',
          nameHindi: 'स्यूडोमोनास फ्लोरेसेंस बीज व पर्ण उपचार',
          dosage: '10g / kg seed for treatment; 5g / L for foliar spray',
          dosageHindi: '10 ग्राम / किग्रा बीज उपचार; 5 ग्राम / L पर्ण छिड़काव',
          instructions: 'Treat seeds before sowing and spray at tillering stage.',
          instructionsHindi: 'बुवाई से पहले बीज उपचार करें और कल्ले फूटने के समय छिड़कें।',
          precautions: 'Keep bio-agent packet in cool shade.',
          precautionsHindi: 'बायो-एजेंट के पैकेट को ठंडी छांव में रखें।',
          ecoRating: 5,
          safetyBadges: ['Soil Bio-Enhancer', '100% Organic'],
          safetyBadgesHindi: ['मिट्टी पोषक', '100% जैविक']
        },
        {
          name: 'Wood Ash & Neem Cake Organic Soil Amendment',
          nameHindi: 'लकड़ी की राख और नीम की खली',
          dosage: '50 kg wood ash + 100 kg neem cake per acre',
          dosageHindi: '50 किग्रा राख + 100 किग्रा नीम खली प्रति एकड़',
          instructions: 'Broadcast into paddy soil to replenish potassium, silicon, and organic nitrogen.',
          instructionsHindi: 'पोटाश और सिलिकॉन की कमी पूरी करने हेतु खेत में बिखेरें।',
          precautions: 'Apply during field preparation or active tillering.',
          precautionsHindi: 'खेत की तैयारी या कल्ले फूटने के समय डालें।',
          ecoRating: 5,
          safetyBadges: ['Natural Potassium Source', 'Pest Repellent'],
          safetyBadgesHindi: ['प्राकृतिक पोटाश', 'कीट निवारक']
        }
      ],
      organicTreatment: [
        'Apply Pseudomonas fluorescens bio-fungicide @ 2.5 kg/ha mixed with 50 kg FYM.',
        'Apply balanced potassium and neem cake to strengthen leaf cell walls.'
      ],
      organicTreatmentHindi: [
        'स्यूडोमोनास फ्लोरेसेंस जैव कवकनाशी @ 2.5 किग्रा/हेक्टेयर को 50 किग्रा गोबर की खाद में मिलाकर डालें।',
        'पत्ती की कोशिका भित्ति को मजबूत करने के लिए संतुलित पोटाश और नीम खली डालें।'
      ],
      chemicalTreatment: [
        'Spray Hexaconazole 5% SC @ 2ml/L or Propiconazole 25% EC @ 1ml/L at boot leaf stage.'
      ],
      chemicalTreatmentHindi: [
        'हेक्साकोनाज़ोल 5% एससी @ 2 मिली/लीटर या प्रोपिकोनाज़ोल 25% ईसी @ 1 मिली/लीटर का छिड़काव करें।'
      ],
      medicines: [
        {
          name: 'Contaf Plus (Hexaconazole 5% SC) Systemic Fungicide',
          nameHindi: 'कोन्टाफ प्लस (हेक्साकोनाज़ोल 5% SC)',
          type: 'chemical',
          purpose: 'Broad spectrum systemic fungicide for rice sheath blight, brown spot, and blast',
          purposeHindi: 'धान के भूरा धब्बा, शीथ ब्लाइट और ब्लास्ट रोग हेतु कवकनाशी',
          dosage: '2 ml / Liter water',
          dosageHindi: '2 मिली / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=hexaconazole+5+sc',
          flipkartUrl: 'https://www.flipkart.com/search?q=hexaconazole+5+sc'
        }
      ],
      preventiveMeasures: [
        'Treat paddy seeds with Carbendazim 2g/kg seed or Trichoderma 10g/kg seed before sowing.',
        'Apply recommended dose of Potash (MOP) to prevent nutritional predisposition to Brown Spot.'
      ],
      preventiveMeasuresHindi: [
        'बुवाई से पहले बीजों को ट्राइकोडरमा 10 ग्राम/किग्रा या कार्बेन्डाजिम 2 ग्राम/किग्रा से उपचारित करें।',
        'भूरा धब्बा रोग से बचाव के लिए पोटाश (MOP) की संतुलित मात्रा का प्रयोग करें।'
      ],
      weatherAdvisoryEn: 'Cloudy weather with intermittent drizzles encourages Brown Spot. Ensure adequate field water drainage and top-dress potash.',
      weatherAdvisoryHi: 'बादल छाए रहने और रिमझिम फुहारों से भूरा धब्बा फैलता है। खेत में जल निकासी रखें और पोटाश का छिड़काव करें।',
      summary: 'Rice Brown Spot is associated with nutrient deficiency in sandy or leached soils. Balanced fertilization and seed treatment provide complete management.',
      summaryHindi: 'धान का भूरा धब्बा पोषक तत्वों की कमी से जुड़ा रोग है। संतुलित पोषण और बीज उपचार से पूर्ण नियंत्रण प्राप्त होता है।'
    }
  },
  {
    id: 'apple-healthy',
    nameEn: 'Apple - Healthy Leaf',
    nameHi: 'सेब - स्वस्थ पत्ती',
    crop: 'Apple',
    disease: 'None (Healthy Leaf)',
    imageDataUrl: generateLeafSvg('#2f8032', 'none', 'Apple - Healthy Foliage'),
    presetAnalysis: {
      cropName: 'Apple',
      cropNameHindi: 'सेब',
      diseaseName: 'Healthy Crop (No Disease Detected)',
      diseaseNameHindi: 'स्वस्थ फसल (कोई बीमारी नहीं पाई गई)',
      isHealthy: true,
      confidence: 98,
      severity: 'None',
      symptoms: [
        'Vibrant green uniform leaf color with smooth tissue structure',
        'No spots, lesions, discoloration or rust pustules observed'
      ],
      symptomsHindi: [
        'चिकनी संरचना के साथ चमकीला हरा एकसमान पत्ती का रंग',
        'कोई धब्बे, घाव, बदरंगता या रतुआ के फफोले नहीं देखे गए'
      ],
      causes: [
        'Optimal orchard soil nutrition, proper pruning aeration, and clean canopy management'
      ],
      causesHindi: [
        'संतुलित बगीचा पोषण, उचित छंटाई और हवादार धूप युक्त स्वस्थ वातावरण'
      ],
      ecoRemedies: [
        {
          name: 'Prophylactic Seaweed Extract Foliar Tonic',
          nameHindi: 'जैविक समुद्री शैवाल (Seaweed) अर्क',
          dosage: '2-3 ml per liter of water',
          dosageHindi: '2-3 मिली प्रति लीटर पानी',
          instructions: 'Spray once a month to boost chlorophyll synthesis and plant immunity against environmental stress.',
          instructionsHindi: 'क्लोरोफिल और पौधों की रोग प्रतिरोधक क्षमता बढ़ाने हेतु माह में एक बार छिड़कें।',
          precautions: 'Apply in morning or evening hours.',
          precautionsHindi: 'सुबह या शाम के समय छिड़काव करें।',
          ecoRating: 5,
          safetyBadges: ['100% Natural Growth Booster', 'Immunity Tonic'],
          safetyBadgesHindi: ['प्राकृतिक वृद्धि वर्धक', 'प्रतिरोधक टॉनिक']
        }
      ],
      organicTreatment: [
        'No curative action required.',
        'Maintain balanced organic soil nutrition with compost and bio-fertilizers.'
      ],
      organicTreatmentHindi: [
        'किसी उपचारात्मक कार्रवाई की आवश्यकता नहीं है।',
        'कंपोस्ट और जैव उर्वरकों के साथ संतुलित जैविक मिट्टी पोषण बनाए रखें।'
      ],
      chemicalTreatment: [
        'No chemical spray necessary.'
      ],
      chemicalTreatmentHindi: [
        'किसी भी रासायनिक छिड़काव की आवश्यकता नहीं है।'
      ],
      medicines: [
        {
          name: 'Organic Seaweed Extract Liquid Fertilizer',
          nameHindi: 'ऑर्गेनिक सीवीड लिक्विड खाद',
          type: 'organic',
          purpose: 'Natural plant growth booster with 60+ micronutrients to keep foliage disease resistant',
          purposeHindi: '60+ सूक्ष्म पोषक तत्वों से युक्त पौधों का प्राकृतिक टॉनिक',
          dosage: '2.5 ml / Liter water',
          dosageHindi: '2.5 मिली / लीटर पानी',
          amazonUrl: 'https://www.amazon.in/s?k=organic+seaweed+liquid+fertilizer',
          flipkartUrl: 'https://www.flipkart.com/search?q=seaweed+fertilizer'
        }
      ],
      preventiveMeasures: [
        'Perform seasonal pruning to maintain sunlight penetration.',
        'Apply bio-fungicides proactively during wet bloom periods.'
      ],
      preventiveMeasuresHindi: [
        'धूप के प्रवेश को बनाए रखने के लिए मौसमी छंटाई करें।',
        'गीले फूल आने की अवधि के दौरान एहतियातन जैव कवकनाशी लगाएं।'
      ],
      weatherAdvisoryEn: 'Optimal weather conditions detected. Continue monitoring soil moisture levels.',
      weatherAdvisoryHi: 'अनुकूल मौसम दर्ज किया गया। मिट्टी में नमी का स्तर संतुलित बनाए रखें।',
      summary: 'The leaf sample shows vibrant, healthy plant cellular health. Continue regular balanced orchard management.',
      summaryHindi: 'पत्ती का नमूना जीवंत, स्वस्थ पौधों के स्वास्थ्य को प्रदर्शित करता है। नियमित संतुलित बगीचा प्रबंधन जारी रखें।'
    }
  }
];

