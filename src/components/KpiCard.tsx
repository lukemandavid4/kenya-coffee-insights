import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface KpiCardProps {
  label: string;
  value: string | number;
  change: number;
  index?: number;
}

export function KpiCard({ label, value, change, index = 0 }: KpiCardProps) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card p-5"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <div className="mt-2 flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 text-chart-up" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-chart-down" />
        )}
        <span
          className={`text-xs font-semibold ${isPositive ? "text-chart-up" : "text-chart-down"}`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </motion.div>
  );
}
