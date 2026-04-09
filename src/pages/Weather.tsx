import { DashboardLayout } from "@/components/DashboardLayout";
import { fetchForecast, fetchCurrentWeather, getAllCounties, type WeatherForecast, type CurrentWeather } from "@/services/weatherApi";
import { predictSales, type SalesPrediction } from "@/services/predictionEngine";
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CloudRain, Thermometer, Droplets, MapPin, Wind } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

const riskColors: Record<string, string> = {
  low: "text-chart-up", medium: "text-accent", high: "text-chart-down", critical: "text-destructive",
};

const counties = getAllCounties();

export default function Weather() {
  const [selected, setSelected] = useState("Nyeri");
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [predictions, setPredictions] = useState<SalesPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      const [fc, cur] = await Promise.all([
        fetchForecast(selected),
        fetchCurrentWeather(selected),
      ]);
      setForecasts(fc);
      setCurrent(cur);
      if (fc.length > 0) setPredictions(predictSales(selected, fc));
      setLoading(false);
    };
    load();
  }, [selected]);

  const hasData = forecasts.length > 0;

  const chartData = forecasts.map((fc, i) => ({
    date: fc.date.slice(5),
    rainfall: fc.rainfall,
    temp: fc.temp,
    humidity: fc.humidity,
    predictedSales: predictions[i]?.predictedSales || 0,
    baselineSales: predictions[i]?.baselineSales || 0,
    impact: predictions[i]?.weatherImpact || 0,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Weather & Sales Forecast</h1>
          <p className="text-sm text-muted-foreground">Real-time weather predictions and their impact on coffee sales</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {counties.map((county) => (
            <button
              key={county}
              onClick={() => setSelected(county)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                selected === county
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/30 bg-card/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <MapPin className="h-3 w-3" />
              {county}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-3 p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Fetching weather for {selected}...</p>
          </div>
        )}

        {current && (
          <motion.div key={selected + "-current"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-4">
            <div className="glass-card flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Thermometer className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Current Temp</p>
                <p className="font-display text-xl font-bold text-foreground">{current.temp.toFixed(1)}°C</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-blue/10">
                <CloudRain className="h-5 w-5 text-chart-blue" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Rainfall</p>
                <p className="font-display text-xl font-bold text-foreground">{current.rainfall}mm</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Humidity</p>
                <p className="font-display text-xl font-bold text-foreground">{current.humidity}%</p>
              </div>
            </div>
            <div className="glass-card flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Wind className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Wind</p>
                <p className="font-display text-xl font-bold text-foreground">{current.windSpeed} m/s</p>
              </div>
            </div>
          </motion.div>
        )}

        {hasData && (
          <>
            <motion.div key={selected + "-sales"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
              <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
                {selected} — Rainfall vs Predicted Sales
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} label={{ value: "mm", angle: -90, position: "insideLeft", fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} label={{ value: "MT", angle: 90, position: "insideRight", fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                  <Tooltip {...ts} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="rainfall" fill="hsl(210 80% 55% / 0.6)" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                  <Line yAxisId="right" type="monotone" dataKey="predictedSales" stroke="hsl(152 60% 45%)" strokeWidth={2.5} dot={{ r: 4 }} name="Predicted Sales (MT)" />
                  <Line yAxisId="right" type="monotone" dataKey="baselineSales" stroke="hsl(215 20% 55%)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Baseline (MT)" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div key={selected + "-impact"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
                {selected} — Temperature & Humidity Forecast
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip {...ts} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="hsl(36 80% 55%)" strokeWidth={2.5} dot={{ r: 3 }} name="Temp (°C)" />
                  <Area yAxisId="right" type="monotone" dataKey="humidity" fill="hsl(152 60% 45% / 0.1)" stroke="hsl(152 60% 45%)" strokeWidth={2} name="Humidity (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
              <div className="border-b border-border/50 px-5 py-3">
                <h3 className="font-display text-sm font-semibold text-foreground">Daily Sales Prediction — {selected}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Rain</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Temp</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Predicted</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">Impact</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted-foreground">Risk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Key Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((p) => (
                      <tr key={p.date} className="border-b border-border/20 hover:bg-secondary/30">
                        <td className="px-4 py-3 font-medium text-foreground">{p.date}</td>
                        <td className="px-4 py-3 text-right text-chart-blue">
                          {forecasts.find(f => f.date === p.date)?.rainfall.toFixed(1)}mm
                        </td>
                        <td className="px-4 py-3 text-right text-accent">
                          {forecasts.find(f => f.date === p.date)?.temp.toFixed(1)}°C
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">{p.predictedSales} MT</td>
                        <td className={`px-4 py-3 text-right font-semibold ${p.weatherImpact >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                          {p.weatherImpact >= 0 ? "+" : ""}{p.weatherImpact.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${riskColors[p.riskLevel]}`}>
                            {p.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{p.factors[0] || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
