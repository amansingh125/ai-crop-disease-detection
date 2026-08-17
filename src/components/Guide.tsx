import React, { useState } from 'react';
import {
  BookOpen,
  Camera,
  Leaf,
  ShieldAlert,
  CloudRain,
  PhoneCall,
  Server,
  CheckCircle2,
  XCircle,
  Sparkles,
  Droplets,
  AlertTriangle,
  ExternalLink,
  Clock,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
  Info,
  Phone,
  Cloud,
  Database,
  Cpu,
  ArrowRight,
  Sprout,
  Thermometer
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import {
  GUIDE_CATEGORIES,
  PHOTO_TIPS,
  ORGANIC_RECIPES,
  CHEMICAL_SAFETY_RULES,
  APP_STEPS,
  HELPLINES
} from '../data/guideData';

interface GuideProps {
  language: Language;
  onNavigateToScan?: () => void;
}

export const Guide: React.FC<GuideProps> = ({ language, onNavigateToScan }) => {
  const [activeCategory, setActiveCategory] = useState<string>('photo');
  const [copiedRecipeIndex, setCopiedRecipeIndex] = useState<number | null>(null);

  const isHi = language === 'hi';

  const handleCopyRecipe = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecipeIndex(index);
    setTimeout(() => setCopiedRecipeIndex(null), 2000);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-4 h-4" />;
      case 'Leaf':
        return <Leaf className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      case 'CloudRain':
        return <CloudRain className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'PhoneCall':
        return <PhoneCall className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#95D5B2]/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[#D8F3DC] text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#95D5B2]" />
            <span>{isHi ? 'किसान ज्ञान केंद्र एवं मार्गदर्शिका' : 'Farmer Knowledge Hub & Documentation'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {isHi ? 'उपयोगकर्ता मार्गदर्शिका एवं कृषि ज्ञान केंद्र' : 'Farmer User Guide & Agricultural Info'}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#D8F3DC] leading-relaxed">
            {isHi
              ? 'सटीक एआई जांच के लिए पत्ती की फोटो खींचने के नियम, घर पर जैविक कीटनाशक व काढ़े बनाने की विधियां, मौसम आधारित रोग जोखिम और किसान हेल्पलाइन की पूरी जानकारी।'
              : 'Master leaf photography for maximum AI diagnostic precision, explore verified organic pesticide recipes, chemical safety protocols, and 24x7 farmer helplines.'}
          </p>

          {onNavigateToScan && (
            <div className="mt-6">
              <button
                id="guide-start-scan-btn"
                onClick={onNavigateToScan}
                className="px-6 py-3 rounded-full bg-[#D4A373] hover:bg-[#BC8A5F] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 group"
              >
                <Sprout className="w-4 h-4" />
                <span>{isHi ? 'अभी फसल की पत्ती स्कैन करें' : 'Scan Crop Leaf Now'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GUIDE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`guide-tab-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-[#1B4332] text-white shadow-md shadow-green-900/10'
                  : 'bg-white text-[#2D3436] hover:bg-[#F0F2EF] border border-[#E8E1D9]'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{isHi ? cat.titleHi : cat.titleEn}</span>
              {(cat.badgeHi || cat.badgeEn) && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold hidden md:inline-block ${
                    isActive ? 'bg-white/20 text-[#D8F3DC]' : 'bg-[#E8F0E6] text-[#2D6A4F]'
                  }`}
                >
                  {isHi ? cat.badgeHi : cat.badgeEn}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CATEGORY 1: PHOTOGRAPHY TIPS (DOs & DONTs) */}
      {activeCategory === 'photo' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#E8E1D9] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2.5">
                <Camera className="w-6 h-6 text-[#52B788]" />
                <span>{isHi ? 'सटीक एआई जांच के लिए पत्ती की फोटो लेने के नियम' : 'Optimal Leaf Photography for 90%+ AI Diagnostic Accuracy'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
                {isHi
                  ? 'एआई मॉडल पत्ती की सूक्ष्म संरचना, फफूंद के बीजाणुओं और रंग परिवर्तन का विश्लेषण करता है। सर्वोत्तम परिणाम के लिए इन सुझावों का पालन करें:'
                  : 'The AI analyzes leaf texture, chlorosis borders, and fungal lesion morphology. Follow these photography dos and don’ts for crystal-clear results:'}
              </p>
            </div>

            {/* Dos & Don'ts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* DO SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#2D6A4F] font-bold text-sm uppercase tracking-wider pb-2 border-b border-[#E8F0E6]">
                  <CheckCircle2 className="w-5 h-5 text-[#52B788]" />
                  <span>{isHi ? 'क्या करें (DOs) - अनुशंसित' : 'Recommended Practices (DOs)'}</span>
                </div>

                {PHOTO_TIPS.filter(t => t.isDo).map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#E8F0E6]/60 border border-[#A3B18A]/40 flex items-start gap-3.5 hover:bg-[#E8F0E6] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B4332] text-sm sm:text-base">
                        {isHi ? tip.titleHi : tip.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#2D3436] mt-1 leading-relaxed">
                        {isHi ? tip.descHi : tip.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* DONT SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-700 font-bold text-sm uppercase tracking-wider pb-2 border-b border-red-100">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>{isHi ? 'क्या न करें (DON’Ts) - इनसे बचें' : 'Common Mistakes to Avoid (DON’Ts)'}</span>
                </div>

                {PHOTO_TIPS.filter(t => !t.isDo).map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-red-50/70 border border-red-200/80 flex items-start gap-3.5 hover:bg-red-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <XCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 text-sm sm:text-base">
                        {isHi ? tip.titleHi : tip.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-red-800 mt-1 leading-relaxed">
                        {isHi ? tip.descHi : tip.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 2: ORGANIC REMEDIES & RECIPES */}
      {activeCategory === 'organic' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#E8E1D9] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2.5">
                  <Leaf className="w-6 h-6 text-[#52B788]" />
                  <span>{isHi ? 'घर पर तैयार होने वाले जैविक घोल एवं कीटनाशक विधियां' : 'Home-Prepared Organic Remedies & Bio-Pesticide Recipes'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
                  {isHi
                    ? '100% पर्यावरण व मिट्टी के अनुकूल, कम लागत और हानिकारक रसायनों से मुक्त प्राकृतिक उपचार विधियां:'
                    : '100% organic, low-cost bio-formulations to cure blight, rust, mildew, and fungal pathogens naturally:'}
                </p>
              </div>
              <span className="self-start sm:self-auto px-4 py-1.5 rounded-full bg-[#E8F0E6] text-[#2D6A4F] font-bold text-xs border border-[#A3B18A]">
                {isHi ? '100% प्राकृतिक एवं सुरक्षित' : '100% Eco-Safe'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ORGANIC_RECIPES.map((recipe, index) => {
                const recipeText = `${isHi ? recipe.nameHi : recipe.nameEn}\n${isHi ? 'उपयोग:' : 'Target:'} ${isHi ? recipe.targetHi : recipe.targetEn}\n${isHi ? 'मात्रा:' : 'Dosage:'} ${isHi ? recipe.dosageHi : recipe.dosageEn}\n${isHi ? 'सामग्री:' : 'Ingredients:'}\n- ${(isHi ? recipe.ingredientsHi : recipe.ingredientsEn).join('\n- ')}\n${isHi ? 'बनाने की विधि:' : 'Steps:'}\n1. ${(isHi ? recipe.stepsHi : recipe.stepsEn).join('\n2. ')}`;
                const isCopied = copiedRecipeIndex === index;

                return (
                  <div
                    key={index}
                    className="bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9] flex flex-col justify-between hover:border-[#52B788] transition-all shadow-2xs"
                  >
                    <div className="space-y-4">
                      {/* Recipe Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4A373] bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#D4A373]/30 inline-block mb-2">
                            {isHi ? 'जैविक नुस्खा #' + (index + 1) : 'Organic Formula #' + (index + 1)}
                          </span>
                          <h4 className="text-base sm:text-lg font-extrabold text-[#1B4332]">
                            {isHi ? recipe.nameHi : recipe.nameEn}
                          </h4>
                          <p className="text-xs text-[#52B788] font-semibold mt-1">
                            <strong>{isHi ? 'उपचार:' : 'Target:'}</strong> {isHi ? recipe.targetHi : recipe.targetEn}
                          </p>
                        </div>

                        <button
                          onClick={() => handleCopyRecipe(index, recipeText)}
                          className="p-2 rounded-xl bg-white hover:bg-gray-100 text-[#7F8C8D] hover:text-[#1B4332] border border-[#E8E1D9] transition-all flex items-center gap-1.5 text-xs font-semibold"
                          title={isHi ? 'विधि कॉपी करें' : 'Copy Recipe'}
                        >
                          {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          <span className="hidden sm:inline">{isCopied ? (isHi ? 'कॉपी हुआ!' : 'Copied!') : (isHi ? 'कॉपी' : 'Copy')}</span>
                        </button>
                      </div>

                      {/* Ingredients */}
                      <div className="bg-white p-4 rounded-2xl border border-[#E8E1D9]">
                        <h5 className="text-xs font-bold text-[#1B4332] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-[#52B788]" />
                          <span>{isHi ? 'आवश्यक सामग्री' : 'Required Ingredients'}</span>
                        </h5>
                        <ul className="space-y-1.5 text-xs text-[#2D3436]">
                          {(isHi ? recipe.ingredientsHi : recipe.ingredientsEn).map((ing, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] mt-1.5 flex-shrink-0" />
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Step by Step Preparation */}
                      <div>
                        <h5 className="text-xs font-bold text-[#1B4332] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{isHi ? 'बनाने व छिड़काव की विधि' : 'Preparation & Spraying Steps'}</span>
                        </h5>
                        <ol className="space-y-2 text-xs text-[#2D3436]">
                          {(isHi ? recipe.stepsHi : recipe.stepsEn).map((st, i) => (
                            <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#E8E1D9]/70">
                              <span className="w-5 h-5 rounded-full bg-[#E8F0E6] text-[#1B4332] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{st}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Recommended Dosage */}
                      <div className="p-3 rounded-2xl bg-[#E8F0E6] text-[#1B4332] border border-[#A3B18A]/50 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] flex-shrink-0" />
                        <span><strong>{isHi ? 'खुराक: ' : 'Dosage: '}</strong>{isHi ? recipe.dosageHi : recipe.dosageEn}</span>
                      </div>

                      {/* Caution */}
                      <div className="p-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>{isHi ? 'सावधानी: ' : 'Caution: '}</strong>{isHi ? recipe.cautionHi : recipe.cautionEn}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: CHEMICAL SPRAY SAFETY & PPE */}
      {activeCategory === 'chemical' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#E8E1D9] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
                <span>{isHi ? 'रासायनिक कवकनाशी एवं कीटनाशक छिड़काव सुरक्षा नियम' : 'Chemical Fungicide & Pesticide Safety Guidelines'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
                {isHi
                  ? 'गंभीर रोग प्रकोप में रासायनिक दवाओं का उपयोग करते समय किसान भाई स्वयं की सुरक्षा और पर्यावरण संरक्षण हेतु इन 6 नियमों का अनिवार्य पालन करें:'
                  : 'When chemical treatments are necessary for severe infestations, always adhere to these 6 golden safety rules to protect yourself and the ecosystem:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CHEMICAL_SAFETY_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9] flex flex-col justify-between hover:border-amber-400 transition-all shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                      #{idx + 1}
                    </div>
                    <h4 className="font-extrabold text-[#1B4332] text-base leading-snug">
                      {isHi ? rule.ruleHi : rule.ruleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#2D3436] leading-relaxed">
                      {isHi ? rule.explanationHi : rule.explanationEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8E1D9] flex items-center gap-1.5 text-xs text-[#52B788] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isHi ? 'अनिवार्य सुरक्षा नियम' : 'Mandatory Standard'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Caution Box */}
            <div className="p-5 rounded-3xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-red-900">
                    {isHi ? 'आपातकालीन विष नियंत्रण सहायता (AIIMS)' : 'Emergency Poison Exposure Control (AIIMS)'}
                  </h4>
                  <p className="text-xs text-red-800 mt-0.5">
                    {isHi
                      ? 'यदि किसी किसान भाई को दवा छिड़कते समय चक्कर, उल्टी या सांस लेने में परेशानी हो तो तुरंत टोल-फ्री 1800-116-117 पर कॉल करें।'
                      : 'In case of accidental pesticide inhalation or exposure, call the 24x7 toll-free helpline at 1800-116-117 immediately.'}
                  </p>
                </div>
              </div>
              <a
                href="tel:1800116117"
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs whitespace-nowrap shadow-sm flex items-center gap-2 self-stretch sm:self-auto justify-center"
              >
                <Phone className="w-4 h-4" />
                <span>1800-116-117</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: WEATHER & DISEASE RISK INDEX */}
      {activeCategory === 'weather' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#E8E1D9] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2.5">
                <CloudRain className="w-6 h-6 text-blue-600" />
                <span>{isHi ? 'मौसम एवं नमी आधारित रोग जोखिम सूचकांक' : 'Weather Conditions & Pathogen Vulnerability Matrix'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
                {isHi
                  ? 'तापमान और हवा में नमी (आर्द्रता) के आधार पर बीमारियों के फैलने की वैज्ञानिक परिस्थितियां समझें:'
                  : 'Understand meteorological thresholds that trigger widespread fungal spore germination and insect pest outbreaks:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Humidity & Moderate Temp */}
              <div className="bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    <Droplets className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                    {isHi ? 'उच्च जोखिम' : 'High Fungal Risk'}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-[#1B4332]">
                  {isHi ? 'आर्द्रता > 80% व तापमान 20-28°C' : 'Humidity > 80% & Temp 20-28°C'}
                </h4>

                <p className="text-xs text-[#2D3436] leading-relaxed">
                  {isHi
                    ? 'झुलसा रोग (Late Blight), डाउनी मिल्ड्यू, और रतुआ (Rust) फफूंद के बीजाणु पानी की बूंदों में मात्र 4-6 घंटे में अंकुरित हो जाते हैं।'
                    : 'Late Blight, Downy Mildew, and Rust fungal spores germinate within 4-6 hours on wet leaf surfaces.'}
                </p>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E1D9] text-xs text-[#1B4332] font-semibold">
                  💡 {isHi ? 'सलाह: ट्राइकोडरमा या कॉपर फंगीसाइड का अग्रिम सुरक्षात्मक छिड़काव करें।' : 'Advisory: Apply protective bio-fungicides or neem oil preventively.'}
                </div>
              </div>

              {/* Hot & Humid (Summer Monsoons) */}
              <div className="bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Thermometer className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {isHi ? 'कीट व जीवाणु जोखिम' : 'Bacterial & Pest Risk'}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-[#1B4332]">
                  {isHi ? 'तापमान 28-35°C व बारिश' : 'Temp 28-35°C & Frequent Showers'}
                </h4>

                <p className="text-xs text-[#2D3436] leading-relaxed">
                  {isHi
                    ? 'जीवाणु झुलसा (Bacterial Blight), तना सड़न, रस चूसक कीट (माहू, थ्रिप्स, सफेद मक्खी) तेजी से पनपते हैं।'
                    : 'Bacterial Blight, Stem Rot, and sucking pests (Whiteflies, Thrips, Aphids) multiply at rapid reproductive cycles.'}
                </p>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E1D9] text-xs text-[#1B4332] font-semibold">
                  💡 {isHi ? 'सलाह: खेत में जलभराव न होने दें और नीम तेल 10,000 PPM का छिड़काव करें।' : 'Advisory: Improve field drainage and deploy yellow sticky traps.'}
                </div>
              </div>

              {/* Dry & Warm with Cool Nights */}
              <div className="bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F0E6] text-[#2D6A4F] flex items-center justify-center font-bold">
                    <Cloud className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    {isHi ? 'पाउडरी मिल्ड्यू जोखिम' : 'Powdery Mildew Risk'}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-[#1B4332]">
                  {isHi ? 'सूखा मौसम व रात में ओस' : 'Dry Days & Heavy Night Dew'}
                </h4>

                <p className="text-xs text-[#2D3436] leading-relaxed">
                  {isHi
                    ? 'सफेद चूर्णी फफूंद (Powdery Mildew) पत्तियों की ऊपरी सतह पर सफेद पाउडर जैसी परत बनाती है।'
                    : 'Powdery Mildew coats upper leaf surfaces with white fungal talcum, choking photosynthesis.'}
                </p>

                <div className="p-3 rounded-2xl bg-white border border-[#E8E1D9] text-xs text-[#1B4332] font-semibold">
                  💡 {isHi ? 'सलाह: खट्टी छाछ (मट्ठा) का 10% घोल या घुलनशील गंधक (सल्फर) छिड़कें।' : 'Advisory: Spray sour buttermilk decoction or wettable sulfur.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 5: STEP BY STEP APP MANUAL */}
      {activeCategory === 'manual' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#E8E1D9] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-[#52B788]" />
                <span>{isHi ? 'एआई फसल निदान प्रणाली - 5 आसान चरणों में उपयोग' : 'How to Use This System in 5 Simple Steps'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
                {isHi
                  ? 'फोटो खींचने से लेकर आधिकारिक स्वास्थ्य रिपोर्ट डाउनलोड करने और वॉइस सहायक से बात करने तक का पूर्ण विवरण:'
                  : 'Complete walkthrough from leaf photography to downloading official certified health reports and voice Q&A:'}
              </p>
            </div>

            <div className="space-y-4">
              {APP_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-5 sm:p-6 rounded-3xl bg-[#F8F9F8] border border-[#E8E1D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#52B788] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-green-900/10">
                      {step.stepNumber}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#52B788] bg-[#E8F0E6] px-2.5 py-0.5 rounded-full inline-block mb-1">
                        {isHi ? step.featureHi : step.featureEn}
                      </span>
                      <h4 className="font-extrabold text-base sm:text-lg text-[#1B4332]">
                        {isHi ? step.titleHi : step.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1 leading-relaxed max-w-2xl">
                        {isHi ? step.descHi : step.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8E1D9] text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                      <span>{isHi ? `चरण ${step.stepNumber} पूर्ण` : `Step ${step.stepNumber}`}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 6: KISAN HELPLINES & SUPPORT */}
      {activeCategory === 'helpline' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#E8E1D9] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B4332] flex items-center gap-2.5">
                <PhoneCall className="w-6 h-6 text-[#D4A373]" />
                <span>{isHi ? 'आधिकारिक किसान हेल्पलाइन एवं कृषि सहायता संपर्क' : 'Official Farmer Helplines & Agricultural Assistance'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#7F8C8D] mt-1">
                {isHi
                  ? 'भारत सरकार और कृषि वैज्ञानिकों से मुफ्त फोन परामर्श और आपातकालीन सहायता प्राप्त करें:'
                  : 'Access verified government toll-free numbers, 24x7 expert consultations, and emergency poison control centers:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HELPLINES.map((hl, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8F9F8] rounded-3xl p-6 border border-[#E8E1D9] flex flex-col justify-between hover:border-[#D4A373] transition-all shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#D4A373] bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#D4A373]/30">
                        {isHi ? hl.hoursHi : hl.hoursEn}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-[#1B4332]">
                      {isHi ? hl.nameHi : hl.nameEn}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#2D3436] leading-relaxed">
                      {isHi ? hl.purposeHi : hl.purposeEn}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E1D9] flex items-center justify-between gap-3">
                    <span className="text-base font-extrabold text-[#1B4332] font-mono">
                      {hl.contact}
                    </span>

                    {hl.link && (
                      <a
                        href={hl.link}
                        target={hl.link.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="px-4 py-2 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        {hl.link.startsWith('tel:') ? <Phone className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{hl.link.startsWith('tel:') ? (isHi ? 'कॉल करें' : 'Call Now') : (isHi ? 'वेबसाइट' : 'Visit')}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 7: FULL-STACK ARCHITECTURE & TECH STACK */}
      {activeCategory === 'architecture' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#2D3A2E] text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-[#3A5A40] shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#A3B18A] flex items-center gap-2">
                <Server className="w-6 h-6 text-[#A3B18A]" />
                <span>{isHi ? 'फुल-स्टैक सिस्टम आर्किटेक्चर एवं तकनीकी विनिर्देश' : 'Full-Stack Application Architecture & Technical Specifications'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#E8E1D9]/80 mt-1">
                {isHi
                  ? 'आधुनिक रिएक्ट 19, एक्सप्रेस बैकएंड, आर्टिफिशियल इंटेलिजेंस विजन और मोंगोडीबी पर आधारित उत्पादन-तैयार संरचना:'
                  : 'Production-ready architecture integrating React 19, Express/FastAPI backends, Artificial Intelligence multimodal vision, and MongoDB Atlas:'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="bg-[#3A5A40]/50 p-5 rounded-2xl border border-[#A3B18A]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#A3B18A] font-bold text-base">
                  <Cloud className="w-5 h-5" />
                  <span>{isHi ? 'फ्रंटएंड (React + Vite)' : 'Frontend (React + Vite)'}</span>
                </div>
                <p className="text-[#E8E1D9] leading-relaxed">
                  {isHi
                    ? 'React 19, Tailwind CSS, Lucide Icons, Recharts और HTML5 Web Speech API द्वारा निर्मित। Vercel या Netlify पर तुरंत डिप्लॉय योग्य।'
                    : 'Built with React 19, Tailwind CSS, Lucide icons, Recharts, and Web Speech API. Instantly deployable to Vercel/Netlify.'}
                </p>
                <span className="text-[10px] font-mono bg-[#A3B18A]/20 text-[#A3B18A] px-2.5 py-1 rounded-full border border-[#A3B18A]/30 inline-block">
                  Vercel / Netlify Ready
                </span>
              </div>

              <div className="bg-[#3A5A40]/50 p-5 rounded-2xl border border-[#A3B18A]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#D4A373] font-bold text-base">
                  <Server className="w-5 h-5" />
                  <span>{isHi ? 'बैकएंड (Express / FastAPI)' : 'Backend (Express / FastAPI)'}</span>
                </div>
                <p className="text-[#E8E1D9] leading-relaxed">
                  {isHi
                    ? 'दोहरा बैकएंड समर्थन: Node.js Express सर्वर अथवा Python FastAPI सर्वर। Render या Docker कंटेनर पर आसानी से डिप्लॉयमेंट।'
                    : 'Dual backend support: Node.js Express server or Python FastAPI in /backend folder. Deployable to Render or Docker.'}
                </p>
                <span className="text-[10px] font-mono bg-[#D4A373]/20 text-[#D4A373] px-2.5 py-1 rounded-full border border-[#D4A373]/30 inline-block">
                  Render / Docker Ready
                </span>
              </div>

              <div className="bg-[#3A5A40]/50 p-5 rounded-2xl border border-[#A3B18A]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#E8F0E6] font-bold text-base">
                  <Cpu className="w-5 h-5" />
                  <span>{isHi ? 'एआई और डेटाबेस' : 'AI & Database'}</span>
                </div>
                <p className="text-[#E8E1D9] leading-relaxed">
                  {isHi
                    ? 'आर्टिफिशियल इंटेलिजेंस विजन मॉडल और स्वचालित फ़ाइल फ़ॉलबैक के साथ MongoDB डेटा स्टोरेज।'
                    : 'Artificial Intelligence multimodal vision models and MongoDB database storage with local JSON fallback.'}
                </p>
                <span className="text-[10px] font-mono bg-[#E8F0E6]/20 text-[#E8F0E6] px-2.5 py-1 rounded-full border border-[#E8F0E6]/30 inline-block">
                  AI Vision + MongoDB
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
