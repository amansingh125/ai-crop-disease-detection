import React, { useState, useEffect } from 'react';
import { Header, NavTabType } from './components/Header';
import { Hero } from './components/Hero';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Dashboard } from './components/Dashboard';
import { Guide } from './components/Guide';
import { Footer } from './components/Footer';
import { WeatherWidget } from './components/WeatherWidget';
import { DiseaseAlerts } from './components/DiseaseAlerts';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { VoiceFloatingWidget } from './components/VoiceFloatingWidget';
import { PredictionRecord, Language, WeatherData, DiseaseAlert } from './types';
import { fetchWeatherData, generateDiseaseAlerts, POPULAR_LOCATIONS } from './utils/weatherService';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('home');
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('crop_app_lang');
      return (saved === 'hi' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const [currentRecord, setCurrentRecord] = useState<PredictionRecord | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<DiseaseAlert[]>([]);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<PredictionRecord[]>([]);

  // Persist language choice
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('crop_app_lang', lang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
  };

  // Initial load: fetch weather data and history for alerts
  useEffect(() => {
    const initData = async () => {
      try {
        const defaultLoc = POPULAR_LOCATIONS[0];
        const weatherData = await fetchWeatherData(
          defaultLoc.lat,
          defaultLoc.lon,
          language === 'hi' ? defaultLoc.nameHi : defaultLoc.name
        );
        setWeather(weatherData);

        // Fetch history
        const histRes = await fetch('/api/history');
        if (histRes.ok) {
          const data = await histRes.json();
          if (data.success && data.records) {
            setHistoryRecords(data.records);
            const generatedAlerts = generateDiseaseAlerts(weatherData, data.records);
            setAlerts(generatedAlerts);
          }
        } else {
          const generatedAlerts = generateDiseaseAlerts(weatherData, []);
          setAlerts(generatedAlerts);
        }
      } catch (err) {
        console.warn('Init data load warning:', err);
      }
    };

    initData();
  }, [language]);

  const handleLocationChange = (newWeather: WeatherData) => {
    setWeather(newWeather);
    const updatedAlerts = generateDiseaseAlerts(newWeather, historyRecords);
    setAlerts(updatedAlerts);
  };

  const handleAnalysisComplete = (record: PredictionRecord) => {
    setCurrentRecord(record);
    setHistoryRecords(prev => [record, ...prev]);
    if (weather) {
      const updatedAlerts = generateDiseaseAlerts(weather, [record, ...historyRecords]);
      setAlerts(updatedAlerts);
    }
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecordFromDashboard = (record: PredictionRecord) => {
    setCurrentRecord(record);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartScan = () => {
    setCurrentRecord(null);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const uploaderEl = document.getElementById('upload-section');
      if (uploaderEl) {
        uploaderEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleViewHistory = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavSelect = (tab: NavTabType) => {
    if (tab === 'analyze') {
      setCurrentRecord(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D3436] flex flex-col justify-between font-sans selection:bg-[#E8F0E6] selection:text-[#1B4332]">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavSelect}
          language={language}
          setLanguage={handleSetLanguage}
          alertCount={alerts.length}
          onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
        />

        <main className="pb-12">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <Hero
                onStartScan={handleStartScan}
                onViewHistory={handleViewHistory}
                language={language}
              />
              
              {/* Weather & Outbreak Alert Banner on Home */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <WeatherWidget
                  weather={weather}
                  language={language}
                  onLocationChange={handleLocationChange}
                />
              </div>

              <ImageUploader
                onAnalysisComplete={handleAnalysisComplete}
                language={language}
              />
            </div>
          )}

          {/* ANALYZE / SCAN TAB */}
          {activeTab === 'analyze' && (
            <div className="px-4 sm:px-6 lg:px-8">
              {currentRecord ? (
                <AnalysisDisplay
                  record={currentRecord}
                  language={language}
                  onScanAnother={() => setCurrentRecord(null)}
                  onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
                />
              ) : (
                <ImageUploader
                  onAnalysisComplete={handleAnalysisComplete}
                  language={language}
                />
              )}
            </div>
          )}

          {/* WEATHER & RISK TAB */}
          {activeTab === 'weather' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <WeatherWidget
                weather={weather}
                language={language}
                onLocationChange={handleLocationChange}
              />
              
              <DiseaseAlerts
                alerts={alerts}
                language={language}
                onSelectCropForScan={() => {
                  setCurrentRecord(null);
                  setActiveTab('analyze');
                }}
                onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
              />
            </div>
          )}

          {/* DISEASE ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <DiseaseAlerts
                alerts={alerts}
                language={language}
                onSelectCropForScan={() => {
                  setCurrentRecord(null);
                  setActiveTab('analyze');
                }}
                onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
              />
            </div>
          )}

          {/* HISTORY & ANALYTICS TAB */}
          {activeTab === 'history' && (
            <Dashboard
              language={language}
              onSelectRecord={handleSelectRecordFromDashboard}
            />
          )}

          {/* GUIDE & FAQ TAB */}
          {activeTab === 'guide' && (
            <Guide language={language} onNavigateToScan={handleStartScan} />
          )}

        </main>
      </div>

      {/* Floating Voice Assistant Trigger */}
      <VoiceFloatingWidget
        onClick={() => setIsVoiceOpen(true)}
        language={language}
      />

      {/* Voice Assistant Interactive Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        currentRecord={currentRecord}
        currentWeather={weather}
      />

      <Footer language={language} />
    </div>
  );
}
