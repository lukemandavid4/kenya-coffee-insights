import { DashboardLayout } from "@/components/DashboardLayout";
import { weatherData } from "@/data/mockData";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart, Area,
} from "recharts";
import { motion } from "framer-motion";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

export default function Weather() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Weather Impact Analysis</h1>
          <p className="text-sm text-muted-foreground">Climate patterns and their correlation with coffee yields</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Rainfall & Temperature Patterns</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="rainfall" fill="hsl(210 80% 55% / 0.6)" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
              <Line yAxisId="right" type="monotone" dataKey="temp" stroke="hsl(36 80% 55%)" strokeWidth={2.5} dot={{ r: 3 }} name="Temp (°C)" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Humidity Levels (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip {...ts} />
              <Area type="monotone" dataKey="humidity" fill="hsl(152 60% 45% / 0.1)" stroke="hsl(152 60% 45%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card border border-primary/20 p-5">
          <h3 className="mb-2 font-display text-sm font-semibold text-primary">AI Weather-Yield Correlation</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Analysis shows a strong positive correlation (r=0.82) between March-May rainfall and main crop yields.
            Counties receiving above 1,100mm annual rainfall consistently produce 15-20% more coffee per hectare.
            Current climate models suggest stable precipitation patterns for the 2025 season, supporting optimistic yield forecasts.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
