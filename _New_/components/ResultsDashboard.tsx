import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, WeatherData, AQIData, VisualizerDetail } from '../types';
import { Heart, Thermometer, Wind, AlertTriangle, Droplets, Leaf, Volume2, Loader, Compass, Sun, MapPin, Activity, Sprout, ShoppingBag, ExternalLink, ShieldCheck, X, Camera, MessageCircle, Clock, Star, Calendar, Music, Play, Pause, BarChart3, CloudRain, Cloud, Home, Shield, CheckCircle, RotateCcw, Sparkles, Layers, Radar } from 'lucide-react';
import { generateTreeVoice } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  weather: WeatherData | null;
  aqi: AQIData | null;
  locationName: string | null;
  coordinates: { lat: number; lon: number } | null;
  uploadedImages: string[];
}

const decodeAudioData = (base64: string, ctx: AudioContext): AudioBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const dataInt16 = new Int16Array(bytes.buffer);
  const sampleRate = 24000;
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};

const EcoMusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<AudioBufferSourceNode | null>(null);

    const toggleMusic = () => {
        if (isPlaying) {
            oscillatorRef.current?.stop();
            audioCtxRef.current?.suspend();
            setIsPlaying(false);
        } else {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            const ctx = audioCtxRef.current;
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5; 
            }

            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = buffer;
            noiseSource.loop = true;
            const gain = ctx.createGain();
            gain.gain.value = 0.05;
            noiseSource.connect(gain);
            gain.connect(ctx.destination);
            noiseSource.start();
            oscillatorRef.current = noiseSource;
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        return () => {
            oscillatorRef.current?.stop();
            audioCtxRef.current?.close();
        }
    }, []);

    return (
        <div className="bg-nature-900/50 backdrop-blur-md text-white p-3 rounded-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                    <Music size={16} className={isPlaying ? "animate-pulse" : ""} />
                </div>
                <div>
                    <h4 className="font-bold text-xs">Forest Ambience</h4>
                    <p className="text-[10px] opacity-70">Heals stress</p>
                </div>
            </div>
            <button onClick={toggleMusic} className="w-8 h-8 bg-white text-nature-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
            </button>
        </div>
    );
};

const TreeHealthVisualizer: React.FC<{ details: VisualizerDetail[], emotion: string, tips: string[], personality: any }> = ({ details, emotion, tips, personality }) => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  const getIssuesForRegion = (part: string) => details?.filter(d => d.part === part) || [];
  const hasIssue = (part: string) => details?.some(d => d.part === part);
  const healthyColor = "#4ade80"; 
  const stressedColor = "#ef4444"; 
  const trunkHealthy = "#8B4513";
  const soilHealthy = "#8d6e63"; 
  const soilStressed = "#e0e0e0"; 

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-nature-900 p-6 rounded-3xl shadow-lg border border-nature-100 dark:border-nature-800 h-full relative overflow-hidden group hover:shadow-xl transition-shadow">
      <h3 className="text-nature-900 dark:text-white font-bold mb-4 flex items-center gap-2 relative z-10 text-sm uppercase tracking-wider">
        <Activity className="w-4 h-4 text-nature-500" /> Interactive Health Map
      </h3>
      
      <div className="relative w-48 h-64">
        <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-xl filter">
          <g onMouseEnter={() => setActiveRegion('Soil')} onMouseLeave={() => setActiveRegion(null)} className="transition-all duration-300 hover:opacity-80 cursor-pointer">
              <path d="M-20 230 Q100 215 220 230 V270 H-20 Z" fill={hasIssue('Soil') ? soilStressed : soilHealthy} opacity="0.2" />
          </g>
          <g onMouseEnter={() => setActiveRegion('Roots')} onMouseLeave={() => setActiveRegion(null)} className="transition-all duration-300 hover:opacity-80 cursor-pointer">
             <path d="M100 200 C80 220, 60 220, 40 240 M100 200 C100 230, 100 240, 100 260 M100 200 C120 220, 140 220, 160 240" stroke={hasIssue('Roots') ? stressedColor : "#8d6e63"} strokeWidth="8" fill="none" strokeLinecap="round" />
          </g>
          <g className={(!details || details.length === 0) ? "animate-sway" : ""} style={{ transformOrigin: '100px 200px' }}>
            <g onMouseEnter={() => setActiveRegion('Trunk')} onMouseLeave={() => setActiveRegion(null)} className="transition-all duration-300 hover:opacity-80 cursor-pointer">
              <path d="M85 200 L85 140 C85 120, 115 120, 115 140 L115 200 Z" fill={hasIssue('Trunk') ? stressedColor : trunkHealthy} />
            </g>
            <g onMouseEnter={() => setActiveRegion('Canopy')} onMouseLeave={() => setActiveRegion(null)} className="transition-all duration-300 hover:opacity-80 cursor-pointer">
              <path d="M100 150 C40 150, 20 100, 50 60 C40 30, 80 0, 100 20 C120 0, 160 30, 150 60 C180 100, 160 150, 100 150 Z" fill={hasIssue('Canopy') ? stressedColor : healthyColor} />
            </g>
          </g>
        </svg>
        {activeRegion && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-nature-200 dark:border-nature-700 text-xs w-56 text-center animate-fade-in z-30">
                <div className="font-bold text-nature-800 dark:text-nature-200 mb-1 border-b border-gray-100 dark:border-white/10 pb-1">{activeRegion} Analysis</div>
                {getIssuesForRegion(activeRegion).length > 0 ? (
                    <ul className="text-left space-y-1">
                        {getIssuesForRegion(activeRegion).map((iss, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <AlertTriangle size={10} className="text-red-500 mt-0.5 shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300 leading-tight">{iss.issue} <span className="text-[10px] font-bold text-red-400">({iss.severity})</span></span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span className="text-green-600 font-bold flex items-center justify-center gap-1"><CheckCircle size={12}/> Condition Optimal</span>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

const HistoricalTrendsChart: React.FC<{ currentTemp?: number, currentAQI?: number }> = ({ currentTemp, currentAQI }) => {
    const data = React.useMemo(() => {
        const baseTemp = currentTemp || 20;
        const baseAQI = currentAQI || 50;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return days.map((day, i) => ({
            name: day,
            temp: Math.round(baseTemp + (Math.random() * 6 - 3)),
            aqi: Math.max(10, Math.round(baseAQI + (Math.random() * 40 - 20)))
        }));
    }, [currentTemp, currentAQI]);

    return (
        <div className="bg-gray-900 dark:bg-black p-6 rounded-3xl shadow-lg border border-white/10 h-full flex flex-col">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Compass className="w-4 h-4 text-emerald-400" /> 7-Day Trend Analysis
            </h3>
            <div className="flex-1 w-full min-h-0" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={200}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" stroke="#ef4444" fontSize={10} axisLine={false} tickLine={false} width={20} />
                        <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} axisLine={false} tickLine={false} width={20} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                            cursor={{stroke: 'rgba(255,255,255,0.2)'}}
                        />
                        <Legend wrapperStyle={{fontSize: '10px'}} />
                        <Area yAxisId="left" type="monotone" dataKey="aqi" name="Pollution (AQI)" stroke="#ef4444" fillOpacity={1} fill="url(#colorAqi)" strokeWidth={2} />
                        <Area yAxisId="right" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const BiometricRadarChart: React.FC<{ result: AnalysisResult; weather: WeatherData | null }> = ({ result, weather }) => {
    // Generate data for radar chart based on analysis
    const data = [
        { subject: 'Canopy', A: result.healthScore, fullMark: 100 },
        { subject: 'Roots', A: Math.max(20, result.healthScore - (result.visualizerDetails.filter(d => d.part === 'Roots').length * 20)), fullMark: 100 },
        { subject: 'Soil', A: result.soilAnalysis?.health === 'Good' ? 90 : 60, fullMark: 100 },
        { subject: 'Air', A: 100 - (result.localAreaHealthScore < 50 ? 50 : 0), fullMark: 100 }, // Inverse of pollution roughly
        { subject: 'Water', A: weather ? (weather.humidity > 40 ? 90 : 50) : 70, fullMark: 100 },
    ];

    return (
        <div className="bg-gray-900 dark:bg-black p-6 rounded-3xl shadow-lg border border-white/10 h-full flex flex-col">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Radar className="w-4 h-4 text-purple-400" /> Biometric Radar
            </h3>
            <div className="flex-1 w-full min-h-0" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" debounce={200}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <RechartsRadar name="Health" dataKey="A" stroke="#8884d8" strokeWidth={2} fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const DiseaseEvolutionMap: React.FC<{ map: any }> = ({ map }) => {
    if (!map) return <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500">Map data unavailable</div>;
    return (
        <div className="bg-white dark:bg-nature-900 p-5 rounded-3xl border border-nature-100 dark:border-nature-800 h-full shadow-lg">
            <h3 className="font-bold text-nature-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldCheck className="text-nature-500" size={16} /> Disease Spread</h3>
            <div className="flex items-center gap-6">
                <div className="relative w-20 h-32 opacity-90">
                    <div className={`absolute top-0 w-full h-1/3 rounded-t-full border-b border-white ${map.upperCanopy?.toLowerCase().includes('healthy') ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></div>
                    <div className={`absolute top-1/3 w-full h-1/3 border-b border-white ${map.middleCanopy?.toLowerCase().includes('healthy') ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                    <div className={`absolute top-2/3 w-full h-1/3 rounded-b-lg ${map.lowerCanopy?.toLowerCase().includes('healthy') ? 'bg-green-600' : 'bg-yellow-400'}`}></div>
                </div>
                <div className="flex-1 space-y-3 text-xs">
                    <div className="flex justify-between items-center"><span className="font-bold text-gray-400">Upper</span> <span className="font-medium text-gray-700 dark:text-gray-300">{map.upperCanopy || 'Healthy'}</span></div>
                    <div className="flex justify-between items-center"><span className="font-bold text-gray-400">Middle</span> <span className="font-medium text-gray-700 dark:text-gray-300">{map.middleCanopy || 'Healthy'}</span></div>
                    <div className="flex justify-between items-center"><span className="font-bold text-gray-400">Lower</span> <span className="font-medium text-gray-700 dark:text-gray-300">{map.lowerCanopy || 'Healthy'}</span></div>
                    <div className="pt-2 border-t border-gray-100 dark:border-white/10">
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div className="bg-red-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${map.overallSeverity}%` }}></div>
                        </div>
                        <div className="text-right text-[10px] text-gray-400 mt-1">Severity: {map.overallSeverity}%</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SoilAnalysisCard: React.FC<{ soil: any }> = ({ soil }) => {
    if (!soil || soil.texture === 'Unknown') return null;
    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-nature-900 dark:to-nature-950 p-6 rounded-3xl shadow-lg border border-amber-100 dark:border-nature-800 h-full">
            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Layers className="text-amber-600 dark:text-amber-500" size={16} /> Subterranean Intelligence
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-amber-200/50 dark:border-white/5">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">Texture</span>
                    <div className="text-sm font-bold text-nature-900 dark:text-white">{soil.texture}</div>
                </div>
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-amber-200/50 dark:border-white/5">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">pH Level</span>
                    <div className="text-sm font-bold text-nature-900 dark:text-white">{soil.pH}</div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-amber-800 dark:text-amber-200">
                    <span>Sand / Silt / Clay</span>
                    <span className="font-bold">{soil.composition?.sand} / {soil.composition?.silt} / {soil.composition?.clay}</span>
                </div>
                <div className="w-full h-2 bg-amber-200 dark:bg-nature-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-yellow-400" style={{ width: parseFloat(soil.composition?.sand) + '%' }} title="Sand"></div>
                    <div className="h-full bg-orange-400" style={{ width: parseFloat(soil.composition?.silt) + '%' }} title="Silt"></div>
                    <div className="h-full bg-amber-600" style={{ width: parseFloat(soil.composition?.clay) + '%' }} title="Clay"></div>
                </div>
                
                <div className="pt-2 border-t border-amber-200/50 dark:border-white/10 text-xs">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Microbial Activity</span>
                        <span className="font-bold text-nature-700 dark:text-nature-300">{soil.microbialActivity}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Organic Matter</span>
                        <span className="font-bold text-nature-700 dark:text-nature-300">{soil.organicMatter}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, weather, aqi, locationName, coordinates, uploadedImages }) => {
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleSpeak = async () => {
    if (isSpeaking) {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        setIsSpeaking(false);
        return;
    }

    try {
        setIsLoadingVoice(true);
        let audioData = audioBase64;

        if (!audioData) {
            const textToSpeak = `Hello! I am ${result.personality?.archetype || "your plant"}. I am feeling ${result.emotion}. ${result.story?.substring(0, 150)}...`;
            audioData = await generateTreeVoice(textToSpeak);
            setAudioBase64(audioData);
        }

        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } else if (audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioCtxRef.current;
        const buffer = decodeAudioData(audioData, ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
        setIsSpeaking(true);

    } catch (e) {
        console.error("Speech failed", e);
        alert("Could not generate voice. Please try again.");
    } finally {
        setIsLoadingVoice(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-12 font-sans">
      
      {/* 1. SOS Banner */}
      {(result.sosAlert?.isActive || result.healthScore < 50) && (
          <div className={`p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start justify-between gap-6 animate-slide-up border-l-8 ${
             result.sosAlert?.type === 'Pest' ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-900 dark:text-red-200' : 
             result.sosAlert?.type === 'Drought' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-900 dark:text-orange-200' :
             'bg-red-50 dark:bg-red-900/30 border-red-600 text-red-900 dark:text-red-200'
          }`}>
              <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${result.sosAlert?.type === 'Drought' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                      <AlertTriangle size={32} className="animate-pulse" />
                  </div>
                  <div>
                      <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                          SOS: {result.sosAlert?.type || "Critical"} Alert
                          <span className="text-xs px-2 py-0.5 rounded bg-white/50 border border-current">{result.sosAlert?.severity || "High"}</span>
                      </h2>
                      <p className="font-medium opacity-90 mt-1">{result.sosAlert?.title || "Critical Plant Distress Detected"}</p>
                  </div>
              </div>
              <div className="bg-white/60 dark:bg-black/40 p-5 rounded-2xl w-full md:w-auto min-w-[300px] backdrop-blur-sm border border-white/20">
                  <h3 className="font-bold mb-2 text-xs uppercase opacity-70 flex items-center gap-1"><ShieldCheck size={12}/> Immediate Action Plan</h3>
                  <ul className="text-sm space-y-2">
                      {result.sosAlert?.steps?.map((step, i) => (
                          <li key={i} className="flex gap-2 items-start">
                              <span className="bg-current text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 mt-0.5">{i+1}</span> 
                              <span className="leading-tight">{step}</span>
                          </li>
                      )) || <li>Isolate plant immediately and check soil moisture.</li>}
                  </ul>
              </div>
          </div>
      )}

      {/* 2. Main Identity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Identity Card */}
          <div className="md:col-span-4 bg-white dark:bg-nature-900 p-6 rounded-3xl shadow-lg border border-nature-100 dark:border-nature-800 flex flex-col items-center text-center relative overflow-hidden transition-colors">
             {/* Background Decoration */}
             <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-nature-50 dark:from-nature-800 to-transparent z-0"></div>
             
             {/* Image & Avatar */}
             <div className="relative z-10 mb-4">
                 <div className="w-32 h-32 rounded-full border-4 border-white dark:border-nature-700 shadow-xl overflow-hidden mx-auto">
                     {uploadedImages && uploadedImages.length > 0 ? (
                        <img src={`data:image/jpeg;base64,${uploadedImages[0]}`} alt="Uploaded" className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full bg-nature-100 dark:bg-nature-800 flex items-center justify-center text-nature-300 dark:text-nature-500"><Leaf size={40}/></div>
                     )}
                 </div>
                 <div className="absolute bottom-0 right-0 bg-nature-600 text-white p-1.5 rounded-full border-2 border-white dark:border-nature-900 shadow-sm">
                     <Camera size={14} />
                 </div>
             </div>

             <h2 className="text-2xl font-black text-nature-900 dark:text-white leading-none mb-2 relative z-10">{result.plantName}</h2>
             <div className="inline-flex items-center gap-1 px-3 py-1 bg-nature-100 dark:bg-nature-800 text-nature-700 dark:text-nature-200 rounded-full text-xs font-bold mb-6">
                <Star size={10} className="fill-current"/> {result.personality?.archetype || "Nature Spirit"}
             </div>

             {/* Stats Row */}
             <div className="w-full grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-white/10 pt-4">
                 <div className="text-center">
                     <div className="text-[10px] uppercase font-bold text-gray-400">Age</div>
                     <div className="font-bold text-nature-800 dark:text-nature-100 text-sm">{result.treeAge?.estimatedAge || "?"}</div>
                 </div>
                 <div className="text-center border-l border-r border-gray-100 dark:border-white/10">
                     <div className="text-[10px] uppercase font-bold text-gray-400">Score</div>
                     <div className={`font-black text-lg ${result.healthScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{result.healthScore}</div>
                 </div>
                 <div className="text-center">
                     <div className="text-[10px] uppercase font-bold text-gray-400">Stage</div>
                     <div className="font-bold text-nature-800 dark:text-nature-100 text-sm">{result.treeAge?.growthStage || "?"}</div>
                 </div>
             </div>
          </div>

          {/* Voice & Story Card */}
          <div className="md:col-span-8 bg-gradient-to-br from-nature-800 to-nature-900 dark:from-black dark:to-nature-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-transparent dark:border-white/10">
              {/* Decorative */}
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10"><Leaf size={200} /></div>
              
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-nature-300 font-bold uppercase text-xs tracking-widest">
                          <Volume2 size={14} /> Nature's Voice
                      </div>
                      <EcoMusicPlayer />
                  </div>
                  
                  <blockquote className="text-lg md:text-xl font-medium leading-relaxed italic opacity-90 mb-6 border-l-4 border-nature-500 pl-4">
                      "{result.story}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={handleSpeak}
                        disabled={isLoadingVoice}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 ${
                            isSpeaking 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-white text-nature-900 hover:bg-nature-50'
                        }`}
                      >
                          {isLoadingVoice ? <Loader className="animate-spin" size={18}/> : isSpeaking ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
                          {isLoadingVoice ? "Generating..." : isSpeaking ? "Stop Voice" : audioBase64 ? "Listen Again" : "Start Speaking"}
                      </button>
                      
                      {audioBase64 && !isSpeaking && !isLoadingVoice && (
                          <div className="text-xs text-nature-300 animate-fade-in flex items-center gap-1">
                              <CheckCircle size={12}/> Voice ready
                          </div>
                      )}
                  </div>
              </div>

              {/* Suggestions */}
              <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-2">
                  <span className="text-xs text-nature-400 self-center mr-2">Try calling me:</span>
                  {result.namingSuggestions?.slice(0, 4).map((name, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 cursor-default transition-colors">{name}</span>
                  ))}
              </div>
          </div>
      </div>

      {/* 3. Vitals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Visualizer */}
           <div className="lg:col-span-1 h-[400px]">
               <TreeHealthVisualizer details={result.visualizerDetails} emotion={result.emotion} tips={result.tips} personality={result.personality} />
           </div>

           {/* Environment & Map */}
           <div className="lg:col-span-1 flex flex-col gap-6">
               {/* Map Card */}
               <div className="bg-white dark:bg-nature-900 p-1 rounded-3xl shadow-lg border border-nature-100 dark:border-nature-800 overflow-hidden relative group h-48">
                    {coordinates ? (
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            style={{ border: 0, borderRadius: '20px' }}
                            src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lon}&z=13&output=embed`}
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-[20px] flex items-center justify-center text-gray-400 text-xs">Map Unavailable</div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-bold text-nature-900 dark:text-white shadow-md flex items-center gap-2">
                        <MapPin size={14} className="text-nature-600 dark:text-nature-400"/>
                        {locationName || "Detected Location"}
                    </div>
               </div>

               {/* Metrics */}
               <div className="bg-white dark:bg-nature-900 p-6 rounded-3xl shadow-lg border border-nature-100 dark:border-nature-800 flex-1 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Sun size={14}/> Live Vitals</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-center">
                            <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-1"/>
                            <div className="text-2xl font-black text-nature-900 dark:text-white">{weather?.temperature ?? '--'}°</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Temperature</div>
                        </div>
                        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl text-center">
                            <Wind className="w-6 h-6 text-teal-400 mx-auto mb-1"/>
                            <div className="text-2xl font-black text-nature-900 dark:text-white">{aqi?.aqi ?? '--'}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Air Quality</div>
                        </div>
                    </div>
               </div>
           </div>

           {/* Historical Chart */}
           <div className="lg:col-span-1 h-[400px]">
                <HistoricalTrendsChart currentTemp={weather?.temperature} currentAQI={aqi?.aqi} />
           </div>
      </div>

      {/* 3.5 Soil Analysis (New Section) */}
      {(result.soilAnalysis?.texture !== "Unknown" || result.healthScore !== undefined) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
              {result.soilAnalysis?.texture !== "Unknown" && (
                  <div className="h-[300px]">
                      <SoilAnalysisCard soil={result.soilAnalysis} />
                  </div>
              )}
              
              {/* Radar Chart */}
              <div className="h-[300px]">
                  <BiometricRadarChart result={result} weather={weather} />
              </div>

              <div className="h-[300px]">
                  <DiseaseEvolutionMap map={result.diseaseMap} />
              </div>
          </div>
      )}
      
      {/* 3.6 Eco-Cosmic Horoscope */}
      {result.horoscope && (
          <div className="bg-indigo-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl animate-fade-in group hover:shadow-2xl transition-all">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900"></div>
             
             {/* Dynamic Stars */}
             <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
             <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse delay-700"></div>
             <div className="absolute bottom-1/4 left-10 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
             <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-100 rounded-full blur-[2px] animate-pulse-slow"></div>

             {/* Animated Nebula Effect */}
             <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-spin-slow"></div>
             <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-float-slow"></div>
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left relative">
                    <div className="absolute -left-4 -top-4 w-12 h-12 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-400/30 transition-colors"></div>
                    <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2 justify-center md:justify-start">
                        <Sparkles size={12} className="text-yellow-200" /> Eco-Cosmic Horoscope
                    </h3>
                    <div className="text-4xl font-black mb-1 text-white tracking-tight drop-shadow-md">{result.horoscope.sign}</div>
                    <div className="text-sm text-indigo-300 font-medium">Today's Eco-Sign</div>
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
                    <p className="text-lg italic font-medium leading-relaxed text-indigo-50 mb-4 drop-shadow-sm">
                        "{result.horoscope.prediction}"
                    </p>
                    <div className="flex items-center gap-3 text-xs font-bold text-indigo-200 uppercase tracking-wider">
                        <span>Lucky Element:</span>
                        <span className="text-white bg-indigo-600/80 px-3 py-1 rounded-full shadow-lg border border-indigo-400/30">{result.horoscope.luckyElement}</span>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* 4. Care Routine */}
      {result.careSchedule && result.careSchedule.length > 0 && (
        <div className="bg-white dark:bg-nature-900 p-8 rounded-3xl shadow-xl border border-nature-100 dark:border-nature-800">
           <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-nature-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-nature-600 dark:text-nature-400" /> 7-Day Smart Care Plan
               </h3>
               <span className="text-xs bg-nature-100 dark:bg-nature-800 text-nature-700 dark:text-nature-200 px-3 py-1 rounded-full font-bold">Auto-Generated</span>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {result.careSchedule.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-nature-800 border border-gray-100 dark:border-nature-700 hover:bg-white dark:hover:bg-nature-700 hover:shadow-lg hover:scale-105 transition-all cursor-default group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">{item.day}</span>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                       item.icon === 'water' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400' :
                       item.icon === 'sun' ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-900/30 dark:text-orange-400' :
                       item.icon === 'shield' ? 'bg-red-100 text-red-600 group-hover:bg-red-500 group-hover:text-white dark:bg-red-900/30 dark:text-red-400' :
                       'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                        {item.icon === 'water' && <Droplets size={20} className="fill-current" />}
                        {item.icon === 'sun' && <Sun size={20} className="fill-current" />}
                        {item.icon === 'shield' && <Shield size={20} className="fill-current" />}
                        {item.icon === 'fertilizer' && <Sprout size={20} />}
                        {item.icon === 'home' && <Home size={20} />}
                        {(item.icon === 'check' || !item.icon) && <CheckCircle size={20} />}
                    </div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight group-hover:text-nature-900 dark:group-hover:text-white">{item.task}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* 5. Shopping */}
      {result.products && result.products.length > 0 && (
          <div className="bg-nature-50 dark:bg-nature-800/50 p-8 rounded-3xl shadow-inner border border-nature-100 dark:border-nature-800">
               <h3 className="text-nature-900 dark:text-white font-bold mb-6 flex items-center gap-2 text-xl">
                   <ShoppingBag className="w-6 h-6 text-nature-600 dark:text-nature-400" /> Curated Essentials
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {result.products.map((prod, idx) => (
                        <a 
                          key={idx} 
                          href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(prod.name + ' ' + (locationName || ''))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white dark:bg-nature-900 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-nature-500 dark:text-nature-300 uppercase tracking-wider bg-nature-50 dark:bg-nature-800 px-2 py-1 rounded-md">{prod.type}</span>
                                <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-nature-500 group-hover:text-white transition-colors"><ExternalLink size={12}/></div>
                            </div>
                            <h4 className="font-bold text-nature-900 dark:text-white text-lg mb-2 leading-tight group-hover:text-nature-600 dark:group-hover:text-nature-400 transition-colors">{prod.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{prod.reason}</p>
                            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2 text-xs font-medium text-nature-600 dark:text-nature-400">
                                 <Clock size={12}/> Use: {prod.timing}
                            </div>
                        </a>
                    ))}
               </div>
          </div>
      )}

    </div>
  );
};

export default ResultsDashboard;