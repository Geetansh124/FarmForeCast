

export type Language = 'English' | 'Hindi' | 'Gujarati' | 'Russian' | 'Punjabi' | 'Bengali';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
  apparentTemperature: number;
  windDirection: number;
}

export interface AQIData {
  aqi: number;
  category: string; // Good, Moderate, Unhealthy...
  healthImpact: string;
  recommendation: string;
  pm25?: number;
  pm10?: number;
  source?: string;
  city?: string;
}

export interface Solution {
  watering: string;
  soil: string;
  pestControl: string;
  weatherPrediction: string;
}

export interface ProductRecommendation {
  name: string;
  type: string;
  reason: string;
  usageInstructions: string; // How to use
  timing: string; // When to use
}

export interface VisualizerDetail {
  part: 'Canopy' | 'Trunk' | 'Roots' | 'Soil';
  issue: string; // e.g. "Low Chlorophyll", "Fungal Spots", "Dry/Cracked Soil"
  severity: 'Low' | 'Medium' | 'High';
}

export interface TreeAge {
  estimatedAge: string; // e.g. "15-20 years"
  growthStage: string; // Sapling, Mature, Ancient
  lifespan: string; // "Expected 40 more years"
}

export interface OxygenScore {
  dailyProduction: string; // "120 liters"
  score: number; // 0-100 (Gamified)
  airQualityImpact: string; // "Offsets 1 car for 20 miles"
}

export interface TreePersonality {
  archetype: string; // "The Wise Sage", "The Green Warrior"
  quote: string; // "I am Peepal, the thinker..."
  mood: string;
}

export interface TreeHoroscope {
  sign: string; // Eco-sign e.g. "Sun Chaser"
  prediction: string;
  luckyElement: string;
}

export interface WaterBudget {
  perDay: string;
  perWeek: string;
  perMonth: string;
  adjustments: string; // "Reduce by 10% due to humidity"
}

export interface FuturePrediction {
  day: string; // "Day 1-3", "Day 4-7"
  leafStatus: string;
  pestRisk: string;
  sunIntensity: string;
  summary: string;
}

export interface DiseaseMap {
  upperCanopy: string; // Description of spread
  middleCanopy: string;
  lowerCanopy: string;
  roots: string;
  overallSeverity: number; // 0-100
}

export interface SoilAnalysis {
  texture: string; // e.g. "Sandy Loam", "Clay"
  composition: {
    sand: string; // e.g. "40%"
    silt: string; // e.g. "40%"
    clay: string; // e.g. "20%"
  };
  pH: string; // e.g. "6.5 (Slightly Acidic)"
  organicMatter: string; // e.g. "Rich in humus"
  microbialActivity: string; // e.g. "High", "Low"
  health: 'Poor' | 'Moderate' | 'Good' | 'Excellent';
}

export interface SOSAlert {
  isActive: boolean;
  type: 'Drought' | 'Pest' | 'Disease' | 'Nutrient' | 'General';
  title: string;
  severity: 'Moderate' | 'Critical';
  steps: string[];
}

export interface AnalysisResult {
  // Original fields
  emotion: 'Happy' | 'Stressed' | 'Suffocating' | 'Recovering' | 'Dormant';
  healthScore: number; 
  localAreaHealthScore: number; 
  stressFactors: string[];
  visualizerDetails: VisualizerDetail[];
  climateTrends: string;
  story: string; 
  solutions: Solution;
  products: ProductRecommendation[];
  tips: string[];
  plantName: string; // Species identification
  
  // New Advanced Fields
  treeAge: TreeAge;
  oxygenScore: OxygenScore;
  personality: TreePersonality;
  horoscope: TreeHoroscope;
  waterBudget: WaterBudget;
  predictions: FuturePrediction[];
  diseaseMap: DiseaseMap;
  soilAnalysis?: SoilAnalysis;
  comparisonScore: number; // Today vs Healthy Specimen (0-100)
  namingSuggestions: string[]; // List of 10-20 names
  careSchedule: { day: string; task: string; icon: 'water' | 'sun' | 'fertilizer' | 'check' | 'shield' | 'cloud' | 'home' }[];
  sosAlert?: SOSAlert;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}