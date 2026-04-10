import { motion } from "framer-motion";
import { Search, ArrowUpRight, ArrowDownRight, Star, Filter } from "lucide-react";
import { useState } from "react";

const coins = [
  { name: "Bitcoin", symbol: "BTC", price: 68423.50, change: 2.34, cap: "1.34T", volume: "28.5B", icon: "₿", sparkColor: "text-green-400" },
  { name: "Ethereum", symbol: "ETH", price: 3847.20, change: -1.12, cap: "462.8B", volume: "15.2B", icon: "Ξ", sparkColor: "text-red-400" },
  { name: "Solana", symbol: "SOL", price: 178.90, change: 5.67, cap: "78.4B", volume: "4.8B", icon: "◎", sparkColor: "text-green-400" },
  { name: "Cardano", symbol: "ADA", price: 0.62, change: 3.21, cap: "21.8B", volume: "890M", icon: "₳", sparkColor: "text-green-400" },
  { name: "Avalanche", symbol: "AVAX", price: 42.15, change: -2.89, cap: "15.6B", volume: "1.2B", icon: "▲", sparkColor: "text-red-400" },
  { name: "Polkadot", symbol: "DOT", price: 8.34, change: 1.45, cap: "11.2B", volume: "620M", icon: "●", sparkColor: "text-green-400" },
  { name: "Chainlink", symbol: "LINK", price: 18.72, change: 4.56, cap: "10.8B", volume: "980M", icon: "⬡", sparkColor: "text-green-400" },
  { name: "Polygon", symbol: "MATIC", price: 0.89, change: -0.78, cap: "8.3B", volume: "450M", icon: "⬠", sparkColor: "text-red-400" },
  { name: "Uniswap", symbol: "UNI", price: 12.45, change: 2.10, cap: "7.5B", volume: "380M", icon: "🦄", sparkColor: "text-green-400" },
  { name: "Cosmos", symbol: "ATOM", price: 9.87, change: -1.34, cap: "3.8B", volume: "210M", icon: "⚛", sparkColor: "text-red-400" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const Markets = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "gainers" | "losers">("all");

  const filtered = coins
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => filter === "all" ? true : filter === "gainers" ? c.change > 0 : c.change < 0);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Markets</h1>
        <p className="text-sm text-muted-foreground mt-1">Track real-time crypto prices and trends</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "gainers", "losers"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={container} initial="hidden" animate="show" className="glass-card overflow-hidden">
        {/* Header - hidden on mobile */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Asset</span><span className="text-right">Price</span><span className="text-right">24h Change</span><span className="text-right">Market Cap</span><span className="text-right">Volume</span><span></span>
        </div>

        {filtered.map((coin, i) => (
          <motion.div
            key={coin.symbol}
            variants={item}
            className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-4 py-3 md:py-4 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer items-center"
          >
            {/* Asset */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg shrink-0">{coin.icon}</div>
              <div>
                <p className="font-semibold text-sm text-foreground">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.symbol}</p>
              </div>
            </div>

            {/* Mobile: price + change stacked */}
            <div className="flex flex-col items-end md:hidden">
              <span className="font-mono font-semibold text-sm text-foreground">${coin.price.toLocaleString()}</span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${coin.change > 0 ? "text-green-400" : "text-red-400"}`}>
                {coin.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(coin.change)}%
              </span>
            </div>

            {/* Desktop columns */}
            <span className="hidden md:block text-right font-mono font-semibold text-sm text-foreground">${coin.price.toLocaleString()}</span>
            <span className={`hidden md:flex items-center justify-end gap-1 text-sm font-medium ${coin.change > 0 ? "text-green-400" : "text-red-400"}`}>
              {coin.change > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(coin.change)}%
            </span>
            <span className="hidden md:block text-right text-sm text-muted-foreground">${coin.cap}</span>
            <span className="hidden md:block text-right text-sm text-muted-foreground">${coin.volume}</span>
            <button className="hidden md:block text-muted-foreground hover:text-primary transition-colors"><Star className="w-4 h-4" /></button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Markets;
