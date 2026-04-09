// WeatherAPI.com service with fallback mock data

import { supabase } from "@/integrations/supabase/client";

const COUNTY_COORDS: Record<string, { lat: number; lon: number }> = {
  Nyeri:       { lat: -0.4167, lon: 36.9500 },
  Kirinyaga:   { lat: -0.5000, lon: 37.2833 },
  "Murang'a":  { lat: -0.7167, lon: 37.1500 },
  Kiambu:      { lat: -1.1714, lon: 36.8356 },
  Embu:        { lat: -0.5389, lon: 37.4583 },
  Meru:        { lat: 0.0500,  lon: 37.6500 },
  Machakos:    { lat: -1.5177, lon: 37.2634 },
  Bungoma:     { lat: 0.5695,  lon: 34.5584 },
};

// Realistic baseline weather per county (altitude & location driven)
const COUNTY_CLIMATE: Record<string, { tempBase: number; humidityBase: number; rainfallBase: number }> = {
  Nyeri:       { tempBase: 18.5, humidityBase: 72, rainfallBase: 4.2 },
  Kirinyaga:   { tempBase: 19.0, humidityBase: 70, rainfallBase: 3.8 },
  "Murang'a":  { tempBase: 20.2, humidityBase: 74, rainfallBase: 5.1 },
  Kiambu:      { tempBase: 19.8, humidityBase: 68, rainfallBase: 3.5 },
  Embu:        { tempBase: 20.5, humidityBase: 71, rainfallBase: 4.0 },
  Meru:        { tempBase: 17.8, humidityBase: 69, rainfallBase: 3.2 },
  Machakos:    { tempBase: 22.4, humidityBase: 58, rainfallBase: 2.1 },
  Bungoma:     { tempBase: 21.0, humidityBase: 76, rainfallBase: 6.3 },
};

export interface WeatherForecast {
  date: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  rainfall: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface CurrentWeather {
  temp: number;
  humidity: number;
  rainfall: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export function getCountyCoords(county: string) {
  return COUNTY_COORDS[county] || COUNTY_COORDS.Nyeri;
}

export function getAllCounties() {
  return Object.keys(COUNTY_COORDS);
}

// Seeded random for deterministic but varied data per county+day
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateFallbackCurrent(county: string): CurrentWeather {
  const climate = COUNTY_CLIMATE[county] || COUNTY_CLIMATE.Nyeri;
  const today = new Date();
  const seed = today.getDate() * 31 + county.length * 7;
  const r = seededRandom(seed);

  const temp = Math.round((climate.tempBase + (r - 0.5) * 4) * 10) / 10;
  const humidity = Math.round(climate.humidityBase + (r - 0.4) * 12);
  const rainfall = Math.round(Math.max(0, climate.rainfallBase + (r - 0.6) * 8) * 10) / 10;
  const windSpeed = Math.round((2 + r * 6) * 10) / 10;

  const descriptions = ["Partly cloudy", "Light rain", "Sunny", "Overcast", "Patchy rain nearby", "Moderate rain"];
  const desc = descriptions[Math.floor(r * descriptions.length)];

  return { temp, humidity, rainfall, description: desc, icon: "//cdn.weatherapi.com/weather/64x64/day/116.png", windSpeed };
}

function generateFallbackForecast(county: string): WeatherForecast[] {
  const climate = COUNTY_CLIMATE[county] || COUNTY_CLIMATE.Nyeri;
  const today = new Date();
  const days: WeatherForecast[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const seed = (date.getDate() * 31 + county.length * 7 + i * 13);
    const r = seededRandom(seed);
    const r2 = seededRandom(seed + 100);

    const tempAvg = Math.round((climate.tempBase + (r - 0.5) * 5) * 10) / 10;
    const tempMin = Math.round((tempAvg - 2 - r2 * 3) * 10) / 10;
    const tempMax = Math.round((tempAvg + 2 + r2 * 3) * 10) / 10;
    const humidity = Math.round(climate.humidityBase + (r - 0.4) * 15);
    const rainfall = Math.round(Math.max(0, climate.rainfallBase + (r - 0.5) * 10) * 10) / 10;
    const windSpeed = Math.round((2 + r2 * 7) * 10) / 10;

    const descriptions = ["Partly cloudy", "Light rain", "Sunny", "Overcast", "Patchy rain nearby", "Moderate rain", "Heavy rain"];
    const desc = descriptions[Math.floor(r * descriptions.length)];

    days.push({ date: dateStr, temp: tempAvg, temp_min: tempMin, temp_max: tempMax, humidity, rainfall, description: desc, icon: "//cdn.weatherapi.com/weather/64x64/day/116.png", windSpeed });
  }
  return days;
}

async function callWeatherProxy(endpoint: string, county: string): Promise<any | null> {
  const { lat, lon } = getCountyCoords(county);
  try {
    const { data, error } = await supabase.functions.invoke("weather-proxy", {
      body: { endpoint, lat, lon },
    });
    if (error || data?.error) {
      console.warn("Weather proxy returned error, using fallback data:", error || data?.error);
      return null;
    }
    return data;
  } catch (e) {
    console.warn("Weather proxy call failed, using fallback data:", e);
    return null;
  }
}

export async function fetchCurrentWeather(county: string): Promise<CurrentWeather | null> {
  try {
    const d = await callWeatherProxy("current", county);
    if (d && d.current) {
      const c = d.current;
      return {
        temp: c.temp_c,
        humidity: c.humidity,
        rainfall: c.precip_mm || 0,
        description: c.condition?.text || "",
        icon: c.condition?.icon || "",
        windSpeed: c.wind_kph ? Math.round(c.wind_kph / 3.6 * 10) / 10 : 0,
      };
    }
  } catch { /* fall through */ }
  return generateFallbackCurrent(county);
}

export async function fetchForecast(county: string): Promise<WeatherForecast[]> {
  try {
    const d = await callWeatherProxy("forecast", county);
    if (d && d.forecast?.forecastday) {
      return d.forecast.forecastday.map((day: any) => ({
        date: day.date,
        temp: day.day.avgtemp_c,
        temp_min: day.day.mintemp_c,
        temp_max: day.day.maxtemp_c,
        humidity: day.day.avghumidity,
        rainfall: day.day.totalprecip_mm,
        description: day.day.condition?.text || "",
        icon: day.day.condition?.icon || "",
        windSpeed: Math.round(day.day.maxwind_kph / 3.6 * 10) / 10,
      }));
    }
  } catch { /* fall through */ }
  return generateFallbackForecast(county);
}
