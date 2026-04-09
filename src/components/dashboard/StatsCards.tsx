import { motion } from "framer-motion";
import { Globe, BarChart3, Percent, TrendingUp } from "lucide-react";

const stats = [
  { icon: Globe, label: "Total Market Cap", value: "$2.87T", sub: "Global assets", color: "text-primary" },
  { icon: BarChart3, label: "24h Volume", value: "$142.8B", sub: "Across all markets", color: "text-chart-blue" },
  { icon: Percent, label: "BTC Dominance", value: "54.2%", sub: "Market share", color: "text-chart-amber" },
  { icon: TrendingUp, label: "Active Assets", value: "12,847", sub: "Tradeable pairs", color: "text-chart-green" },
];

const StatsCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {stats.map((s, i) => (
      <motion.div
        key={s.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
        className="glass-card p-5 flex items-start gap-4 hover:border-primary/30 transition-colors group"
      >
        <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
          <s.icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{s.label}</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default StatsCards;
