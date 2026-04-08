// OpenWeather API service for fetching real weather data

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

export function getApiKey(): string {
  return localStorage.getItem("dcip_openweather_key") || "";
}

export function setApiKey(key: string) {
  localStorage.setItem("dcip_openweather_key", key);
}

export function getCountyCoords(county: string) {
  return COUNTY_COORDS[county] || COUNTY_COORDS.Nyeri;
}

export function getAllCounties() {
  return Object.keys(COUNTY_COORDS);
}

export async function fetchCurrentWeather(county: string): Promise<CurrentWeather | null> {
  const key = getApiKey();
  if (!key) return null;
  const { lat, lon } = getCountyCoords(county);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    );
    if (!res.ok) return null;
    const d = await res.json();
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
  const key = getApiKey();
  if (!key) return [];
  const { lat, lon } = getCountyCoords(county);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    );
    if (!res.ok) return [];
    const d = await res.json();

    // Group by day and aggregate
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
