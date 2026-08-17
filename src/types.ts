export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'None';
export type Language = 'en' | 'hi';

export interface EcoRemedy {
  name: string;
  nameHindi: string;
  dosage: string;
  dosageHindi: string;
  instructions: string;
  instructionsHindi: string;
  precautions: string;
  precautionsHindi: string;
  ecoRating: number; // 1-5 (5 is most eco-safe)
  safetyBadges: string[];
  safetyBadgesHindi: string[];
}

export interface MedicineProduct {
  name: string;
  nameHindi: string;
  type: 'organic' | 'chemical';
  purpose: string;
  purposeHindi: string;
  dosage: string;
  dosageHindi: string;
  amazonUrl: string;
  flipkartUrl: string;
  safetyWarning?: string;
  safetyWarningHindi?: string;
}

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  rainfallProbability: number;
  windSpeed: number;
  condition: string;
  conditionHindi: string;
  icon: string;
  diseaseRisk: {
    fungalRisk: 'Low' | 'Medium' | 'High';
    pestRisk: 'Low' | 'Medium' | 'High';
    bacterialRisk: 'Low' | 'Medium' | 'High';
    summaryEn: string;
    summaryHi: string;
    actionTipEn: string;
    actionTipHi: string;
  };
}

export interface DiseaseAlert {
  id: string;
  type: 'weather' | 'regional' | 'scanned-crop';
  severity: 'Critical' | 'Warning' | 'Advisory';
  cropName: string;
  cropNameHindi: string;
  diseaseName: string;
  diseaseNameHindi: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  recommendationEn: string;
  recommendationHi: string;
  timestamp: string;
}

export interface AlternativeDiagnosis {
  disease: string;
  diseaseHindi?: string;
  confidence: number;
}

export interface AnalysisResult {
  cropName: string;
  cropNameHindi: string;
  diseaseName: string;
  diseaseNameHindi: string;
  isHealthy: boolean;
  confidence: number; // 0 - 100
  severity: SeverityLevel;
  symptoms: string[];
  symptomsHindi: string[];
  causes?: string[];
  causesHindi?: string[];
  ecoRemedies?: EcoRemedy[];
  organicTreatment: string[];
  organicTreatmentHindi: string[];
  chemicalTreatment: string[];
  chemicalTreatmentHindi: string[];
  medicines?: MedicineProduct[];
  preventiveMeasures: string[];
  preventiveMeasuresHindi: string[];
  weatherAdvisoryEn?: string;
  weatherAdvisoryHi?: string;
  alternativeDiagnoses?: AlternativeDiagnosis[];
  summary: string;
  summaryHindi: string;
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  cropName: string;
  diseaseName: string;
  severity: SeverityLevel;
  isHealthy: boolean;
  confidence: number;
  language: Language;
  imagePreview: string; // Base64 or URL
  analysis: AnalysisResult;
}

export interface DashboardStats {
  totalScans: number;
  totalDiseased: number;
  totalHealthy: number;
  cropBreakdown: { name: string; count: number }[];
  severityBreakdown: { level: string; count: number }[];
  diseaseBreakdown: { name: string; count: number }[];
}

export interface VoiceAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBase64?: string;
  language?: Language;
}

