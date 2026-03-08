import { DashboardLayout } from "@/components/DashboardLayout";
import { countyProduction } from "@/data/mockData";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Droplets } from "lucide-react";
import { useState } from "react";

export default function CountyMap() {
  const [selected, setSelected] = useState(countyProduction[0]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">County Map</h1>
          <p className="text-sm text-muted-foreground">Interactive coffee-producing regions of Kenya</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* County selector grid */}
          <div className="space-y-2 lg:col-span-1">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select County</h3>
            {countyProduction.map((county, i) => (
              <motion.button
                key={county.county}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(county)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  selected.county === county.county
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/30 bg-card/50 hover:border-border"
                }`}
              >
                <MapPin className={`h-4 w-4 ${selected.county === county.county ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{county.county}</p>
                  <p className="text-[10px] text-muted-foreground">{county.production.toLocaleString()} MT</p>
                </div>
                <span className="text-xs font-semibold text-chart-up">+{county.change}%</span>
              </motion.button>
            ))}
          </div>

          {/* County detail */}
          <motion.div
            key={selected.county}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{selected.county} County</h2>
                <p className="text-sm text-muted-foreground">Central Kenya Coffee Region</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Production</p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">{selected.production.toLocaleString()} MT</p>
              </div>
              <div className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Forecast</p>
                <p className="mt-1 font-display text-2xl font-bold text-primary">{selected.forecast.toLocaleString()} MT</p>
              </div>
              <div className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-up" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Growth</p>
                </div>
                <p className="mt-1 font-display text-2xl font-bold text-chart-up">+{selected.change}%</p>
              </div>
              <div className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-chart-blue" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Avg. Rainfall</p>
                </div>
                <p className="mt-1 font-display text-2xl font-bold text-chart-blue">{selected.rainfall}mm</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary">AI Prediction</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.county} county is expected to see a {selected.change}% increase in production next season,
                driven by favorable rainfall patterns averaging {selected.rainfall}mm annually.
                The forecast model confidence is 85%.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
