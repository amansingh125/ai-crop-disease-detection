import React, { useState } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Bug, 
  Sprout, 
  RefreshCw,
  Navigation
} from 'lucide-react';
import { WeatherData, Language } from '../types';
import { getTranslation } from '../translations';
import { POPULAR_LOCATIONS, fetchWeatherData } from '../utils/weatherService';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  language: Language;
  onLocationChange: (newWeather: WeatherData) => void;
  isLoading?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  language,
  onLocationChange,
  isLoading = false
}) => {
  const [selectedCity, setSelectedCity] = useState(weather?.locationName || POPULAR_LOCATIONS[0].name);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleCitySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locName = e.target.value;
    setSelectedCity(locName);
    const loc = POPULAR_LOCATIONS.find(l => l.name === locName) || POPULAR_LOCATIONS[0];
    const data = await fetchWeatherData(loc.lat, loc.lon, language === 'hi' ? loc.nameHi : loc.name);
    onLocationChange(data);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में जीपीएस स्थान उपलब्ध नहीं है।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const data = await fetchWeatherData(lat, lon, language === 'hi' ? 'वर्तमान स्थान (GPS)' : 'Current GPS Location');
        setSelectedCity(data.locationName);
        onLocationChange(data);
        setDetectingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setDetectingLocation(false);
        alert(language === 'hi' ? 'स्थान प्राप्त नहीं हो सका। कृपया सूची से शहर चुनें।' : 'Could not detect GPS location. Please select a city.');
      },
      { timeout: 8000 }
    );
  };

  if (!weather) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#E8E1D9] flex items-center justify-center gap-3 text-gray-500">
        <RefreshCw className="w-5 h-5 animate-spin text-[#2D6A4F]" />
        <span>{language === 'hi' ? 'मौसम डेटा लोड हो रहा है...' : 'Loading weather & risk forecast...'}</span>
      </div>
    );
  }

  const getRiskBadge = (riskLevel: 'Low' | 'Medium' | 'High') => {
    if (riskLevel === 'High') {
      return (
        <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          {riskLevel} {language === 'hi' ? 'जोखिम' : 'Risk'}
        </span>
      );
    }
    if (riskLevel === 'Medium') {
      return (
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          {riskLevel} {language === 'hi' ? 'जोखिम' : 'Risk'}
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
        {riskLevel} {language === 'hi' ? 'जोखिम' : 'Risk'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D9] p-6 shadow-sm overflow-hidden space-y-6">
      
      {/* Top Bar with Location Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D9]">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-[#2D6A4F]" />
            <h3 className="font-bold text-lg text-[#1B4332]">
              {getTranslation(language, 'weatherTitle')}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {getTranslation(language, 'weatherSub')}
          </p>
        </div>

        {/* Location Dropdown & GPS Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#2D6A4F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="weather-location-select"
              value={selectedCity}
              onChange={handleCitySelect}
              className="bg-[#F8F9F8] border border-[#E8E1D9] focus:border-[#2D6A4F] rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-[#1B4332] outline-none appearance-none cursor-pointer"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.name} value={language === 'hi' ? loc.nameHi : loc.name}>
                  {language === 'hi' ? loc.nameHi : loc.name}
                </option>
              ))}
            </select>
          </div>

          <button
            id="detect-gps-location-btn"
            onClick={handleDetectLocation}
            disabled={detectingLocation}
            className="p-2 rounded-xl bg-[#E8F0E6] hover:bg-[#2D6A4F] text-[#1B4332] hover:text-white transition-colors"
            title={getTranslation(language, 'detectLocation')}
          >
            <Navigation className={`w-4 h-4 ${detectingLocation ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Temperature */}
        <div className="bg-[#FDFCFB] p-4 rounded-2xl border border-[#E8E1D9] flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-amber-500" />
            {getTranslation(language, 'temp')}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1B4332]">{weather.temperature}°C</span>
            <span className="text-xs text-gray-500">({language === 'hi' ? weather.conditionHindi : weather.condition})</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-[#FDFCFB] p-4 rounded-2xl border border-[#E8E1D9] flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-500" />
            {getTranslation(language, 'humidity')}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1B4332]">{weather.humidity}%</span>
            <span className={`text-[11px] font-bold ${weather.humidity >= 80 ? 'text-red-600' : 'text-emerald-700'}`}>
              {weather.humidity >= 80 ? (language === 'hi' ? 'उच्च नमी' : 'High') : (language === 'hi' ? 'सामान्य' : 'Normal')}
            </span>
          </div>
        </div>

        {/* Rainfall Probability */}
        <div className="bg-[#FDFCFB] p-4 rounded-2xl border border-[#E8E1D9] flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-cyan-600" />
            {getTranslation(language, 'rainProb')}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1B4332]">{weather.rainfallProbability}%</span>
            <span className="text-xs text-gray-500">
              {weather.rainfallProbability >= 50 ? (language === 'hi' ? 'वर्षा संभव' : 'Likely') : (language === 'hi' ? 'कम' : 'Low')}
            </span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-[#FDFCFB] p-4 rounded-2xl border border-[#E8E1D9] flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-teal-600" />
            {getTranslation(language, 'windSpeed')}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1B4332]">{weather.windSpeed}</span>
            <span className="text-xs text-gray-500">km/h</span>
          </div>
        </div>

      </div>

      {/* Disease Outbreak Risk Indicators */}
      <div className="bg-[#F4F9F4] p-5 rounded-2xl border border-[#A3B18A]/40 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1B4332] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#2D6A4F]" />
            {language === 'hi' ? 'रोग संवेदनशीलता एवं जोखिम स्तर' : 'Pathogen Vulnerability & Risk Index'}
          </h4>
          <span className="text-xs text-gray-500">
            {weather.locationName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Fungal Risk */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-xs font-bold text-[#2D3436]">
                {getTranslation(language, 'fungalRisk')}
              </span>
            </div>
            {getRiskBadge(weather.diseaseRisk.fungalRisk)}
          </div>

          {/* Pest Risk */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-[#2D3436]">
                {getTranslation(language, 'pestRisk')}
              </span>
            </div>
            {getRiskBadge(weather.diseaseRisk.pestRisk)}
          </div>

          {/* Bacterial Risk */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E8E1D9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-[#2D3436]">
                {getTranslation(language, 'bacterialRisk')}
              </span>
            </div>
            {getRiskBadge(weather.diseaseRisk.bacterialRisk)}
          </div>

        </div>

        {/* Actionable Advisory Note */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E1D9] text-xs text-[#2D3436] space-y-1.5">
          <div className="font-bold text-[#1B4332] flex items-center gap-1.5">
            <span>📢 {getTranslation(language, 'weatherAdvisoryTitle')}:</span>
          </div>
          <p className="leading-relaxed">
            {language === 'hi' ? weather.diseaseRisk.summaryHi : weather.diseaseRisk.summaryEn}
          </p>
          <div className="pt-1 text-[#2D6A4F] font-semibold flex items-center gap-1">
            <span>👉 {language === 'hi' ? weather.diseaseRisk.actionTipHi : weather.diseaseRisk.actionTipEn}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
