import React from 'react';
import { 
  Sprout, 
  BarChart3, 
  HelpCircle, 
  Languages, 
  Sparkles, 
  CloudSun, 
  Bell, 
  Mic
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

export type NavTabType = 'home' | 'analyze' | 'weather' | 'alerts' | 'history' | 'guide';

interface HeaderProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  alertCount?: number;
  onOpenVoiceAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  alertCount = 0,
  onOpenVoiceAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-[#2D3436] border-b border-[#E8E1D9] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1B4332] flex items-center justify-center text-white shadow-md shadow-green-900/10 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 text-[#95D5B2]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-[#1B4332] flex items-center gap-2 tracking-tight leading-tight">
              {getTranslation(language, 'appTitle')}
              <span className="text-[10px] bg-[#E8F0E6] text-[#2D6A4F] border border-[#A3B18A]/40 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider hidden sm:inline-block">
                AI Vision
              </span>
            </h1>
            <p className="text-[11px] text-[#7F8C8D] font-medium hidden sm:block">
              {language === 'hi' ? 'स्मार्ट कृषि सहायक एवं फसल रोग पहचान' : 'Smart Agriculture Assistant & Crop Health'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F0F2EF] p-1 rounded-full border border-[#E8E1D9]">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#7F8C8D] hover:text-[#1B4332]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            {getTranslation(language, 'navHome')}
          </button>

          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'analyze'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#7F8C8D] hover:text-[#1B4332]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {getTranslation(language, 'navAnalyze')}
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'weather'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#7F8C8D] hover:text-[#1B4332]'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5 text-blue-500" />
            {getTranslation(language, 'navWeather')}
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'alerts'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#7F8C8D] hover:text-[#1B4332]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-red-500" />
            <span>{getTranslation(language, 'navAlerts')}</span>
            {alertCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#7F8C8D] hover:text-[#1B4332]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {getTranslation(language, 'navHistory')}
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'text-[#7F8C8D] hover:text-[#1B4332]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {getTranslation(language, 'navAbout')}
          </button>
        </nav>

        {/* Right Section: Voice Assistant & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Voice Assistant Button */}
          {onOpenVoiceAssistant && (
            <button
              id="header-voice-assistant-btn"
              onClick={onOpenVoiceAssistant}
              className="px-3 py-1.5 rounded-full bg-[#E8F0E6] hover:bg-[#52B788] text-[#1B4332] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              title="Voice Assistant"
            >
              <Mic className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'आवाज सहायक' : 'Voice AI'}
              </span>
            </button>
          )}

          {/* Dual Language Selector (Hindi / English) */}
          <div className="flex items-center bg-[#F0F2EF] p-1 rounded-full border border-[#E8E1D9]">
            <Languages className="w-3.5 h-3.5 text-[#1B4332] ml-2 mr-1" />
            <button
              id="lang-toggle-en-btn"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                language === 'en'
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-[#7F8C8D] hover:text-[#1B4332]'
              }`}
            >
              EN
            </button>
            <button
              id="lang-toggle-hi-btn"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                language === 'hi'
                  ? 'bg-white text-[#1B4332] shadow-sm'
                  : 'text-[#7F8C8D] hover:text-[#1B4332]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-[#F0F2EF] border-t border-[#E8E1D9] py-2 px-1 text-[11px] overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 px-2 ${
            activeTab === 'home' ? 'text-[#1B4332] font-bold' : 'text-[#7F8C8D]'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{getTranslation(language, 'navHome')}</span>
        </button>

        <button
          onClick={() => setActiveTab('analyze')}
          className={`flex flex-col items-center gap-0.5 px-2 ${
            activeTab === 'analyze' ? 'text-[#1B4332] font-bold' : 'text-[#7F8C8D]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{getTranslation(language, 'navAnalyze')}</span>
        </button>

        <button
          onClick={() => setActiveTab('weather')}
          className={`flex flex-col items-center gap-0.5 px-2 ${
            activeTab === 'weather' ? 'text-[#1B4332] font-bold' : 'text-[#7F8C8D]'
          }`}
        >
          <CloudSun className="w-4 h-4 text-blue-500" />
          <span>{getTranslation(language, 'navWeather')}</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center gap-0.5 px-2 relative ${
            activeTab === 'alerts' ? 'text-[#1B4332] font-bold' : 'text-[#7F8C8D]'
          }`}
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-red-500" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </div>
          <span>{getTranslation(language, 'navAlerts')}</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-0.5 px-2 ${
            activeTab === 'history' ? 'text-[#1B4332] font-bold' : 'text-[#7F8C8D]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{getTranslation(language, 'navHistory')}</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center gap-0.5 px-2 ${
            activeTab === 'guide' ? 'text-[#1B4332] font-bold' : 'text-[#7F8C8D]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{getTranslation(language, 'navAbout')}</span>
        </button>
      </div>
    </header>
  );
};
