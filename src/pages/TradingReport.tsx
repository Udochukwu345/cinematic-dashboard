import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Share2,
  Sparkles,
  Timer,
  Scale,
  Brain,
  ScrollText,
  BarChart3,
  TrendingUp,
  Plus,
  Trash2,
  Search,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { toast } from "sonner";

const YELLOW = "#f5c518";
const BLUE = "#2f6bff";
const RED = "#ef4444";

type Range = "1M" | "3M" | "ALL";
type Asset = {
  sym: string;
  name: string;
  type: "Crypto" | "Forex";
};

const ASSETS: Asset[] = [
  { sym: "BTC/USD", name: "Bitcoin", type: "Crypto" },
  { sym: "ETH/USD", name: "Ethereum", type: "Crypto" },
  { sym: "SOL/USD", name: "Solana", type: "Crypto" },
  { sym: "XRP/USD", name: "Ripple", type: "Crypto" },
  { sym: "DOGE/USD", name: "Dogecoin", type: "Crypto" },
  { sym: "EUR/USD", name: "Euro / Dollar", type: "Forex" },
  { sym: "GBP/USD", name: "Pound / Dollar", type: "Forex" },
  { sym: "USD/JPY", name: "Dollar / Yen", type: "Forex" },
  { sym: "AUD/USD", name: "Aussie / Dollar", type: "Forex" },
  { sym: "USD/CAD", name: "Dollar / Loonie", type: "Forex" },
];

type Trade = {
  id: string;
  sym: string;
  name: string;
  type: "Crypto" | "Forex";
  side: "LONG" | "SHORT";
  price: number;
  pnl: number;
  date: string; // ISO
};

const seedTrades: Trade[] = [
  { id: "t1", sym: "BTC/USD", name: "Bitcoin", type: "Crypto", side: "LONG", price: 34210.56, pnl: 1240, date: new Date().toISOString() },
  { id: "t2", sym: "ETH/USD", name: "Ethereum", type: "Crypto", side: "SHORT", price: 1850, pnl: -320, date: new Date(Date.now() - 864e5).toISOString() },
  { id: "t3", sym: "EUR/USD", name: "Euro / Dollar", type: "Forex", side: "LONG", price: 1.0842, pnl: 420, date: new Date(Date.now() - 2 * 864e5).toISOString() },
  { id: "t4", sym: "USD/JPY", name: "Dollar / Yen", type: "Forex", side: "SHORT", price: 149.21, pnl: 680, date: new Date(Date.now() - 3 * 864e5).toISOString() },
];

const STORAGE_TRADES = "tr_trades_v1";
const STORAGE_JOURNAL = "tr_journal_v1";
const STORAGE_FOCUS = "tr_focus_v1";
const STORAGE_STRESS = "tr_stress_v1";

// Build full equity curve (90 days) from a base
const buildEquity = () =>
  Array.from({ length: 90 }, (_, i) => ({
    d: i,
    label: new Date(Date.now() - (89 - i) * 864e5).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    v: 10000 + i * 220 + Math.sin(i / 2.4) * 1800 + (i > 50 ? (i - 50) * 180 : 0),
  }));

const dailyPL = Array.from({ length: 14 }, (_, i) => {
  const v = Math.round(Math.sin(i * 1.3) * 1600 + (i % 3 === 0 ? 1200 : -400) + i * 60);
  return {
    d: new Date(Date.now() - (13 - i) * 864e5).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    v,
    c: v >= 1500 ? YELLOW : v >= 0 ? BLUE : RED,
  };
});

const heatmap: number[][] = [
  [-1, 0.4, -0.6, 0.6, -0.9, 0.2, 0.1],
  [0.5, -0.7, 1, 0.4, 0.4, -0.3, 0.6],
  [0.5, -1, 0.5, -0.9, 1, 0.7, 0.2],
];
const heatColor = (v: number) => {
  if (v >= 0.8) return "bg-[#f5c518]";
  if (v > 0) return "bg-[#2f6bff]";
  if (v <= -0.8) return "bg-[#ef4444]";
  return "bg-[#ef4444]/70";
};

const TradingReport = () => {
  const [range, setRange] = useState<Range>("1M");
  const [assetFilter, setAssetFilter] = useState<"All" | "Crypto" | "Forex">("All");
  const [search, setSearch] = useState("");
  const [trades, setTrades] = useState<Trade[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_TRADES);
      return raw ? (JSON.parse(raw) as Trade[]) : seedTrades;
    } catch {
      return seedTrades;
    }
  });
  const [journal, setJournal] = useState<string>(
    () => localStorage.getItem(STORAGE_JOURNAL) ??
      "Missed the breakout on ETH, felt some FOMO but stayed out. Disciplined execution on the reversal later."
  );
  const [focus, setFocus] = useState<number>(() => Number(localStorage.getItem(STORAGE_FOCUS) ?? 85));
  const [stress, setStress] = useState<number>(() => Number(localStorage.getItem(STORAGE_STRESS) ?? 55));
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_TRADES, JSON.stringify(trades)); }, [trades]);
  useEffect(() => { localStorage.setItem(STORAGE_JOURNAL, journal); }, [journal]);
  useEffect(() => { localStorage.setItem(STORAGE_FOCUS, String(focus)); }, [focus]);
  useEffect(() => { localStorage.setItem(STORAGE_STRESS, String(stress)); }, [stress]);

  const equityFull = useMemo(buildEquity, []);
  const equityData = useMemo(() => {
    const n = range === "1M" ? 30 : range === "3M" ? 90 : 90;
    return equityFull.slice(-n);
  }, [range, equityFull]);

  const filteredTrades = useMemo(() => {
    return trades
      .filter((t) => assetFilter === "All" || t.type === assetFilter)
      .filter((t) =>
        !search ||
        t.sym.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [trades, assetFilter, search]);

  const stats = useMemo(() => {
    const wins = trades.filter((t) => t.pnl > 0);
    const losses = trades.filter((t) => t.pnl <= 0);
    const totalPL = trades.reduce((s, t) => s + t.pnl, 0);
    const winRate = trades.length ? (wins.length / trades.length) * 100 : 0;
    const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
    const profitFactor = grossLoss ? grossWin / grossLoss : grossWin;
    const avg = trades.length ? totalPL / trades.length : 0;
    return { winRate, totalPL, profitFactor, avg };
  }, [trades]);

  const circ = 2 * Math.PI * 70;
  const offset = circ - (stats.winRate / 100) * circ;

  const handleExport = () => {
    const rows = [
      ["Date", "Asset", "Type", "Side", "Entry", "P/L"],
      ...trades.map((t) => [t.date, t.sym, t.type, t.side, t.price.toString(), t.pnl.toString()]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trading-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  const handleShare = async () => {
    const summary = `Trading Report — Win rate: ${stats.winRate.toFixed(1)}% • Total P/L: $${stats.totalPL.toFixed(2)} • PF: ${stats.profitFactor.toFixed(2)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Trading Report", text: summary, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${summary}\n${window.location.href}`);
        toast.success("Report link copied");
      }
    } catch { /* user cancel */ }
  };

  const deleteTrade = (id: string) => {
    setTrades((t) => t.filter((x) => x.id !== id));
    toast.success("Trade removed");
  };

  return (
    <div className="flex-1 overflow-auto bg-[#070b1a]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Trading Report</h1>
            <p className="text-xs text-white/50 mt-1">
              Last updated: {new Date().toLocaleString()} • Live Data Stream Active
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition"
            >
              <Download className="w-3.5 h-3.5" /> EXPORT CSV
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f5c518] text-black text-xs font-bold hover:brightness-110 transition"
            >
              <Share2 className="w-3.5 h-3.5" /> SHARE
            </button>
          </div>
        </motion.div>

        {/* Top grid: Win rate + Equity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Win Rate */}
          <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-6">
            <p className="text-[11px] tracking-[0.2em] text-white/50 font-semibold">WIN RATE</p>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#1a2347" strokeWidth="10" fill="none" />
                  <motion.circle
                    cx="80" cy="80" r="70"
                    stroke={YELLOW}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ filter: `drop-shadow(0 0 12px ${YELLOW})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-[#f5c518]">{stats.winRate.toFixed(1)}%</p>
                  <p className="text-[10px] tracking-[0.2em] text-white/50 mt-1">TARGET: 65%</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-sm pt-3">
                <span className="text-white/70">Profit Factor</span>
                <span className="font-bold text-[#f5c518]">{stats.profitFactor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Avg Trade</span>
                <span className={`font-mono font-bold ${stats.avg >= 0 ? "text-[#f5c518]" : "text-[#ef4444]"}`}>
                  ${stats.avg.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Total Trades</span>
                <span className="font-mono font-bold">{trades.length}</span>
              </div>
            </div>
          </div>

          {/* Equity Curve */}
          <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#2f6bff]" />
                <h3 className="font-semibold">Equity Curve</h3>
              </div>
              <div className="flex bg-black/30 rounded-full p-0.5 text-[10px] font-bold">
                {(["1M", "3M", "ALL"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 rounded-full transition ${
                      range === r ? "bg-[#f5c518] text-black" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={equityData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BLUE} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: "#ffffff60", fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
                <Tooltip
                  contentStyle={{ background: "#0e1430", border: "1px solid #1a2347", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, "Equity"]}
                />
                <Area type="monotone" dataKey="v" stroke={BLUE} strokeWidth={2.5} fill="url(#eq)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t border-white/5">
              {[
                { l: "TOTAL P/L", v: `${stats.totalPL >= 0 ? "+" : ""}$${stats.totalPL.toFixed(2)}`, c: stats.totalPL >= 0 ? "text-[#f5c518]" : "text-[#ef4444]" },
                { l: "WIN RATE", v: `${stats.winRate.toFixed(1)}%`, c: "text-white" },
                { l: "PROFIT FACTOR", v: stats.profitFactor.toFixed(2), c: "text-[#f5c518]" },
                { l: "AVG TRADE", v: `$${stats.avg.toFixed(0)}`, c: "text-white" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-[9px] tracking-wider text-white/40">{s.l}</p>
                  <p className={`text-sm font-bold mt-1 ${s.c}`}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle grid: Daily PL + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#f5c518]" />
              <h3 className="font-semibold">Daily P/L Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyPL}>
                <XAxis dataKey="d" tick={{ fill: "#ffffff50", fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#0e1430", border: "1px solid #1a2347", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v}`, "P/L"]}
                />
                <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                  {dailyPL.map((d, i) => (
                    <Cell key={i} fill={d.c} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Performance Heatmap</h3>
              <span className="text-[10px] tracking-wider text-white/40">BY SESSION / DAY</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-white/40 font-semibold">{d}</div>
              ))}
            </div>
            <div className="space-y-1.5">
              {heatmap.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 gap-1.5">
                  {row.map((v, ci) => (
                    <div key={ci} title={`P/L score: ${v.toFixed(1)}`} className={`aspect-square rounded ${heatColor(v)} hover:scale-110 transition cursor-pointer`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-[10px] tracking-wider text-white/40">
              <span>LOSS</span>
              <div className="flex-1 mx-3 h-1.5 rounded-full bg-gradient-to-r from-[#ef4444] via-[#2f6bff] to-[#f5c518]" />
              <span>PROFIT</span>
            </div>
          </div>
        </div>

        {/* Trades table */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-semibold">Trade History — Forex & Crypto</h3>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search asset..."
                  className="pl-8 pr-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs w-44 focus:outline-none focus:border-[#f5c518]"
                />
              </div>
              <div className="flex bg-black/30 rounded-lg p-0.5 text-[10px] font-bold">
                {(["All", "Crypto", "Forex"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAssetFilter(f)}
                    className={`px-3 py-1.5 rounded-md transition ${
                      assetFilter === f ? "bg-[#2f6bff] text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#f5c518] text-black text-xs font-bold hover:brightness-110"
              >
                <Plus className="w-3.5 h-3.5" /> ADD TRADE
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-[10px] tracking-wider text-white/40 border-b border-white/5">
                  <th className="text-left py-2 font-semibold">ASSET</th>
                  <th className="text-left py-2 font-semibold">TYPE</th>
                  <th className="text-left py-2 font-semibold">SIDE</th>
                  <th className="text-right py-2 font-semibold">ENTRY</th>
                  <th className="text-right py-2 font-semibold">P/L</th>
                  <th className="text-right py-2 font-semibold">DATE</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTrades.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold ${t.type === "Crypto" ? "bg-[#f5c518]/15 text-[#f5c518]" : "bg-[#2f6bff]/15 text-[#2f6bff]"}`}>
                            {t.sym.slice(0, 3)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{t.sym}</p>
                            <p className="text-[10px] text-white/40">{t.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-white/70">{t.type}</td>
                      <td>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${t.side === "LONG" ? "bg-[#2f6bff]/20 text-[#2f6bff]" : "bg-[#ef4444]/20 text-[#ef4444]"}`}>
                          {t.side}
                        </span>
                      </td>
                      <td className="text-right font-mono">${t.price.toLocaleString()}</td>
                      <td className={`text-right font-mono font-bold ${t.pnl >= 0 ? "text-[#f5c518]" : "text-[#ef4444]"}`}>
                        {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                      </td>
                      <td className="text-right text-xs text-white/50">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => deleteTrade(t.id)}
                          className="text-white/30 hover:text-[#ef4444] transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredTrades.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-white/40 text-sm">
                      No trades match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom grid: AI + Emotional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5c518]/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#f5c518]" />
              </div>
              <div>
                <h3 className="font-semibold">AI Improvement Suggestions</h3>
                <p className="text-[10px] tracking-wider text-white/40">BASED ON YOUR LIVE DATA</p>
              </div>
            </div>

            {[
              { icon: Timer, title: "Premature Exits Identified", body: "Your average hold time on winning trades is 14% below your 20-day average. Hold to target for ~$3.2K/mo upside." },
              { icon: Scale, title: "Sizing Inconsistency", body: "Standardize position sizing on high-volatility pairs. Over-leveraging on BTC/USD during London open." },
              { icon: Brain, title: "Emotion Alert: Revenge Trading", body: "Detected 3 immediate re-entries after a loss last week. These trades have an 82% failure rate." },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl bg-black/30 border border-white/5 p-4 flex gap-3"
              >
                <s.icon className="w-4 h-4 text-[#f5c518] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{s.title}</p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#f5c518]" />
              <h3 className="font-semibold">Emotional Log</h3>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/60">Focus Level</span>
                <span className="text-[#f5c518] font-bold tracking-wider text-[11px]">{focus}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
                className="w-full accent-[#f5c518]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/60">Stress Indication</span>
                <span className="text-[#ef4444] font-bold tracking-wider text-[11px]">{stress}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full accent-[#ef4444]"
              />
            </div>

            <div className="rounded-xl bg-black/30 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-wider text-white/40">JOURNAL ENTRY</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#f5c518] text-black">LATEST</span>
              </div>
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                rows={4}
                className="w-full bg-transparent text-xs text-white/80 leading-relaxed focus:outline-none resize-none"
                placeholder="Reflect on today's trading..."
              />
              <button
                onClick={() => toast.success("Journal saved")}
                className="mt-2 text-[10px] font-bold tracking-wider text-[#f5c518] hover:underline"
              >
                SAVE ENTRY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Trade Modal */}
      <AnimatePresence>
        {showAdd && (
          <AddTradeModal
            onClose={() => setShowAdd(false)}
            onSave={(t) => {
              setTrades((cur) => [t, ...cur]);
              setShowAdd(false);
              toast.success("Trade added");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AddTradeModal = ({ onClose, onSave }: { onClose: () => void; onSave: (t: Trade) => void }) => {
  const [symIdx, setSymIdx] = useState(0);
  const [side, setSide] = useState<"LONG" | "SHORT">("LONG");
  const [price, setPrice] = useState("");
  const [pnl, setPnl] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = ASSETS[symIdx];
    if (!price) return toast.error("Enter entry price");
    onSave({
      id: crypto.randomUUID(),
      sym: asset.sym,
      name: asset.name,
      type: asset.type,
      side,
      price: Number(price),
      pnl: Number(pnl) || 0,
      date: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-[#0e1430] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 text-white"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Add Trade</h3>
          <button type="button" onClick={onClose} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">Asset</label>
          <select
            value={symIdx}
            onChange={(e) => setSymIdx(Number(e.target.value))}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#f5c518]"
          >
            <optgroup label="Crypto">
              {ASSETS.map((a, i) => a.type === "Crypto" && <option key={a.sym} value={i}>{a.sym} — {a.name}</option>)}
            </optgroup>
            <optgroup label="Forex">
              {ASSETS.map((a, i) => a.type === "Forex" && <option key={a.sym} value={i}>{a.sym} — {a.name}</option>)}
            </optgroup>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Side</label>
            <div className="flex bg-black/30 rounded-lg p-0.5">
              {(["LONG", "SHORT"] as const).map((s) => (
                <button
                  key={s} type="button" onClick={() => setSide(s)}
                  className={`flex-1 py-2 rounded-md text-xs font-bold transition ${
                    side === s ? (s === "LONG" ? "bg-[#2f6bff]" : "bg-[#ef4444]") : "text-white/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block">Entry Price</label>
            <input
              type="number" step="any" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#f5c518]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60 mb-1.5 block">P/L ($)</label>
          <input
            type="number" step="any" value={pnl} onChange={(e) => setPnl(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#f5c518]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#f5c518] text-black font-bold hover:brightness-110 transition"
        >
          Save Trade
        </button>
      </motion.form>
    </motion.div>
  );
};

export default TradingReport;
