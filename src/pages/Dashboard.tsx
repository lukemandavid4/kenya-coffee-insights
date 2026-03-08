import { DashboardLayout } from "@/components/DashboardLayout";
import { KpiCard } from "@/components/KpiCard";
import { InsightCard } from "@/components/InsightCard";
import { kpiData, auctionData, aiInsights, demandTrends } from "@/data/mockData";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, Legend,
} from "recharts";
import { motion } from "framer-motion";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

export default function Dashboard() {
  const kpis = Object.values(kpiData);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Kenya coffee market overview & AI predictions</p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} change={kpi.change} index={i} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Price Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card col-span-2 p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Auction Price Trends (KES/bag)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={auctionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="gradeAA" stroke="hsl(152 60% 45%)" strokeWidth={2} dot={false} name="AA" />
                <Line type="monotone" dataKey="gradeAB" stroke="hsl(210 80% 55%)" strokeWidth={2} dot={false} name="AB" />
                <Line type="monotone" dataKey="gradePB" stroke="hsl(36 80% 55%)" strokeWidth={2} dot={false} name="PB" />
                <Line type="monotone" dataKey="gradeC" stroke="hsl(215 20% 55%)" strokeWidth={2} dot={false} name="C" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* AI Insights Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
            <h3 className="font-display text-sm font-semibold text-foreground">AI Market Intelligence</h3>
            {aiInsights.slice(0, 3).map((insight, i) => (
              <InsightCard key={insight.id} {...insight} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Demand Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Demand Trends (MT)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={demandTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="domestic" fill="hsl(36 80% 55%)" radius={[4, 4, 0, 0]} name="Domestic" />
                <Bar dataKey="export" fill="hsl(152 60% 45%)" radius={[4, 4, 0, 0]} name="Export" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Volume */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Auction Volume (bags)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={auctionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="volume" stroke="hsl(210 80% 55%)" fill="hsl(210 80% 55% / 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
