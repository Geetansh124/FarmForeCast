
import React, { useState, useEffect } from 'react';
import { Sun, Wind, Droplets, MapPin, Heart, Activity, Sprout, ArrowRight, CloudRain, Zap, Thermometer, Cpu, Scan, Globe, Leaf } from 'lucide-react';
import { fetchWeather, fetchAQI, fetchLocationName } from '../services/weatherService';
import { WeatherData, AQIData } from '../types';
import GlobalStats from './GlobalStats';

const LandingContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const [localAQI, setLocalAQI] = useState<AQIData | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sound Effect Helper
  const playSound = (type: 'hover' | 'appear' | 'click') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'hover') {
        // High-tech blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'appear') {
        // Subtle whoosh
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'click') {
        // Confirm beep
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // Ignore audio errors (e.g. user hasn't interacted yet)
    }
  };

  useEffect(() => {
    // Play sound on mount
    const timer = setTimeout(() => {
        playSound('appear');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchLocalData = () => {
    playSound('click');
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const [weather, aqi, name] = await Promise.all([
            fetchWeather(lat, lon),
            fetchAQI(lat, lon),
            fetchLocationName(lat, lon)
          ]);
          
          setLocalWeather(weather);
          setLocalAQI(aqi);
          setLocationName(name || aqi?.city || "Your Location");
          playSound('appear');
        } catch (err) {
          console.error(err);
          setError("Couldn't fetch local data.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn(err);
        setError("Location access needed for live updates.");
        setLoading(false);
      }
    );
  };

  const AnimatedText = ({ text }: { text: string }) => {
    return (
      <span className="inline-block">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block animate-slide-in-left"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-16 space-y-16 animate-fade-in px-4 relative z-10">
      
      {/* 1. Hero Section with 3D Effect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center perspective-1000">
        
        {/* Left: Text Content */}
        <div className="space-y-8 animate-slide-in-left text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-nature-700 dark:text-nature-300 shadow-sm animate-pulse-slow">
            <Cpu size={14} className="text-nature-500 dark:text-nature-400" /> V3.0 Neural Engine Active
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[0.9] transition-colors">
            <AnimatedText text="Decode The " /> <br/>
            <span className="block text-4xl md:text-5xl font-bold bg-clip-text  bg-gradient-to-r from-emerald-400 to-teal-300 leading-tight">
              <AnimatedText text="Language of Nature" />
</span>


          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-nature-200 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-90 animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
            ArborZen AI merges biological science with generative intelligence. 
            Upload a photo to unlock a tree's hidden health metrics, personality, and survival needs in real-time.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {/* Feature Tags with Struggle Animation on Hover */}
              <div 
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-nature-800/50 rounded-xl border border-white/60 dark:border-nature-700 shadow-sm transition-colors cursor-default hover:animate-struggle"
                onMouseEnter={() => playSound('hover')}
              >
                  <Scan className="text-nature-600 dark:text-nature-400" /> <span className="text-sm font-bold text-gray-800 dark:text-nature-100">Visual Diagnosis</span>
              </div>
              <div 
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-nature-800/50 rounded-xl border border-white/60 dark:border-nature-700 shadow-sm transition-colors cursor-default hover:animate-struggle"
                onMouseEnter={() => playSound('hover')}
              >
                  <Wind className="text-teal-600 dark:text-teal-400" /> <span className="text-sm font-bold text-gray-800 dark:text-nature-100">Air Analysis</span>
              </div>
              <div 
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-nature-800/50 rounded-xl border border-white/60 dark:border-nature-700 shadow-sm transition-colors cursor-default hover:animate-struggle"
                onMouseEnter={() => playSound('hover')}
              >
                  <Activity className="text-red-500 dark:text-red-400" /> <span className="text-sm font-bold text-gray-800 dark:text-nature-100">Vital Tracking</span>
              </div>
          </div>
        </div>

        {/* Right: 3D Floating Widget */}
        <div className="relative animate-slide-in-left group perspective-1000" style={{ animationDelay: '0.3s' }}>
          {/* Glowing Blobs Behind */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          
          {/* Main Card */}
          <div className="relative glass dark:glass-dark p-8 rounded-[2rem] shadow-2xl border border-white/50 dark:border-white/10 transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12 preserve-3d">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-white/10 pb-4">
              <h3 className="text-2xl font-bold text-nature-900 dark:text-white flex items-center gap-3">
                <Globe className="text-nature-500 dark:text-nature-400 animate-spin-slow" /> Global Sensor Net
              </h3>
              {localWeather ? (
                 <div className="text-[10px] font-black text-white bg-gradient-to-r from-nature-500 to-emerald-500 px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div> LIVE
                 </div>
              ) : (
                <button 
                  onClick={fetchLocalData}
                  disabled={loading}
                  className="text-xs bg-nature-800 dark:bg-nature-700 text-white px-4 py-2 rounded-full hover:bg-nature-900 dark:hover:bg-nature-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                >
                  {loading ? "Syncing..." : "Connect GPS"}
                </button>
              )}
            </div>

            {localWeather ? (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="col-span-2 flex items-center gap-2 text-nature-800 dark:text-nature-100 text-sm mb-2 font-bold bg-nature-50/50 dark:bg-nature-900/50 p-2 rounded-lg">
                   <MapPin size={16} className="text-nature-600 dark:text-nature-400" /> {locationName}
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-white dark:from-nature-800 dark:to-nature-900 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-orange-100 dark:border-white/10 shadow-sm hover:scale-105 transition-transform hover:animate-struggle">
                   <Thermometer className="text-orange-500 mb-2" size={28} />
                   <div className="text-3xl font-black text-nature-900 dark:text-white">{localWeather.temperature}°</div>
                   <div className="text-[10px] font-bold text-nature-400 uppercase tracking-wider">Thermal</div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-white dark:from-nature-800 dark:to-nature-900 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-teal-100 dark:border-white/10 shadow-sm hover:scale-105 transition-transform hover:animate-struggle">
                   <Wind className="text-teal-500 mb-2" size={28} />
                   <div className="text-3xl font-black text-nature-900 dark:text-white">{localAQI?.aqi ?? '--'}</div>
                   <div className="text-[10px] font-bold text-nature-400 uppercase tracking-wider">AQI Score</div>
                </div>

                <div className="col-span-2 bg-nature-900 dark:bg-nature-950 text-white p-4 rounded-2xl text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full animate-shimmer"></div>
                   <p className="text-sm font-medium relative z-10">
                     {localAQI?.category ? `Atmospheric Condition: ${localAQI.category}` : "Analysis Complete"}
                   </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                 <div className="p-4 bg-nature-50 dark:bg-nature-800 rounded-full animate-bounce">
                    <MapPin className="text-nature-400" size={32} />
                 </div>
                 <p className="text-nature-600 dark:text-nature-300 font-medium max-w-[200px] leading-relaxed">
                   {error ? error : "Initiate downlink to fetch hyper-local ecological data."}
                 </p>
              </div>
            )}
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-6 -left-6 bg-white dark:bg-nature-800 p-3 rounded-2xl shadow-xl animate-float-delayed hidden md:block border border-nature-100 dark:border-nature-700">
              <Leaf className="text-nature-500 dark:text-nature-400" />
          </div>
           <div className="absolute -bottom-6 -right-6 bg-white dark:bg-nature-800 p-3 rounded-2xl shadow-xl animate-float hidden md:block border border-nature-100 dark:border-nature-700">
              <Droplets className="text-blue-500 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* 2. Global Statistics Dashboard (Staggered Slide Up) */}
      <div className="animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
          <GlobalStats />
      </div>

      {/* 3. Feature Cards with Hover 3D */}
      <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: '0.8s' }}>
        <h3 className="text-center text-3xl font-black text-nature-900 dark:text-white tracking-tight">System Capabilities</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Card 1 */}
           <div 
             className="bg-white dark:bg-nature-900 p-8 rounded-[2rem] shadow-sm border border-nature-100 dark:border-nature-800 hover:shadow-2xl transition-all duration-300 hover:animate-struggle group overflow-hidden relative cursor-default"
             onMouseEnter={() => playSound('hover')}
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-red-50 dark:bg-red-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                 <Activity className="text-red-500 dark:text-red-400" size={28} />
              </div>
              <h4 className="font-bold text-xl text-nature-900 dark:text-white mb-3">Invisible Stressors</h4>
              <p className="text-nature-600 dark:text-nature-300 text-sm leading-relaxed">
                Pollution hurts plants in ways we can't see. We visualize these invisible threats using real-time sensor data overlay.
              </p>
           </div>

           {/* Card 2 */}
           <div 
             className="bg-white dark:bg-nature-900 p-8 rounded-[2rem] shadow-sm border border-nature-100 dark:border-nature-800 hover:shadow-2xl transition-all duration-300 hover:animate-struggle group overflow-hidden relative cursor-default"
             onMouseEnter={() => playSound('hover')}
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nature-100 dark:bg-nature-800 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-nature-50 dark:bg-nature-800 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                 <Heart className="text-nature-600 dark:text-nature-400" size={28} />
              </div>
              <h4 className="font-bold text-xl text-nature-900 dark:text-white mb-3">Biometric Translation</h4>
              <p className="text-nature-600 dark:text-nature-300 text-sm leading-relaxed">
                Using advanced computer vision, we translate visual cues (leaf droop, discoloration) into emotional narratives.
              </p>
           </div>

           {/* Card 3 */}
           <div 
             className="bg-white dark:bg-nature-900 p-8 rounded-[2rem] shadow-sm border border-nature-100 dark:border-nature-800 hover:shadow-2xl transition-all duration-300 hover:animate-struggle group overflow-hidden relative cursor-default"
             onMouseEnter={() => playSound('hover')}
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                 <Sprout className="text-blue-500 dark:text-blue-400" size={28} />
              </div>
              <h4 className="font-bold text-xl text-nature-900 dark:text-white mb-3">Predictive Care</h4>
              <p className="text-nature-600 dark:text-nature-300 text-sm leading-relaxed">
                Don't just watch nature fade. Get AI-generated forecasts, watering schedules, and precise recovery protocols.
              </p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default LandingContent;
