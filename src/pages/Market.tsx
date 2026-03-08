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

const marketKpis = [
  { label: "Arabica Futures", value: "$218.50/lb", change: 18.0, icon: TrendingUp },
  { label: "Robusta Futures", value: "$120.60/lb", change: 22.4, icon: TrendingUp },
  { label: "Kenyan Premium", value: "$298.80/lb", change: 21.5, icon: TrendingUp },
  { label: "KES/USD Rate", value: "153.20", change: -2.1, icon: TrendingDown },
];

export default function Market() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Global Market Tracker</h1>
          <p className="text-sm text-muted-foreground">Coffee futures & international market indicators</p>
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
                <kpi.icon className={`h-3 w-3 ${kpi.change >= 0 ? "text-chart-up" : "text-chart-down"}`} />
                <span className={`text-xs font-semibold ${kpi.change >= 0 ? "text-chart-up" : "text-chart-down"}`}>
                  {kpi.change >= 0 ? "+" : ""}{kpi.change}% YTD
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Global Coffee Price Comparison (USD/lb)</h3>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={globalMarketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="kenyan" stroke="hsl(152 60% 45%)" strokeWidth={2.5} dot={{ r: 3 }} name="Kenyan" />
              <Line type="monotone" dataKey="arabica" stroke="hsl(36 80% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Arabica Global" />
              <Line type="monotone" dataKey="robusta" stroke="hsl(215 20% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Robusta" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card border border-primary/20 p-5">
          <h3 className="mb-2 font-display text-sm font-semibold text-primary">AI Market Analysis</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Kenyan coffee maintains a 36% premium over global arabica averages, driven by specialty grade quality.
            The AI model predicts this premium will hold steady at 33-38% through Q2 2025.
            Rising robusta prices are shifting blender demand toward high-quality arabica, benefiting Kenyan AA and AB grades.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
