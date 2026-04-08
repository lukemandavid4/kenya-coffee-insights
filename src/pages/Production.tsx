import { DashboardLayout } from "@/components/DashboardLayout";
import { countyProduction } from "@/data/mockData";
import { fetchForecast, getApiKey, getAllCounties } from "@/services/weatherApi";
import { generateCountyPrediction, type CountyPrediction } from "@/services/predictionEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, CloudRain, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

const riskColors: Record<string, string> = {
  low: "text-chart-up", medium: "text-accent", high: "text-chart-down", critical: "text-destructive",
};

export default function Production() {
  const [predictions, setPredictions] = useState<CountyPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getApiKey()) return;
    setLoading(true);
    const load = async () => {
      const counties = getAllCounties();
      const results: CountyPrediction[] = [];
      for (const county of counties) {
        const forecasts = await fetchForecast(county);
        if (forecasts.length > 0) results.push(generateCountyPrediction(county, forecasts));
      }
      setPredictions(results);
      setLoading(false);
    };
    load();
  }, []);

  const chartData = countyProduction.map(cp => {
    const pred = predictions.find(p => p.county === cp.county);
    return {
      county: cp.county,
      current: cp.production,
      forecast: cp.forecast,
      weatherAdjusted: pred ? Math.round(cp.forecast * (1 + (pred.salesTrend === "declining" ? -0.08 : pred.salesTrend === "increasing" ? 0.05 : 0))) : cp.forecast,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Production Forecast</h1>
          <p className="text-sm text-muted-foreground">AI-predicted production levels adjusted for real-time weather conditions</p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading weather-adjusted forecasts...</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
            Production by County (MT) — Current vs AI Forecast {predictions.length > 0 ? "vs Weather-Adjusted" : ""}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis type="number" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis dataKey="county" type="category" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} width={80} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="current" fill="hsl(210 80% 55%)" radius={[0, 4, 4, 0]} name="Current" />
              <Bar dataKey="forecast" fill="hsl(152 60% 45%)" radius={[0, 4, 4, 0]} name="AI Forecast" />
              {predictions.length > 0 && (
                <Bar dataKey="weatherAdjusted" fill="hsl(36 80% 55%)" radius={[0, 4, 4, 0]} name="Weather-Adjusted" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countyProduction.map((county, i) => {
            const pred = predictions.find(p => p.county === county.county);
            return (
              <motion.div
                key={county.county}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold text-foreground">{county.county}</h4>
                  {pred && (
                    <span className={`text-[10px] font-bold uppercase ${riskColors[pred.weatherRisk]}`}>
                      {pred.weatherRisk}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Production: {county.production.toLocaleString()} MT</p>
                <p className="text-xs text-muted-foreground">AI Forecast: {county.forecast.toLocaleString()} MT</p>
                <div className="mt-2 flex items-center gap-1">
                  {pred?.salesTrend === "declining" ? (
                    <><TrendingDown className="h-3 w-3 text-chart-down" /><span className="text-xs font-semibold text-chart-down">Declining</span></>
                  ) : pred?.salesTrend === "increasing" ? (
                    <><TrendingUp className="h-3 w-3 text-chart-up" /><span className="text-xs font-semibold text-chart-up">+{county.change}%</span></>
                  ) : (
                    <><TrendingUp className="h-3 w-3 text-chart-up" /><span className="text-xs font-semibold text-chart-up">+{county.change}%</span></>
                  )}
                </div>
                {pred && (
                  <p className="mt-1 text-[10px] text-muted-foreground">{pred.rainfallOutlook}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
