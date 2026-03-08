import { DashboardLayout } from "@/components/DashboardLayout";
import { countyProduction } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

export default function Production() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Production Forecast</h1>
          <p className="text-sm text-muted-foreground">County-level production data & AI yield predictions</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Production by County (MT) — Actual vs Forecast</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={countyProduction} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis type="number" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis dataKey="county" type="category" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} width={80} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="production" fill="hsl(210 80% 55%)" radius={[0, 4, 4, 0]} name="Actual" />
              <Bar dataKey="forecast" fill="hsl(152 60% 45%)" radius={[0, 4, 4, 0]} name="Forecast" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countyProduction.map((county, i) => (
            <motion.div
              key={county.county}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <h4 className="font-display text-sm font-semibold text-foreground">{county.county}</h4>
              <p className="mt-1 text-xs text-muted-foreground">Production: {county.production.toLocaleString()} MT</p>
              <p className="text-xs text-muted-foreground">Forecast: {county.forecast.toLocaleString()} MT</p>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-chart-up" />
                <span className="text-xs font-semibold text-chart-up">+{county.change}%</span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Avg. Rainfall: {county.rainfall}mm</p>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
