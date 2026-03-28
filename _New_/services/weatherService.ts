import { WeatherData, AQIData } from '../types';

// Helper to prevent hanging requests
const fetchWithTimeout = async (url: string, timeout = 20000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => {
    // Attempt to provide a reason for the abort (supported in modern browsers)
    try {
      controller.abort(new Error("Request timed out"));
    } catch {
      controller.abort();
    }
  }, timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day,apparent_temperature,wind_direction_10m`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error('Weather API failed');
    
    const data = await response.json();
    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day,
      apparentTemperature: data.current.apparent_temperature,
      windDirection: data.current.wind_direction_10m,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
};

export const fetchLocationName = async (lat: number, lon: number): Promise<string | null> => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&format=json&language=en`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      const parts = [];
      if (place.name) parts.push(place.name);
      if (place.admin1 && place.admin1 !== place.name) parts.push(place.admin1);
      if (place.country) parts.push(place.country);
      return parts.join(', ');
    }
    return null;
  } catch (error) {
    console.warn("Failed to fetch location name:", error);
    return null;
  }
};

export const getCoordinatesForCity = async (city: string): Promise<{lat: number, lon: number, name: string} | null> => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.latitude,
        lon: result.longitude,
        name: `${result.name}, ${result.country || ''}`
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};

const getAQIDetails = (aqi: number) => {
  if (aqi <= 50) return { category: 'Good', impact: 'Air quality is satisfactory.', recommendation: 'Great day for outdoor activities.' };
  if (aqi <= 100) return { category: 'Moderate', impact: 'Air quality is acceptable.', recommendation: 'Sensitive individuals should limit prolonged outdoor exertion.' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', impact: 'Members of sensitive groups may experience health effects.', recommendation: 'Children and active adults should limit outdoor exertion.' };
  if (aqi <= 200) return { category: 'Unhealthy', impact: 'Everyone may begin to experience health effects.', recommendation: 'Avoid prolonged outdoor exertion.' };
  if (aqi <= 300) return { category: 'Very Unhealthy', impact: 'Health warnings of emergency conditions.', recommendation: 'Avoid all outdoor exertion.' };
  return { category: 'Hazardous', impact: 'Health alert: everyone may experience more serious health effects.', recommendation: 'Stay indoors and keep windows closed.' };
};

export const fetchAQI = async (lat: number, lon: number): Promise<AQIData | null> => {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5`;
    
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error('AQI API failed');
    
    const data = await response.json();
    const current = data.current;
    
    const aqiValue = current.us_aqi || 0;
    const details = getAQIDetails(aqiValue);

    return {
      aqi: aqiValue,
      pm25: current.pm2_5,
      pm10: current.pm10,
      category: details.category,
      healthImpact: details.impact,
      recommendation: details.recommendation,
      source: 'Open-Meteo',
      city: 'Local Coordinates'
    };
  } catch (error) {
    console.error("Failed to fetch AQI:", error);
    return null;
  }
};