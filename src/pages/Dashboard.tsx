import { DashboardLayout } from "@/components/DashboardLayout";
import { KpiCard } from "@/components/KpiCard";
import { InsightCard } from "@/components/InsightCard";
import { aiInsights, countyProduction } from "@/data/mockData";
import { fetchForecast, getApiKey, setApiKey, getAllCounties } from "@/services/weatherApi";
import { generateCountyPrediction, type CountyPrediction } from "@/services/predictionEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AlertTriangle, CloudRain, TrendingDown, TrendingUp, Settings, Key } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

const riskColors: Record<string, string> = {
  low: "text-chart-up",
  medium: "text-accent",
  high: "text-chart-down",
  critical: "text-destructive",
};

export default function Dashboard() {
  const [apiKey, setKey] = useState(getApiKey());
  const [showKeyInput, setShowKeyInput] = useState(!getApiKey());
  const [predictions, setPredictions] = useState<CountyPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  const saveKey = () => {
    setApiKey(apiKey);
    setShowKeyInput(false);
    loadPredictions();
  };

  const loadPredictions = async () => {
    const key = getApiKey();
    if (!key) return;
    setLoading(true);
    const counties = getAllCounties();
    const results: CountyPrediction[] = [];
    for (const county of counties) {
      const forecasts = await fetchForecast(county);
      if (forecasts.length > 0) {
        results.push(generateCountyPrediction(county, forecasts));
      }
    }
    setPredictions(results);
    setLoading(false);
  };

  useEffect(() => {
    if (getApiKey()) loadPredictions();
  }, []);

  const totalPredicted7 = predictions.reduce((s, p) => s + p.predicted7Day, 0);
  const totalBaseline = predictions.reduce((s, p) => s + p.currentSales, 0);
  const overallChange = totalBaseline ? ((totalPredicted7 - totalBaseline) / totalBaseline * 100) : 0;
  const highRiskCounties = predictions.filter(p => p.weatherRisk === "high" || p.weatherRisk === "critical");

  const chartData = predictions.map(p => ({
    county: p.county,
    baseline: p.currentSales,
    predicted: p.predicted7Day,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Sales Predictions</h1>
            <p className="text-sm text-muted-foreground">AI-powered coffee sales forecasts based on real-time weather</p>
          </div>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Key className="h-3.5 w-3.5" />
            API Key
          </button>
        </div>

        {/* API Key Input */}
        {showKeyInput && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <p className="mb-2 text-sm font-medium text-foreground">Enter your OpenWeather API Key</p>
            <p className="mb-3 text-xs text-muted-foreground">
              Get a free key at{" "}
              <a href="https://openweathermap.org/api" target="_blank" rel="noopener" className="text-primary underline">
                openweathermap.org
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter API key..."
                className="flex-1 rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
              <button onClick={saveKey} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Save & Load
              </button>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Fetching weather data & generating predictions...</p>
          </div>
        )}

        {predictions.length > 0 && (
          <>
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Predicted 7-Day Sales (MT)" value={totalPredicted7} change={overallChange} index={0} />
              <KpiCard label="Baseline 7-Day Sales (MT)" value={totalBaseline} change={0} index={1} />
              <KpiCard label="Counties at Risk" value={highRiskCounties.length} change={highRiskCounties.length > 0 ? -highRiskCounties.length * 10 : 0} index={2} />
              <KpiCard label="Counties Monitored" value={predictions.length} change={0} index={3} />
            </div>

            {/* Alerts */}
            {highRiskCounties.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h3 className="font-display text-sm font-semibold text-destructive">Weather Risk Alerts</h3>
                </div>
                {highRiskCounties.map(c => (
                  <div key={c.county} className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{c.county}:</span> {c.rainfallOutlook}
                    {c.impactFactors.slice(0, 2).map((f, i) => <span key={i}> • {f}</span>)}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
              <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Predicted vs Baseline Sales by County (MT/week)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                  <XAxis dataKey="county" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                  <Tooltip {...ts} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="baseline" fill="hsl(210 80% 55%)" radius={[4, 4, 0, 0]} name="Baseline" />
                  <Bar dataKey="predicted" fill="hsl(152 60% 45%)" radius={[4, 4, 0, 0]} name="Predicted" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* County cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {predictions.map((p, i) => (
                <motion.div key={p.county} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-semibold text-foreground">{p.county}</h4>
                    <span className={`text-xs font-bold uppercase ${riskColors[p.weatherRisk]}`}>{p.weatherRisk}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">7-day forecast</span>
                      <span className="font-medium text-foreground">{p.predicted7Day} MT</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">30-day forecast</span>
                      <span className="font-medium text-foreground">{p.predicted30Day} MT</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {p.salesTrend === "increasing" ? <TrendingUp className="h-3 w-3 text-chart-up" /> :
                       p.salesTrend === "declining" ? <TrendingDown className="h-3 w-3 text-chart-down" /> :
                       <CloudRain className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-[10px] text-muted-foreground">{p.rainfallOutlook}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* AI Insights - always visible */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-foreground">AI Market Predictions</h3>
          {aiInsights.slice(0, 3).map((insight, i) => (
            <InsightCard key={insight.id} {...insight} index={i} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
