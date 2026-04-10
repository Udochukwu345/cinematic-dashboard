import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, ArrowDown, ArrowUp, RefreshCw, Copy, QrCode, Wallet, Clock } from "lucide-react";

const balances = [
  { asset: "Bitcoin", symbol: "BTC", balance: "1.2400", value: "$84,845", icon: "₿", color: "hsl(36 100% 50%)" },
  { asset: "Ethereum", symbol: "ETH", balance: "12.5000", value: "$48,090", icon: "Ξ", color: "hsl(228 60% 60%)" },
  { asset: "Solana", symbol: "SOL", balance: "180.00", value: "$32,202", icon: "◎", color: "hsl(280 70% 60%)" },
  { asset: "USDT", symbol: "USDT", balance: "15,000.00", value: "$15,000", icon: "$", color: "hsl(160 70% 45%)" },
];

const transactions = [
  { type: "receive", asset: "BTC", amount: "+0.0500", value: "$3,421", time: "Today, 2:34 PM", from: "0x3f...a8c2" },
  { type: "send", asset: "ETH", amount: "-2.0000", value: "$7,694", time: "Today, 11:20 AM", from: "0x7b...f1e9" },
  { type: "swap", asset: "SOL → USDT", amount: "20 SOL", value: "$3,578", time: "Yesterday", from: "DEX" },
  { type: "receive", asset: "USDT", amount: "+5,000", value: "$5,000", time: "Apr 7, 2026", from: "0x1a...d4b7" },
  { type: "send", asset: "BTC", amount: "-0.0200", value: "$1,368", time: "Apr 6, 2026", from: "0x9c...e2f3" },
];

const typeIcon = (t: string) => t === "receive" ? <ArrowDown className="w-4 h-4 text-green-400" /> : t === "send" ? <ArrowUp className="w-4 h-4 text-red-400" /> : <RefreshCw className="w-4 h-4 text-blue-400" />;
const typeBg = (t: string) => t === "receive" ? "bg-green-400/10" : t === "send" ? "bg-red-400/10" : "bg-blue-400/10";

const WalletPage = () => (
  <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wallet</h1>
      <p className="text-sm text-muted-foreground mt-1">Manage your crypto assets</p>
    </motion.div>

    {/* Total Balance */}
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5 md:p-6">
      <span className="text-xs text-muted-foreground">Total Balance</span>
      <p className="text-3xl md:text-4xl font-bold text-foreground mt-1">$180,137</p>
      <span className="text-sm text-green-400 flex items-center gap-1 mt-1"><ArrowUpRight className="w-4 h-4" />+3.2% today</span>
      <div className="flex gap-2 mt-4">
        {[{ label: "Send", icon: ArrowUp }, { label: "Receive", icon: ArrowDown }, { label: "Swap", icon: RefreshCw }].map((a) => (
          <button key={a.label} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium text-foreground transition-colors">
            <a.icon className="w-4 h-4" />{a.label}
          </button>
        ))}
      </div>
    </motion.div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
      {/* Assets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border"><h2 className="text-base font-semibold text-foreground">Assets</h2></div>
        {balances.map((b, i) => (
          <motion.div key={b.symbol} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }} className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${b.color}20` }}>
                <span className="text-sm font-bold" style={{ color: b.color }}>{b.icon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{b.asset}</p>
                <p className="text-xs text-muted-foreground">{b.balance} {b.symbol}</p>
              </div>
            </div>
            <span className="text-sm font-mono font-semibold text-foreground">{b.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border"><h2 className="text-base font-semibold text-foreground">Recent Transactions</h2></div>
        {transactions.map((tx, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.04 }} className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeBg(tx.type)}`}>{typeIcon(tx.type)}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground capitalize">{tx.type} {tx.asset}</p>
                <p className="text-xs text-muted-foreground truncate">{tx.from}</p>
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className={`text-sm font-mono font-medium ${tx.type === "receive" ? "text-green-400" : tx.type === "send" ? "text-red-400" : "text-foreground"}`}>{tx.amount}</p>
              <p className="text-[11px] text-muted-foreground">{tx.time}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default WalletPage;
