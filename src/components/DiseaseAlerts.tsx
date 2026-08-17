import React from 'react';
import { AlertTriangle, Bell, ShieldAlert, Sparkles, Sprout, ArrowRight, ExternalLink } from 'lucide-react';
import { DiseaseAlert, Language } from '../types';
import { getTranslation } from '../translations';

interface DiseaseAlertsProps {
  alerts: DiseaseAlert[];
  language: Language;
  onSelectCropForScan?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const DiseaseAlerts: React.FC<DiseaseAlertsProps> = ({
  alerts,
  language,
  onSelectCropForScan,
  onOpenVoiceAssistant
}) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-[#E8E1D9] text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#E8F0E6] text-[#2D6A4F] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-base text-[#1B4332]">
          {language === 'hi' ? 'कोई सक्रिय चेतावनी नहीं' : 'No Active Outbreak Alerts'}
        </h4>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          {language === 'hi'
            ? 'वर्तमान में आपके क्षेत्र में मौसम और रोग संबंधी स्थितियां सामान्य हैं। नियमित फसल निरीक्षण जारी रखें।'
            : 'Weather and plant health parameters in your region are currently within safe ranges.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Bell className="w-5 h-5 text-red-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#1B4332]">
              {getTranslation(language, 'alertsTitle')}
            </h3>
            <p className="text-xs text-gray-500">
              {getTranslation(language, 'alertsSub')}
            </p>
          </div>
        </div>

        <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
          {alerts.length} {language === 'hi' ? 'सक्रिय अलर्ट' : 'Active Alerts'}
        </span>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isWarning = alert.severity === 'Warning';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-red-50/70 border-red-200 shadow-sm'
                  : isWarning
                  ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                  : 'bg-[#F4F9F4] border-[#A3B18A]/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-red-500 text-white'
                        : isWarning
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#2D6A4F] text-white'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-[#1B4332]">
                        {language === 'hi' ? alert.titleHi : alert.titleEn}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isWarning
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#2D6A4F] text-white'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="font-semibold text-[#2D6A4F] flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5" />
                        {language === 'hi' ? alert.cropNameHindi || alert.cropName : alert.cropName}
                      </span>
                      <span>•</span>
                      <span>{language === 'hi' ? alert.diseaseNameHindi || alert.diseaseName : alert.diseaseName}</span>
                    </div>

                    <p className="text-xs text-[#2D3436] leading-relaxed pt-1">
                      {language === 'hi' ? alert.messageHi : alert.messageEn}
                    </p>

                    {/* Recommendation Box */}
                    <div className="bg-white/80 p-3 rounded-xl border border-black/5 text-xs text-[#1B4332] mt-2 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-[#2D6A4F]">
                        <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
                        {language === 'hi' ? 'सुझाया गया निवारक कदम:' : 'Recommended Action:'}
                      </span>
                      <p>{language === 'hi' ? alert.recommendationHi : alert.recommendationEn}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                  {onSelectCropForScan && (
                    <button
                      onClick={onSelectCropForScan}
                      className="w-full text-xs font-bold bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>{language === 'hi' ? 'पत्ती स्कैन करें' : 'Scan Leaf'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  {onOpenVoiceAssistant && (
                    <button
                      onClick={onOpenVoiceAssistant}
                      className="w-full text-xs font-semibold bg-white hover:bg-[#E8F0E6] text-[#2D6A4F] px-3.5 py-2 rounded-xl border border-[#A3B18A]/40 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>{language === 'hi' ? 'आवाज में पूछें' : 'Ask Voice'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
