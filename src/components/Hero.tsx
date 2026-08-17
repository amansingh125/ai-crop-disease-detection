import React from 'react';
import { ShieldAlert, Zap, Languages, CheckCircle2, ArrowRight, Sparkles, Sprout } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface HeroProps {
  onStartScan: () => void;
  onViewHistory: () => void;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ onStartScan, onViewHistory, language }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#E8F0E6]/40 via-transparent to-transparent pt-8 pb-12 sm:pt-12 sm:pb-16">
      
      {/* Background Decorative Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#A3B18A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Top Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#E8F0E6] text-[#3A5A40] border border-[#A3B18A]/50 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#588157]" />
            {getTranslation(language, 'heroBadge')}
          </span>
        </div>

        {/* Hero Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#3A5A40] tracking-tight leading-tight">
            {getTranslation(language, 'heroTitle')}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#7F8C8D] leading-relaxed">
            {getTranslation(language, 'heroDesc')}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartScan}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3A5A40] hover:bg-[#344E41] text-white font-bold text-sm sm:text-base shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-2.5 group"
            >
              <Sprout className="w-5 h-5" />
              {getTranslation(language, 'startScanBtn')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onViewHistory}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#D4A373] hover:bg-[#BC8A5F] text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              {getTranslation(language, 'viewDashboardBtn')}
            </button>
          </div>
        </div>

        {/* Supported Crops Pill Bar */}
        <div className="mt-12 bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#E8E1D9] shadow-xs">
          <p className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider mb-3 text-center sm:text-left">
            {getTranslation(language, 'supportedCropsTitle')}:
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#2D3436]">
            {['Tomato 🍅', 'Potato 🥔', 'Rice 🌾', 'Wheat 🌾', 'Corn / Maize 🌽', 'Apple 🍎', 'Grape 🍇', 'Cotton ☁️', 'Sugarcane 🎋', 'Chili 🌶️'].map((crop, i) => (
              <span key={i} className="px-3.5 py-1.5 rounded-full bg-[#F8F9F8] border border-[#E8F0E6] text-[#3A5A40] shadow-2xs">
                {crop}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Core Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#3A5A40] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#3A5A40] text-lg">
              {getTranslation(language, 'featFastTitle')}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#7F8C8D] leading-relaxed">
              {getTranslation(language, 'featFastDesc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0E6] text-[#3A5A40] flex items-center justify-center mb-4">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#3A5A40] text-lg">
              {getTranslation(language, 'featMultilingualTitle')}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#7F8C8D] leading-relaxed">
              {getTranslation(language, 'featMultilingualDesc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#D4A373] flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#3A5A40] text-lg">
              {getTranslation(language, 'featTreatmentTitle')}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#7F8C8D] leading-relaxed">
              {getTranslation(language, 'featTreatmentDesc')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
