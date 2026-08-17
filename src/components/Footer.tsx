import React from 'react';
import { Sprout, Heart } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-[#3A5A40] text-[#E8E1D9] border-t border-[#A3B18A]/30 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#D4A373] text-white flex items-center justify-center font-bold shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">
              {getTranslation(language, 'appTitle')}
            </span>
            <p className="text-[#A3B18A] text-[11px]">
              Powered by Artificial Intelligence & Agronomic Vision Models
            </p>
          </div>
        </div>

        <div className="text-center md:text-right text-[#E8E1D9]">
          <p className="flex items-center justify-center md:justify-end gap-1">
            Designed for farmers & agricultural scientists • Supports <strong>English</strong> & <strong>हिन्दी</strong>
          </p>
          <p className="text-[11px] text-[#A3B18A] mt-1">
            © {new Date().getFullYear()} AI Crop Disease Detection System. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
