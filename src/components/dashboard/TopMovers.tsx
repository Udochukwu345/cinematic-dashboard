import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const movers = [
  { name: "Bitcoin", symbol: "BTC", price: "$67,234", change: "+2.34%", up: true },
  { name: "Ethereum", symbol: "ETH", price: "$3,456", change: "-0.87%", up: false },
  { name: "Solana", symbol: "SOL", price: "$142.67", change: "+5.21%", up: true },
  { name: "Cardano", symbol: "ADA", price: "$0.62", change: "+3.14%", up: true },
  { name: "Polkadot", symbol: "DOT", price: "$7.82", change: "-1.45%", up: false },
  { name: "Avalanche", symbol: "AVAX", price: "$38.91", change: "+4.67%", up: true },
];

const TopMovers = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="glass-card p-6"
  >
    <h3 className="text-sm font-semibold text-foreground mb-4">Top Movers</h3>
    <div className="space-y-3">
      {movers.map((m, i) => (
        <motion.div
          key={m.symbol}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + i * 0.05 }}
          className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
              {m.symbol.slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground font-mono">{m.price}</p>
            <p className={`text-xs font-medium flex items-center gap-0.5 justify-end ${m.up ? "text-chart-green" : "text-chart-red"}`}>
              {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {m.change}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default TopMovers;
