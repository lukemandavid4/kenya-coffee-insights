import { DashboardLayout } from "@/components/DashboardLayout";
import { InsightCard } from "@/components/InsightCard";
import { aiInsights } from "@/data/mockData";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Market Intelligence</h1>
            <p className="text-sm text-muted-foreground">Machine learning-powered predictions & market signals</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-primary/20 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-primary">AI Engine Status</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Models last trained: 2 hours ago • Dataset: 48,500 auction records • Accuracy: 89.2% (30-day forecast)
          </p>
          <div className="mt-3 flex gap-4">
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">LSTM</p>
              <p className="text-xs font-semibold text-chart-up">Active</p>
            </div>
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">XGBoost</p>
              <p className="text-xs font-semibold text-chart-up">Active</p>
            </div>
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">Prophet</p>
              <p className="text-xs font-semibold text-chart-up">Active</p>
            </div>
            <div className="rounded-md bg-secondary/50 px-3 py-1.5">
              <p className="text-[10px] text-muted-foreground">Random Forest</p>
              <p className="text-xs font-semibold text-chart-accent">Training</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Predictions</h3>
          {aiInsights.map((insight, i) => (
            <InsightCard key={insight.id} {...insight} index={i} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
