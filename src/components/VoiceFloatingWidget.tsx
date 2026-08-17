import React from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface VoiceFloatingWidgetProps {
  onClick: () => void;
  language: Language;
}

export const VoiceFloatingWidget: React.FC<VoiceFloatingWidgetProps> = ({ onClick, language }) => {
  return (
    <button
      id="floating-voice-assistant-btn"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-[#52B788]/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 border-2 border-white/30 group"
      title="Ask Kisan Voice Assistant"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Mic className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#52B788] rounded-full ring-2 ring-white animate-pulse" />
      </div>

      <div className="hidden sm:flex flex-col text-left pr-1">
        <span className="text-xs font-bold leading-tight flex items-center gap-1">
          <span>{language === 'hi' ? 'किसान वॉइस सहायक' : 'Kisan Voice AI'}</span>
          <Sparkles className="w-3 h-3 text-[#D8F3DC]" />
        </span>
        <span className="text-[10px] text-[#D8F3DC] font-medium leading-none">
          {language === 'hi' ? 'बोलकर पूछें (Hindi/Eng)' : 'Tap to speak'}
        </span>
      </div>
    </button>
  );
};
