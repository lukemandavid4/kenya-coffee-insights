import { TrendingUp, TrendingDown, AlertTriangle, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface InsightCardProps {
  type: "bullish" | "bearish" | "warning" | "neutral";
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  index?: number;
}

const typeConfig = {
  bullish: { icon: TrendingUp, color: "text-chart-up", bg: "bg-chart-up/10", border: "border-chart-up/20" },
  bearish: { icon: TrendingDown, color: "text-chart-down", bg: "bg-chart-down/10", border: "border-chart-down/20" },
  warning: { icon: AlertTriangle, color: "text-chart-accent", bg: "bg-chart-accent/10", border: "border-chart-accent/20" },
  neutral: { icon: Minus, color: "text-chart-neutral", bg: "bg-chart-neutral/10", border: "border-chart-neutral/20" },
};

export function InsightCard({ type, title, description, confidence, timeframe, index = 0 }: InsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`glass-card border ${config.border} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-display text-sm font-semibold text-foreground">{title}</h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{confidence}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground">•</span>
            <span className="text-[10px] text-muted-foreground">{timeframe}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
