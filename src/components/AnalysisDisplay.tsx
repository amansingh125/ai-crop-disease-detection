import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, ShieldAlert, Sparkles, Printer, RefreshCw, 
  Leaf, FlaskConical, ShieldCheck, Stethoscope, FileText, Volume2, VolumeX,
  ShoppingCart, ExternalLink, Star, Shield, Info, Download, CloudSun, AlertCircle, HelpCircle
} from 'lucide-react';
import { PredictionRecord, Language } from '../types';
import { getTranslation } from '../translations';
import { ttsService } from '../utils/speechUtils';
import { generateCropHealthReportPdf } from '../utils/pdfGenerator';

interface AnalysisDisplayProps {
  record: PredictionRecord;
  language: Language;
  onScanAnother: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  record,
  language,
  onScanAnother,
  onOpenVoiceAssistant
}) => {
  const { analysis } = record;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [medicineFilter, setMedicineFilter] = useState<'all' | 'organic' | 'chemical'>('all');

  useEffect(() => {
    ttsService.registerStateChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => {
      ttsService.stop();
    };
  }, []);

  // Language localized fields
  const isHi = language === 'hi';
  const cropName = isHi && analysis.cropNameHindi ? analysis.cropNameHindi : analysis.cropName;
  const diseaseName = isHi && analysis.diseaseNameHindi ? analysis.diseaseNameHindi : analysis.diseaseName;
  const symptoms = isHi && analysis.symptomsHindi?.length ? analysis.symptomsHindi : analysis.symptoms;
  const causes = isHi && analysis.causesHindi?.length ? analysis.causesHindi : analysis.causes;
  const organicTreatment = isHi && analysis.organicTreatmentHindi?.length ? analysis.organicTreatmentHindi : analysis.organicTreatment;
  const chemicalTreatment = isHi && analysis.chemicalTreatmentHindi?.length ? analysis.chemicalTreatmentHindi : analysis.chemicalTreatment;
  const preventiveMeasures = isHi && analysis.preventiveMeasuresHindi?.length ? analysis.preventiveMeasuresHindi : analysis.preventiveMeasures;
  const summary = isHi && analysis.summaryHindi ? analysis.summaryHindi : analysis.summary;
  const weatherAdvisory = isHi && analysis.weatherAdvisoryHi ? analysis.weatherAdvisoryHi : analysis.weatherAdvisoryEn;
  const ecoRemedies = analysis.ecoRemedies || [];

  // Build comprehensive medicines list ensuring both organic and chemical options exist
  const baseMedicines = (analysis.medicines && analysis.medicines.length > 0) 
    ? [...analysis.medicines]
    : [];

  const searchCropFungicide = encodeURIComponent(`${record.cropName} ${record.diseaseName} fungicide`);
  const searchMancozeb = encodeURIComponent(`Mancozeb 75 WP agriculture`);
  const searchNeem = encodeURIComponent(`Organic Neem Oil 10000 PPM agriculture`);
  const searchTrichoderma = encodeURIComponent(`Trichoderma Viride bio fungicide`);

  // Ensure at least 2 organic and 2 chemical medicines exist
  const hasOrganic = baseMedicines.some(m => m.type === 'organic');
  const hasChemical = baseMedicines.some(m => m.type === 'chemical');

  const allMedicines = [...baseMedicines];

  if (!hasOrganic) {
    allMedicines.unshift(
      {
        name: 'Organic Neem Oil 10,000 PPM Bio-Pesticide',
        nameHindi: 'जैविक नीम तेल (10,000 PPM) बायो-पेस्टीसाइड',
        type: 'organic',
        purpose: 'Organic deterrent for fungal spores, powdery mildew, and piercing pests',
        purposeHindi: 'फफूंद बीजाणुओं, चूर्णिल आसिता एवं कीटों की रोकथाम हेतु जैविक सुरक्षा',
        dosage: '5 ml / Liter water + 1 ml liquid soap',
        dosageHindi: '5 मिली / लीटर पानी + 1 मिली तरल साबुन',
        amazonUrl: `https://www.amazon.in/s?k=${searchNeem}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${searchNeem}`
      },
      {
        name: 'Trichoderma Viride 1% W.P. Bio-Fungicide',
        nameHindi: 'ट्राइकोडरमा विरिडी 1% डब्ल्यूपी जैव कवकनाशी',
        type: 'organic',
        purpose: 'Beneficial antagonistic fungi that suppresses root rot, blights, and soil-borne pathogens',
        purposeHindi: 'जड़ सड़न, झुलसा और मिट्टी जनित कवक रोगों को नियंत्रित करने वाला लाभकारी जैविक कवक',
        dosage: '5-10 g / Liter water (foliar spray or root drench)',
        dosageHindi: '5-10 ग्राम / लीटर पानी (पत्तियों पर छिड़काव या जड़ों में)',
        amazonUrl: `https://www.amazon.in/s?k=${searchTrichoderma}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${searchTrichoderma}`
      }
    );
  }

  if (!hasChemical) {
    allMedicines.push(
      {
        name: `Targeted Protective Fungicide (Mancozeb 75% WP)`,
        nameHindi: `सुरक्षात्मक कवकनाशी (मैनकोज़ेब 75% डब्ल्यूपी)`,
        type: 'chemical',
        purpose: `Broad-spectrum contact fungicide against ${record.diseaseName} and leaf blight`,
        purposeHindi: `${record.diseaseName} एवं पर्ण झुलसा रोग पर प्रभावी सुरक्षात्मक कवकनाशी`,
        dosage: '2 - 2.5 g / Liter water',
        dosageHindi: '2 - 2.5 ग्राम / लीटर पानी',
        amazonUrl: `https://www.amazon.in/s?k=${searchMancozeb}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${searchMancozeb}`,
        safetyWarning: 'Wear gloves, face mask, and eye protection. Do not apply near water reservoirs or beehives.',
        safetyWarningHindi: 'दस्ताने व मास्क पहनकर ही छिड़काव करें। जल स्रोतों या मधुमक्खियों के पास छिड़काव न करें।'
      },
      {
        name: `Systemic Crop Medicine for ${record.cropName}`,
        nameHindi: `${record.cropName} हेतु सिस्टमिक फसल औषधि`,
        type: 'chemical',
        purpose: `Curative and translaminar systemic action targeting deep pathogen infections`,
        purposeHindi: `गहरी फफूंद संक्रमण को जड़ से समाप्त करने हेतु प्रणालीगत (सिस्टमिक) उपचार`,
        dosage: '1.5 - 2 g / Liter water',
        dosageHindi: '1.5 - 2 ग्राम / लीटर पानी',
        amazonUrl: `https://www.amazon.in/s?k=${searchCropFungicide}`,
        flipkartUrl: `https://www.flipkart.com/search?q=${searchCropFungicide}`,
        safetyWarning: 'Maintain minimum 7-10 days waiting period before harvesting crops after spray.',
        safetyWarningHindi: 'छिड़काव के बाद फसल की तुड़ाई में कम से कम 7-10 दिनों का अंतर रखें।'
      }
    );
  }

  // Filtered medicines based on user selection
  const filteredMedicines = allMedicines.filter((med) => {
    if (medicineFilter === 'all') return true;
    return med.type === medicineFilter;
  });

  // Severity Styling
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            {getTranslation(language, 'sevHigh')}
          </span>
        );
      case 'medium':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {getTranslation(language, 'sevMedium')}
          </span>
        );
      case 'low':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            {getTranslation(language, 'sevLow')}
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8F0E6] text-[#2D6A4F] border border-[#A3B18A] flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-[#52B788]" />
            {getTranslation(language, 'sevNone')}
          </span>
        );
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateCropHealthReportPdf('crop-health-report-container', record, language);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleToggleAudio = () => {
    if (isSpeaking) {
      ttsService.stop();
    } else {
      const speechText = isHi
        ? `फसल निदान रिपोर्ट: फसल का नाम ${cropName}। बीमारी: ${diseaseName}। रोग का स्तर ${analysis.severity}। सारांश: ${summary}। मुख्य जैविक उपाय: ${organicTreatment?.slice(0, 2).join('. ')}।`
        : `Crop Health Pathology Report: Crop is ${cropName}. Detected Condition: ${diseaseName}. Severity level is ${analysis.severity}. Summary: ${summary}. Recommended Organic Treatment: ${organicTreatment?.slice(0, 2).join('. ')}.`;
      ttsService.speak(speechText, language);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-6 space-y-6">
      
      {/* Report Container for PDF and Screen */}
      <div 
        id="crop-health-report-container"
        className="bg-white rounded-3xl border border-[#E8E1D9] shadow-sm p-6 sm:p-9 space-y-8 print:p-4 print:border-none print:shadow-none"
      >
        
        {/* Top Header & Export Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E1D9] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F0E6] text-[#1B4332] border border-[#A3B18A]/40 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
                {getTranslation(language, 'reportCertificate')}
              </span>
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                ID: {record.id}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight">
              {getTranslation(language, 'reportTitle')}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {getTranslation(language, 'generatedOn')}: {new Date(record.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Action Bar (Audio Readout, PDF, Print, Scan Another) */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            {/* Audio Voice Readout */}
            <button
              id="report-audio-readout-btn"
              onClick={handleToggleAudio}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                isSpeaking
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#E8F0E6] text-[#1B4332] hover:bg-[#52B788] hover:text-white'
              }`}
              title={isSpeaking ? 'Stop Audio' : 'Listen to Diagnosis'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? getTranslation(language, 'stopAudio') : getTranslation(language, 'listenAloud')}</span>
            </button>

            {/* Download PDF */}
            <button
              id="download-health-report-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 rounded-2xl bg-[#D4A373] hover:bg-[#BC8A5F] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? getTranslation(language, 'generatingPdf') : getTranslation(language, 'downloadPdf')}</span>
            </button>

            {/* Print */}
            <button
              id="print-report-btn"
              onClick={handlePrint}
              className="p-2.5 rounded-2xl bg-[#F8F9F8] hover:bg-gray-200 text-[#2D3436] border border-[#E8E1D9] transition-colors"
              title={getTranslation(language, 'printReport')}
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Scan Another */}
            <button
              id="scan-another-leaf-btn"
              onClick={onScanAnother}
              className="px-4 py-2.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{getTranslation(language, 'analyzeAnother')}</span>
            </button>
          </div>
        </div>

        {/* Primary Diagnosis Hero Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9]">
          
          {/* Leaf Image Frame */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-52 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#A3B18A]/50 shadow-md bg-white">
              <img
                src={record.imagePreview}
                alt="Analyzed Crop Leaf"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <span className="text-[11px] text-gray-500 font-semibold mt-2">
              📸 {getTranslation(language, 'cropType')}: {cropName}
            </span>
          </div>

          {/* Diagnostic Details */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase text-[#2D6A4F] tracking-wider">
                  {getTranslation(language, 'cropType')}: <strong className="text-[#1B4332] text-base ml-1">{cropName}</strong>
                </span>
                {getSeverityBadge(analysis.severity)}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#1B4332] leading-snug">
                {diseaseName}
              </h3>

              <div className="mt-2.5 text-xs sm:text-sm text-[#2D3436] bg-white p-4 rounded-2xl border border-[#E8E1D9] shadow-sm leading-relaxed space-y-1">
                <strong className="text-[#1B4332]">{getTranslation(language, 'summaryTitle')}:</strong>
                <p>{summary}</p>
              </div>
            </div>

            {/* AI Confidence Meter */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E1D9] space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-[#52B788]" />
                  {getTranslation(language, 'confidenceScore')}
                </span>
                <span className="text-sm font-black text-[#2D6A4F]">
                  {analysis.confidence || 90}%
                </span>
              </div>
              <div className="w-full bg-[#E8E1D9] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${
                    (analysis.confidence || 90) >= 95
                      ? 'bg-gradient-to-r from-emerald-500 to-[#1B4332]'
                      : (analysis.confidence || 90) >= 80
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-700'
                      : (analysis.confidence || 90) >= 60
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                      : 'bg-gradient-to-r from-rose-400 to-rose-600'
                  }`}
                  style={{ width: `${analysis.confidence || 90}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {(analysis.confidence || 90) >= 95
                  ? getTranslation(language, 'confidenceTierClear')
                  : (analysis.confidence || 90) >= 80
                  ? getTranslation(language, 'confidenceTierStrong')
                  : (analysis.confidence || 90) >= 60
                  ? getTranslation(language, 'confidenceTierModerate')
                  : getTranslation(language, 'confidenceTierUncertain')}
              </p>
            </div>
          </div>

        </div>

        {/* Alternative Diagnoses / Differential Pathology (When Present) */}
        {analysis.alternativeDiagnoses && analysis.alternativeDiagnoses.length > 0 && (
          <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#D4A373]/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E8E1D9] pb-2.5">
              <h4 className="font-bold text-[#936639] text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#D4A373]" />
                {getTranslation(language, 'alternativeDiagnosesTitle')}
              </h4>
              <span className="text-[11px] text-gray-500">
                {getTranslation(language, 'alternativeDiagnosesSubtitle')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {analysis.alternativeDiagnoses.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-2xl border border-[#E8E1D9] flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4A373]" />
                    <span className="text-xs sm:text-sm font-bold text-[#1B4332]">
                      {alt.disease}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#E8F0E6] text-[#2D6A4F] border border-[#A3B18A]/30">
                    {alt.confidence}% confidence
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Symptoms & Causes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Symptoms */}
          <div className="bg-[#F5EFE6]/60 p-6 rounded-3xl border border-[#E8E1D9] space-y-3">
            <h4 className="font-bold text-[#936639] text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#B08968]" />
              {getTranslation(language, 'symptomsTitle')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#2D3436]">
              {symptoms?.map((symptom: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08968] mt-2 flex-shrink-0" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes / Pathogen Origin */}
          <div className="bg-[#F4F9F4] p-6 rounded-3xl border border-[#A3B18A]/40 space-y-3">
            <h4 className="font-bold text-[#1B4332] text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#2D6A4F]" />
              {getTranslation(language, 'causesTitle')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#2D3436]">
              {causes && causes.length > 0 ? (
                causes.map((cause: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] mt-2 flex-shrink-0" />
                    <span>{cause}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-600">
                  {isHi
                    ? 'अनुकूल तापमान (20-30°C), उच्च सापेक्ष आर्द्रता और लंबे समय तक पत्तियों पर पानी रहने से कवक बीजाणु अंकुरित होते हैं।'
                    : 'High leaf wetness duration, relative humidity above 75%, and moderate temperatures promote fungal spore proliferation.'}
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Weather Vulnerability Advisory Banner */}
        {weatherAdvisory && (
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <CloudSun className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-amber-950">
                {getTranslation(language, 'weatherAdvisoryTitle')}
              </h5>
              <p className="leading-relaxed">{weatherAdvisory}</p>
            </div>
          </div>
        )}

        {/* Eco-Friendly Remedies Section (Requested Feature) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E1D9] pb-3">
            <div className="flex items-center gap-2.5">
              <Leaf className="w-5 h-5 text-[#2D6A4F]" />
              <h4 className="font-bold text-lg text-[#1B4332]">
                {getTranslation(language, 'ecoTitle')}
              </h4>
            </div>
            <span className="bg-[#E8F0E6] text-[#2D6A4F] text-xs font-bold px-3 py-1 rounded-full border border-[#A3B18A]/40">
              🌱 {language === 'hi' ? '100% सुरक्षित जैविक उपचार' : 'Zero Chemical Residue'}
            </span>
          </div>

          {ecoRemedies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecoRemedies.map((remedy, i) => (
                <div 
                  key={i} 
                  className="bg-[#FDFCFB] p-5 rounded-2xl border border-[#E8E1D9] hover:border-[#52B788] transition-colors space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-sm sm:text-base text-[#1B4332]">
                        {isHi ? remedy.nameHindi || remedy.name : remedy.name}
                      </h5>
                      <div className="flex items-center gap-1 mt-1 text-amber-500">
                        {[...Array(remedy.ecoRating || 5)].map((_, rIdx) => (
                          <Star key={rIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[11px] font-bold text-gray-500 ml-1">
                          ({remedy.ecoRating || 5}/5 Eco-Safe)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(isHi ? remedy.safetyBadgesHindi || remedy.safetyBadges : remedy.safetyBadges)?.map((badge, bIdx) => (
                        <span key={bIdx} className="bg-[#E8F0E6] text-[#2D6A4F] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#2D3436]">
                    <div className="bg-[#F4F9F4] p-2.5 rounded-xl border border-[#A3B18A]/30">
                      <strong className="text-[#1B4332] block mb-0.5">
                        📏 {getTranslation(language, 'dosage')}:
                      </strong>
                      <span>{isHi ? remedy.dosageHindi || remedy.dosage : remedy.dosage}</span>
                    </div>

                    <div>
                      <strong className="text-[#1B4332] block mb-0.5">
                        📋 {getTranslation(language, 'preparation')}:
                      </strong>
                      <p className="leading-relaxed">{isHi ? remedy.instructionsHindi || remedy.instructions : remedy.instructions}</p>
                    </div>

                    <div className="text-amber-800 text-[11px]">
                      <strong>⚠️ {getTranslation(language, 'precautions')}:</strong> {isHi ? remedy.precautionsHindi || remedy.precautions : remedy.precautions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#E8F0E6]/50 p-5 rounded-2xl border border-[#A3B18A]/40">
              <ul className="space-y-2 text-xs sm:text-sm text-[#2D3436]">
                {organicTreatment?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#52B788] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Medicine Purchase Integration Section (Requested Feature) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D9] pb-3">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-[#2D6A4F]" />
              <div>
                <h4 className="font-bold text-lg text-[#1B4332]">
                  {getTranslation(language, 'medicineTitle')}
                </h4>
                <p className="text-xs text-gray-500">
                  {getTranslation(language, 'medicineSubtitle')}
                </p>
              </div>
            </div>

            {/* Medicine Category Filter Tabs */}
            <div className="flex items-center bg-[#F0F2EF] p-1 rounded-full border border-[#E8E1D9] self-start sm:self-auto">
              <button
                type="button"
                id="med-filter-all-btn"
                onClick={() => setMedicineFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${
                  medicineFilter === 'all'
                    ? 'bg-white text-[#1B4332] shadow-xs'
                    : 'text-[#7F8C8D] hover:text-[#1B4332]'
                }`}
              >
                <span>{getTranslation(language, 'allMedicines')}</span>
                <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded-full">
                  {allMedicines.length}
                </span>
              </button>

              <button
                type="button"
                id="med-filter-organic-btn"
                onClick={() => setMedicineFilter('organic')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${
                  medicineFilter === 'organic'
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-[#7F8C8D] hover:text-[#1B4332]'
                }`}
              >
                <span>{getTranslation(language, 'ecoMedicines')}</span>
                <span className="text-[10px] bg-green-700 text-white px-1.5 py-0.2 rounded-full">
                  {allMedicines.filter(m => m.type === 'organic').length}
                </span>
              </button>

              <button
                type="button"
                id="med-filter-chem-btn"
                onClick={() => setMedicineFilter('chemical')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${
                  medicineFilter === 'chemical'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-[#7F8C8D] hover:text-[#1B4332]'
                }`}
              >
                <span>{getTranslation(language, 'chemMedicines')}</span>
                <span className="text-[10px] bg-blue-900 text-white px-1.5 py-0.2 rounded-full">
                  {allMedicines.filter(m => m.type === 'chemical').length}
                </span>
              </button>
            </div>
          </div>

          {/* Chemical Caution Banner if chemical tab or chemical medicine selected */}
          {medicineFilter === 'chemical' && (
            <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <FlaskConical className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-bold text-blue-950">
                  {language === 'hi' ? 'रासायनिक कवकनाशी सुरक्षा निर्देश:' : 'Chemical Application Safety Instructions:'}
                </strong>
                <p className="leading-relaxed text-blue-800">
                  {getTranslation(language, 'chemicalWarning')} {getTranslation(language, 'chemicalCautionNote')}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMedicines.map((med, idx) => (
              <div 
                key={idx}
                className={`bg-white p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  med.type === 'organic'
                    ? 'border-[#A3B18A]/40 hover:border-[#52B788] shadow-2xs hover:shadow-md'
                    : 'border-blue-200 hover:border-blue-400 shadow-2xs hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                      med.type === 'organic' 
                        ? 'bg-[#E8F0E6] text-[#2D6A4F] border border-[#A3B18A]/40' 
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {med.type === 'organic' ? (
                        <>
                          <Leaf className="w-3 h-3 text-[#2D6A4F]" />
                          <span>{getTranslation(language, 'medicineTypeOrganic')}</span>
                        </>
                      ) : (
                        <>
                          <FlaskConical className="w-3 h-3 text-blue-700" />
                          <span>{getTranslation(language, 'medicineTypeChemical')}</span>
                        </>
                      )}
                    </span>

                    <span className="text-[10px] text-gray-400 font-mono">
                      #{idx + 1}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm sm:text-base text-[#1B4332]">
                    {isHi ? med.nameHindi || med.name : med.name}
                  </h5>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isHi ? med.purposeHindi || med.purpose : med.purpose}
                  </p>

                  <div className="text-xs bg-[#F8F9F8] p-2.5 rounded-xl border border-[#E8E1D9]">
                    <strong className="text-[#1B4332] block mb-0.5">{getTranslation(language, 'dosage')}:</strong>
                    <span>{isHi ? med.dosageHindi || med.dosage : med.dosage}</span>
                  </div>

                  {med.safetyWarning && (
                    <p className="text-[11px] text-amber-800 bg-amber-50/60 p-2 rounded-lg border border-amber-200">
                      ⚠️ {isHi ? med.safetyWarningHindi || med.safetyWarning : med.safetyWarning}
                    </p>
                  )}
                </div>

                {/* Buy Buttons (Amazon & Flipkart) */}
                <div className="pt-2 flex items-center gap-2 print:hidden">
                  {med.amazonUrl && (
                    <a
                      href={med.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#FF9900] hover:bg-[#e68a00] text-black text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{getTranslation(language, 'buyAmazon')}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                  )}

                  {med.flipkartUrl && (
                    <a
                      href={med.flipkartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#2874F0] hover:bg-[#1a5bc2] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{getTranslation(language, 'buyFlipkart')}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Measures & Spray Timings */}
        <div className="bg-[#F8F9F8] p-6 rounded-3xl border border-[#E8E1D9] space-y-3">
          <h4 className="font-bold text-[#1B4332] text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#52B788]" />
            {getTranslation(language, 'preventionTitle')}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#2D3436]">
            {preventiveMeasures?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E8E1D9]">
                <CheckCircle className="w-4 h-4 text-[#52B788] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-[#E8E1D9] text-[#7F8C8D] text-xs italic text-center">
          {getTranslation(language, 'disclaimer')}
        </div>

      </div>

    </div>
  );
};
