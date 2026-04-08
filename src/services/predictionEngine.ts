// Coffee Sales Prediction Engine
// Uses weather forecast data to predict impact on coffee sales

import type { WeatherForecast } from "./weatherApi";

export interface SalesPrediction {
  date: string;
  predictedSales: number;       // MT predicted
  baselineSales: number;        // MT normal
  weatherImpact: number;        // percentage impact (-30 to +20)
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: string[];
}

export interface CountyPrediction {
  county: string;
  currentSales: number;
  predicted7Day: number;
  predicted30Day: number;
  weatherRisk: "low" | "medium" | "high" | "critical";
  rainfallOutlook: string;
  salesTrend: "increasing" | "stable" | "declining";
  impactFactors: string[];
}

// Ideal conditions for coffee production in Kenya
const IDEAL = {
  temp: { min: 15, max: 24, optimal: 20 },
  humidity: { min: 60, max: 80, optimal: 70 },
  dailyRainfall: { min: 2, max: 8, optimal: 5 },
};

// Baseline daily sales by county (MT)
const BASELINE_SALES: Record<string, number> = {
  Nyeri: 50.7, Kirinyaga: 41.6, "Murang'a": 35.1, Kiambu: 30.7,
  Embu: 26.8, Meru: 39.7, Machakos: 17.0, Bungoma: 15.9,
};

function calcWeatherImpact(forecast: WeatherForecast): { impact: number; factors: string[] } {
  let impact = 0;
  const factors: string[] = [];

  // Temperature impact
  if (forecast.temp < IDEAL.temp.min) {
    const diff = IDEAL.temp.min - forecast.temp;
    impact -= diff * 2.5;
    factors.push(`Cold stress: ${forecast.temp.toFixed(1)}°C (below ${IDEAL.temp.min}°C)`);
  } else if (forecast.temp > IDEAL.temp.max) {
    const diff = forecast.temp - IDEAL.temp.max;
    impact -= diff * 3;
    factors.push(`Heat stress: ${forecast.temp.toFixed(1)}°C (above ${IDEAL.temp.max}°C)`);
  } else {
    const proximity = 1 - Math.abs(forecast.temp - IDEAL.temp.optimal) / (IDEAL.temp.max - IDEAL.temp.min);
    impact += proximity * 5;
  }

  // Rainfall impact - KEY FACTOR
  if (forecast.rainfall < 0.5) {
    impact -= 15;
    factors.push(`Drought risk: No rainfall expected (${forecast.rainfall}mm)`);
  } else if (forecast.rainfall < IDEAL.dailyRainfall.min) {
    impact -= (IDEAL.dailyRainfall.min - forecast.rainfall) * 3;
    factors.push(`Low rainfall: ${forecast.rainfall}mm (needs ${IDEAL.dailyRainfall.min}mm+)`);
  } else if (forecast.rainfall > IDEAL.dailyRainfall.max * 3) {
    impact -= 20;
    factors.push(`Flood risk: Excessive rain ${forecast.rainfall}mm`);
  } else if (forecast.rainfall > IDEAL.dailyRainfall.max) {
    impact -= (forecast.rainfall - IDEAL.dailyRainfall.max) * 1.5;
    factors.push(`Heavy rainfall: ${forecast.rainfall}mm may damage crops`);
  } else {
    impact += 5;
    factors.push(`Adequate rainfall: ${forecast.rainfall}mm`);
  }

  // Humidity impact
  if (forecast.humidity < IDEAL.humidity.min) {
    impact -= (IDEAL.humidity.min - forecast.humidity) * 0.5;
    factors.push(`Low humidity: ${forecast.humidity}% (risk of leaf drying)`);
  } else if (forecast.humidity > IDEAL.humidity.max) {
    impact -= (forecast.humidity - IDEAL.humidity.max) * 0.8;
    factors.push(`High humidity: ${forecast.humidity}% (fungal disease risk)`);
  }

  // Wind impact
  if (forecast.windSpeed > 15) {
    impact -= 10;
    factors.push(`Strong winds: ${forecast.windSpeed}m/s (may damage plants)`);
  }

  // Consecutive dry days amplifier
  return { impact: Math.max(-30, Math.min(20, impact)), factors };
}

function getRiskLevel(impact: number): "low" | "medium" | "high" | "critical" {
  if (impact >= -5) return "low";
  if (impact >= -12) return "medium";
  if (impact >= -20) return "high";
  return "critical";
}

export function predictSales(county: string, forecasts: WeatherForecast[]): SalesPrediction[] {
  const baseline = BASELINE_SALES[county] || 30;
  let consecutiveDryDays = 0;

  return forecasts.map((fc) => {
    const { impact, factors } = calcWeatherImpact(fc);

    // Track consecutive dry days
    if (fc.rainfall < 0.5) {
      consecutiveDryDays++;
      if (consecutiveDryDays >= 2) {
        const dryPenalty = consecutiveDryDays * 3;
        const adjustedImpact = Math.max(-30, impact - dryPenalty);
        factors.push(`${consecutiveDryDays} consecutive dry days — cumulative yield decline`);
        const predicted = Math.round(baseline * (1 + adjustedImpact / 100) * 10) / 10;
        return {
          date: fc.date,
          predictedSales: Math.max(0, predicted),
          baselineSales: baseline,
          weatherImpact: adjustedImpact,
          riskLevel: getRiskLevel(adjustedImpact),
          factors,
        };
      }
    } else {
      consecutiveDryDays = 0;
    }

    const predicted = Math.round(baseline * (1 + impact / 100) * 10) / 10;
    return {
      date: fc.date,
      predictedSales: Math.max(0, predicted),
      baselineSales: baseline,
      weatherImpact: impact,
      riskLevel: getRiskLevel(impact),
      factors,
    };
  });
}

export function generateCountyPrediction(
  county: string,
  forecasts: WeatherForecast[]
): CountyPrediction {
  const predictions = predictSales(county, forecasts);
  const baseline = BASELINE_SALES[county] || 30;

  const avg7 = predictions.slice(0, Math.min(5, predictions.length));
  const predicted7 = avg7.length > 0
    ? Math.round(avg7.reduce((s, p) => s + p.predictedSales, 0) / avg7.length * 7)
    : baseline * 7;

  const predicted30 = Math.round(predicted7 / 7 * 30);
  const avgImpact = predictions.length > 0
    ? predictions.reduce((s, p) => s + p.weatherImpact, 0) / predictions.length
    : 0;

  const totalRain = forecasts.reduce((s, f) => s + f.rainfall, 0);
  const avgDailyRain = forecasts.length > 0 ? totalRain / forecasts.length : 0;
  const dryDays = forecasts.filter(f => f.rainfall < 0.5).length;

  let rainfallOutlook = "Normal rainfall expected";
  if (avgDailyRain < 1) rainfallOutlook = `Dry spell ahead — only ${totalRain.toFixed(1)}mm over ${forecasts.length} days`;
  else if (avgDailyRain > 10) rainfallOutlook = `Heavy rains expected — ${totalRain.toFixed(1)}mm forecast`;
  else if (dryDays > 3) rainfallOutlook = `${dryDays} dry days forecast — potential water stress`;

  const allFactors = predictions.flatMap(p => p.factors);
  const uniqueFactors = [...new Set(allFactors)].slice(0, 5);

  return {
    county,
    currentSales: Math.round(baseline * 7),
    predicted7Day: predicted7,
    predicted30Day: predicted30,
    weatherRisk: getRiskLevel(avgImpact),
    rainfallOutlook,
    salesTrend: avgImpact > 2 ? "increasing" : avgImpact < -5 ? "declining" : "stable",
    impactFactors: uniqueFactors,
  };
}
