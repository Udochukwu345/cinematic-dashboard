import { motion } from "framer-motion";
import { useState } from "react";
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

const YELLOW = "#f5c518";
const BLUE = "#2f6bff";
const RED = "#ef4444";

const equityData = Array.from({ length: 24 }, (_, i) => ({
  d: i,
  v: 10000 + i * 900 + Math.sin(i / 1.5) * 2400 + (i > 12 ? i * 600 : 0),
}));

const dailyPL = [
  { d: "Oct 10", v: 1200, c: BLUE },
  { d: "Oct 11", v: 800, c: BLUE },
  { d: "Oct 12", v: -600, c: RED },
  { d: "Oct 13", v: 2400, c: YELLOW },
  { d: "Oct 14", v: 3200, c: YELLOW },
  { d: "Oct 15", v: -900, c: RED },
  { d: "Oct 16", v: 2100, c: YELLOW },
  { d: "Oct 17", v: 1500, c: BLUE },
  { d: "Oct 18", v: 1800, c: BLUE },
  { d: "Oct 19", v: 2600, c: YELLOW },
  { d: "Oct 20", v: -400, c: RED },
  { d: "Oct 21", v: 1400, c: BLUE },
  { d: "Oct 22", v: 900, c: BLUE },
  { d: "Oct 24", v: 2800, c: YELLOW },
];

// 3 rows x 7 days, values -1..1
const heatmap: number[][] = [
  [-1, 0.4, -1, 0.6, -0.9, 0, 0],
  [0.5, -0.7, 1, 0.4, 0.4, 0, 0],
  [0.5, -1, 0.5, -0.9, 1, 0, 0],
];
const heatColor = (v: number) => {
  if (v === 0) return "bg-white/[0.03] border border-white/5";
  if (v >= 0.8) return "bg-[#f5c518]";
  if (v > 0) return "bg-[#2f6bff]";
  if (v <= -0.8) return "bg-[#ef4444]";
  return "bg-[#ef4444]/70";
};

const TradingReport = () => {
  const [range, setRange] = useState<"1M" | "3M" | "ALL">("1M");
  const winRate = 68.4;
  const circ = 2 * Math.PI * 70;
  const offset = circ - (winRate / 100) * circ;

  return (
    <div className="flex-1 overflow-auto bg-[#070b1a]">
      <div className="max-w-md mx-auto p-5 space-y-5 text-white">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-bold leading-tight">
            Trading Report: Q3 Performance
          </h1>
          <p className="text-xs text-white/50">
            Last updated: Oct 24, 2023 • Live Data Stream Active
          </p>
          <div className="flex gap-3 pt-1">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition">
              <Download className="w-3.5 h-3.5" /> EXPORT PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f5c518] text-black text-xs font-bold hover:brightness-110 transition">
              <Share2 className="w-3.5 h-3.5" /> SHARE REPORT
            </button>
          </div>
        </motion.div>

        {/* Win Rate */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-6">
          <p className="text-[11px] tracking-[0.2em] text-white/50 font-semibold">
            WIN RATE
          </p>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-56 h-56">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#1a2347" strokeWidth="10" fill="none" />
                <motion.circle
                  cx="80" cy="80" r="70"
                  stroke={YELLOW}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 12px ${YELLOW})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-[#f5c518]">{winRate}%</p>
                <p className="text-[10px] tracking-[0.2em] text-white/50 mt-1">TARGET: 65%</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-sm pt-3">
              <span className="text-white/70">Profit Factor</span>
              <span className="font-bold text-[#f5c518]">2.84</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70">Risk-Reward</span>
              <span className="font-mono font-bold">1:2.4</span>
            </div>
          </div>
        </div>

        {/* Equity Curve */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
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
                    range === r ? "bg-[#f5c518] text-black" : "text-white/50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={equityData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BLUE} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" hide />
              <YAxis hide domain={["dataMin - 1000", "dataMax + 1000"]} />
              <Tooltip
                contentStyle={{ background: "#0e1430", border: "1px solid #1a2347", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="v" stroke={BLUE} strokeWidth={2.5} fill="url(#eq)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-4 gap-2 pt-4 mt-2 border-t border-white/5">
            {[
              { l: "TOTAL P/L", v: "+$42,890.00", c: "text-[#f5c518]" },
              { l: "DRAWDOWN", v: "4.2%", c: "text-[#ef4444]" },
              { l: "MAX RUN-UP", v: "+$8,400", c: "text-[#f5c518]" },
              { l: "AV. TRADE", v: "$1,240", c: "text-white" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-[9px] tracking-wider text-white/40">{s.l}</p>
                <p className={`text-xs font-bold mt-1 ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily P/L Distribution */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[#f5c518]" />
            <h3 className="font-semibold">Daily P/L Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyPL}>
              <XAxis dataKey="d" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#0e1430", border: "1px solid #1a2347", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                {dailyPL.map((d, i) => (
                  <Cell key={i} fill={d.c} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[10px] tracking-wider text-white/40 mt-2">
            <span>OCT 10</span>
            <span>OCT 24</span>
          </div>
        </div>

        {/* Performance Heatmap */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-[#f5c518] rounded-[1px]" />
                <div className="bg-[#2f6bff] rounded-[1px]" />
                <div className="bg-[#2f6bff] rounded-[1px]" />
                <div className="bg-[#f5c518] rounded-[1px]" />
              </div>
              <h3 className="font-semibold">Performance Heatmap</h3>
            </div>
            <span className="text-[10px] tracking-wider text-white/40">BY HOUR / DAY</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-white/40 font-semibold">
                {d}
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {heatmap.map((row, ri) => (
              <div key={ri} className="grid grid-cols-7 gap-1.5">
                {row.map((v, ci) => (
                  <div key={ci} className={`aspect-square rounded ${heatColor(v)}`} />
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

        {/* AI Suggestions */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#f5c518]/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#f5c518]" />
            </div>
            <div>
              <h3 className="font-semibold">AI Improvement Suggestions</h3>
              <p className="text-[10px] tracking-wider text-white/40">PROCESSING LIVE BEHAVIORAL DATA</p>
            </div>
          </div>

          {[
            {
              icon: Timer,
              title: "Premature Exits Identified",
              body:
                "Your average hold time on winning trades is 14% below the 20-day moving average. Hold until your original target for +$3,200/mo estimated gain.",
            },
            {
              icon: Scale,
              title: "Sizing Inconsistency",
              body:
                "Standardize position sizing on high-volatility pairs. You are over-leveraging on BTC-USD during London open sessions.",
            },
            {
              icon: Brain,
              title: "Emotion Alert: Revenge Trading",
              body:
                "Detected 3 instances of immediate re-entry after a loss last week. Data shows these trades have an 82% failure rate.",
            },
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

        {/* Emotional Log */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-[#f5c518]" />
            <h3 className="font-semibold">Emotional Log</h3>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/60">Focus Level</span>
              <span className="text-[#f5c518] font-bold tracking-wider text-[11px]">HIGH</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#f5c518]" style={{ width: "85%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/60">Stress Indication</span>
              <span className="text-[#ef4444] font-bold tracking-wider text-[11px]">MODERATE</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#ef4444]" style={{ width: "55%" }} />
            </div>
          </div>

          <div className="rounded-xl bg-black/30 border border-white/5 p-4 relative">
            <p className="text-[10px] tracking-wider text-white/40 mb-2">LATEST JOURNAL ENTRY</p>
            <span className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded bg-[#f5c518] text-black">
              LATEST
            </span>
            <p className="text-xs text-white/70 leading-relaxed">
              "Missed the breakout on ETH, felt some FOMO but stayed out. Disciplined execution on the reversal later.
              Need to trust the daily bias more..."
            </p>
          </div>
        </div>

        {/* Recent Trade Execution */}
        <div className="rounded-2xl bg-[#0e1430] border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Trade Execution</h3>
            <button className="text-[10px] font-bold tracking-wider text-[#f5c518]">VIEW FULL HISTORY</button>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 text-[10px] tracking-wider text-white/40 pb-3 border-b border-white/5">
            <span>ASSET</span>
            <span>TYPE</span>
            <span>ENTRY</span>
          </div>
          {[
            { sym: "BTC", name: "Bitcoin", date: "Oct 24, 09:12", side: "LONG", price: "$34,210.56", sideClass: "bg-[#2f6bff]/20 text-[#2f6bff]" },
            { sym: "ETH", name: "Ethereum", date: "Oct 23, 14:45", side: "SHORT", price: "$1,850.00", sideClass: "bg-[#ef4444]/20 text-[#ef4444]" },
          ].map((t) => (
            <div key={t.sym} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                  {t.sym}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-[10px] text-white/40">{t.date}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${t.sideClass}`}>{t.side}</span>
              <span className="font-mono text-sm">{t.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingReport;
