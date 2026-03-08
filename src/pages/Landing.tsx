import { Coffee, BarChart3, Brain, Map, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { icon: Brain, title: "AI Forecasting", desc: "LSTM & Prophet models predict prices, production, and demand trends" },
  { icon: BarChart3, title: "Auction Analytics", desc: "Real-time insights from Nairobi Coffee Exchange historical data" },
  { icon: Map, title: "County Intelligence", desc: "Interactive map with production data across all coffee regions" },
  { icon: TrendingUp, title: "Market Tracking", desc: "Global arabica & robusta price correlation analysis" },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-border/30 px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Coffee className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">KCIP</span>
        </div>
        <Link
          to="/dashboard"
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Open Platform
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <div className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary">AI-Powered Analytics</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
            Kenya Coffee
            <br />
            <span className="text-gradient-primary">Intelligence Platform</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Predict production levels, forecast auction prices, and understand market trends with
            AI-driven insights for the Kenyan coffee industry.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Enter Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/insights"
              className="rounded-lg border border-border bg-secondary px-6 py-3 font-display text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              View AI Insights
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="glass-card p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Kenya Coffee Intelligence Platform. Data-driven decisions for the coffee industry.
        </p>
      </footer>
    </div>
  );
}
