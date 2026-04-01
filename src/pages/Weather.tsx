import { DashboardLayout } from "@/components/DashboardLayout";
import { countyWeatherData, countyProduction } from "@/data/mockData";
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart,
} from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { CloudRain, Thermometer, Droplets, MapPin } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

const counties = Object.keys(countyWeatherData);

function getSummary(data: { rainfall: number; temp: number; humidity: number }[]) {
  const totalRainfall = data.reduce((s, d) => s + d.rainfall, 0);
  const avgTemp = (data.reduce((s, d) => s + d.temp, 0) / data.length).toFixed(1);
  const avgHumidity = Math.round(data.reduce((s, d) => s + d.humidity, 0) / data.length);
  return { totalRainfall, avgTemp, avgHumidity };
}

export default function Weather() {
  const [selected, setSelected] = useState("Nyeri");
  const data = countyWeatherData[selected];
  const summary = getSummary(data);
  const countyInfo = countyProduction.find((c) => c.county === selected);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">County Weather Analysis</h1>
          <p className="text-sm text-muted-foreground">Climate patterns by coffee-producing county and their impact on yields</p>
        </div>

        {/* County selector */}
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

        {/* Summary KPIs */}
        <motion.div
          key={selected + "-kpis"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-blue/10">
              <CloudRain className="h-5 w-5 text-chart-blue" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Annual Rainfall</p>
              <p className="font-display text-xl font-bold text-foreground">{summary.totalRainfall.toLocaleString()} mm</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Thermometer className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Avg Temperature</p>
              <p className="font-display text-xl font-bold text-foreground">{summary.avgTemp}°C</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Avg Humidity</p>
              <p className="font-display text-xl font-bold text-foreground">{summary.avgHumidity}%</p>
            </div>
          </div>
        </motion.div>

        {/* Rainfall & Temperature chart */}
        <motion.div key={selected + "-rain"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
            {selected} — Rainfall & Temperature
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} label={{ value: "mm", angle: -90, position: "insideLeft", fill: "hsl(215 20% 55%)", fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} label={{ value: "°C", angle: 90, position: "insideRight", fill: "hsl(215 20% 55%)", fontSize: 10 }} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="rainfall" fill="hsl(210 80% 55% / 0.6)" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
              <Line yAxisId="right" type="monotone" dataKey="temp" stroke="hsl(36 80% 55%)" strokeWidth={2.5} dot={{ r: 3 }} name="Temp (°C)" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Humidity chart */}
        <motion.div key={selected + "-hum"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
            {selected} — Humidity Levels (%)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} domain={[40, 100]} />
              <Tooltip {...ts} />
              <Area type="monotone" dataKey="humidity" fill="hsl(152 60% 45% / 0.1)" stroke="hsl(152 60% 45%)" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI insight */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card border border-primary/20 p-5">
          <h3 className="mb-2 font-display text-sm font-semibold text-primary">AI Weather-Yield Insight — {selected}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {selected} county receives approximately {summary.totalRainfall.toLocaleString()}mm of annual rainfall with an average
            temperature of {summary.avgTemp}°C.
            {countyInfo
              ? ` Current production stands at ${countyInfo.production.toLocaleString()} MT with a forecasted growth of ${countyInfo.change}%. The climate model confidence for this region is 85%.`
              : " Climate data suggests stable conditions for the upcoming growing season."}
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
