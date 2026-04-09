// WeatherAPI.com service - proxied through edge function

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
    const d = await callWeatherProxy("current", county);
    if (!d || d.error || !d.current) return null;
    const c = d.current;
    return {
      temp: c.temp_c,
      humidity: c.humidity,
      rainfall: c.precip_mm || 0,
      description: c.condition?.text || "",
      icon: c.condition?.icon || "",
      windSpeed: c.wind_kph ? Math.round(c.wind_kph / 3.6 * 10) / 10 : 0, // convert to m/s
    };
  } catch { return null; }
}

export async function fetchForecast(county: string): Promise<WeatherForecast[]> {
  try {
    const d = await callWeatherProxy("forecast", county);
    if (!d || d.error || !d.forecast?.forecastday) return [];

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
  } catch { return []; }
}
