import { DashboardLayout } from "@/components/DashboardLayout";
import { globalMarketData } from "@/data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

// Convert USD to KES (approx rate)
const USD_TO_KES = 129.5;

const globalMarketKES = globalMarketData.map(d => ({
  date: d.date,
  kenyan: Math.round(d.kenyan * USD_TO_KES),
  arabica: Math.round(d.arabica * USD_TO_KES),
  robusta: Math.round(d.robusta * USD_TO_KES),
}));

const futurePredictions = [
  { date: "2025-01", kenyan: Math.round(305.2 * USD_TO_KES), arabica: Math.round(222.1 * USD_TO_KES), robusta: Math.round(123.5 * USD_TO_KES) },
  { date: "2025-02", kenyan: Math.round(312.8 * USD_TO_KES), arabica: Math.round(226.4 * USD_TO_KES), robusta: Math.round(126.2 * USD_TO_KES) },
  { date: "2025-03", kenyan: Math.round(318.5 * USD_TO_KES), arabica: Math.round(230.8 * USD_TO_KES), robusta: Math.round(128.9 * USD_TO_KES) },
  { date: "2025-04", kenyan: Math.round(310.2 * USD_TO_KES), arabica: Math.round(227.3 * USD_TO_KES), robusta: Math.round(125.8 * USD_TO_KES) },
  { date: "2025-05", kenyan: Math.round(325.6 * USD_TO_KES), arabica: Math.round(235.1 * USD_TO_KES), robusta: Math.round(131.5 * USD_TO_KES) },
  { date: "2025-06", kenyan: Math.round(332.1 * USD_TO_KES), arabica: Math.round(240.2 * USD_TO_KES), robusta: Math.round(134.8 * USD_TO_KES) },
];

const marketKpis = [
  { label: "Kenyan AA Predicted (90d)", value: `KES ${Math.round(318.5 * USD_TO_KES).toLocaleString()}/lb`, change: 6.6, up: true },
  { label: "Global Arabica Predicted (90d)", value: `KES ${Math.round(230.8 * USD_TO_KES).toLocaleString()}/lb`, change: 5.6, up: true },
  { label: "Kenyan Premium Forecast", value: "38.2%", change: 1.5, up: true },
  { label: "Predicted Demand Growth", value: "+15.2%", change: 15.2, up: true },
];

export default function Market() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Market Forecast</h1>
          <p className="text-sm text-muted-foreground">AI-predicted global coffee prices & Kenyan market outlook (KES)</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketKpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
              </div>
              <p className="mt-2 font-display text-xl font-bold text-foreground">{kpi.value}</p>
              <div className="mt-1 flex items-center gap-1">
                {kpi.up ? <TrendingUp className="h-3 w-3 text-chart-up" /> : <TrendingDown className="h-3 w-3 text-chart-down" />}
                <span className={`text-xs font-semibold ${kpi.up ? "text-chart-up" : "text-chart-down"}`}>
                  +{kpi.change}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-foreground">Predicted Forward Curve (KES/lb)</h3>
          <p className="mb-4 text-xs text-muted-foreground">6-month price prediction using LSTM + global demand models</p>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={futurePredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip {...ts} formatter={(value: number) => `KES ${value.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="kenyan" stroke="hsl(152 60% 45%)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4 }} name="Kenyan (Predicted)" />
              <Line type="monotone" dataKey="arabica" stroke="hsl(36 80% 55%)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4 }} name="Arabica (Predicted)" />
              <Line type="monotone" dataKey="robusta" stroke="hsl(215 20% 55%)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4 }} name="Robusta (Predicted)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Historical Price Data (KES)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={globalMarketKES}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip {...ts} formatter={(value: number) => `KES ${value.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="kenyan" stroke="hsl(152 60% 45%)" strokeWidth={2} dot={{ r: 2 }} name="Kenyan" />
              <Line type="monotone" dataKey="arabica" stroke="hsl(36 80% 55%)" strokeWidth={1.5} dot={{ r: 2 }} name="Arabica" />
              <Line type="monotone" dataKey="robusta" stroke="hsl(215 20% 55%)" strokeWidth={1.5} dot={{ r: 2 }} name="Robusta" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card border border-primary/20 p-5">
          <h3 className="mb-2 font-display text-sm font-semibold text-primary">AI Market Prediction</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Our model predicts Kenyan coffee will reach <span className="font-semibold text-primary">KES {Math.round(332.1 * USD_TO_KES).toLocaleString()}/lb</span> within 6 months, 
            maintaining a 38% premium over global arabica. Key drivers: European specialty demand up 15% YoY, 
            Brazilian supply constraints from La Niña, and reduced Kenyan output from weather-affected counties. 
            <span className="font-semibold text-accent"> Optimal selling window: March–May 2025</span> when demand peaks align with limited supply.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
