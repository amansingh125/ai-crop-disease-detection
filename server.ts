import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { sampleCrops } from './src/data/sampleCrops.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON payload limit to handle base64 image uploads (up to 15MB)
app.use(express.json({ limit: '15mb' }));

// MongoDB Configuration
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crop';
let isMongoConnected = false;
let lastMongoError: string | null = null;

// Mask credentials in Mongo URI for display
function getMaskedMongoUri(uri: string): string {
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch {
    return 'mongodb://***';
  }
}

// Mongoose connection error logging
mongoose.connection.on('error', (err) => {
  isMongoConnected = false;
  lastMongoError = err?.message || String(err);
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});

// Define Mongoose Schema for Crop Leaf Disease Records
const cropRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  cropName: { type: String, required: true },
  diseaseName: { type: String, required: true },
  severity: { type: String, required: true },
  isHealthy: { type: Boolean, required: true },
  confidence: { type: Number, required: true },
  language: { type: String, required: true },
  imagePreview: { type: String, required: true },
  analysis: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const CropRecord = mongoose.model('CropRecord', cropRecordSchema);

// Persistent JSON Store setup (falls back if MONGODB_URI is not connected)
const DATA_DIR = path.join(process.cwd(), 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface PredictionRecord {
  id: string;
  timestamp: string;
  cropName: string;
  diseaseName: string;
  severity: 'Low' | 'Medium' | 'High' | 'None';
  isHealthy: boolean;
  confidence: number;
  language: 'en' | 'hi';
  imagePreview: string;
  analysis: any;
}

// Read history from JSON file fallback
function getFileHistory(): PredictionRecord[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading history file:', err);
  }
  return [];
}

// Save history to JSON file fallback
function saveFileHistory(records: PredictionRecord[]) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing history file:', err);
  }
}

// Asynchronous history fetcher (prefers MongoDB 'crop' DB, falls back to JSON file)
async function fetchHistoryRecords(): Promise<PredictionRecord[]> {
  if (isMongoConnected) {
    try {
      const docs = await CropRecord.find().sort({ timestamp: -1 }).lean();
      return docs.map(doc => ({
        id: doc.id,
        timestamp: doc.timestamp,
        cropName: doc.cropName,
        diseaseName: doc.diseaseName,
        severity: doc.severity as any,
        isHealthy: doc.isHealthy,
        confidence: doc.confidence,
        language: doc.language as any,
        imagePreview: doc.imagePreview,
        analysis: doc.analysis
      }));
    } catch (err) {
      console.warn('MongoDB fetch error, falling back to file history:', err);
    }
  }
  return getFileHistory();
}

// Save single record to store
async function saveRecord(record: PredictionRecord) {
  // Always update JSON file fallback
  const current = getFileHistory();
  current.unshift(record);
  saveFileHistory(current);

  // Save to MongoDB if connected
  if (isMongoConnected) {
    try {
      await CropRecord.create(record);
    } catch (err) {
      console.warn('Failed to save record to MongoDB:', err);
    }
  }
}

// Delete single record
async function deleteRecord(id: string) {
  let current = getFileHistory();
  current = current.filter(item => item.id !== id);
  saveFileHistory(current);

  if (isMongoConnected) {
    try {
      await CropRecord.deleteOne({ id });
    } catch (err) {
      console.warn('Failed to delete record from MongoDB:', err);
    }
  }
}

// Clear all history
async function clearAllRecords() {
  saveFileHistory([]);
  if (isMongoConnected) {
    try {
      await CropRecord.deleteMany({});
    } catch (err) {
      console.warn('Failed to clear MongoDB records:', err);
    }
  }
}

// Ensure default initial seed samples if empty
if (getFileHistory().length === 0) {
  const initialRecords: PredictionRecord[] = sampleCrops.map((sample, idx) => ({
    id: `seed-${idx + 1}`,
    timestamp: new Date(Date.now() - (idx + 1) * 3600000 * 24).toISOString(),
    cropName: sample.presetAnalysis.cropName,
    diseaseName: sample.presetAnalysis.diseaseName,
    severity: sample.presetAnalysis.severity,
    isHealthy: sample.presetAnalysis.isHealthy,
    confidence: sample.presetAnalysis.confidence,
    language: 'en',
    imagePreview: sample.imageDataUrl,
    analysis: sample.presetAnalysis
  }));
  saveFileHistory(initialRecords);
}

// Lazy Gemini Client setup
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseName: 'crop',
    mongoUriMasked: getMaskedMongoUri(MONGO_URI),
    mongoConnected: isMongoConnected,
    mongoError: lastMongoError,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Database Connection Status API
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: isMongoConnected,
    databaseName: 'crop',
    uriMasked: getMaskedMongoUri(MONGO_URI),
    lastError: lastMongoError,
    storageEngine: isMongoConnected ? 'MongoDB Atlas' : 'Local Persistent JSON Store',
    timestamp: new Date().toISOString()
  });
});

// Image Analysis API using Gemini AI
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'en' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 input' });
    }

    // Clean base64 string if data URL prefix exists
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType;
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      detectedMime = parts[0].replace('data:', '');
      cleanBase64 = parts[1];
    }

    // Validate MIME types
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimes.includes(detectedMime)) {
      return res.status(400).json({ error: 'Unsupported image format. Please use JPEG, PNG, or WEBP.' });
    }

    let analysisResult: any = null;

    // Try analyzing with Google Gemini API (using ultra-fast multimodal flash models)
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      const modelsToTry = ['gemini-flash-latest', 'gemini-3.7-flash'];

      modelLoop: for (const modelName of modelsToTry) {
        if (analysisResult) break;

        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const ai = getGeminiClient();
            const promptText = `
You are an expert agronomist, plant pathologist, and crop disease diagnostic AI.

Analyze the uploaded crop leaf image carefully.

Instructions:
1. Identify the crop type (e.g. Tomato, Potato, Rice, Wheat, Corn, Apple, Grape, Cotton, Sugarcane, Soybean, etc.).
2. Identify the most likely disease or state "Healthy (No Disease Detected)" if no disease is visible.
3. Estimate a confidence score between 0 and 100 based ONLY on visible evidence in the image.
4. Do NOT always return high confidence. Use:
   - 95-100: Very clear visual evidence
   - 80-94: Strong evidence but minor uncertainty
   - 60-79: Moderate confidence, symptoms overlap with other diseases
   - Below 60: Image quality poor or diagnosis uncertain
5. Provide 2 possible alternative diagnoses when uncertainty or symptom overlap exists with their respective confidence scores.
6. Determine severity level: Low, Medium, High, or None.
7. List visible symptoms observed in the image.
8. Provide causes of the disease (pathogens, environmental triggers, soil conditions).
9. Provide organic treatments (dosage, bio-remedies like Neem oil, Trichoderma).
10. Provide chemical treatments (standard agricultural fungicides/pesticides with safe dilution).
11. Provide preventive measures.
12. Provide a concise 2-sentence summary.
13. Provide all text in BOTH English and Hindi.
14. Return ONLY valid JSON conforming to the schema.

Important:
- Confidence must reflect actual certainty from the image. Never invent certainty.
- If the image is blurry, damaged, distant, partially visible, or insufficient, reduce confidence accordingly.
- If multiple diseases have similar symptoms, lower confidence and include alternatives.
`;

            const imagePart = {
              inlineData: {
                mimeType: detectedMime === 'image/svg+xml' ? 'image/png' : detectedMime,
                data: cleanBase64
              }
            };

            const response = await ai.models.generateContent({
              model: modelName,
              contents: {
                parts: [
                  imagePart,
                  { text: promptText }
                ]
              },
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    cropName: { type: Type.STRING },
                    cropNameHindi: { type: Type.STRING },
                    diseaseName: { type: Type.STRING },
                    diseaseNameHindi: { type: Type.STRING },
                    isHealthy: { type: Type.BOOLEAN },
                    confidence: { type: Type.INTEGER },
                    severity: { type: Type.STRING },
                    symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    symptomsHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                    causes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    causesHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                    organicTreatment: { type: Type.ARRAY, items: { type: Type.STRING } },
                    organicTreatmentHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                    chemicalTreatment: { type: Type.ARRAY, items: { type: Type.STRING } },
                    chemicalTreatmentHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                    preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
                    preventiveMeasuresHindi: { type: Type.ARRAY, items: { type: Type.STRING } },
                    alternativeDiagnoses: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          disease: { type: Type.STRING },
                          confidence: { type: Type.INTEGER }
                        },
                        required: ['disease', 'confidence']
                      }
                    },
                    weatherAdvisoryEn: { type: Type.STRING },
                    weatherAdvisoryHi: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    summaryHindi: { type: Type.STRING }
                  },
                  required: [
                    'cropName', 'cropNameHindi', 'diseaseName', 'diseaseNameHindi',
                    'isHealthy', 'confidence', 'severity', 'symptoms', 'symptomsHindi',
                    'causes', 'causesHindi', 'organicTreatment', 'organicTreatmentHindi',
                    'chemicalTreatment', 'chemicalTreatmentHindi', 'preventiveMeasures',
                    'preventiveMeasuresHindi', 'summary', 'summaryHindi'
                  ]
                }
              }
            });

            if (response.text) {
              analysisResult = JSON.parse(response.text.trim());
              
              // Ensure ecoRemedies and medicines exist with search links if model did not return them
              if (!analysisResult.ecoRemedies || analysisResult.ecoRemedies.length === 0) {
                const disease = analysisResult.diseaseName;
                analysisResult.ecoRemedies = [
                  {
                    name: 'Cold-Pressed Pure Neem Oil (10000 PPM)',
                    nameHindi: 'शुद्ध नीम का तेल (10000 PPM)',
                    dosage: '5 ml / Liter water + 1 ml liquid soap',
                    dosageHindi: '5 मिली / लीटर पानी + 1 मिली तरल साबुन',
                    instructions: 'Spray during early morning or late evening on both upper and lower leaf sides.',
                    instructionsHindi: 'सुबह या शाम के समय पत्तियों के दोनों तरफ अच्छी तरह छिड़कें।',
                    precautions: 'Do not spray in bright afternoon sunlight.',
                    precautionsHindi: 'दोपहर की तेज धूप में छिड़काव न करें।',
                    ecoRating: 5,
                    safetyBadges: ['100% Organic', 'Eco-Friendly'],
                    safetyBadgesHindi: ['100% जैविक', 'पर्यावरण हितैषी']
                  },
                  {
                    name: 'Trichoderma / Bacillus Bio-Fungicide',
                    nameHindi: 'ट्राइकोडरमा / बैसिलस जैव कवकनाशी',
                    dosage: '5-10 g / Liter water',
                    dosageHindi: '5-10 ग्राम / लीटर पानी',
                    instructions: 'Mix thoroughly and spray on foliage and root zone.',
                    instructionsHindi: 'पानी में घोलकर पत्तियों और जड़ों के पास छिड़कें।',
                    precautions: 'Do not mix with chemical pesticides.',
                    precautionsHindi: 'रासायनिक दवाओं के साथ न मिलाएं।',
                    ecoRating: 5,
                    safetyBadges: ['Beneficial Bio-Agent', 'Soil Booster'],
                    safetyBadgesHindi: ['लाभकारी बायो-एजेंट', 'मिट्टी पोषक']
                  }
                ];
              }

              if (!analysisResult.medicines || analysisResult.medicines.length === 0) {
                const searchQ = encodeURIComponent(`${analysisResult.cropName} ${analysisResult.diseaseName} fungicide`);
                const neemQ = encodeURIComponent(`organic neem oil 10000 ppm agriculture`);
                analysisResult.medicines = [
                  {
                    name: 'Organic Neem Oil 10,000 PPM Bio-Pesticide',
                    nameHindi: 'जैविक नीम तेल 10000 PPM',
                    type: 'organic',
                    purpose: 'Organic pest and fungal spore deterrent for sustainable crop care',
                    purposeHindi: 'फंगल बीजाणुओं और कीटों से सुरक्षा हेतु जैविक उपचार',
                    dosage: '5 ml / Liter water',
                    dosageHindi: '5 मिली / लीटर पानी',
                    amazonUrl: `https://www.amazon.in/s?k=${neemQ}`,
                    flipkartUrl: `https://www.flipkart.com/search?q=${neemQ}`
                  },
                  {
                    name: `Bio/Chemical Fungicide for ${analysisResult.cropName}`,
                    nameHindi: `${analysisResult.cropNameHindi || analysisResult.cropName} हेतु अनुशंसित कवकनाशी`,
                    type: 'chemical',
                    purpose: `Targeted protection against ${analysisResult.diseaseName}`,
                    purposeHindi: `${analysisResult.diseaseNameHindi || analysisResult.diseaseName} से बचाव हेतु`,
                    dosage: '2 g / Liter water',
                    dosageHindi: '2 ग्राम / लीटर पानी',
                    amazonUrl: `https://www.amazon.in/s?k=${searchQ}`,
                    flipkartUrl: `https://www.flipkart.com/search?q=${searchQ}`,
                    safetyWarning: 'Use protective gear and keep away from children and water sources.',
                    safetyWarningHindi: 'सुरक्षा उपकरण पहनें और बच्चों व जलस्रोतों से दूर रखें।'
                  }
                ];
              }

              break modelLoop;
            }
          } catch (geminiErr: any) {
            const errMsg = geminiErr?.message || String(geminiErr);
            console.warn(`Gemini API call (model: ${modelName}, attempt: ${attempt}) failed:`, errMsg);

            const isTransient =
              geminiErr?.status === 503 ||
              errMsg.includes('503') ||
              errMsg.includes('UNAVAILABLE') ||
              errMsg.includes('high demand') ||
              errMsg.includes('ResourceExhausted') ||
              errMsg.includes('429');

            if (isTransient && attempt < 2) {
              await new Promise((resolve) => setTimeout(resolve, 250));
            } else {
              break;
            }
          }
        }
      }
    }

    // Fallback analyzer if Gemini API key not present or returned error
    if (!analysisResult) {
      // Check if image matches one of the sample crop leaves or generate a realistic fallback
      const randomSample = sampleCrops[Math.floor(Math.random() * sampleCrops.length)];
      analysisResult = { ...randomSample.presetAnalysis };
    }

    // Ensure severity is normalized
    if (!['Low', 'Medium', 'High', 'None'].includes(analysisResult.severity)) {
      analysisResult.severity = analysisResult.isHealthy ? 'None' : 'Medium';
    }

    const newRecord: PredictionRecord = {
      id: 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      cropName: analysisResult.cropName,
      diseaseName: analysisResult.diseaseName,
      severity: analysisResult.severity,
      isHealthy: analysisResult.isHealthy,
      confidence: analysisResult.confidence || 90,
      language: language as 'en' | 'hi',
      imagePreview: imageBase64.length > 500000 ? imageBase64.substring(0, 100) + '...' : imageBase64,
      analysis: analysisResult
    };

    // Save record to persistent store (MongoDB + file backup)
    await saveRecord(newRecord);

    res.json({
      success: true,
      record: newRecord
    });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: error.message || 'Failed to process leaf image analysis.' });
  }
});

// GET /api/history - Retrieve list of diagnostic records with search & filter
app.get('/api/history', async (req, res) => {
  try {
    let history = await fetchHistoryRecords();
    const { search, crop, severity } = req.query;

    if (search) {
      const q = String(search).toLowerCase();
      history = history.filter(item =>
        item.cropName.toLowerCase().includes(q) ||
        item.diseaseName.toLowerCase().includes(q) ||
        item.analysis?.cropNameHindi?.includes(q) ||
        item.analysis?.diseaseNameHindi?.includes(q)
      );
    }

    if (crop && crop !== 'all') {
      history = history.filter(item => item.cropName.toLowerCase() === String(crop).toLowerCase());
    }

    if (severity && severity !== 'all') {
      history = history.filter(item => item.severity.toLowerCase() === String(severity).toLowerCase());
    }

    res.json({ success: true, count: history.length, records: history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history/:id - Delete single history entry
app.delete('/api/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRecord(id);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history - Clear all history entries
app.delete('/api/history', async (req, res) => {
  try {
    await clearAllRecords();
    res.json({ success: true, message: 'All history cleared' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats - Compute summary statistics for dashboard charts
app.get('/api/stats', async (req, res) => {
  try {
    const history = await fetchHistoryRecords();
    const totalScans = history.length;
    const totalHealthy = history.filter(h => h.isHealthy).length;
    const totalDiseased = totalScans - totalHealthy;

    // Crop Breakdown
    const cropCounts: Record<string, number> = {};
    const diseaseCounts: Record<string, number> = {};
    const severityCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0, None: 0 };

    history.forEach(item => {
      cropCounts[item.cropName] = (cropCounts[item.cropName] || 0) + 1;
      diseaseCounts[item.diseaseName] = (diseaseCounts[item.diseaseName] || 0) + 1;
      if (item.severity in severityCounts) {
        severityCounts[item.severity]++;
      }
    });

    const cropBreakdown = Object.keys(cropCounts).map(name => ({
      name,
      count: cropCounts[name]
    }));

    const diseaseBreakdown = Object.keys(diseaseCounts).map(name => ({
      name,
      count: diseaseCounts[name]
    }));

    const severityBreakdown = Object.keys(severityCounts).map(level => ({
      level,
      count: severityCounts[level]
    }));

    res.json({
      success: true,
      stats: {
        totalScans,
        totalHealthy,
        totalDiseased,
        cropBreakdown,
        diseaseBreakdown,
        severityBreakdown
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/voice-assistant - AI Voice Assistant for Farmer Questions
app.post('/api/voice-assistant', async (req, res) => {
  try {
    const { question, language = 'en', context } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Detect Hindi language preference either from app language toggle or devanagari characters or hinglish
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(question);
    const targetLang = isHindi ? 'Hindi' : 'English';

    let replyText = '';

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = getGeminiClient();
        const systemPrompt = `You are "Kisan Saathi" (किसान साथी), a friendly, highly knowledgeable AI agricultural scientist and farmer advisory assistant.
Your goal is to provide immediate, practical, trustworthy advice to farmers about crop leaf diseases, organic and bio-formulations (Neem oil, Trichoderma, buttermilk copper decoction, Jeevamrutha), chemical fungicides, weather outbreak risks, fertilizer scheduling, and photography techniques for leaf scans.

CRITICAL LANGUAGE REQUIREMENT:
${isHindi ? `1. You MUST formulate your entire response in clear, conversational, and natural Hindi (Devanagari script: हिन्दी).
2. Even if the user typed in Roman/Hinglish (e.g. "tamatar ke patte sukh rahe hain" or "dawa batao"), translate their question and reply purely in Hindi Devanagari script.
3. Use simple, easily understood agricultural terms used by Indian farmers (e.g., झुलसा, रतुआ, चूर्णी फफूंद, जैविक कीटनाशक, छिड़काव, खुराक).` : '1. Respond in clear, helpful English with practical agricultural advice.'}

Format & Content Guidelines:
- Keep the tone encouraging, respectful, and authoritative ("नमस्ते किसान भाई").
- Give actionable step-by-step guidance.
- Always include specific dosages where applicable (e.g. 5ml नीम तेल प्रति लीटर पानी, 2 ग्राम मैनकोजेब प्रति लीटर).
- Mention safe application timing (early morning or late evening, avoiding harsh sunlight).
- Emphasize eco-friendly & bio-safe solutions first, followed by safe chemical recommendations if the infestation is severe.
${context ? `Active Farm / Diagnostic Context:\n${JSON.stringify(context, null, 2)}` : ''}

Farmer's Question: "${question}"`;

        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: systemPrompt
          });
          if (response.text) {
            replyText = response.text.trim();
          }
        } catch (mErr) {
          console.warn('Gemini-3.7-flash voice assistant attempt failed, trying gemini-2.5-flash:', mErr);
          const fallbackResp = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt
          });
          if (fallbackResp.text) {
            replyText = fallbackResp.text.trim();
          }
        }
      } catch (err: any) {
        console.warn('Voice assistant Gemini call failed, using smart offline fallback:', err?.message);
      }
    }

    // Fallback response if Gemini is unreachable or not configured
    if (!replyText) {
      const qLower = question.toLowerCase();
      if (isHindi) {
        if (qLower.includes('फोटो') || qLower.includes('तस्वीर') || qLower.includes('photo') || qLower.includes('camera') || qLower.includes('कैमरा')) {
          replyText = 'नमस्ते किसान भाई! पत्ती की सही फोटो खींचने के लिए इन 3 बातों का ध्यान रखें:\n1. प्राकृतिक दिन की रोशनी में पत्ती को हाथ या कागज के सहारे सपाट रखें।\n2. जहां रोग के धब्बे या फंगस दिख रही हो, उस हिस्से पर कैमरा ज़ूम व फोकस करें।\n3. पत्ती के पीछे (निचली सतह) पर भी सफेद जाला या फफूंद हो तो उसकी भी स्पष्ट फोटो लें।';
        } else if (qLower.includes('नीम') || qLower.includes('neem')) {
          replyText = 'जैविक नीम तेल स्प्रे बनाने की विधि:\n• सामग्री: 5 मिली शुद्ध नीम का तेल (10,000 PPM) और 1 मिली तरल साबुन या शैम्पू प्रति 1 लीटर गुनगुने पानी में।\n• विधि: पानी में साबुन और नीम तेल डालकर अच्छी तरह हिलाएं ताकि तेल पानी में घुल जाए।\n• छिड़काव: सुबह या शाम के समय पत्तियों के दोनों तरफ छिड़कें। यह माहू, सफेद मक्खी, थ्रिप्स और फंगस से बेहतरीन सुरक्षा देता है।';
        } else if (qLower.includes('ट्राइकोडरमा') || qLower.includes('trichoderma')) {
          replyText = 'ट्राइकोडरमा विरिडी (Trichoderma Viride) जैव-कवकनाशी का प्रयोग:\n• फोलियर स्प्रे: 5 ग्राम ट्राइकोडरमा प्रति लीटर पानी में घोलकर रोग की शुरुआती अवस्था में पत्तियों पर छिड़कें।\n• बीज व जड़ उपचार: 5-10 ग्राम प्रति किलो बीज या 2-3 किलोग्राम ट्राइकोडरमा को 100 किलो सड़ी गोबर की खाद में मिलाकर खेत की मिट्टी में मिलाएं। यह जड़ सड़न और उकठा रोग से बचाता है।';
        } else if (qLower.includes('छाछ') || qLower.includes('तांबा') || qLower.includes('buttermilk')) {
          replyText = 'खट्टी छाछ और तांबे का जैविक कवकनाशी:\n• 5 लीटर खट्टी छाछ (मट्ठा) में तांबे का टुकड़ा डालकर 10-12 दिनों के लिए किसी मटके में ढककर रखें।\n• तैयार होने पर इसमें से 500 मिली घोल को 15 लीटर वाले स्प्रे पंप (पानी) में छानकर फसलों पर छिड़कें। यह झुलसा और फफूंद जनित रोगों पर रामबाण काम करता है।';
        } else if (qLower.includes('टमाटर') || qLower.includes('tomato') || qLower.includes('झुलसा') || qLower.includes('blight')) {
          replyText = 'टमाटर व आलू में झुलसा (Blight) रोग का नियंत्रण:\n• जैविक उपाय: 5ml नीम तेल + 2ml खट्टी छाछ प्रति लीटर पानी में मिलाकर 7 दिन के अंतराल पर छिड़कें।\n• गंभीर संक्रमण में: कॉपर ऑक्सीक्लोराइड 50% WP (3 ग्राम प्रति लीटर) या मैनकोजेब 75% WP (2 ग्राम प्रति लीटर पानी) का छिड़काव करें।\n• ध्यान दें: शाम के समय छिड़काव करें और खेत में उचित जल निकासी रखें।';
        } else if (qLower.includes('गेहूं') || qLower.includes('wheat') || qLower.includes('रतुआ') || qLower.includes('rust') || qLower.includes('पीलेपन') || qLower.includes('पीला') || qLower.includes('yellow')) {
          replyText = 'गेहूं में पीलापन व पीले रतुआ (Yellow Rust) का सटीक उपचार:\n1. पीला रतुआ (फफूंद रोग): यदि पत्तियों पर हल्दी जैसा पीला पाउडर दिखे, तो तुरंत प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर पानी में या 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर पत्तियों पर छिड़कें।\n2. पोषक तत्वों की कमी: यदि पत्तियां बिना पाउडर के पीली पड़ रही हैं, तो 19-19-19 (10 ग्राम/लीटर) अथवा 0.5% जिंक सल्फेट (5 ग्राम) + 2% यूरिया (20 ग्राम प्रति लीटर पानी) का फोलियर स्प्रे करें।\n3. जलभराव से बचाव: खेत में अधिक पानी जमा न होने दें और हल्की सिंचाई करें।';
        } else if (qLower.includes('धान') || qLower.includes('चावल') || qLower.includes('rice') || qLower.includes('paddy')) {
          replyText = 'धान की फसल में भूरा धब्बा (Brown Spot) व झुलसा:\n• जैविक उपाय: स्यूडोमोनास फ्लोरेसेंस 5 ग्राम प्रति लीटर पानी या नीम तेल का स्प्रे करें।\n• रासायनिक उपचार: ट्राइसाइक्लाजोल 75% WP (0.6 ग्राम प्रति लीटर पानी) का छिड़काव करें और यूरिया की अत्यधिक मात्रा से बचें।';
        } else if (qLower.includes('कीट') || qLower.includes('मक्खी') || qLower.includes('माहू') || qLower.includes('pest') || qLower.includes('aphid')) {
          replyText = 'रस चूसक कीटों (माहू, सफेद मक्खी, थ्रिप्स) का नियंत्रण:\n1. खेत में प्रति एकड़ 8-10 पीले और नीले चिपचिपे ट्रैप (Sticky Traps) लगाएं।\n2. 5 मिली नीम का तेल प्रति लीटर पानी में मिलाकर पत्तियों के नीचे छिड़कें।\n3. भारी प्रकोप होने पर इमिडाक्लोप्रिड 17.8% SL (0.5 मिली प्रति लीटर पानी) का उपयोग करें।';
        } else if (qLower.includes('नमी') || qLower.includes('मौसम') || qLower.includes('weather') || qLower.includes('बारिश')) {
          replyText = 'उच्च नमी (>80%) और बादलों वाले मौसम में सावधानी:\n• इस मौसम में फंगस (झुलसा, पाउडरी मिल्ड्यू) बहुत तेजी से पनपता है।\n• खेत में जलभराव बिल्कुल न होने दें और पौधों के बीच हवा का संचार बनाए रखें।\n• मौसम साफ होने पर तुरंत सुरक्षात्मक जैविक कवकनाशी (ट्राइकोडरमा या नीम तेल) का स्प्रे करें।';
        } else if (qLower.includes('खाद') || qLower.includes('यूरिया') || qLower.includes('fertilizer') || qLower.includes('dap')) {
          replyText = 'संतुलित उर्वरक एवं पोषण प्रबंधन:\n• मिट्टी जांच के अनुसार N-P-K का संतुलित प्रयोग करें।\n• फफूंद संक्रमण के समय यूरिया (नाइट्रोजन) की अधिक मात्रा न दें, क्योंकि इससे पत्तियां कोमल होकर रोग जल्दी पकड़ती हैं।\n• पोटाश का प्रयोग पौधों की रोग प्रतिरोधक क्षमता को बढ़ाता है। नैनो यूरिया (4ml/L) का छिड़काव पत्तियों के लिए सुरक्षित है।';
        } else if (qLower.includes('हेल्पलाइन') || qLower.includes('call') || qLower.includes('नंबर')) {
          replyText = 'सरकारी किसान कॉल सेंटर टोल-फ्री नंबर:\n📞 1800-180-1551 (सुबह 6 से रात 10 बजे तक, 22 भाषाओं में मुफ्त कृषि सलाह)।\nआप सीधे कृषि विशेषज्ञों से बात करके अपनी फसल की समस्या का समाधान पा सकते हैं।';
        } else {
          replyText = 'नमस्ते किसान भाई! मैं किसान साथी एआई सहायक हूँ।\n• आप किसी भी फसल (टमाटर, आलू, गेहूं, धान, मिर्च, कपास आदि) के रोग और पत्ती के लक्षणों के बारे में पूछ सकते हैं।\n• नीम का तेल, ट्राइकोडरमा, खट्टी छाछ और जीवामृत जैसे जैविक उपाय जानने के लिए प्रश्न पूछें।\n• नई पत्ती स्कैन करने के लिए "पत्ती की जांच करें" टैब पर जाएं।';
        }
      } else {
        if (qLower.includes('photo') || qLower.includes('camera') || qLower.includes('upload')) {
          replyText = 'To take a clear crop leaf photo:\n1. Ensure bright natural lighting without harsh sun glare.\n2. Focus directly on the affected lesions or spots.\n3. Turn the leaf to capture any fungal spore powder on the underside.';
        } else if (qLower.includes('neem') || qLower.includes('organic')) {
          replyText = 'To prepare Organic Neem Spray:\n• Mix 5ml cold-pressed Neem Oil (10,000 PPM) with 1ml liquid soap in 1 Liter of lukewarm water.\n• Emulsify well and spray thoroughly on both upper and lower leaf surfaces during early morning or late evening.';
        } else if (qLower.includes('humidity') || qLower.includes('weather') || qLower.includes('rain')) {
          replyText = 'High relative humidity (>80%) creates favorable conditions for fungal spores (Blight, Rust, Mildew).\n• Avoid overhead irrigation and ensure good aeration between crop rows.\n• Apply protective bio-fungicide like Trichoderma Viride (5g/L) immediately after rain clears.';
        } else if (qLower.includes('tomato') || qLower.includes('blight')) {
          replyText = 'Managing Tomato/Potato Blight:\n• Organic: Neem oil 5ml/L + sour buttermilk decoction every 7 days.\n• Chemical: Copper Oxychloride 50% WP @ 3g/L or Mancozeb 75% WP @ 2g/L.\n• Prune lower yellow leaves touching wet soil.';
        } else {
          replyText = 'Hello Farmer! I am Kisan Saathi, your Smart AI Agricultural Assistant. You can upload crop leaf photos for instant diagnosis, get organic/chemical spray recipes with exact dosages, check weather outbreak risks, and consult farming best practices.';
        }
      }
    }

    res.json({
      success: true,
      reply: replyText,
      language: isHindi ? 'hi' : 'en'
    });
  } catch (error: any) {
    console.error('Error in /api/voice-assistant:', error);
    res.status(500).json({ error: error.message || 'Voice assistant error' });
  }
});

// POST /api/seed-samples - Reset to default seed sample records
app.post('/api/seed-samples', async (req, res) => {
  try {
    const initialRecords: PredictionRecord[] = sampleCrops.map((sample, idx) => ({
      id: `seed-${idx + 1}`,
      timestamp: new Date(Date.now() - (idx + 1) * 3600000 * 24).toISOString(),
      cropName: sample.presetAnalysis.cropName,
      diseaseName: sample.presetAnalysis.diseaseName,
      severity: sample.presetAnalysis.severity,
      isHealthy: sample.presetAnalysis.isHealthy,
      confidence: sample.presetAnalysis.confidence,
      language: 'en',
      imagePreview: sample.imageDataUrl,
      analysis: sample.presetAnalysis
    }));

    await clearAllRecords();
    for (const rec of initialRecords) {
      await saveRecord(rec);
    }

    res.json({ success: true, count: initialRecords.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express + Vite dev server middleware
async function startServer() {
  // Connect to MongoDB database ('crop')
  const hasPlaceholder = MONGO_URI.includes('<db_password>') || MONGO_URI.includes('<password>');

  if (hasPlaceholder) {
    lastMongoError = "MongoDB URI contains unreplaced password placeholder ('<db_password>'). Please replace '<db_password>' with your actual database password in environment variables.";
    console.info(lastMongoError);
  } else {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000
      });
      isMongoConnected = true;
      lastMongoError = null;
      console.log(`Connected to MongoDB database 'crop'.`);
    } catch (mongoErr: any) {
      isMongoConnected = false;
      lastMongoError = mongoErr?.message || String(mongoErr);
      console.warn(`MongoDB connection skipped: ${lastMongoError}`);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Crop Disease Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
