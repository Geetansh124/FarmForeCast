import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Thermometer, ArrowRight, Mountain, Trees, Waves, CheckCircle, AlertTriangle, Loader, Leaf, Globe, Flag } from 'lucide-react';
import { fetchWeather, fetchAQI, getCoordinatesForCity, fetchLocationName } from '../services/weatherService';
import { getHealthyDestinations } from '../services/geminiService';
import { WeatherData, AQIData } from '../types';

interface Destination {
  name: string;
  reason: string;
  type?: 'Domestic' | 'International';
  weather: WeatherData | null;
  aqi: AQIData | null;
}

const EcoHavenFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchedCityData, setSearchedCityData] = useState<{
    name: string;
    weather: WeatherData | null;
    aqi: AQIData | null;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [oxygenWidth, setOxygenWidth] = useState('0%');

  // Reset animation when data changes
  useEffect(() => {
    if (searchedCityData) {
        setOxygenWidth('0%');
        const target = getOxygenLevel(searchedCityData.aqi?.aqi || 50).width;
        // Small delay to allow render before animating
        const timer = setTimeout(() => {
            setOxygenWidth(target);
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [searchedCityData]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearchedCityData(null);
    setSuggestions([]);
    setOxygenWidth('0%');

    try {
      // 1. Get coords for searched city
      const coords = await getCoordinatesForCity(query);
      if (!coords) {
        setError(`Could not find location "${query}".`);
        setLoading(false);
        return;
      }

      // 2. Fetch real-time data
      const [weather, aqi] = await Promise.all([
        fetchWeather(coords.lat, coords.lon),
        fetchAQI(coords.lat, coords.lon)
      ]);

      setSearchedCityData({
        name: coords.name,
        weather,
        aqi
      });

      // 3. Get AI Suggestions based on this context
      const aiSuggestions = await getHealthyDestinations(coords.name, aqi?.aqi || 50);

      // 4. Fetch Real Data for suggestions to prove they are healthy
      const detailedSuggestions = await Promise.all(
        aiSuggestions.map(async (s) => {
          const sCoords = await getCoordinatesForCity(s.name);
          if (!sCoords) return { ...s, weather: null, aqi: null };
          
          const [sWeather, sAqi] = await Promise.all([
            fetchWeather(sCoords.lat, sCoords.lon),
            fetchAQI(sCoords.lat, sCoords.lon)
          ]);
          
          return { ...s, weather: sWeather, aqi: sAqi };
        })
      );

      setSuggestions(detailedSuggestions);

    } catch (err) {
      console.error(err);
      setError("Failed to analyze location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getOxygenLevel = (aqi: number) => {
    if (aqi <= 30) return { label: 'Maximum Purity', color: 'text-emerald-500', width: '100%' };
    if (aqi <= 50) return { label: 'High Freshness', color: 'text-green-500', width: '85%' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-500', width: '60%' };
    return { label: 'Low / Polluted', color: 'text-red-500', width: '30%' };
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-nature-900 rounded-3xl shadow-xl border border-nature-100 dark:border-nature-800 p-6 md:p-8 animate-slide-up mb-12 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-nature-100 dark:border-nature-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-nature-900 dark:text-white flex items-center gap-2">
            <Mountain className="text-nature-500" /> Eco-Haven Finder
          </h2>
          <p className="text-sm text-nature-600 dark:text-nature-300 mt-1">
            Analyze any city's oxygen levels and find the healthiest places on Earth right now.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Enter city (e.g. Kyoto, Vancouver)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-nature-50 dark:bg-nature-800 border border-nature-200 dark:border-nature-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-nature-400 text-nature-900 dark:text-white placeholder-nature-400"
            />
            <Search className="absolute left-3 top-3.5 text-nature-400 w-5 h-5" />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-nature-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-nature-700 disabled:opacity-50 transition-colors shadow-lg shadow-nature-200 dark:shadow-none"
          >
            {loading ? <Loader className="animate-spin" /> : "Check"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* Main Result */}
      {searchedCityData && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Analysis Card */}
          <div className="bg-gradient-to-br from-nature-50 to-white dark:from-nature-800 dark:to-nature-900 rounded-3xl border border-nature-200 dark:border-nature-700 p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-nature-600 dark:text-nature-400" />
                <h3 className="text-xl font-bold text-nature-900 dark:text-white">{searchedCityData.name}</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AQI / Pollution */}
                <div className="bg-white dark:bg-nature-800 p-4 rounded-2xl border border-gray-100 dark:border-nature-700 shadow-sm flex flex-col justify-center items-center text-center">
                    <Wind className={`w-8 h-8 mb-2 ${searchedCityData.aqi && searchedCityData.aqi.aqi > 100 ? 'text-red-500' : 'text-green-500'}`} />
                    <div className="text-3xl font-black text-gray-800 dark:text-white">{searchedCityData.aqi?.aqi ?? '--'}</div>
                    <div className="text-xs font-bold uppercase text-gray-400">Air Quality Index</div>
                    <div className="mt-2 text-sm font-medium dark:text-nature-200">{searchedCityData.aqi?.category}</div>
                </div>

                {/* Oxygen Meter Visual */}
                <div className="bg-white dark:bg-nature-800 p-4 rounded-2xl border border-gray-100 dark:border-nature-700 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-nature-700 dark:text-nature-200 flex items-center gap-1"><Leaf size={14}/> Oxygen Quality</span>
                        <span className={`text-sm font-bold ${getOxygenLevel(searchedCityData.aqi?.aqi || 50).color}`}>
                            {getOxygenLevel(searchedCityData.aqi?.aqi || 50).label}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-nature-700 rounded-full h-4 overflow-hidden relative">
                         <div 
                           className="h-full bg-gradient-to-r from-teal-400 to-green-500 transition-all duration-1000 ease-out"
                           style={{ width: oxygenWidth }}
                         ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-tight">
                        Based on particulate matter density. Lower PM2.5 indicates cleaner, oxygen-rich air.
                    </p>
                </div>

                {/* Weather Context */}
                <div className="bg-white dark:bg-nature-800 p-4 rounded-2xl border border-gray-100 dark:border-nature-700 shadow-sm flex flex-col justify-center items-center text-center">
                    <Thermometer className="w-8 h-8 mb-2 text-orange-500" />
                    <div className="text-3xl font-black text-gray-800 dark:text-white">{searchedCityData.weather?.temperature ?? '--'}°C</div>
                    <div className="text-xs font-bold uppercase text-gray-400">Comfort Level</div>
                    <div className="mt-2 text-sm font-medium flex items-center gap-2 dark:text-nature-200">
                         <Wind size={12} /> {searchedCityData.weather?.windSpeed} km/h
                    </div>
                </div>
             </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
             <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h4 className="text-lg font-bold text-nature-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    Recommended Healthy Alternatives
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestions.map((place, idx) => (
                        <div key={idx} className="bg-white dark:bg-nature-800 p-5 rounded-2xl border border-green-100 dark:border-nature-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                             {/* Badge */}
                             <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${
                               place.type === 'International' ? 'bg-blue-500 text-white' : 'bg-nature-500 text-white'
                             }`}>
                                {place.type === 'International' ? <span className="flex items-center gap-1"><Globe size={10}/> Global</span> : <span className="flex items-center gap-1"><Flag size={10}/> Domestic</span>}
                             </div>

                             <div className="flex justify-between items-start mb-3 mt-2">
                                 <h5 className="font-bold text-nature-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{place.name}</h5>
                             </div>
                             
                             <div className="flex items-center gap-4 mb-3 text-sm">
                                 <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                     <Wind size={14} className="text-green-500"/> AQI {place.aqi?.aqi ?? '--'}
                                 </div>
                                 <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                     <Thermometer size={14} className="text-orange-500"/> {place.weather?.temperature ?? '--'}°C
                                 </div>
                             </div>

                             <p className="text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-nature-700 pt-3">
                                 "{place.reason}"
                             </p>
                        </div>
                    ))}
                </div>
             </div>
          )}
        </div>
      )}

      {/* Empty State / Hint */}
      {!searchedCityData && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
              <Trees className="w-16 h-16 text-nature-300 dark:text-nature-600 mb-4" />
              <p className="text-nature-600 dark:text-nature-400 max-w-md">
                  Search for a location to see if it's a "Green Zone" or "Red Zone". We'll suggest the best places to breathe freely based on real data.
              </p>
          </div>
      )}
      
      {loading && (
         <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-nature-500 animate-spin mb-2" />
            <p className="text-sm text-nature-600 dark:text-nature-300">Scanning global atmosphere...</p>
         </div>
      )}

    </div>
  );
};

export default EcoHavenFinder;