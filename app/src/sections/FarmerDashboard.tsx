import { useState, useEffect, useCallback } from 'react';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Droplets, 
  Leaf,
  Sprout,
  Flower2,
  Wheat,
  AlertTriangle,
  CheckCircle,
  Info,
  Phone,
  Volume2,
  Shield,
  MapPin,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  dashboardConfig, 
  mockWeatherData, 
  mockCropData, 
  mockAdvisories, 
  mockPestAlerts,
  mockInsuranceStatus,
  mockFarmerProfile,
  voiceConfig 
} from '../config';

// Advisory Engine - Rule-based logic
const generateAdvisory = (weather: typeof mockWeatherData, crop: typeof mockCropData) => {
  const advisories = [];
  
  // Rule 1: Heavy rain during harvest
  if (weather.rainfall > 70 && crop.currentStage === "Harvest") {
    advisories.push({
      id: "harvest-delay",
      priority: "high" as const,
      title: "Delay Harvesting Immediately",
      message: "Heavy rainfall detected. High risk of crop damage if harvesting proceeds.",
      action: "Wait for weather to clear. Protect harvested crops from moisture.",
      icon: "CloudRain",
    });
  }
  
  // Rule 2: Fungal risk
  if (weather.humidity > 80 && weather.temperature >= 20 && weather.temperature <= 30) {
    advisories.push({
      id: "fungal-risk",
      priority: "high" as const,
      title: "High Fungal Disease Risk",
      message: `Humidity at ${weather.humidity}% with ${weather.temperature}°C creates perfect conditions for fungal infection.`,
      action: "Apply preventative fungicide spray within 24 hours.",
      icon: "AlertTriangle",
    });
  }
  
  // Rule 3: Optimal sowing conditions
  if (weather.rainfall > 50 && weather.rainfall < 100 && crop.currentStage === "Sowing") {
    advisories.push({
      id: "optimal-sowing",
      priority: "low" as const,
      title: "Optimal Sowing Conditions",
      message: "Moisture levels are ideal for sowing activities.",
      action: "Proceed with planned sowing as scheduled.",
      icon: "CheckCircle",
    });
  }
  
  // Rule 4: Irrigation recommendation
  if (weather.rainfall < 10 && crop.currentStage === "Vegetative") {
    advisories.push({
      id: "irrigation-needed",
      priority: "medium" as const,
      title: "Irrigation Recommended",
      message: "Low rainfall detected during critical vegetative growth stage.",
      action: "Schedule irrigation within next 2 days.",
      icon: "Droplets",
    });
  }
  
  return advisories.length > 0 ? advisories : mockAdvisories;
};

// Pest Prediction Engine
const checkPestRisks = (weather: typeof mockWeatherData) => {
  const risks = [];
  
  // Fungal disease risk
  if (weather.humidity > 80 && weather.temperature > 25) {
    risks.push({
      id: "fungal",
      pestName: "Fungal Disease",
      riskLevel: "high" as const,
      conditions: `Humidity ${weather.humidity}% + Temp ${weather.temperature}°C`,
      recommendation: "Apply preventative spray immediately",
      active: true,
    });
  }
  
  // Aphid risk
  if (weather.temperature >= 20 && weather.temperature <= 30 && weather.rainfall < 20) {
    risks.push({
      id: "aphid",
      pestName: "Aphid Infestation",
      riskLevel: "medium" as const,
      conditions: `Temp ${weather.temperature}°C + Low rainfall`,
      recommendation: "Monitor closely, use neem oil if detected",
      active: false,
    });
  }
  
  return risks.length > 0 ? risks : mockPestAlerts;
};

// Insurance Trigger
const checkInsuranceTrigger = (weather: typeof mockWeatherData) => {
  if (weather.rainfall > 100) {
    return {
      triggered: true,
      threshold: 100,
      currentValue: weather.rainfall,
      message: "⚠️ Insurance Claim Initiated (Simulated)",
      claimStatus: "Triggered - Processing",
    };
  }
  return mockInsuranceStatus;
};

// Crop Stage Calculator
const calculateCropStage = (sowingDate: string) => {
  const sowing = new Date(sowingDate);
  const today = new Date();
  const daysSinceSowing = Math.floor((today.getTime() - sowing.getTime()) / (1000 * 60 * 60 * 24));
  
  let stage = "sowing";
  let nextStage = "vegetative";
  let daysToNext = 20 - daysSinceSowing;
  let progress = (daysSinceSowing / 20) * 100;
  
  if (daysSinceSowing >= 20 && daysSinceSowing < 50) {
    stage = "vegetative";
    nextStage = "flowering";
    daysToNext = 50 - daysSinceSowing;
    progress = ((daysSinceSowing - 20) / 30) * 100;
  } else if (daysSinceSowing >= 50 && daysSinceSowing < 80) {
    stage = "flowering";
    nextStage = "harvest";
    daysToNext = 80 - daysSinceSowing;
    progress = ((daysSinceSowing - 50) / 30) * 100;
  } else if (daysSinceSowing >= 80) {
    stage = "harvest";
    nextStage = "complete";
    daysToNext = 0;
    progress = Math.min(((daysSinceSowing - 80) / 20) * 100, 100);
  }
  
  return { stage, nextStage, daysToNext, progress, daysSinceSowing };
};

// Get weather icon
const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'rain':
    case 'heavy rain':
      return <CloudRain className="w-8 h-8" />;
    case 'sunny':
      return <Sun className="w-8 h-8" />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud className="w-8 h-8" />;
    default:
      return <Sun className="w-8 h-8" />;
  }
};

// Get crop stage icon
const getCropStageIcon = (stage: string) => {
  switch (stage.toLowerCase()) {
    case 'sowing':
      return <Sprout className="w-6 h-6" />;
    case 'vegetative':
      return <Leaf className="w-6 h-6" />;
    case 'flowering':
      return <Flower2 className="w-6 h-6" />;
    case 'harvest':
      return <Wheat className="w-6 h-6" />;
    default:
      return <Leaf className="w-6 h-6" />;
  }
};

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/20 border-red-500/50 text-red-400';
    case 'medium':
      return 'bg-amber-500/20 border-amber-500/50 text-amber-400';
    case 'low':
      return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
    default:
      return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
  }
};

// Get risk level color
const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'text-red-400 bg-red-500/20';
    case 'medium':
      return 'text-amber-400 bg-amber-500/20';
    case 'low':
      return 'text-emerald-400 bg-emerald-500/20';
    default:
      return 'text-slate-400 bg-slate-500/20';
  }
};

export function FarmerDashboard() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [advisories, setAdvisories] = useState(mockAdvisories);
  const [pestAlerts, setPestAlerts] = useState(mockPestAlerts);
  const [insuranceStatus, setInsuranceStatus] = useState(mockInsuranceStatus);
  const [cropStage, setCropStage] = useState(mockCropData);
  const [showInsuranceOverlay, setShowInsuranceOverlay] = useState(false);

  // Calculate dynamic data
  useEffect(() => {
    const stage = calculateCropStage(mockCropData.sowingDate);
    setCropStage(prev => ({
      ...prev,
      currentStage: stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1),
      nextStage: stage.nextStage.charAt(0).toUpperCase() + stage.nextStage.slice(1),
      daysToNextStage: stage.daysToNext,
      stageProgress: stage.progress,
      daysSinceSowing: stage.daysSinceSowing,
    }));
    
    setAdvisories(generateAdvisory(mockWeatherData, { ...mockCropData, currentStage: stage.stage }));
    setPestAlerts(checkPestRisks(mockWeatherData));
    const insurance = checkInsuranceTrigger(mockWeatherData);
    setInsuranceStatus(insurance);
    
    if (insurance.triggered) {
      setShowInsuranceOverlay(true);
    }
  }, []);

  // Text-to-Speech function
  const speakAdvisory = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Build the advisory message
    const highPriorityAdvice = advisories.find(a => a.priority === 'high');
    const mainAdvice = highPriorityAdvice || advisories[0];
    
    const message = `
      Namaste ${mockFarmerProfile.name}. 
      Aaj ka mausam: ${mockWeatherData.temperature} degree, ${mockWeatherData.condition}.
      Aapki fasal: ${mockCropData.type}, ${cropStage.currentStage} stage mein hai.
      ${mainAdvice ? `Mahatwapurn salaah: ${mainAdvice.message}` : 'Koi vishesh salaah nahi.'}
      ${pestAlerts.some(p => p.active) ? 'Satarak rahein: ${pestAlerts.find(p => p.active)?.pestName} ka khatra hai.' : ''}
    `;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = voiceConfig.language;
    utterance.rate = voiceConfig.rate;
    utterance.pitch = voiceConfig.pitch;
    utterance.volume = voiceConfig.volume;

    // Try to find Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [advisories, cropStage, pestAlerts]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return (
    <section id="dashboard" className="relative min-h-screen bg-[#0a0a0a] py-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-emerald-400/80 text-sm tracking-[0.3em] uppercase mb-4">
            {dashboardConfig.subtitle}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-4">
            {dashboardConfig.mainTitle}
          </h2>
          <p className="text-white/50 text-lg">{dashboardConfig.scriptText}</p>
          
          {/* Farmer Profile */}
          <div className="mt-6 inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-medium">{mockFarmerProfile.name.charAt(0)}</span>
            </div>
            <div className="text-left">
              <p className="text-white font-medium">{mockFarmerProfile.name}</p>
              <p className="text-white/50 text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {mockFarmerProfile.location}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Card */}
          <div id="weather" className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-emerald-400" />
                {dashboardConfig.weatherCardTitle}
              </h3>
              <span className="text-white/40 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {mockWeatherData.location}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {/* Main Weather */}
              <div className="col-span-2 sm:col-span-2 bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    {getWeatherIcon(mockWeatherData.condition)}
                  </div>
                  <div>
                    <p className="text-4xl font-light text-white">{mockWeatherData.temperature}°C</p>
                    <p className="text-white/60">{mockWeatherData.condition}</p>
                  </div>
                </div>
              </div>
              
              {/* Humidity */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-white/60 text-sm">Humidity</span>
                </div>
                <p className="text-2xl font-light text-white">{mockWeatherData.humidity}%</p>
              </div>
              
              {/* Rainfall */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/60 text-sm">Rainfall</span>
                </div>
                <p className="text-2xl font-light text-white">{mockWeatherData.rainfall}mm</p>
              </div>
            </div>
            
            {/* Forecast */}
            <div className="grid grid-cols-4 gap-3">
              {mockWeatherData.forecast.map((day, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-white/60 text-xs mb-2">{day.day}</p>
                  <div className="flex justify-center mb-2 text-white/80">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <p className="text-white font-medium">{day.temp}°</p>
                  <p className="text-white/40 text-xs">{day.rainfall}mm</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Status Card */}
          <div id="crops" className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20">
            <h3 className="text-xl font-medium text-white flex items-center gap-2 mb-6">
              <Sprout className="w-5 h-5 text-emerald-400" />
              {dashboardConfig.cropCardTitle}
            </h3>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                {getCropStageIcon(cropStage.currentStage)}
              </div>
              <p className="text-2xl font-light text-white">{cropStage.type}</p>
              <p className="text-emerald-400">{cropStage.currentStage} Stage</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Stage Progress</span>
                <span className="text-emerald-400">{Math.round(cropStage.stageProgress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${cropStage.stageProgress}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Days Since Sowing
                </span>
                <span className="text-white font-medium">{cropStage.daysSinceSowing} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Next: {cropStage.nextStage}
                </span>
                <span className="text-emerald-400 font-medium">{cropStage.daysToNextStage} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Advisory Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Alerts */}
          <div id="alerts" className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-medium text-white flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              {dashboardConfig.alertCardTitle}
            </h3>
            
            <div className="space-y-4">
              {pestAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border ${alert.active ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.active ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${alert.active ? 'text-white' : 'text-white/60'}`}>
                          {alert.pestName}
                        </p>
                        <p className="text-white/40 text-sm">{alert.conditions}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(alert.riskLevel)}`}>
                      {alert.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm ml-[52px]">{alert.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Advisory */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-medium text-white flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-blue-400" />
              {dashboardConfig.advisoryCardTitle}
            </h3>
            
            <div className="space-y-4">
              {advisories.slice(0, 3).map((advisory) => (
                <div 
                  key={advisory.id}
                  className={`p-4 rounded-xl border ${getPriorityColor(advisory.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-current bg-opacity-20 flex items-center justify-center flex-shrink-0">
                      {advisory.priority === 'high' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : advisory.priority === 'medium' ? (
                        <Info className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium mb-1">{advisory.title}</p>
                      <p className="text-sm opacity-80 mb-2">{advisory.message}</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <ChevronRight className="w-4 h-4" />
                        {advisory.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insurance Status */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${insuranceStatus.triggered ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">{dashboardConfig.insuranceCardTitle}</h3>
                <p className={`${insuranceStatus.triggered ? 'text-red-400' : 'text-white/60'}`}>
                  {insuranceStatus.message}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Rainfall Threshold</p>
              <p className="text-2xl font-light text-white">
                {insuranceStatus.currentValue} <span className="text-white/40">/ {insuranceStatus.threshold}mm</span>
              </p>
              <p className={`text-sm font-medium ${insuranceStatus.triggered ? 'text-red-400' : 'text-emerald-400'}`}>
                {insuranceStatus.claimStatus}
              </p>
            </div>
          </div>
        </div>

        {/* CALL ME Button - The Focal Point */}
        <div className="flex justify-center">
          <button
            onClick={isSpeaking ? stopSpeaking : speakAdvisory}
            className={`
              group relative px-16 py-8 rounded-full font-medium text-xl tracking-wider
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${isSpeaking 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/50' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/50'
              }
              shadow-2xl
            `}
          >
            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            <span className="relative flex items-center gap-4">
              {isSpeaking ? (
                <>
                  <Volume2 className="w-8 h-8 animate-bounce" />
                  {dashboardConfig.callMeButtonText} - STOP
                </>
              ) : (
                <>
                  <Phone className="w-8 h-8 group-hover:animate-bounce" />
                  {dashboardConfig.callMeButtonText}
                </>
              )}
            </span>
          </button>
        </div>
        <p className="text-center text-white/40 mt-4">{dashboardConfig.callMeSubtext}</p>
      </div>

      {/* Insurance Trigger Overlay */}
      {showInsuranceOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-red-500/50 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-4">Insurance Alert</h3>
            <p className="text-white/80 mb-6">
              Heavy rainfall threshold breached! Your parametric insurance has been triggered.
            </p>
            <div className="bg-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 font-medium">Claim Status: Processing</p>
              <p className="text-white/60 text-sm">Rainfall: {insuranceStatus.currentValue}mm (Threshold: {insuranceStatus.threshold}mm)</p>
            </div>
            <button
              onClick={() => setShowInsuranceOverlay(false)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
