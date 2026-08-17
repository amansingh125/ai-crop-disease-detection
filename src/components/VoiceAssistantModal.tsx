import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, Bot, User, RefreshCw, Languages, HelpCircle, Play } from 'lucide-react';
import { Language, VoiceAssistantMessage, PredictionRecord, WeatherData } from '../types';
import { getTranslation } from '../translations';
import { ttsService, createSpeechRecognizer } from '../utils/speechUtils';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  currentRecord?: PredictionRecord | null;
  currentWeather?: WeatherData | null;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language: initialLanguage,
  onLanguageChange,
  currentRecord,
  currentWeather
}) => {
  const [activeLang, setActiveLang] = useState<Language>(initialLanguage);
  
  const getWelcomeMessage = (lang: Language): VoiceAssistantMessage => ({
    id: 'welcome-' + lang,
    sender: 'assistant',
    text: lang === 'hi'
      ? 'नमस्ते किसान भाई! मैं किसान साथी एआई सहायक हूँ।\nआप फसल की बीमारी, जैविक स्प्रे (नीम तेल, ट्राइकोडरमा, खट्टी छाछ), मौसम के खतरे, खाद की मात्रा या पत्ती की फोटो खींचने के बारे में मुझसे आवाज में बोलकर या लिखकर पूछ सकते हैं।'
      : 'Hello Farmer! I am Kisan Saathi, your Smart AI Agricultural Assistant.\nAsk me anything about crop leaf diseases, organic sprays (Neem oil, Trichoderma, buttermilk decoction), weather risks, fertilizer doses, or how to photograph crop leaves.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    language: lang
  });

  const [messages, setMessages] = useState<VoiceAssistantMessage[]>([getWelcomeMessage(initialLanguage)]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voiceTestInfo, setVoiceTestInfo] = useState<{ voiceName: string; hasExplicitVoice: boolean } | null>(null);
  
  const recognizerRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync initial language prop change and update voice status
  useEffect(() => {
    setActiveLang(initialLanguage);
    const info = ttsService.getVoiceInfo(initialLanguage);
    setVoiceTestInfo(info);
  }, [initialLanguage]);

  useEffect(() => {
    ttsService.registerStateChange((speaking) => {
      setIsSpeaking(speaking);
    });

    ttsService.registerErrorCallback((error) => {
      setSpeechError(error);
    });

    // Update voice info when voices finish loading in browser
    const info = ttsService.getVoiceInfo(activeLang);
    setVoiceTestInfo(info);

    return () => {
      ttsService.stop();
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [activeLang]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleLanguageSwitch = (newLang: Language) => {
    setActiveLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    ttsService.stop();
    setSpeechError(null);
    if (isListening && recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
    const info = ttsService.getVoiceInfo(newLang);
    setVoiceTestInfo(info);

    // If only welcome message exists, update it to selected language
    if (messages.length === 1 && messages[0].id.startsWith('welcome')) {
      setMessages([getWelcomeMessage(newLang)]);
    }
  };

  const quickQuestions = activeLang === 'hi' ? [
    '🌾 गेहूं में पीलेपन और रतुआ का इलाज क्या है?',
    '🌿 नीम तेल का स्प्रे कैसे बनाएं और छिड़कें?',
    '🍅 टमाटर/आलू के झुलसा रोग का जैविक इलाज',
    '🍄 ट्राइकोडरमा विरिडी का प्रयोग कैसे करें?',
    '📸 पत्ती की स्पष्ट फोटो कैसे खींचें?',
    '🐛 माहू, सफेद मक्खी व रस चूसक कीटों का नियंत्रण',
    '☁️ अधिक नमी और बारिश में फसलों का बचाव',
    '📞 सरकारी किसान हेल्पलाइन टोल-फ्री नंबर'
  ] : [
    '🌾 How to treat yellowing & rust disease in wheat?',
    '🌿 How to make and spray organic Neem Oil?',
    '🍅 How to treat tomato/potato blight naturally?',
    '🍄 How to use Trichoderma bio-fungicide?',
    '📸 Best tips for clear crop leaf photo',
    '🐛 Control methods for aphids & whiteflies',
    '☁️ Crop precautions for high humidity/rain',
    '📞 Government Kisan helpline toll-free number'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const question = (queryText || inputText).trim();
    if (!question || isLoading) return;

    // Detect if input is Hindi by checking for Devanagari script (U+0900 to U+097F)
    const hasDevanagari = /[\u0900-\u097F]/.test(question);
    const effectiveLang: Language = hasDevanagari ? 'hi' : activeLang;

    if (effectiveLang !== activeLang) {
      setActiveLang(effectiveLang);
      if (onLanguageChange) {
        onLanguageChange(effectiveLang);
      }
    }

    setInputText('');
    setSpeechError(null);

    const userMsg: VoiceAssistantMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: effectiveLang
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const contextData = {
        currentScan: currentRecord ? {
          crop: currentRecord.cropName,
          disease: currentRecord.diseaseName,
          severity: currentRecord.severity,
          isHealthy: currentRecord.isHealthy
        } : null,
        weather: currentWeather ? {
          location: currentWeather.locationName,
          temp: currentWeather.temperature,
          humidity: currentWeather.humidity,
          fungalRisk: currentWeather.diseaseRisk.fungalRisk
        } : null
      };

      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          language: effectiveLang,
          context: contextData
        })
      });

      const data = await res.json();
      const reply = data.reply || (effectiveLang === 'hi' ? 'क्षमा करें, उत्तर प्राप्त नहीं हुआ। कृपया पुनः प्रयास करें।' : 'Sorry, could not fetch answer. Please try again.');
      const responseLang: Language = (data.language as Language) || effectiveLang;

      const botMsg: VoiceAssistantMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: responseLang
      };

      setMessages(prev => [...prev, botMsg]);

      // Automatically speak the response aloud in natural Hindi (hi-IN) or English (en-US/en-IN)
      ttsService.speak(reply, responseLang);
    } catch (err) {
      console.error('Failed to get voice assistant response:', err);
      const errMsg: VoiceAssistantMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        text: effectiveLang === 'hi'
          ? 'नेटवर्क त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'Network error. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: effectiveLang
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    ttsService.stop();

    const recognizer = createSpeechRecognizer(
      activeLang,
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal && transcript.trim()) {
          setIsListening(false);
          handleSendMessage(transcript.trim());
        }
      },
      (error) => {
        setSpeechError(error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!recognizer) {
      setSpeechError(
        activeLang === 'hi'
          ? 'ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है। कृपया नीचे दिए गए इनपुट बॉक्स में लिखकर पूछें।'
          : 'Speech recognition is not supported in this browser. Please type your query below.'
      );
      return;
    }

    recognizerRef.current = recognizer;
    try {
      recognizer.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Speech start error:', e);
      setIsListening(false);
    }
  };

  const toggleSpeak = (text: string, msgLang?: Language) => {
    if (isSpeaking) {
      ttsService.stop();
    } else {
      ttsService.speak(text, msgLang || activeLang);
    }
  };

  const testVoiceAudio = () => {
    const sampleText = activeLang === 'hi'
      ? 'नमस्ते किसान भाई! मैं किसान साथी हूँ। आपकी आवाज और स्पीकर बिल्कुल सही काम कर रहे हैं।'
      : 'Hello Farmer! I am Kisan Saathi. Your audio and speaker are working properly.';
    ttsService.speak(sampleText, activeLang);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8E1D9] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header with Language Switcher & Controls */}
        <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#2D6A4F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Bot className="w-6 h-6 text-[#95D5B2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {getTranslation(activeLang, 'voiceTitle')}
                </h3>
                <span className="bg-[#52B788] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  AI Live
                </span>
              </div>
              <p className="text-xs text-[#D8F3DC]">
                {activeLang === 'hi' ? 'हिंदी और अंग्रेजी में तुरंत आवाज में सलाह पाएं' : 'Instant farming guidance in Hindi & English'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Inline Language Toggle */}
            <div className="bg-black/25 rounded-xl p-1 flex items-center border border-white/15">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeLang === 'hi'
                    ? 'bg-[#52B788] text-white shadow-sm'
                    : 'text-[#D8F3DC] hover:text-white'
                }`}
                title="Switch to Hindi"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeLang === 'en'
                    ? 'bg-[#52B788] text-white shadow-sm'
                    : 'text-[#D8F3DC] hover:text-white'
                }`}
                title="Switch to English"
              >
                English
              </button>
            </div>

            <button
              id="close-voice-assistant-btn"
              onClick={() => {
                ttsService.stop();
                if (isListening && recognizerRef.current) {
                  try {
                    recognizerRef.current.stop();
                  } catch (e) {}
                }
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic / Voice Status & Weather Context Banner */}
        <div className="bg-[#F4F9F4] px-4 py-2.5 border-b border-[#E8E1D9] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#1B4332] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
              {activeLang === 'hi' ? 'सक्रिय संदर्भ:' : 'Active Context:'}
            </span>
            {currentRecord ? (
              <span className="bg-[#E8F0E6] text-[#2D6A4F] px-2.5 py-0.5 rounded-full font-medium border border-[#A3B18A]/40">
                🌱 {currentRecord.cropName}: {currentRecord.diseaseName}
              </span>
            ) : null}
            {currentWeather ? (
              <span className="bg-[#E8F0E6] text-[#2D6A4F] px-2.5 py-0.5 rounded-full font-medium border border-[#A3B18A]/40">
                🌤️ {currentWeather.locationName} ({currentWeather.temperature}°C, {currentWeather.humidity}% नमी)
              </span>
            ) : null}
            {!currentRecord && !currentWeather && (
              <span className="text-gray-500 italic">
                {activeLang === 'hi' ? 'फसल, जैविक दवा या मौसम से जुड़ा कोई भी प्रश्न पूछें' : 'Ask any question regarding crops, bio-sprays or weather'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Active Voice Engine Badge */}
            {voiceTestInfo && (
              <span
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#A3B18A]/40 text-[10px] text-gray-600 font-mono"
                title={`TTS Engine: ${voiceTestInfo.voiceName} (${voiceTestInfo.langCode})`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${voiceTestInfo.hasExplicitVoice ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {voiceTestInfo.hasExplicitVoice ? voiceTestInfo.voiceName.slice(0, 18) : (activeLang === 'hi' ? 'hi-IN TTS' : 'en-US TTS')}
              </span>
            )}

            {/* Test Hindi / English Voice Button */}
            <button
              id="test-voice-audio-btn"
              onClick={testVoiceAudio}
              className="text-xs bg-[#E8F0E6] hover:bg-[#D8F3DC] text-[#1B4332] font-bold px-3 py-1 rounded-full border border-[#A3B18A]/50 flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-95 transition-all"
              title={activeLang === 'hi' ? 'हिंदी आवाज की टेस्टिंग करें' : 'Test English speech synthesis'}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#52B788]" />
              <span>{activeLang === 'hi' ? '🔊 टेस्ट हिंदी आवाज' : '🔊 Test Voice'}</span>
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FDFCFB]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#1B4332] text-[#95D5B2] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#1B4332] text-white rounded-tr-none shadow-md'
                      : 'bg-white text-[#2D3436] rounded-tl-none border border-[#E8E1D9]'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
                  
                  <div className="mt-2.5 pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px]">
                    <span className={isUser ? 'text-white/70' : 'text-gray-400'}>
                      {msg.timestamp}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => toggleSpeak(msg.text, msg.language)}
                        className="text-[#2D6A4F] hover:text-[#1B4332] font-semibold flex items-center gap-1.5 bg-[#E8F0E6]/60 hover:bg-[#E8F0E6] px-2.5 py-1 rounded-full border border-[#A3B18A]/30 transition-colors ml-2"
                        title="Listen to audio"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span className="text-amber-700 font-bold">{getTranslation(activeLang, 'stopAudio')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-[#52B788]" />
                            <span className="text-[#1B4332] font-medium">{getTranslation(activeLang, 'listenAloud')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#52B788] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#1B4332] text-[#95D5B2] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#E8E1D9] rounded-2xl rounded-tl-none p-3.5 text-xs text-gray-700 flex items-center gap-2.5 shadow-sm">
                <RefreshCw className="w-4 h-4 animate-spin text-[#52B788]" />
                <span className="font-medium">
                  {activeLang === 'hi' ? 'किसान साथी एआई उत्तर तैयार कर रहा है...' : 'Kisan Saathi is formulating agricultural advice...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2.5 bg-[#F8F9F8] border-t border-[#E8E1D9] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#1B4332] flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#52B788]" />
            {activeLang === 'hi' ? 'त्वरित सवाल:' : 'Suggested:'}
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-white hover:bg-[#E8F0E6] text-[#2D6A4F] hover:text-[#1B4332] px-3 py-1.5 rounded-full border border-[#A3B18A]/40 transition-all hover:scale-102 flex-shrink-0 shadow-xs active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Speech Error Banner */}
        {speechError && (
          <div className="bg-amber-50 text-amber-900 text-xs px-4 py-2 border-t border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{speechError}</span>
            </div>
            <button
              onClick={() => setSpeechError(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold underline"
            >
              {activeLang === 'hi' ? 'हटाएं' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Active Listening Indicator with Sound Wave Animation */}
        {isListening && (
          <div className="bg-[#E8F0E6] text-[#1B4332] px-4 py-2.5 flex items-center justify-between text-xs font-bold border-t border-[#52B788] shadow-inner">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[bounce_0.6s_infinite_100ms]" />
                <span className="w-1.5 h-6 bg-red-600 rounded-full animate-[bounce_0.6s_infinite_200ms]" />
                <span className="w-1.5 h-5 bg-red-500 rounded-full animate-[bounce_0.6s_infinite_300ms]" />
                <span className="w-1.5 h-3 bg-red-400 rounded-full animate-[bounce_0.6s_infinite_400ms]" />
              </div>
              <span className="text-red-700">
                {activeLang === 'hi' ? '🎤 हिंदी में सुन रहा हूँ... अपनी बात बोलें' : '🎤 Listening in English... Speak your question'}
              </span>
            </div>
            <button
              onClick={toggleMic}
              className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-bold hover:bg-red-700 transition-colors shadow-sm"
            >
              {getTranslation(activeLang, 'voiceStopMic')}
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E8E1D9]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              id="voice-mic-trigger-btn"
              onClick={toggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-[#1B4332] text-[#95D5B2] hover:bg-[#2D6A4F] hover:text-white'
              }`}
              title={isListening ? 'Stop Listening' : (activeLang === 'hi' ? 'माइक से हिंदी में बोलें' : 'Speak via Microphone')}
            >
              {isListening ? <MicOff className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
            </button>

            <input
              type="text"
              id="voice-query-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeLang === 'hi'
                  ? 'रोग, नीम तेल, खाद या लक्षण के बारे में पूछें (या माइक दबाकर बोलें)...'
                  : 'Ask about crop disease, neem spray, dosages, or symptoms...'
              }
              className="flex-1 bg-[#F5EFE6]/40 border border-[#E8E1D9] focus:border-[#52B788] focus:bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#2D3436] outline-none transition-all placeholder:text-gray-400"
            />

            <button
              type="submit"
              id="voice-send-btn"
              disabled={!inputText.trim() || isLoading}
              className="w-12 h-12 rounded-2xl bg-[#52B788] hover:bg-[#40916C] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-md"
              title="Send Query"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

