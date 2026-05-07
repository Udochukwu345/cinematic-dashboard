import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, CandlestickChart, ArrowLeftRight, History, TrendingUp, TrendingDown } from "lucide-react";
import TradingViewChart from "@/components/dashboard/TradingViewChart";

type Tab = "quote" | "chart" | "trade" | "history";

const quotes = [
  { symbol: "BTC/USDT", bid: "67,231.20", ask: "67,234.50", change: "+2.34%", up: true, tvSymbol: "BINANCE:BTCUSDT" },
  { symbol: "ETH/USDT", bid: "3,455.10", ask: "3,456.78", change: "-0.87%", up: false, tvSymbol: "BINANCE:ETHUSDT" },
  { symbol: "SOL/USDT", bid: "142.55", ask: "142.67", change: "+5.21%", up: true, tvSymbol: "BINANCE:SOLUSDT" },
  { symbol: "EUR/USD", bid: "1.0840", ask: "1.0842", change: "-0.12%", up: false, tvSymbol: "FX:EURUSD" },
  { symbol: "GBP/USD", bid: "1.2732", ask: "1.2734", change: "+0.08%", up: true, tvSymbol: "FX:GBPUSD" },
  { symbol: "XAU/USD", bid: "2,341.80", ask: "2,342.10", change: "+0.64%", up: true, tvSymbol: "OANDA:XAUUSD" },
];

const history = [
  { pair: "BTC/USDT", side: "Buy", lots: "0.50", price: "66,450.00", pnl: "+$391.00", up: true, time: "10:24" },
  { pair: "ETH/USDT", side: "Sell", lots: "2.00", price: "3,470.20", pnl: "-$26.80", up: false, time: "09:58" },
  { pair: "EUR/USD", side: "Buy", lots: "1.00", price: "1.0825", pnl: "+$17.00", up: true, time: "Yesterday" },
  { pair: "XAU/USD", side: "Sell", lots: "0.10", price: "2,348.50", pnl: "+$64.00", up: true, time: "Yesterday" },
  { pair: "SOL/USDT", side: "Buy", lots: "25.0", price: "138.20", pnl: "+$111.75", up: true, time: "2 days ago" },
];

const TradeExecution = () => {
  const [tab, setTab] = useState<Tab>("quote");
  const [selected, setSelected] = useState(quotes[0]);
  const [lots, setLots] = useState("0.10");

  const tabs: { id: Tab; label: string; icon: typeof LineChart }[] = [
    { id: "quote", label: "Quote", icon: LineChart },
    { id: "chart", label: "Chart", icon: CandlestickChart },
    { id: "trade", label: "Trade", icon: ArrowLeftRight },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 pb-20">
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Trade Execution</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selected.symbol} · Bid <span className="text-chart-red font-mono">{selected.bid}</span> / Ask{" "}
            <span className="text-chart-green font-mono">{selected.ask}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "quote" && (
              <div className="glass-card overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-3 text-xs text-muted-foreground border-b border-border/50">
                  <div className="col-span-4">Symbol</div>
                  <div className="col-span-3 text-right">Bid</div>
                  <div className="col-span-3 text-right">Ask</div>
                  <div className="col-span-2 text-right">Chg</div>
                </div>
                {quotes.map((q) => (
                  <button
                    key={q.symbol}
                    onClick={() => setSelected(q)}
                    className={`w-full grid grid-cols-12 px-4 py-3 text-sm border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors ${
                      selected.symbol === q.symbol ? "bg-secondary/60" : ""
                    }`}
                  >
                    <div className="col-span-4 text-left font-medium text-foreground">{q.symbol}</div>
                    <div className="col-span-3 text-right font-mono text-chart-red">{q.bid}</div>
                    <div className="col-span-3 text-right font-mono text-chart-green">{q.ask}</div>
                    <div className={`col-span-2 text-right font-medium ${q.up ? "text-chart-green" : "text-chart-red"}`}>
                      {q.change}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {tab === "chart" && (
              <div className="glass-card overflow-hidden rounded-xl">
                <TradingViewChart symbol={selected.tvSymbol} height={500} />
              </div>
            )}

            {tab === "trade" && (
              <div className="glass-card p-5 max-w-xl space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Symbol</p>
                  <p className="text-lg font-semibold text-foreground">{selected.symbol}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Volume (lots)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={lots}
                    onChange={(e) => setLots(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="flex flex-col items-center justify-center py-3 rounded-lg bg-chart-red/15 border border-chart-red/40 hover:bg-chart-red/25 transition-colors">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-chart-red">
                      <TrendingDown className="w-4 h-4" /> Sell
                    </span>
                    <span className="text-xs font-mono text-chart-red/80 mt-0.5">{selected.bid}</span>
                  </button>
                  <button className="flex flex-col items-center justify-center py-3 rounded-lg bg-chart-green/15 border border-chart-green/40 hover:bg-chart-green/25 transition-colors">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-chart-green">
                      <TrendingUp className="w-4 h-4" /> Buy
                    </span>
                    <span className="text-xs font-mono text-chart-green/80 mt-0.5">{selected.ask}</span>
                  </button>
                </div>
              </div>
            )}

            {tab === "history" && (
              <div className="glass-card overflow-hidden">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 border-b border-border/30 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{h.pair}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {h.side} {h.lots} @ {h.price} · {h.time}
                      </p>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${h.up ? "text-chart-green" : "text-chart-red"}`}>
                      {h.pnl}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom tab bar — works on mobile and desktop */}
      <nav className="fixed bottom-0 left-0 right-0 md:left-60 z-40 bg-sidebar/95 backdrop-blur border-t border-sidebar-border">
        <div className="grid grid-cols-4 max-w-2xl mx-auto">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
                <span className="text-[11px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default TradeExecution;
