import { motion } from "framer-motion";
import { useState } from "react";
import TradingViewChart from "@/components/dashboard/TradingViewChart";

const popularSymbols = [
  { label: "BTC/USDT", symbol: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", symbol: "BINANCE:ETHUSDT" },
  { label: "SOL/USDT", symbol: "BINANCE:SOLUSDT" },
  { label: "BNB/USDT", symbol: "BINANCE:BNBUSDT" },
  { label: "XRP/USDT", symbol: "BINANCE:XRPUSDT" },
  { label: "ADA/USDT", symbol: "BINANCE:ADAUSDT" },
];

const MarketChart = () => {
  const [activeSymbol, setActiveSymbol] = useState(popularSymbols[0]);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Market Chart</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time charts powered by TradingView</p>
      </motion.div>

      {/* Symbol Selector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap">
        {popularSymbols.map((s) => (
          <button
            key={s.symbol}
            onClick={() => setActiveSymbol(s)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSymbol.symbol === s.symbol
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden rounded-xl"
      >
        <TradingViewChart symbol={activeSymbol.symbol} height={550} />
      </motion.div>
    </div>
  );
};

export default MarketChart;
