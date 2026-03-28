import { GoogleGenAI, Type, Modality, Chat, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, WeatherData, AQIData, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper: Retry Logic ---
const retry = async <T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Gemini API call failed, retrying... (${retries} attempts left). Error:`, error.message);
      await new Promise(res => setTimeout(res, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// --- Chat Service ---
let chatSession: Chat | null = null;

export const getBotanistChat = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: `You are the "Eco-Botanist", an expert in farming, plant pathology, and environmental science for ArborZen AI.
        
        YOUR GOALS:
        1. Answer user questions about plants, farming techniques, pests, and soil health accurately.
        2. Remember the context of the conversation.
        3. CRITICAL: At the end of every helpful answer, recommend specifically what kind of image the user should upload to the EarthSense app for better analysis based on the topic.
        
        Keep your tone friendly, professional, and encouraging.`,
      },
    });
  }
  return chatSession;
};

// Helper: Clean JSON string (remove markdown code blocks)
const cleanJsonString = (str: string): string => {
  if (!str) return "{}";
  // Remove ```json and ```
  let cleaned = str.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
  // Remove generic code blocks
  cleaned = cleaned.replace(/```/g, "");
  return cleaned.trim();
};

// Helper: Default Result to prevent UI crashes
const getDefaultResult = (): AnalysisResult => ({
  plantName: "Unknown Plant",
  emotion: "Dormant",
  healthScore: 50,
  localAreaHealthScore: 50,
  stressFactors: ["Data incomplete"],
  visualizerDetails: [],
  climateTrends: "Analysis incomplete.",
  story: "I am having trouble finding my voice right now. Please try scanning me again.",
  treeAge: { estimatedAge: "Unknown", growthStage: "Unknown", lifespan: "Unknown" },
  oxygenScore: { dailyProduction: "0L", score: 0, airQualityImpact: "Unknown" },
  personality: { archetype: "The Silent Observer", quote: "Nature speaks in whispers.", mood: "Quiet" },
  horoscope: { sign: "Earth", prediction: "A time for rest.", luckyElement: "Soil" },
  waterBudget: { perDay: "Check soil", perWeek: "--", perMonth: "--", adjustments: "Monitor manually" },
  predictions: [],
  diseaseMap: { upperCanopy: "Unknown", middleCanopy: "Unknown", lowerCanopy: "Unknown", roots: "Unknown", overallSeverity: 0 },
  soilAnalysis: { 
    texture: "Unknown", 
    composition: { sand: "--", silt: "--", clay: "--" }, 
    pH: "Unknown", 
    organicMatter: "Unknown", 
    microbialActivity: "Unknown", 
    health: "Moderate" 
  },
  comparisonScore: 50,
  namingSuggestions: ["Greenie", "Sprout"],
  careSchedule: [],
  solutions: { watering: "Check soil moisture.", soil: "Ensure drainage.", pestControl: "Monitor visually.", weatherPrediction: "Check local forecast." },
  products: [],
  tips: ["Please try analyzing again."],
  sosAlert: { isActive: false, type: 'General', title: '', severity: 'Moderate', steps: [] }
});

// --- Analysis Service ---
export const analyzeEnvironment = async (
  images: string[], // Base64 array
  audio: string | null, // Base64
  audioMimeType: string | null,
  weather: WeatherData | null,
  aqi: AQIData | null,
  locationName: string | null,
  language: Language
): Promise<AnalysisResult> => {

  const parts: any[] = [];

  const promptText = `
    You are ArborZen AI, the ultimate Digital Plant Doctor and Eco-Companion.
    
    INPUTS:
    ${locationName ? `- Location: ${locationName}` : ''}
    ${weather ? `- Weather: ${JSON.stringify(weather)}` : '- Weather: Unknown'}
    ${aqi ? `- AQI Data: ${JSON.stringify(aqi)}` : '- AQI: Unknown'}
    - Audio Provided: ${audio ? 'Yes' : 'No'}
    - Images Provided: ${images.length}
    - Language: ${language}

    TASKS:
    1. **Tree Age Estimator**: Identify the plant/tree species. Analyze visual cues (trunk girth, bark texture, canopy spread) to estimate Age, Growth Stage, and Remaining Lifespan.
    2. **Personality & Soul**: 
       - Determine the **Archetype** based on the species (e.g., Oak = "The Ancient Guardian", Willow = "The Weeping Sage", Cactus = "The Resilient Survivor").
       - Determine the **Mood** based on health/weather (e.g., Healthy + Sun = "Radiant", Sick + Rain = "Gloomy").
       - Generate a unique **Quote** in the first person ("I...") that reflects this personality and current condition.
    3. **Gamified Metrics**: Calculate an "Oxygen Contribution Score" (0-100). 
       **Water Budget Calculator**: Calculate precise water needs (Day/Week/Month) considering species, soil, and current weather (e.g. "500ml", "3.5L"). Suggest specific adjustments based on humidity/temp.
    4. **Forecasting**: Predict the next 10 days (Leaf fall, fungus risk, sun stress).
    5. **Care Plan (7-Day Routine)**: Generate a highly detailed 7-day schedule based on weather/disease. Use icons: 'water', 'sun', 'fertilizer', 'check', 'shield', 'cloud', 'home'.
    6. **Disease Mapping & Soil Analysis**: Analyze spread (Upper/Middle/Lower canopy). 
       **Deep Soil Analysis**: Inspect any visible soil or infer from plant health. Estimate:
       - **Texture**: (e.g., Sandy, Loamy, Clay).
       - **Composition**: Approx % of Sand, Silt, Clay.
       - **pH Level**: Estimate based on plant type preference and condition (e.g., Yellowing leaves might indicate high pH/Iron deficiency).
       - **Microbial Activity**: Infer from mulch/organic matter visibility.
    7. **Shopping**: Suggest products with "Why, How, When".
    8. **Names**: Suggest 10 unique names.
    9. **SOS Mode**: If health < 50 or risks detected, activate SOS. Classify type (Drought/Pest/Disease/Nutrient).
    10. **Eco-Astrology (Horoscope)**: Generate a mystical "Tree Horoscope" based on the tree species, current weather patterns, and sunlight levels (isDay/cloud cover).
       - **Sign**: Invent a nature sign (e.g., "The Sun Chaser" if high sunlight/clear sky, "The Rooted Sage" if old, "The Storm Dancer" if windy).
       - **Prediction**: A poetic yet practical daily forecast mixing botany and astrology.
       - **Lucky Element**: e.g., "Morning Dew", "Nitrogen", "Sunlight", "West Wind".
    
    OUTPUT JSON SCHEMA (Do not include markdown):
    {
      "plantName": string,
      "emotion": "Happy" | "Stressed" | "Suffocating" | "Recovering" | "Dormant",
      "healthScore": number, 
      "localAreaHealthScore": number,
      "stressFactors": string[],
      "visualizerDetails": [
        { "part": "Canopy" | "Trunk" | "Roots" | "Soil", "issue": string, "severity": "Low" | "Medium" | "High" }
      ],
      "climateTrends": string,
      "story": string,
      "treeAge": {
        "estimatedAge": string,
        "growthStage": string,
        "lifespan": string
      },
      "oxygenScore": {
        "dailyProduction": string,
        "score": number,
        "airQualityImpact": string
      },
      "personality": {
        "archetype": string,
        "quote": string,
        "mood": string
      },
      "horoscope": {
        "sign": string,
        "prediction": string,
        "luckyElement": string
      },
      "waterBudget": {
        "perDay": string,
        "perWeek": string,
        "perMonth": string,
        "adjustments": string
      },
      "predictions": [
        { "day": "Day 1-3", "leafStatus": string, "pestRisk": string, "sunIntensity": string, "summary": string },
        { "day": "Day 4-7", "leafStatus": string, "pestRisk": string, "sunIntensity": string, "summary": string },
        { "day": "Day 8-10", "leafStatus": string, "pestRisk": string, "sunIntensity": string, "summary": string }
      ],
      "diseaseMap": {
        "upperCanopy": string,
        "middleCanopy": string,
        "lowerCanopy": string,
        "roots": string,
        "overallSeverity": number
      },
      "soilAnalysis": {
        "texture": string,
        "composition": { "sand": string, "silt": string, "clay": string },
        "pH": string,
        "organicMatter": string,
        "microbialActivity": string,
        "health": "Poor" | "Moderate" | "Good" | "Excellent"
      },
      "comparisonScore": number,
      "namingSuggestions": { type: Type.ARRAY, items: { type: Type.STRING } },
      "careSchedule": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: {type:Type.STRING}, task: {type:Type.STRING}, icon: {type:Type.STRING} } } },
      "solutions": { type: Type.OBJECT, properties: { watering: {type:Type.STRING}, soil: {type:Type.STRING}, pestControl: {type:Type.STRING}, weatherPrediction: {type:Type.STRING} } },
      "products": { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type:Type.STRING}, type: {type:Type.STRING}, reason: {type:Type.STRING}, usageInstructions: {type:Type.STRING}, timing: {type:Type.STRING} } } },
      "sosAlert": { 
          type: Type.OBJECT, 
          properties: { 
             isActive: {type: Type.BOOLEAN},
             type: {type: Type.STRING, enum: ["Drought", "Pest", "Disease", "Nutrient", "General"]}, 
             title: {type:Type.STRING}, 
             severity: {type: Type.STRING, enum: ["Moderate", "Critical"]},
             steps: { type: Type.ARRAY, items: { type: Type.STRING } } 
          } 
      },
      "tips": { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  `;

  parts.push({ text: promptText });

  if (images.length > 0) {
    images.forEach(imgBase64 => {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imgBase64
        }
      });
    });
  }

  if (audio) {
    parts.push({
      inlineData: {
        mimeType: audioMimeType || 'audio/wav',
        data: audio
      }
    });
  }

  try {
    const response = await retry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High-reasoning model
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 32768 } // Max thinking budget for deep analysis
      }
    }));

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const cleanedText = cleanJsonString(text);
    
    let parsed: any;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error, trying regex repair or fallback", e);
      return getDefaultResult();
    }

    return { ...getDefaultResult(), ...parsed };

  } catch (err) {
    console.error("Gemini Analysis Failed:", err);
    return getDefaultResult();
  }
};

export const generateTreeVoice = async (text: string): Promise<string> => {
  try {
    const response = await retry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Fenrir' },
            },
        },
      },
    }));

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio generated");
    
    return base64Audio;
  } catch (error) {
    console.error("TTS Generation Failed:", error);
    throw error;
  }
}

// --- Smart Destination Suggester ---
export const getHealthyDestinations = async (
    currentCity: string, 
    currentAQI: number
): Promise<{ name: string; reason: string; type: 'Domestic' | 'International' }[]> => {
    try {
        const prompt = `
        The user is currently checking environment data for "${currentCity}". 
        The current AQI is ${currentAQI}.
        
        Task: Suggest 3 real "Eco-Havens".
        - If "${currentCity}" is a country name (e.g., India, USA), suggest 2 best cities within that country and 1 international benchmark.
        - If "${currentCity}" is a city, suggest 2 nearby healthy escapes and 1 international benchmark.
        
        Output JSON:
        [
            { "name": "Location, Country", "reason": "Reason...", "type": "Domestic" | "International" },
            ...
        ]
        `;

        const response = await retry<GenerateContentResponse>(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        }));

        const text = response.text;
        if (!text) return [];
        const cleaned = cleanJsonString(text);
        return JSON.parse(cleaned);

    } catch (e) {
        console.error("Failed to suggest destinations", e);
        return [];
    }
}