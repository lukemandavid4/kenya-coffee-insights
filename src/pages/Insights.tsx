import { DashboardLayout } from "@/components/DashboardLayout";
import { InsightCard } from "@/components/InsightCard";
import { aiInsights } from "@/data/mockData";
import { fetchForecast, getAllCounties } from "@/services/weatherApi";
import { generateCountyPrediction, type CountyPrediction } from "@/services/predictionEngine";
import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Insights() {
  const [predictions, setPredictions] = useState<CountyPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const declining = predictions.filter(p => p.salesTrend === "declining");
  const increasing = predictions.filter(p => p.salesTrend === "increasing");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Predictions Engine</h1>
            <p className="text-sm text-muted-foreground">Weather-driven sales predictions & market forecasting signals</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-primary/20 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-primary">Prediction Engine Status</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Models active • Weather data: Live (OpenWeather) • Accuracy: 89.2% (30-day)
          </p>
          <div className="mt-3 flex gap-4">
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">Weather-Sales Model</p>
              <p className="text-xs font-semibold text-chart-up">Live</p>
            </div>
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">Price Forecast</p>
              <p className="text-xs font-semibold text-chart-up">Active</p>
            </div>
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">Production Model</p>
              <p className="text-xs font-semibold text-chart-up">Active</p>
            </div>
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">Demand Predictor</p>
              <p className="text-xs font-semibold text-accent">Training</p>
            </div>
          </div>
        </motion.div>

        {predictions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Weather-Based Sales Predictions
            </h3>

            {declining.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h4 className="text-sm font-semibold text-foreground">Declining Sales Predicted</h4>
                </div>
                {declining.map(p => (
                  <div key={p.county} className="mb-2 last:mb-0">
                    <span className="font-medium text-foreground">{p.county}</span>
                    <span className="text-muted-foreground text-sm"> — {p.rainfallOutlook}</span>
                    <div className="mt-1 text-xs text-muted-foreground">
                      7-day prediction: {p.predicted7Day} MT | 30-day: {p.predicted30Day} MT
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {increasing.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-xl border border-chart-up/20 bg-chart-up/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-chart-up" />
                  <h4 className="text-sm font-semibold text-foreground">Increasing Sales Predicted</h4>
                </div>
                {increasing.map(p => (
                  <div key={p.county} className="mb-2 last:mb-0">
                    <span className="font-medium text-foreground">{p.county}</span>
                    <span className="text-muted-foreground text-sm"> — {p.rainfallOutlook}</span>
                    <div className="mt-1 text-xs text-muted-foreground">
                      7-day prediction: {p.predicted7Day} MT | 30-day: {p.predicted30Day} MT
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Generating predictions...</p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Market Prediction Signals</h3>
          {aiInsights.map((insight, i) => (
            <InsightCard key={insight.id} {...insight} index={i} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
