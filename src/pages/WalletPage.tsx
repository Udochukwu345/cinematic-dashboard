import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDown, ArrowUp, RefreshCw, Wallet, ExternalLink, CheckCircle, XCircle, Link2, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useWalletConnectors, SUPPORTED_WALLETS } from "@/hooks/useWalletConnectors";

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

const typeIcon = (t: string) =>
  t === "receive" ? <ArrowDown className="w-4 h-4 text-green-400" /> :
  t === "send" ? <ArrowUp className="w-4 h-4 text-red-400" /> :
  <RefreshCw className="w-4 h-4 text-blue-400" />;

const typeBg = (t: string) =>
  t === "receive" ? "bg-green-400/10" :
  t === "send" ? "bg-red-400/10" :
  "bg-blue-400/10";

const WalletPage = () => {
  const { connectedWallets, connecting, connect, disconnect, getConnectedWallet } = useWalletConnectors();
  const [showConnect, setShowConnect] = useState(false);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your crypto assets & connected wallets</p>
        </div>
        <button
          onClick={() => setShowConnect(!showConnect)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Link2 className="w-4 h-4" />
          {showConnect ? "Hide Wallets" : "Connect Wallet"}
        </button>
      </motion.div>

      {/* Connect Wallet Panel */}
      <AnimatePresence>
        {showConnect && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 md:p-5">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" /> Connect a Wallet
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SUPPORTED_WALLETS.map((wallet, i) => {
                  const connected = getConnectedWallet(wallet.id);
                  const isConnecting = connecting === wallet.id;
                  return (
                    <motion.div
                      key={wallet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`relative border rounded-xl p-4 transition-all ${
                        connected
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-secondary/20 hover:border-primary/20 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: `${wallet.color}15` }}
                          >
                            {wallet.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{wallet.name}</p>
                            <p className="text-xs text-muted-foreground">{wallet.description}</p>
                          </div>
                        </div>
                        {connected && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
                      </div>

                      {/* Connected address */}
                      {connected && (
                        <div className="mb-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border/50">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs font-mono text-muted-foreground truncate">
                            {connected.address.slice(0, 8)}...{connected.address.slice(-6)}
                          </span>
                          <button
                            onClick={() => copyAddress(connected.address)}
                            className="ml-auto shrink-0 p-1 rounded hover:bg-secondary/60 transition-colors"
                          >
                            <Copy className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-3">
                        {wallet.chains.map((chain) => (
                          <span key={chain} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground font-medium">
                            {chain}
                          </span>
                        ))}
                        {connected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 font-medium">
                            {connected.chain}
                          </span>
                        )}
                      </div>

                      {connected ? (
                        <button
                          onClick={() => disconnect(wallet.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-400/30 text-red-400 text-xs font-medium hover:bg-red-400/10 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => connect(wallet.id)}
                          disabled={isConnecting}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                          {isConnecting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3.5 h-3.5" /> Connect
                            </>
                          )}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Wallets Summary */}
      {connectedWallets.length > 0 && !showConnect && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Connected Wallets</h2>
          <div className="flex flex-wrap gap-2">
            {connectedWallets.map((cw) => {
              const wallet = SUPPORTED_WALLETS.find((w) => w.id === cw.id);
              return (
                <div key={cw.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-sm">{wallet?.icon}</span>
                  <span className="text-xs font-medium text-foreground">{wallet?.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {cw.address.slice(0, 4)}...{cw.address.slice(-4)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400">
                    {cw.chain}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Total Balance */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-5 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <span className="text-xs text-muted-foreground">Total Balance</span>
          {connectedWallets.length > 0 && (
            <span className="text-xs text-green-400 font-medium">{connectedWallets.length} wallet{connectedWallets.length > 1 ? "s" : ""} connected</span>
          )}
        </div>
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
};

export default WalletPage;
