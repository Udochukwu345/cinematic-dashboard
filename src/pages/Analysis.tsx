import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Activity, Zap, Target, Shield } from "lucide-react";
import { useState } from "react";

const priceData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  price: 64000 + Math.sin(i * 0.5) * 3000 + Math.random() * 1500,
  volume: 15 + Math.random() * 20,
}));

const indicators = [
  { name: "RSI (14)", value: "62.4", signal: "Neutral", icon: Activity, color: "text-yellow-400" },
  { name: "MACD", value: "Bullish", signal: "Buy", icon: TrendingUp, color: "text-green-400" },
  { name: "Bollinger Bands", value: "Upper", signal: "Overbought", icon: Target, color: "text-orange-400" },
  { name: "Moving Avg (50)", value: "$65,200", signal: "Above", icon: Zap, color: "text-green-400" },
  { name: "Stochastic", value: "78.3", signal: "Overbought", icon: Activity, color: "text-orange-400" },
  { name: "Support Level", value: "$62,100", signal: "Strong", icon: Shield, color: "text-blue-400" },
];

const signals = [
  { asset: "BTC/USD", action: "Buy", confidence: 87, reason: "Golden cross on 4H chart" },
  { asset: "ETH/USD", action: "Hold", confidence: 65, reason: "Consolidation near resistance" },
  { asset: "SOL/USD", action: "Buy", confidence: 92, reason: "Breakout above key level" },
  { asset: "AVAX/USD", action: "Sell", confidence: 74, reason: "Bearish divergence on RSI" },
];

const Analysis = () => {
  const [period, setPeriod] = useState("1M");

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Technical indicators & trading signals</p>
      </motion.div>

      {/* Indicators Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {indicators.map((ind, i) => (
          <motion.div key={ind.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }} className="glass-card p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <ind.icon className={`w-4 h-4 ${ind.color}`} />
              <span className="text-[11px] text-muted-foreground truncate">{ind.name}</span>
            </div>
            <p className="text-sm font-bold text-foreground">{ind.value}</p>
            <span className={`text-[11px] font-medium ${ind.color}`}>{ind.signal}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-foreground">BTC/USD Price Action</h2>
          <div className="flex gap-1.5">
            {["1D", "1W", "1M", "3M"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>{p}</button>
            ))}
          </div>
        </div>
        <div className="h-[250px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="analysisGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 }} />
              <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#analysisGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Signals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Trading Signals</h2>
        </div>
        {signals.map((s, i) => (
          <motion.div key={s.asset} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }} className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.action === "Buy" ? "bg-green-400/10" : s.action === "Sell" ? "bg-red-400/10" : "bg-yellow-400/10"}`}>
                {s.action === "Buy" ? <TrendingUp className="w-4 h-4 text-green-400" /> : s.action === "Sell" ? <TrendingDown className="w-4 h-4 text-red-400" /> : <Activity className="w-4 h-4 text-yellow-400" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.asset}</p>
                <p className="text-xs text-muted-foreground truncate">{s.reason}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${s.action === "Buy" ? "bg-green-400/10 text-green-400" : s.action === "Sell" ? "bg-red-400/10 text-red-400" : "bg-yellow-400/10 text-yellow-400"}`}>{s.action}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{s.confidence}% conf.</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Analysis;
