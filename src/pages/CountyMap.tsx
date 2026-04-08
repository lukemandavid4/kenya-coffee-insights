import { DashboardLayout } from "@/components/DashboardLayout";
import { KenyaMap } from "@/components/KenyaMap";
import { countyProduction } from "@/data/mockData";
import { fetchForecast, getApiKey, getAllCounties } from "@/services/weatherApi";
import { generateCountyPrediction, type CountyPrediction } from "@/services/predictionEngine";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, TrendingDown, Droplets, AlertTriangle, CloudRain } from "lucide-react";
import { useState, useEffect } from "react";

const riskBg: Record<string, string> = {
  low: "border-chart-up/20 bg-chart-up/5",
  medium: "border-accent/20 bg-accent/5",
  high: "border-chart-down/20 bg-chart-down/5",
  critical: "border-destructive/20 bg-destructive/5",
};

export default function CountyMap() {
  const [selected, setSelected] = useState("Nyeri");
  const [predictions, setPredictions] = useState<Record<string, CountyPrediction>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getApiKey()) return;
    setLoading(true);
    const load = async () => {
      const counties = getAllCounties();
      const result: Record<string, CountyPrediction> = {};
      for (const county of counties) {
        const forecasts = await fetchForecast(county);
        if (forecasts.length > 0) result[county] = generateCountyPrediction(county, forecasts);
      }
      setPredictions(result);
      setLoading(false);
    };
    load();
  }, []);

  const pred = predictions[selected];
  const countyInfo = countyProduction.find(c => c.county === selected);
  const mapData: Record<string, { risk: string; sales: number }> = {};
  Object.entries(predictions).forEach(([c, p]) => {
    mapData[c] = { risk: p.weatherRisk, sales: p.predicted7Day };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Kenya Coffee Map</h1>
          <p className="text-sm text-muted-foreground">Interactive map with real-time weather-based sales predictions</p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading weather predictions for all counties...</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Coffee Producing Regions</h3>
            <KenyaMap
              selectedCounty={selected}
              onSelectCounty={setSelected}
              countyData={mapData}
            />
          </motion.div>

          {/* County Detail */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{selected}</h2>
                  <p className="text-xs text-muted-foreground">Coffee Producing County</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Production</p>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">
                    {countyInfo?.production.toLocaleString() || "—"} MT
                  </p>
                </div>
                <div className="rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Predicted 7-Day Sales</p>
                  <p className="mt-1 font-display text-xl font-bold text-primary">
                    {pred ? `${pred.predicted7Day} MT` : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">30-Day Forecast</p>
                  <p className="mt-1 font-display text-xl font-bold text-foreground">
                    {pred ? `${pred.predicted30Day} MT` : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-border/30 bg-secondary/30 p-3">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-chart-blue" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rainfall</p>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold text-chart-blue">
                    {countyInfo?.rainfall || "—"} mm
                  </p>
                </div>
              </div>
            </div>

            {/* Prediction card */}
            {pred && (
              <div className={`rounded-xl border p-4 ${riskBg[pred.weatherRisk]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {pred.weatherRisk === "high" || pred.weatherRisk === "critical" ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CloudRain className="h-4 w-4 text-primary" />
                  )}
                  <p className="text-xs font-semibold uppercase text-foreground">
                    Weather Risk: {pred.weatherRisk}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pred.rainfallOutlook}</p>
                <div className="flex items-center gap-1 mb-2">
                  {pred.salesTrend === "increasing" ? <TrendingUp className="h-3 w-3 text-chart-up" /> : 
                   pred.salesTrend === "declining" ? <TrendingDown className="h-3 w-3 text-chart-down" /> : null}
                  <span className="text-xs font-medium text-foreground">Sales trend: {pred.salesTrend}</span>
                </div>
                <ul className="space-y-1">
                  {pred.impactFactors.map((f, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {!pred && !loading && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">
                  Add your OpenWeather API key in the Dashboard to see real-time weather predictions for {selected}.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
