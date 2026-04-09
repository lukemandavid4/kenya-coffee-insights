// OpenWeather API service - proxied through Supabase Edge Function

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

async function callWeatherProxy(endpoint: string, county: string): Promise<any | null> {
  const { lat, lon } = getCountyCoords(county);
  const { data, error } = await supabase.functions.invoke("weather-proxy", {
    body: { endpoint, lat, lon },
  });
  if (error) {
    console.error("Weather proxy error:", error);
    return null;
  }
  return data;
}

export async function fetchCurrentWeather(county: string): Promise<CurrentWeather | null> {
  try {
    const d = await callWeatherProxy("weather", county);
    if (!d || d.error) return null;
    return {
      temp: d.main.temp,
      humidity: d.main.humidity,
      rainfall: d.rain?.["1h"] || d.rain?.["3h"] || 0,
      description: d.weather?.[0]?.description || "",
      icon: d.weather?.[0]?.icon || "01d",
      windSpeed: d.wind?.speed || 0,
    };
  } catch { return null; }
}

export async function fetchForecast(county: string): Promise<WeatherForecast[]> {
  try {
    const d = await callWeatherProxy("forecast", county);
    if (!d || d.error || !d.list) return [];

    const daily: Record<string, any> = {};
    for (const item of d.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date]) {
        daily[date] = { temps: [], humidities: [], rain: 0, desc: item.weather[0].description, icon: item.weather[0].icon, wind: [] };
      }
      daily[date].temps.push(item.main.temp);
      daily[date].humidities.push(item.main.humidity);
      daily[date].rain += (item.rain?.["3h"] || 0);
      daily[date].wind.push(item.wind?.speed || 0);
    }

    return Object.entries(daily).map(([date, v]: [string, any]) => ({
      date,
      temp: Math.round((v.temps.reduce((a: number, b: number) => a + b, 0) / v.temps.length) * 10) / 10,
      temp_min: Math.min(...v.temps),
      temp_max: Math.max(...v.temps),
      humidity: Math.round(v.humidities.reduce((a: number, b: number) => a + b, 0) / v.humidities.length),
      rainfall: Math.round(v.rain * 10) / 10,
      description: v.desc,
      icon: v.icon,
      windSpeed: Math.round((v.wind.reduce((a: number, b: number) => a + b, 0) / v.wind.length) * 10) / 10,
    }));
  } catch { return []; }
}
