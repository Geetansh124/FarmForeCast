import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingState from './components/LoadingState';
import LandingContent from './components/LandingContent';
import Chatbot from './components/Chatbot';
import EcoHavenFinder from './components/EcoHavenFinder';
import { fetchWeather, fetchAQI, fetchLocationName, getCoordinatesForCity } from './services/weatherService';
import { analyzeEnvironment } from './services/geminiService';
import { AnalysisResult, WeatherData, AQIData, Language, GeoLocation } from './types';
import { RotateCcw, X, Camera, Globe, Leaf, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleAnalyze = async (inputs: {
    images: string[];
    audio: string | null;
    audioMimeType: string | null;
    useLocation: boolean;
    manualLocation: string;
    language: Language;
  }) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setLocationName(null);
    setCoordinates(null);
    setUploadedImages(inputs.images);

    try {
      let resolvedLocationName = null;
      let weather: WeatherData | null = null;
      let aqi: AQIData | null = null;
      let lat = 0; 
      let lon = 0;
      let locationSuccess = false;

      // 1. GPS Location Strategy
      if (inputs.useLocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            });
          });
          
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          locationSuccess = true;

        } catch (locErr: any) {
          console.warn("Location denied or failed", locErr);
          let msg = "Could not access location.";
          if (locErr.code === 1) msg = "Location permission denied. Please enable in settings.";
          else if (locErr.code === 2) msg = "Location unavailable. Check GPS.";
          else if (locErr.code === 3) msg = "Location request timed out.";
          setError(msg);
          setIsAnalyzing(false);
          return;
        }
      } 
      // 2. Manual Location
      else if (inputs.manualLocation && inputs.manualLocation.trim().length > 0) {
        const coords = await getCoordinatesForCity(inputs.manualLocation);
        if (coords) {
          lat = coords.lat;
          lon = coords.lon;
          resolvedLocationName = coords.name;
          locationSuccess = true;
        } else {
          setError(`Could not find location "${inputs.manualLocation}".`);
          setIsAnalyzing(false);
          return;
        }
      }

      // 3. Fetch Sensors
      if (locationSuccess) {
          setCoordinates({ lat, lon });
          const [wData, aData, locName] = await Promise.all([
            fetchWeather(lat, lon),
            fetchAQI(lat, lon),
            !resolvedLocationName ? fetchLocationName(lat, lon) : Promise.resolve(null)
          ]);
          weather = wData;
          aqi = aData;
          if (!resolvedLocationName) resolvedLocationName = locName || aqi?.city || "Unknown Location";
      }

      // 4. Call Gemini
      const analysis = await analyzeEnvironment(
        inputs.images,
        inputs.audio,
        inputs.audioMimeType,
        weather,
        aqi,
        resolvedLocationName,
        inputs.language
      );

      setWeatherData(weather);
      setAqiData(aqi);
      setLocationName(resolvedLocationName);
      setResult(analysis);

    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-gray-900 dark:text-gray-100 pb-20 font-sans selection:bg-emerald-200 dark:selection:bg-emerald-800 transition-colors duration-300">
      
      {/* Optimized Background Layer - Replaced laggy blobs with bg-mesh */}
      <div className="fixed inset-0 z-[-1] bg-mesh transition-colors duration-500"></div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-nature-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-nature-800 relative">
            <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-nature-800 rounded-full transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Leaf size={24} />
              </div>
              <h2 className="text-2xl font-bold">About ArborZen AI</h2>
            </div>

            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p>
                ArborZen AI merges biological science with advanced generative intelligence to give nature a voice. 
                Using the latest <strong>Gemini 3 Pro Neural Engine</strong>, we decode visual and environmental data into actionable insights.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-nature-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Camera size={16} className="text-emerald-500"/> Visual Diagnosis
                  </h3>
                  <p className="text-sm">Upload photos of leaves, roots, or soil. Our AI detects diseases, pests, and nutrient deficiencies instantly.</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-nature-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Globe size={16} className="text-blue-500"/> Global Sensors
                  </h3>
                  <p className="text-sm">Connect your GPS to fetch real-time AQI, weather, and pollen data to understand environmental stress.</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-2">
                  <Cpu size={16}/> Thinking Mode Active
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  We use an extended thinking budget to generate highly personalized care plans, horoscopes, and personality profiles for your plants.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        <Header darkMode={darkMode} toggleTheme={toggleTheme} onAboutClick={() => setShowAbout(true)} />
        
        <main className="container mx-auto px-4 mt-8 flex flex-col gap-12">
          {!result && !isAnalyzing && (
            <>
              <LandingContent />
              
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <EcoHavenFinder />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                 <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
              </div>
            </>
          )}

          {isAnalyzing && <LoadingState />}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-2xl text-center max-w-lg mx-auto shadow-lg animate-fade-in">
              <p className="font-bold text-lg mb-2">Connection Issue</p>
              <p className="text-sm opacity-90">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="block mx-auto mt-4 text-sm bg-white dark:bg-transparent border border-red-300 dark:border-red-700 px-6 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-12 animate-fade-in">
              <ResultsDashboard 
                result={result} 
                weather={weatherData} 
                aqi={aqiData} 
                locationName={locationName}
                coordinates={coordinates}
                uploadedImages={uploadedImages}
              />
              <div className="text-center pb-8">
                <button 
                  onClick={() => setResult(null)}
                  className="py-4 px-10 rounded-full bg-gray-900 dark:bg-emerald-600 text-white font-bold hover:scale-105 transition-all shadow-xl flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={18} /> Start New Analysis
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Chatbot />
    </div>
  );
};

export default App;
