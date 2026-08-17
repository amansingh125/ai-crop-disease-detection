import { WeatherData, DiseaseAlert, PredictionRecord } from '../types';

export interface LocationOption {
  name: string;
  nameHi: string;
  lat: number;
  lon: number;
}

export const POPULAR_LOCATIONS: LocationOption[] = [
  { name: 'New Delhi (NCR)', nameHi: 'नई दिल्ली (एनसीआर)', lat: 28.6139, lon: 77.2090 },
  { name: 'Ludhiana, Punjab', nameHi: 'लुधियाना, पंजाब', lat: 30.9010, lon: 75.8573 },
  { name: 'Pune, Maharashtra', nameHi: 'पुणे, महाराष्ट्र', lat: 18.5204, lon: 73.8567 },
  { name: 'Varanasi, Uttar Pradesh', nameHi: 'वाराणसी, उत्तर प्रदेश', lat: 25.3176, lon: 82.9739 },
  { name: 'Patna, Bihar', nameHi: 'पटना, बिहार', lat: 25.5941, lon: 85.1376 },
  { name: 'Bhopal, Madhya Pradesh', nameHi: 'भोपाल, मध्य प्रदेश', lat: 23.2599, lon: 77.4126 },
  { name: 'Ahmedabad, Gujarat', nameHi: 'अहमदाबाद, गुजरात', lat: 23.0225, lon: 72.5714 },
  { name: 'Hyderabad, Telangana', nameHi: 'हैदराबाद, तेलंगाना', lat: 17.3850, lon: 78.4867 },
  { name: 'Bengaluru, Karnataka', nameHi: 'बेंगलुरु, कर्नाटक', lat: 12.9716, lon: 77.5946 },
  { name: 'Jaipur, Rajasthan', nameHi: 'जयपुर, राजस्थान', lat: 26.9124, lon: 75.7873 },
];

// Map WMO Weather Codes to descriptive conditions
function getWeatherDescription(code: number): { en: string; hi: string; icon: string } {
  if (code === 0) return { en: 'Clear Sky', hi: 'साफ आसमान', icon: 'Sun' };
  if (code === 1 || code === 2) return { en: 'Partly Cloudy', hi: 'आंशिक बादल', icon: 'CloudSun' };
  if (code === 3) return { en: 'Overcast', hi: 'घने बादल', icon: 'Cloud' };
  if (code >= 45 && code <= 48) return { en: 'Foggy / Mist', hi: 'कोहरा / धुंध', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { en: 'Rain Showers', hi: 'वर्षा / बारिश', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { en: 'Heavy Showers', hi: 'भारी बारिश', icon: 'CloudRainWind' };
  if (code >= 95) return { en: 'Thunderstorm', hi: 'आंधी-तूफान', icon: 'CloudLightning' };
  return { en: 'Normal Conditions', hi: 'सामान्य मौसम', icon: 'Sun' };
}

// Compute Disease Outbreak Risk from Weather Parameters
function calculateDiseaseRisk(temp: number, humidity: number, rainProb: number): WeatherData['diseaseRisk'] {
  let fungalRisk: 'Low' | 'Medium' | 'High' = 'Low';
  let bacterialRisk: 'Low' | 'Medium' | 'High' = 'Low';
  let pestRisk: 'Low' | 'Medium' | 'High' = 'Low';

  // Fungal Blight / Rust loves high humidity + warm temperatures
  if (humidity >= 80 && temp >= 20 && temp <= 30) {
    fungalRisk = 'High';
  } else if (humidity >= 65 || (temp >= 18 && temp <= 32)) {
    fungalRisk = 'Medium';
  }

  // Bacterial Rot thrives with high moisture / rainfall
  if (rainProb >= 60 || (humidity >= 85 && temp >= 25)) {
    bacterialRisk = 'High';
  } else if (rainProb >= 30 || humidity >= 70) {
    bacterialRisk = 'Medium';
  }

  // Sucking Pests / Mites thrive in hot dry spells
  if (temp >= 32 && humidity <= 50) {
    pestRisk = 'High';
  } else if (temp >= 28 && humidity <= 60) {
    pestRisk = 'Medium';
  }

  let summaryEn = '';
  let summaryHi = '';
  let actionTipEn = '';
  let actionTipHi = '';

  if (fungalRisk === 'High') {
    summaryEn = `High relative humidity (${humidity}%) and warm weather (${temp}°C) create optimal conditions for Early/Late Blight and Rust spore propagation.`;
    summaryHi = `उच्च आर्द्रता (${humidity}%) और तापमान (${temp}°C) झुलसा और रतुआ कवक के तेजी से फैलाव के लिए अनुकूल परिस्थितियां बना रहे हैं।`;
    actionTipEn = 'Apply protective bio-fungicides (Neem Oil / Trichoderma) or systemic fungicides before rainy spells.';
    actionTipHi = 'बारिश से पहले सुरक्षात्मक जैव कवकनाशी (नीम तेल / ट्राइकोडरमा) का छिड़काव करें।';
  } else if (pestRisk === 'High') {
    summaryEn = `Dry, warm weather (${temp}°C, ${humidity}% humidity) increases aphid, thrips, and mite infestation risks on tender foliage.`;
    summaryHi = `शुष्क और गर्म मौसम (${temp}°C, ${humidity}% नमी) कोमल पत्तियों पर माहू, थ्रिप्स और मकड़ी कीटों के प्रकोप को बढ़ाता है।`;
    actionTipEn = 'Inspect undersides of leaves and spray 5ml/L Neem oil or set yellow sticky traps in fields.';
    actionTipHi = 'पत्तियों की निचली सतह की जांच करें और 5 मिली/L नीम तेल का छिड़काव करें या पीले चिपचिपे ट्रैप लगाएं।';
  } else {
    summaryEn = `Current conditions (${temp}°C, ${humidity}% humidity) are generally stable with moderate crop disease vulnerability.`;
    summaryHi = `वर्तमान मौसम स्थिति (${temp}°C, ${humidity}% नमी) सामान्यतः स्थिर है और फसल रोग का जोखिम मध्यम है।`;
    actionTipEn = 'Maintain regular balanced irrigation and monitor leaf canopies weekly.';
    actionTipHi = 'नियमित संतुलित सिंचाई बनाए रखें और पत्तियों की साप्ताहिक निगरानी करें।';
  }

  return {
    fungalRisk,
    pestRisk,
    bacterialRisk,
    summaryEn,
    summaryHi,
    actionTipEn,
    actionTipHi
  };
}

export async function fetchWeatherData(lat: number, lon: number, locationName: string): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API returned ${res.status}`);
    }
    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 26);
    const humidity = Math.round(data.current?.relative_humidity_2m ?? 68);
    const windSpeed = Math.round(data.current?.wind_speed_10m ?? 12);
    const weatherCode = data.current?.weather_code ?? 0;
    
    // Average hourly rain probability or fallback
    const rainProbArray = data.hourly?.precipitation_probability || [];
    const rainProb = rainProbArray.length > 0 
      ? Math.round(rainProbArray.slice(0, 12).reduce((a: number, b: number) => a + b, 0) / 12)
      : 20;

    const weatherDesc = getWeatherDescription(weatherCode);
    const diseaseRisk = calculateDiseaseRisk(temp, humidity, rainProb);

    return {
      locationName,
      latitude: lat,
      longitude: lon,
      temperature: temp,
      humidity,
      rainfallProbability: rainProb,
      windSpeed,
      condition: weatherDesc.en,
      conditionHindi: weatherDesc.hi,
      icon: weatherDesc.icon,
      diseaseRisk
    };
  } catch (err) {
    console.warn('Using fallback weather data:', err);
    // Reliable realistic agricultural weather fallback
    const temp = 28;
    const humidity = 76;
    const rainProb = 35;
    return {
      locationName,
      latitude: lat,
      longitude: lon,
      temperature: temp,
      humidity,
      rainfallProbability: rainProb,
      windSpeed: 11,
      condition: 'Partly Cloudy',
      conditionHindi: 'आंशिक बादल',
      icon: 'CloudSun',
      diseaseRisk: calculateDiseaseRisk(temp, humidity, rainProb)
    };
  }
}

// Generate Outbreak Alerts based on Weather and Past Scans
export function generateDiseaseAlerts(weather: WeatherData, pastRecords: PredictionRecord[] = []): DiseaseAlert[] {
  const alerts: DiseaseAlert[] = [];
  const now = new Date().toISOString();

  // 1. Weather-based High Fungal Risk Alert
  if (weather.diseaseRisk.fungalRisk === 'High') {
    alerts.push({
      id: 'alert-weather-fungal',
      type: 'weather',
      severity: 'Critical',
      cropName: 'Tomato / Potato / Solanaceous Crops',
      cropNameHindi: 'टमाटर / आलू / सोलेनेसी फसलें',
      diseaseName: 'Early & Late Blight Outbreak Risk',
      diseaseNameHindi: 'अगेती व पछेती झुलसा प्रकोप चेतावनी',
      titleEn: `High Humidity (${weather.humidity}%) Alert: Blight Spore Trigger`,
      titleHi: `उच्च आर्द्रता (${weather.humidity}%) चेतावनी: झुलसा रोग का खतरा`,
      messageEn: `Current weather conditions in ${weather.locationName} (${weather.temperature}°C, ${weather.humidity}% RH) favor rapid spore germination of leaf blights and downy mildew.`,
      messageHi: `${weather.locationName} में वर्तमान मौसम (${weather.temperature}°C, ${weather.humidity}% नमी) झुलसा और डाउनी मिल्ड्यू फंगस के तेजी से फैलाव के लिए अति-संवेदनशील है।`,
      recommendationEn: 'Spray preventative Neem Oil (5ml/L) or Copper Oxychloride (3g/L) immediately. Ensure proper drainage.',
      recommendationHi: 'तुरंत नीम तेल (5 मिली/L) या कॉपर ऑक्सीक्लोराइड (3 ग्राम/L) का छिड़काव करें। जल निकासी दुरुस्त रखें।',
      timestamp: now
    });
  }

  // 2. Weather-based Rain / Spraying Advisory Alert
  if (weather.rainfallProbability >= 60) {
    alerts.push({
      id: 'alert-weather-rain',
      type: 'weather',
      severity: 'Warning',
      cropName: 'All Standing Crops',
      cropNameHindi: 'सभी खड़ी फसलें',
      diseaseName: 'Rain Warning: Chemical Washout Advisory',
      diseaseNameHindi: 'वर्षा चेतावनी: कीटनाशक छिड़काव से बचें',
      titleEn: `High Rain Chance (${weather.rainfallProbability}%): Delay Foliar Sprays`,
      titleHi: `बारिश की उच्च संभावना (${weather.rainfallProbability}%): स्प्रे टालें`,
      messageEn: `Expected rain in ${weather.locationName} will wash off foliar pesticide and fungicide applications. Save chemical costs by delaying application until rain stops.`,
      messageHi: `${weather.locationName} में संभावित बारिश पत्तियों पर छिड़के गए कवकनाशी को धो सकती है। बारिश रुकने तक छिड़काव टालें।`,
      recommendationEn: 'Wait until clear skies return before applying curative foliar treatments. Use sticker/spreader agent if urgent.',
      recommendationHi: 'उपचारात्मक पर्ण छिड़काव के लिए मौसम साफ होने की प्रतीक्षा करें। अत्यंत आवश्यक होने पर स्टीकर/स्प्रेडर मिलाएं।',
      timestamp: now
    });
  }

  // 3. Previously Scanned Crops Vulnerability Alert
  const scannedDiseases = pastRecords.filter(r => !r.isHealthy);
  if (scannedDiseases.length > 0) {
    const recentScan = scannedDiseases[0];
    if (weather.humidity >= 70) {
      alerts.push({
        id: `alert-scanned-${recentScan.id}`,
        type: 'scanned-crop',
        severity: recentScan.severity === 'High' ? 'Critical' : 'Warning',
        cropName: recentScan.cropName,
        cropNameHindi: recentScan.analysis?.cropNameHindi || recentScan.cropName,
        diseaseName: recentScan.diseaseName,
        diseaseNameHindi: recentScan.analysis?.diseaseNameHindi || recentScan.diseaseName,
        titleEn: `Follow-up Risk for your ${recentScan.cropName} Crop`,
        titleHi: `आपकी ${recentScan.analysis?.cropNameHindi || recentScan.cropName} फसल के लिए चेतावनी`,
        messageEn: `You scanned ${recentScan.cropName} with ${recentScan.diseaseName}. Current humidity (${weather.humidity}%) in ${weather.locationName} can trigger secondary infection cycles in neighboring plants.`,
        messageHi: `आपने हाल ही में ${recentScan.cropName} का स्कैन किया था जिसमें ${recentScan.diseaseName} पाई गई थी। वर्तमान नमी (${weather.humidity}%) पड़ोसी पौधों में संक्रमण बढ़ा सकती है।`,
        recommendationEn: 'Check adjacent crop rows. Remove infected leaves and apply recommended organic bio-fungicide.',
        recommendationHi: 'आसपास की फसल पंक्तियों की जांच करें। रोगग्रस्त पत्तियों को हटाएं और अनुशंसित जैविक उपचार अपनाएं।',
        timestamp: now
      });
    }
  }

  // 4. Regional Preventive Advisory (Always present if alerts count is low)
  if (alerts.length < 2) {
    alerts.push({
      id: 'alert-general-advisory',
      type: 'regional',
      severity: 'Advisory',
      cropName: 'Wheat, Rice & Vegetables',
      cropNameHindi: 'गेहूं, धान और मौसमी सब्जियां',
      diseaseName: 'Preventive Organic Foliar Care',
      diseaseNameHindi: 'निवारक जैविक पर्ण पोषण',
      titleEn: 'Seasonal Crop Protection Advisory',
      titleHi: 'मौसमी फसल सुरक्षा सलाह',
      messageEn: `Proactively boost plant leaf immunity with natural seaweed extract and balanced potassium before seasonal pest emergence.`,
      messageHi: `मौसमी कीटों और फंगस से पहले प्राकृतिक समुद्री शैवाल अर्क और संतुलित पोटाश से पत्तियों की प्रतिरोधक क्षमता बढ़ाएं।`,
      recommendationEn: 'Apply Seaweed extract foliar spray (2.5ml/L) and maintain clean weeding around field borders.',
      recommendationHi: 'सीवीड लिक्विड (2.5 मिली/L) का छिड़काव करें और मेड़ों पर खरपतवार नियंत्रण रखें।',
      timestamp: now
    });
  }

  return alerts;
}
