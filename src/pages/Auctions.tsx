import { DashboardLayout } from "@/components/DashboardLayout";
import { auctionData, forecastData } from "@/data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
} from "recharts";
import { motion } from "framer-motion";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

export default function Auctions() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Auction Analytics</h1>
          <p className="text-sm text-muted-foreground">Nairobi Coffee Exchange price trends & AI predictions</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Historical Price by Grade (KES/bag)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={auctionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="gradeAA" stroke="hsl(152 60% 45%)" strokeWidth={2.5} dot={{ r: 3 }} name="Grade AA" />
              <Line type="monotone" dataKey="gradeAB" stroke="hsl(210 80% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Grade AB" />
              <Line type="monotone" dataKey="gradePB" stroke="hsl(36 80% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Grade PB" />
              <Line type="monotone" dataKey="gradeC" stroke="hsl(215 20% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Grade C" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-foreground">AI Price Forecast — Grade AA (KES/bag)</h3>
          <p className="mb-4 text-xs text-muted-foreground">Predicted range with 90% confidence interval</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} domain={["dataMin - 2000", "dataMax + 2000"]} />
              <Tooltip {...ts} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(152 60% 45% / 0.1)" name="Upper Bound" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(152 60% 45% / 0.1)" name="Lower Bound" />
              <Line type="monotone" dataKey="predicted" stroke="hsl(152 60% 45%)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 4 }} name="Predicted" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent auction table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden">
          <div className="border-b border-border/50 px-5 py-3">
            <h3 className="font-display text-sm font-semibold text-foreground">Recent Auction Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">AA</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">AB</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">PB</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">C</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Volume</th>
                </tr>
              </thead>
              <tbody>
                {auctionData.slice().reverse().map((row) => (
                  <tr key={row.date} className="border-b border-border/20 transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3 font-medium text-foreground">{row.date}</td>
                    <td className="px-5 py-3 text-right text-chart-up">{row.gradeAA.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-chart-blue">{row.gradeAB.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-chart-accent">{row.gradePB.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{row.gradeC.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-foreground">{row.volume.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
