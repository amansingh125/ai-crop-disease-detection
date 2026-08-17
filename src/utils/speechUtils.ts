import { Language } from '../types';

// Speech Synthesis (Text-to-Speech)
class TTSService {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;
  private onStateChangeCallback: ((speaking: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private activeUtterances: SpeechSynthesisUtterance[] = [];
  private currentChunkIndex = 0;
  private chunksToSpeak: string[] = [];
  private currentLanguage: Language = 'en';
  private keepAliveInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  public loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    try {
      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        this.cachedVoices = voices;
      }
    } catch (e) {
      console.warn('Could not load speech voices:', e);
    }
    return this.cachedVoices;
  }

  public registerStateChange(callback: (speaking: boolean) => void) {
    this.onStateChangeCallback = callback;
  }

  public registerErrorCallback(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.cachedVoices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.cachedVoices;
  }

  public isHindiVoiceAvailable(): boolean {
    const voices = this.getAvailableVoices();
    return voices.some(v => {
      const lang = (v.lang || '').toLowerCase().replace('_', '-');
      const name = (v.name || '').toLowerCase();
      return (
        lang === 'hi-in' ||
        lang === 'hi' ||
        lang.startsWith('hi-') ||
        name.includes('hindi') ||
        name.includes('हिन्दी') ||
        name.includes('swara') ||
        name.includes('madhur') ||
        name.includes('hemant') ||
        name.includes('lekha') ||
        name.includes('kalpana') ||
        name.includes('neerja')
      );
    });
  }

  public findBestVoice(language: Language): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    if (language === 'hi') {
      // 1. Look for explicit Hindi voices across Chrome, Edge, Safari, Android, Windows
      const exactHi = voices.find(v => {
        const langLower = (v.lang || '').toLowerCase().replace('_', '-');
        const nameLower = (v.name || '').toLowerCase();
        return (
          langLower === 'hi-in' ||
          langLower === 'hi' ||
          langLower.startsWith('hi-') ||
          nameLower.includes('hindi') ||
          nameLower.includes('हिन्दी') ||
          nameLower.includes('swara') ||
          nameLower.includes('madhur') ||
          nameLower.includes('hemant') ||
          nameLower.includes('lekha') ||
          nameLower.includes('kalpana') ||
          nameLower.includes('neerja') ||
          nameLower.includes('google हिन्दी')
        );
      });
      if (exactHi) return exactHi;

      // Do NOT fallback to English voice for Hindi text, because English engines fail on Devanagari script.
      // Return null so the browser engine can use its default network hi-IN synthesiser.
      return null;
    } else {
      // English Voice: Prefer Indian English (en-IN) or US English (en-US)
      const indianEn = voices.find(v => {
        const langLower = (v.lang || '').toLowerCase().replace('_', '-');
        const nameLower = (v.name || '').toLowerCase();
        return (
          langLower === 'en-in' ||
          nameLower.includes('india') ||
          nameLower.includes('indian')
        );
      });
      if (indianEn) return indianEn;

      const enVoice = voices.find(v => {
        const langLower = (v.lang || '').toLowerCase().replace('_', '-');
        return langLower === 'en-us' || langLower === 'en-gb' || langLower.startsWith('en');
      });
      if (enVoice) return enVoice;
    }

    return null;
  }

  public getVoiceInfo(language: Language): { voiceName: string; langCode: string; hasExplicitVoice: boolean } {
    const voice = this.findBestVoice(language);
    if (voice) {
      return {
        voiceName: voice.name,
        langCode: voice.lang,
        hasExplicitVoice: true
      };
    }
    return {
      voiceName: language === 'hi' ? 'Browser hi-IN Engine' : 'Browser Default Engine',
      langCode: language === 'hi' ? 'hi-IN' : 'en-US',
      hasExplicitVoice: false
    };
  }

  private cleanTextForSpeech(text: string, language: Language): string {
    let clean = text
      .normalize('NFC')
      .replace(/[*_~`#]/g, '') // remove markdown
      .replace(/https?:\/\/\S+/g, '') // remove URLs
      .replace(/[\(\)\[\]\{\}]/g, ' ')
      .replace(/[•▪▸►◆]/g, ' , ') // replace bullets with natural pause comma
      .replace(/-\s+/g, ' ')
      .replace(/—|–/g, ' , ')
      .replace(/\s+/g, ' ')
      .trim();

    if (language === 'hi') {
      // Normalize common technical terms and units for natural Devanagari pronunciation
      clean = clean
        .replace(/PPM/gi, ' पीपीएम ')
        .replace(/ml\b/gi, ' मिलीलीटर ')
        .replace(/g\b/gi, ' ग्राम ')
        .replace(/kg\b/gi, ' किलोग्राम ')
        .replace(/L\b/gi, ' लीटर ')
        .replace(/pH\b/gi, ' पीएच ')
        .replace(/°C/gi, ' डिग्री सेल्सियस ')
        .replace(/%/g, ' प्रतिशत ')
        .replace(/AI/gi, ' एआई ')
        .replace(/\bPDF\b/gi, ' पीडीएफ ')
        .replace(/\bNPK\b/gi, ' एनपीके ')
        .replace(/\bWP\b/gi, ' डब्ल्यूपी ')
        .replace(/\bEC\b/gi, ' ईसी ')
        .replace(/\bSL\b/gi, ' एसएल ')
        .replace(/(\d+)\s*:\s*(\d+)/g, '$1 अनुपात $2'); // Ratios like 10:1
    }

    return clean;
  }

  private splitIntoChunks(text: string, language: Language): string[] {
    const clean = this.cleanTextForSpeech(text, language);
    if (!clean) return [];

    // Split by sentence delimiters: Hindi purna viram (।), newline (\n), period (.), exclamation (!), question (?)
    const sentenceDelimiters = language === 'hi' ? /[।\n!?.]+/ : /[\n!?.]+/;
    const rawSentences = clean.split(sentenceDelimiters);
    const chunks: string[] = [];

    for (const raw of rawSentences) {
      const sentence = raw.trim();
      if (!sentence) continue;

      // If sentence is short enough (under 140 chars), add directly
      if (sentence.length <= 140) {
        chunks.push(sentence);
      } else {
        // Split long sentence by commas or semicolons
        const subParts = sentence.split(/[,;،]+/);
        let tempChunk = '';
        for (const sub of subParts) {
          const trimmed = sub.trim();
          if (!trimmed) continue;
          if ((tempChunk + ' ' + trimmed).length <= 140) {
            tempChunk = tempChunk ? `${tempChunk}, ${trimmed}` : trimmed;
          } else {
            if (tempChunk) chunks.push(tempChunk);
            tempChunk = trimmed;
          }
        }
        if (tempChunk) chunks.push(tempChunk);
      }
    }

    return chunks.length > 0 ? chunks : [clean];
  }

  public speak(text: string, language: Language = 'en') {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment');
      if (this.onErrorCallback) {
        this.onErrorCallback(
          language === 'hi'
            ? 'आपके ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है।'
            : 'Speech synthesis is not supported in this browser.'
        );
      }
      return;
    }

    // Stop current speech
    this.stop();

    // Prepare fresh voice pool
    this.loadVoices();

    const chunks = this.splitIntoChunks(text, language);
    if (chunks.length === 0) return;

    this.chunksToSpeak = chunks;
    this.currentChunkIndex = 0;
    this.currentLanguage = language;
    this.activeUtterances = [];

    this.startKeepAlive();
    this.speakNextChunk();
  }

  private speakNextChunk() {
    if (!this.synth) return;

    if (this.currentChunkIndex >= this.chunksToSpeak.length) {
      // Finished all chunks
      this.isSpeaking = false;
      this.stopKeepAlive();
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      return;
    }

    const chunkText = this.chunksToSpeak[this.currentChunkIndex];
    if (!chunkText.trim()) {
      this.currentChunkIndex++;
      this.speakNextChunk();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(chunkText);
      // Keep reference to prevent GC in Chrome/V8
      this.activeUtterances.push(utterance);

      const targetLang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
      const bestVoice = this.findBestVoice(this.currentLanguage);

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang || targetLang;
      } else {
        // Fallback: set the language tag so browser online/native TTS kicks in
        utterance.lang = targetLang;
      }

      // Natural speech cadence
      utterance.rate = this.currentLanguage === 'hi' ? 0.88 : 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      utterance.onend = () => {
        this.currentChunkIndex++;
        // Trigger next chunk seamlessly
        setTimeout(() => {
          if (this.isSpeaking) {
            this.speakNextChunk();
          }
        }, 50);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis chunk note:', e);
        if (e.error === 'interrupted' || e.error === 'canceled') {
          // Normal cancel event
          return;
        }

        // Advance to next chunk if one fails
        this.currentChunkIndex++;
        if (this.currentChunkIndex < this.chunksToSpeak.length) {
          setTimeout(() => this.speakNextChunk(), 50);
        } else {
          this.isSpeaking = false;
          this.stopKeepAlive();
          if (this.onStateChangeCallback) this.onStateChangeCallback(false);
        }
      };

      // Resume synthesis if paused
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.speak(utterance);
    } catch (err: any) {
      console.warn('SpeechSynthesis speak error:', err);
      this.isSpeaking = false;
      this.stopKeepAlive();
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      if (this.onErrorCallback) {
        this.onErrorCallback(
          this.currentLanguage === 'hi'
            ? 'वॉइस आउटपुट प्रारंभ करने में समस्या हुई। कृपया टेक्स्ट उत्तर पढ़ें।'
            : 'Error starting voice speech output. Please read text response.'
        );
      }
    }
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    // Chromium has a bug where SpeechSynthesis pauses after 14 seconds; periodic resume prevents stalls
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.isSpeaking) {
        if (this.synth.paused) {
          this.synth.resume();
        }
      }
    }, 5000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  public stop() {
    this.stopKeepAlive();
    this.chunksToSpeak = [];
    this.currentChunkIndex = 0;
    this.activeUtterances = [];

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn('TTS cancel note:', err);
      }
    }
    this.isSpeaking = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const ttsService = new TTSService();

// Speech Recognition (Speech-to-Text)
export interface SpeechRecognitionResultState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

export function createSpeechRecognizer(
  language: Language,
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
) {
  if (typeof window === 'undefined') {
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    // Set to Hindi (hi-IN) or Indian English (en-IN)
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    let hasDeliveredFinal = false;
    let lastRecognizedText = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      if (finalTranscript) {
        lastRecognizedText = finalTranscript.trim();
        hasDeliveredFinal = true;
        onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        lastRecognizedText = interimTranscript.trim();
        onResult(interimTranscript.trim(), false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event.error);
      let errMessage = event.error || 'Speech recognition error';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errMessage = language === 'hi'
          ? 'माइक्रोफ़ोन अनुमति अस्वीकार कर दी गई है। कृपया ब्राउज़र सेटिंग्स में माइक की अनुमति दें।'
          : 'Microphone permission was denied. Please allow microphone access in your browser.';
      } else if (event.error === 'no-speech') {
        errMessage = language === 'hi'
          ? 'कोई आवाज नहीं सुनाई दी। कृपया माइक के पास आकर स्पष्ट बोलें।'
          : 'No speech was detected. Please try speaking closer to the microphone.';
      } else if (event.error === 'network') {
        errMessage = language === 'hi'
          ? 'आवाज पहचानने के लिए इंटरनेट कनेक्शन आवश्यक है।'
          : 'Network connection error during voice recognition.';
      } else if (event.error === 'language-not-supported') {
        errMessage = language === 'hi'
          ? 'इस ब्राउज़र में हिंदी वॉइस इनपुट समर्थित नहीं है। कृपया नीचे टाइप करके प्रश्न पूछें।'
          : 'Language not supported by voice engine. Please type below.';
      }
      onError(errMessage);
    };

    recognition.onend = () => {
      // If recognition ended naturally and browser did not mark isFinal, deliver the latest text:
      if (!hasDeliveredFinal && lastRecognizedText.trim().length > 0) {
        hasDeliveredFinal = true;
        onResult(lastRecognizedText.trim(), true);
      }
      onEnd();
    };

    return recognition;
  } catch (err: any) {
    console.warn('Failed to initialize speech recognition:', err);
    return null;
  }
}

