import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Calendar, Tag, TrendingUp, TrendingDown, X } from "lucide-react";
import { useState } from "react";

interface Note {
  id: number;
  title: string;
  asset: string;
  type: "long" | "short";
  date: string;
  entry: string;
  exit: string;
  pnl: string;
  pnlPositive: boolean;
  notes: string;
  tags: string[];
}

const initialNotes: Note[] = [
  { id: 1, title: "BTC Breakout Trade", asset: "BTC/USD", type: "long", date: "Apr 8, 2026", entry: "$67,200", exit: "$68,900", pnl: "+$2,125", pnlPositive: true, notes: "Entered on 4H golden cross confirmation. Clean breakout above $67k resistance with volume.", tags: ["breakout", "swing"] },
  { id: 2, title: "ETH Support Bounce", asset: "ETH/USD", type: "long", date: "Apr 7, 2026", entry: "$3,780", exit: "$3,850", pnl: "+$875", pnlPositive: true, notes: "Bounced perfectly off the 50 EMA on daily. Took profit at the 0.618 fib extension.", tags: ["support", "fib"] },
  { id: 3, title: "SOL Reversal Missed", asset: "SOL/USD", type: "short", date: "Apr 5, 2026", entry: "$182", exit: "$186", pnl: "-$400", pnlPositive: false, notes: "Should have waited for confirmation. Entered too early on the reversal signal.", tags: ["reversal", "lesson"] },
  { id: 4, title: "AVAX Range Play", asset: "AVAX/USD", type: "long", date: "Apr 3, 2026", entry: "$40.50", exit: "$43.20", pnl: "+$540", pnlPositive: true, notes: "Range-bound play between $40 and $44. Took partial profits near upper range.", tags: ["range", "scalp"] },
];

const TradeNotes = () => {
  const [notes] = useState<Note[]>(initialNotes);
  const [selected, setSelected] = useState<Note | null>(null);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Trade Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Journal your trades and track performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Trades", value: "24" },
          { label: "Win Rate", value: "71%" },
          { label: "Total P&L", value: "+$12,450" },
          { label: "Avg Gain", value: "+$518" },
        ].map((s, i) => (
          <div key={s.label} className="glass-card p-3 md:p-4">
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
            <p className="text-lg md:text-xl font-bold text-foreground mt-0.5">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Notes Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            onClick={() => setSelected(note)}
            className="glass-card p-4 cursor-pointer hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${note.type === "long" ? "bg-green-400/10" : "bg-red-400/10"}`}>
                  {note.type === "long" ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{note.title}</p>
                  <p className="text-xs text-muted-foreground">{note.asset}</p>
                </div>
              </div>
              <span className={`text-sm font-mono font-bold ${note.pnlPositive ? "text-green-400" : "text-red-400"}`}>{note.pnl}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{note.notes}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {note.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] text-muted-foreground">{t}</span>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{note.date}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-5 md:p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-foreground">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Asset</span><span className="text-foreground font-medium">{selected.asset}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Direction</span><span className={`font-medium capitalize ${selected.type === "long" ? "text-green-400" : "text-red-400"}`}>{selected.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Entry</span><span className="text-foreground font-mono">{selected.entry}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Exit</span><span className="text-foreground font-mono">{selected.exit}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">P&L</span><span className={`font-mono font-bold ${selected.pnlPositive ? "text-green-400" : "text-red-400"}`}>{selected.pnl}</span></div>
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground text-xs mb-1">Notes</p>
                  <p className="text-foreground text-sm">{selected.notes}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradeNotes;
