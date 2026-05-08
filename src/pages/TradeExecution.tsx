import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  CandlestickChart,
  ArrowLeftRight,
  History,
  TrendingUp,
  TrendingDown,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import TradingViewChart from "@/components/dashboard/TradingViewChart";

type Tab = "quote" | "chart" | "trade" | "history";

type Quote = {
  symbol: string;
  bid: string;
  ask: string;
  change: string;
  up: boolean;
  tvSymbol: string;
};

const defaultQuotes: Quote[] = [
  { symbol: "BTC/USDT", bid: "67,231.20", ask: "67,234.50", change: "+2.34%", up: true, tvSymbol: "BINANCE:BTCUSDT" },
  { symbol: "ETH/USDT", bid: "3,455.10", ask: "3,456.78", change: "-0.87%", up: false, tvSymbol: "BINANCE:ETHUSDT" },
  { symbol: "EUR/USD", bid: "1.0840", ask: "1.0842", change: "-0.12%", up: false, tvSymbol: "FX:EURUSD" },
  { symbol: "XAU/USD", bid: "2,341.80", ask: "2,342.10", change: "+0.64%", up: true, tvSymbol: "OANDA:XAUUSD" },
];

const STORAGE_KEY = "tradexa:user_pairs";

const history = [
  { pair: "BTC/USDT", side: "Buy", lots: "0.50", price: "66,450.00", pnl: "+$391.00", up: true, time: "10:24" },
  { pair: "ETH/USDT", side: "Sell", lots: "2.00", price: "3,470.20", pnl: "-$26.80", up: false, time: "09:58" },
  { pair: "EUR/USD", side: "Buy", lots: "1.00", price: "1.0825", pnl: "+$17.00", up: true, time: "Yesterday" },
  { pair: "XAU/USD", side: "Sell", lots: "0.10", price: "2,348.50", pnl: "+$64.00", up: true, time: "Yesterday" },
];

const loadPairs = (): Quote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultQuotes;
};

const TradeExecution = () => {
  const [tab, setTab] = useState<Tab>("quote");
  const [pairs, setPairs] = useState<Quote[]>(loadPairs);
  const [selected, setSelected] = useState<Quote>(() => loadPairs()[0] ?? defaultQuotes[0]);
  const [lots, setLots] = useState("0.10");

  // Editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Quote>({
    symbol: "",
    bid: "0.00",
    ask: "0.00",
    change: "+0.00%",
    up: true,
    tvSymbol: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    if (!pairs.find((p) => p.symbol === selected?.symbol) && pairs[0]) {
      setSelected(pairs[0]);
    }
  }, [pairs]);

  const openAdd = () => {
    setEditingIndex(null);
    setForm({ symbol: "", bid: "0.00", ask: "0.00", change: "+0.00%", up: true, tvSymbol: "" });
    setEditorOpen(true);
  };

  const openEdit = (i: number) => {
    setEditingIndex(i);
    setForm({ ...pairs[i] });
    setEditorOpen(true);
  };

  const savePair = () => {
    if (!form.symbol.trim()) return;
    const next: Quote = {
      ...form,
      symbol: form.symbol.trim().toUpperCase(),
      tvSymbol: form.tvSymbol.trim() || form.symbol.replace("/", ""),
    };
    setPairs((prev) => {
      if (editingIndex === null) return [...prev, next];
      const copy = [...prev];
      copy[editingIndex] = next;
      return copy;
    });
    setEditorOpen(false);
  };

  const deletePair = (i: number) => {
    setPairs((prev) => prev.filter((_, idx) => idx !== i));
  };

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
          {selected && (
            <p className="text-sm text-muted-foreground mt-1">
              {selected.symbol} · Bid <span className="text-chart-red font-mono">{selected.bid}</span> / Ask{" "}
              <span className="text-chart-green font-mono">{selected.ask}</span>
            </p>
          )}
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {pairs.length} pair{pairs.length === 1 ? "" : "s"} in your watchlist
                  </p>
                  <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add pair
                  </button>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="grid grid-cols-12 px-4 py-3 text-xs text-muted-foreground border-b border-border/50">
                    <div className="col-span-3">Symbol</div>
                    <div className="col-span-3 text-right">Bid</div>
                    <div className="col-span-2 text-right">Ask</div>
                    <div className="col-span-2 text-right">Chg</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  {pairs.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No pairs yet. Click <span className="text-primary font-medium">Add pair</span> to start.
                    </div>
                  )}
                  {pairs.map((q, i) => (
                    <div
                      key={`${q.symbol}-${i}`}
                      className={`grid grid-cols-12 items-center px-4 py-3 text-sm border-b border-border/30 last:border-0 hover:bg-secondary/40 transition-colors ${
                        selected?.symbol === q.symbol ? "bg-secondary/60" : ""
                      }`}
                    >
                      <button onClick={() => setSelected(q)} className="col-span-3 text-left font-medium text-foreground">
                        {q.symbol}
                      </button>
                      <button onClick={() => setSelected(q)} className="col-span-3 text-right font-mono text-chart-red">
                        {q.bid}
                      </button>
                      <button onClick={() => setSelected(q)} className="col-span-2 text-right font-mono text-chart-green">
                        {q.ask}
                      </button>
                      <button
                        onClick={() => setSelected(q)}
                        className={`col-span-2 text-right font-medium ${q.up ? "text-chart-green" : "text-chart-red"}`}
                      >
                        {q.change}
                      </button>
                      <div className="col-span-2 flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(i)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          aria-label="Edit pair"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePair(i)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-chart-red hover:bg-chart-red/10 transition-colors"
                          aria-label="Delete pair"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "chart" && selected && (
              <div className="glass-card overflow-hidden rounded-xl">
                <TradingViewChart symbol={selected.tvSymbol} height={500} />
              </div>
            )}

            {tab === "trade" && selected && (
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

      {/* Editor modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingIndex === null ? "Add pair" : "Edit pair"}
              </h2>
              <button
                onClick={() => setEditorOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Symbol (e.g. BTC/USDT)</label>
                <input
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground focus:outline-none focus:border-primary"
                  placeholder="BTC/USDT"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  TradingView symbol (e.g. BINANCE:BTCUSDT)
                </label>
                <input
                  value={form.tvSymbol}
                  onChange={(e) => setForm({ ...form, tvSymbol: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground focus:outline-none focus:border-primary"
                  placeholder="BINANCE:BTCUSDT"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Bid</label>
                  <input
                    value={form.bid}
                    onChange={(e) => setForm({ ...form, bid: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Ask</label>
                  <input
                    value={form.ask}
                    onChange={(e) => setForm({ ...form, ask: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Change</label>
                  <input
                    value={form.change}
                    onChange={(e) => setForm({ ...form, change: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground font-mono focus:outline-none focus:border-primary"
                    placeholder="+1.23%"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setForm({ ...form, up: true })}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.up
                          ? "bg-chart-green/20 border-chart-green/50 text-chart-green"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Up
                    </button>
                    <button
                      onClick={() => setForm({ ...form, up: false })}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                        !form.up
                          ? "bg-chart-red/20 border-chart-red/50 text-chart-red"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Down
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditorOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={savePair}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

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
