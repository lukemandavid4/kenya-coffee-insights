import { DashboardLayout } from "@/components/DashboardLayout";
import { globalMarketData } from "@/data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

// Generate forward predictions
const lastEntry = globalMarketData[globalMarketData.length - 1];
const futurePredictions = [
  { date: "2025-01", kenyan: 305.2, arabica: 222.1, robusta: 123.5, predicted: true },
  { date: "2025-02", kenyan: 312.8, arabica: 226.4, robusta: 126.2, predicted: true },
  { date: "2025-03", kenyan: 318.5, arabica: 230.8, robusta: 128.9, predicted: true },
  { date: "2025-04", kenyan: 310.2, arabica: 227.3, robusta: 125.8, predicted: true },
  { date: "2025-05", kenyan: 325.6, arabica: 235.1, robusta: 131.5, predicted: true },
  { date: "2025-06", kenyan: 332.1, arabica: 240.2, robusta: 134.8, predicted: true },
];

const marketKpis = [
  { label: "Kenyan AA Predicted (90d)", value: "$318.50/lb", change: 6.6, up: true },
  { label: "Global Arabica Predicted (90d)", value: "$230.80/lb", change: 5.6, up: true },
  { label: "Kenyan Premium Forecast", value: "38.2%", change: 1.5, up: true },
  { label: "Predicted Demand Growth", value: "+15.2%", change: 15.2, up: true },
];

export default function Market() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Market Forecast</h1>
          <p className="text-sm text-muted-foreground">AI-predicted global coffee prices & Kenyan market outlook</p>
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

        {/* Predicted forward curve */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-foreground">Predicted Forward Curve (USD/lb)</h3>
          <p className="mb-4 text-xs text-muted-foreground">6-month price prediction using LSTM + global demand models</p>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={futurePredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="kenyan" stroke="hsl(152 60% 45%)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4 }} name="Kenyan (Predicted)" />
              <Line type="monotone" dataKey="arabica" stroke="hsl(36 80% 55%)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4 }} name="Arabica (Predicted)" />
              <Line type="monotone" dataKey="robusta" stroke="hsl(215 20% 55%)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4 }} name="Robusta (Predicted)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Historical for context */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Historical Price Data (Reference)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={globalMarketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip {...ts} />
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
            Our model predicts Kenyan coffee will reach <span className="font-semibold text-primary">$332/lb</span> within 6 months, 
            maintaining a 38% premium over global arabica. Key drivers: European specialty demand up 15% YoY, 
            Brazilian supply constraints from La Niña, and reduced Kenyan output from weather-affected counties. 
            <span className="font-semibold text-accent"> Optimal selling window: March–May 2025</span> when demand peaks align with limited supply.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
