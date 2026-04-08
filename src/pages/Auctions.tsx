import { DashboardLayout } from "@/components/DashboardLayout";
import { auctionData, forecastData } from "@/data/mockData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const ts = {
  contentStyle: { background: "hsl(222 41% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: "8px", fontSize: "12px" },
  labelStyle: { color: "hsl(210 40% 93%)" },
};

// Generate extended forecast with different timeframes
const forecast7 = forecastData.slice(0, 2);
const forecast30 = forecastData.slice(0, 4);
const forecast90 = forecastData;

export default function Auctions() {
  const latestPrice = auctionData[auctionData.length - 1].gradeAA;
  const prevPrice = auctionData[auctionData.length - 2].gradeAA;
  const change = ((latestPrice - prevPrice) / prevPrice * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Price Forecast</h1>
          <p className="text-sm text-muted-foreground">AI-predicted coffee auction prices for Grade AA, AB, PB, C</p>
        </div>

        {/* Prediction KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Current AA Price</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">KES {latestPrice.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-chart-up" />
              <span className="text-xs text-chart-up">+{change}% vs last month</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">7-Day Prediction</p>
            <p className="mt-1 font-display text-2xl font-bold text-primary">KES {forecastData[0].predicted.toLocaleString()}</p>
            <span className="text-xs text-chart-up">+{((forecastData[0].predicted - latestPrice) / latestPrice * 100).toFixed(1)}%</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">30-Day Prediction</p>
            <p className="mt-1 font-display text-2xl font-bold text-accent">KES {forecastData[2].predicted.toLocaleString()}</p>
            <span className="text-xs text-chart-up">+{((forecastData[2].predicted - latestPrice) / latestPrice * 100).toFixed(1)}%</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">90-Day Prediction</p>
            <p className="mt-1 font-display text-2xl font-bold text-chart-blue">KES {forecastData[5].predicted.toLocaleString()}</p>
            <span className="text-xs text-chart-up">+{((forecastData[5].predicted - latestPrice) / latestPrice * 100).toFixed(1)}%</span>
          </motion.div>
        </div>

        {/* AI Forecast chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <h3 className="mb-1 font-display text-sm font-semibold text-foreground">AI Price Prediction — Grade AA (KES/bag)</h3>
          <p className="mb-4 text-xs text-muted-foreground">Predicted price with 90% confidence interval • LSTM + Prophet ensemble</p>
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

        {/* Historical + predicted overlay */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Historical Prices + Forward Curve</h3>
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

        {/* AI prediction insight */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card border border-primary/20 p-5">
          <h3 className="mb-2 font-display text-sm font-semibold text-primary">AI Price Prediction Summary</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Our ensemble model (LSTM + Prophet + XGBoost) predicts Grade AA prices will reach <span className="font-semibold text-primary">KES {forecastData[5].predicted.toLocaleString()}/bag</span> within 
            90 days, representing a {((forecastData[5].predicted - latestPrice) / latestPrice * 100).toFixed(1)}% increase. 
            Key drivers include reduced supply from drought-affected regions, rising global arabica demand, and seasonal harvest patterns. 
            The model recommends <span className="font-semibold text-accent">holding inventory</span> for sellers to maximize returns during the predicted price peak in Q2 2025.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
