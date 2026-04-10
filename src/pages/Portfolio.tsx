import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, DollarSign } from "lucide-react";

const holdings = [
  { name: "Bitcoin", symbol: "BTC", amount: 1.24, value: 84845, change: 2.34, allocation: 45, color: "hsl(36 100% 50%)" },
  { name: "Ethereum", symbol: "ETH", amount: 12.5, value: 48090, change: -1.12, allocation: 25, color: "hsl(228 60% 60%)" },
  { name: "Solana", symbol: "SOL", amount: 180, value: 32202, change: 5.67, allocation: 17, color: "hsl(280 70% 60%)" },
  { name: "Chainlink", symbol: "LINK", amount: 500, value: 9360, change: 4.56, allocation: 5, color: "hsl(210 80% 55%)" },
  { name: "Others", symbol: "MISC", amount: 0, value: 15503, change: 1.2, allocation: 8, color: "hsl(160 50% 50%)" },
];

const totalValue = holdings.reduce((s, h) => s + h.value, 0);

const stats = [
  { label: "Total Value", value: `$${(totalValue).toLocaleString()}`, icon: Wallet, change: "+3.2%" },
  { label: "24h P&L", value: "+$2,340", icon: TrendingUp, change: "+1.24%" },
  { label: "Total Invested", value: "$165,000", icon: DollarSign, change: "" },
];

const Portfolio = () => (
  <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Portfolio</h1>
      <p className="text-sm text-muted-foreground mt-1">Your crypto holdings at a glance</p>
    </motion.div>

    {/* Stats */}
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <s.icon className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-foreground">{s.value}</p>
          {s.change && <span className="text-xs text-green-400">{s.change}</span>}
        </motion.div>
      ))}
    </motion.div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      {/* Allocation Chart */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-4 md:p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Allocation</h2>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={holdings} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="allocation" stroke="none">
                {holdings.map((h, i) => <Cell key={i} fill={h.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {holdings.map((h) => (
            <div key={h.symbol} className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: h.color }} />
              <span className="text-muted-foreground">{h.symbol} {h.allocation}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Holdings List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Holdings</h2>
        </div>
        {holdings.map((h, i) => (
          <motion.div
            key={h.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${h.color}20` }}>
                <span className="text-xs font-bold" style={{ color: h.color }}>{h.symbol[0]}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.amount} {h.symbol}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-mono font-semibold text-foreground">${h.value.toLocaleString()}</p>
              <span className={`flex items-center justify-end gap-0.5 text-xs ${h.change > 0 ? "text-green-400" : "text-red-400"}`}>
                {h.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(h.change)}%
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default Portfolio;
