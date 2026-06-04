import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Activity, BarChart3, Download, Filter } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

type Asset = {
  name: string;
  symbol: string;
  type: "forex" | "crypto";
  price: number;
  change24h: number;
  change7d: number;
  volume: string;
  high: number;
  low: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  signal: "Buy" | "Sell" | "Hold";
};

const assets: Asset[] = [
  { name: "Bitcoin", symbol: "BTC/USD", type: "crypto", price: 68234.5, change24h: 2.34, change7d: 5.12, volume: "28.5B", high: 69210, low: 66890, sentiment: "Bullish", signal: "Buy" },
  { name: "Ethereum", symbol: "ETH/USD", type: "crypto", price: 3847.2, change24h: -1.12, change7d: 2.4, volume: "15.2B", high: 3920, low: 3760, sentiment: "Neutral", signal: "Hold" },
  { name: "Solana", symbol: "SOL/USD", type: "crypto", price: 178.9, change24h: 5.67, change7d: 12.3, volume: "4.8B", high: 184.2, low: 165.4, sentiment: "Bullish", signal: "Buy" },
  { name: "Cardano", symbol: "ADA/USD", type: "crypto", price: 0.62, change24h: 3.21, change7d: -1.8, volume: "890M", high: 0.65, low: 0.58, sentiment: "Neutral", signal: "Hold" },
  { name: "XRP", symbol: "XRP/USD", type: "crypto", price: 0.58, change24h: -2.45, change7d: -4.1, volume: "1.4B", high: 0.61, low: 0.56, sentiment: "Bearish", signal: "Sell" },
  { name: "Euro / US Dollar", symbol: "EUR/USD", type: "forex", price: 1.0842, change24h: -0.12, change7d: 0.34, volume: "112B", high: 1.0871, low: 1.0820, sentiment: "Neutral", signal: "Hold" },
  { name: "British Pound / USD", symbol: "GBP/USD", type: "forex", price: 1.2734, change24h: 0.08, change7d: -0.21, volume: "78B", high: 1.2760, low: 1.2712, sentiment: "Neutral", signal: "Hold" },
  { name: "US Dollar / Yen", symbol: "USD/JPY", type: "forex", price: 156.42, change24h: 0.34, change7d: 1.12, volume: "94B", high: 156.78, low: 155.80, sentiment: "Bullish", signal: "Buy" },
  { name: "Australian Dollar / USD", symbol: "AUD/USD", type: "forex", price: 0.6612, change24h: -0.21, change7d: -0.67, volume: "42B", high: 0.6645, low: 0.6598, sentiment: "Bearish", signal: "Sell" },
  { name: "USD / Swiss Franc", symbol: "USD/CHF", type: "forex", price: 0.9034, change24h: 0.18, change7d: 0.42, volume: "38B", high: 0.9051, low: 0.9012, sentiment: "Neutral", signal: "Hold" },
];

const sparkData = (seed: number) =>
  Array.from({ length: 24 }, (_, i) => ({
    t: i,
    v: 100 + Math.sin(i / 2 + seed) * 8 + Math.cos(i / 3 + seed) * 4 + i * 0.3,
  }));

const sentimentColor = (s: Asset["sentiment"]) =>
  s === "Bullish" ? "text-chart-green" : s === "Bearish" ? "text-chart-red" : "text-muted-foreground";

const signalBg = (s: Asset["signal"]) =>
  s === "Buy"
    ? "bg-chart-green/15 text-chart-green border-chart-green/30"
    : s === "Sell"
    ? "bg-chart-red/15 text-chart-red border-chart-red/30"
    : "bg-muted/30 text-muted-foreground border-border";

const TradingReport = () => {
  const [tab, setTab] = useState<"all" | "crypto" | "forex">("all");

  const filtered = useMemo(
    () => (tab === "all" ? assets : assets.filter((a) => a.type === tab)),
    [tab]
  );

  const stats = useMemo(() => {
    const gainers = filtered.filter((a) => a.change24h > 0).length;
    const losers = filtered.filter((a) => a.change24h < 0).length;
    const avg = filtered.reduce((s, a) => s + a.change24h, 0) / (filtered.length || 1);
    const top = [...filtered].sort((a, b) => b.change24h - a.change24h)[0];
    return { gainers, losers, avg, top };
  }, [filtered]);

  const volumeData = filtered.map((a) => ({
    name: a.symbol.split("/")[0],
    change: Number(a.change24h.toFixed(2)),
  }));

  const exportCsv = () => {
    const header = "Symbol,Name,Type,Price,24h %,7d %,Volume,High,Low,Sentiment,Signal\n";
    const rows = filtered
      .map((a) =>
        [a.symbol, a.name, a.type, a.price, a.change24h, a.change7d, a.volume, a.high, a.low, a.sentiment, a.signal].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trading-report-${tab}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Trading Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live performance, signals and sentiment across forex & crypto.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition self-start md:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Assets Tracked", value: filtered.length, icon: BarChart3, tone: "text-primary" },
          { label: "Gainers (24h)", value: stats.gainers, icon: TrendingUp, tone: "text-chart-green" },
          { label: "Losers (24h)", value: stats.losers, icon: TrendingDown, tone: "text-chart-red" },
          {
            label: "Avg 24h Change",
            value: `${stats.avg.toFixed(2)}%`,
            icon: Activity,
            tone: stats.avg >= 0 ? "text-chart-green" : "text-chart-red",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.tone}`} />
            </div>
            <p className={`mt-2 text-xl md:text-2xl font-bold ${s.tone}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(["all", "crypto", "forex"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Volume change chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">24h Performance</h3>
          <span className="text-xs text-muted-foreground">% change</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="change" radius={[4, 4, 0, 0]}>
              {volumeData.map((d, i) => (
                <Bar
                  key={i}
                  dataKey="change"
                  fill={d.change >= 0 ? "hsl(var(--chart-green))" : "hsl(var(--chart-red))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Asset cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((a, i) => (
          <motion.div
            key={a.symbol}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{a.symbol}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                    {a.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{a.name}</p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${signalBg(a.signal)}`}
              >
                {a.signal}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <p className="font-mono text-2xl font-bold text-foreground">
                {a.type === "forex" ? a.price.toFixed(4) : `$${a.price.toLocaleString()}`}
              </p>
              <p
                className={`flex items-center gap-1 text-sm font-medium ${
                  a.change24h >= 0 ? "text-chart-green" : "text-chart-red"
                }`}
              >
                {a.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(a.change24h)}%
              </p>
            </div>

            <div className="mt-3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData(i)}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={a.change24h >= 0 ? "hsl(var(--chart-green))" : "hsl(var(--chart-red))"}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">7d</p>
                <p className={a.change7d >= 0 ? "text-chart-green font-medium" : "text-chart-red font-medium"}>
                  {a.change7d >= 0 ? "+" : ""}
                  {a.change7d}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">High</p>
                <p className="text-foreground font-medium font-mono">{a.high}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Low</p>
                <p className="text-foreground font-medium font-mono">{a.low}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Volume {a.volume}</span>
              <span className={`font-semibold ${sentimentColor(a.sentiment)}`}>{a.sentiment}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TradingReport;
