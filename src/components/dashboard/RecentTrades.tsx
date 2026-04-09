import { motion } from "framer-motion";

const trades = [
  { asset: "BTC/USDT", type: "Buy", amount: "0.5 BTC", price: "$33,617", time: "2 min ago", profit: true },
  { asset: "ETH/USDT", type: "Sell", amount: "2.0 ETH", price: "$6,913", time: "15 min ago", profit: false },
  { asset: "SOL/USDT", type: "Buy", amount: "25 SOL", price: "$3,566", time: "1 hr ago", profit: true },
  { asset: "ADA/USDT", type: "Buy", amount: "500 ADA", price: "$310", time: "3 hr ago", profit: true },
  { asset: "DOT/USDT", type: "Sell", amount: "50 DOT", price: "$391", time: "5 hr ago", profit: false },
];

const RecentTrades = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.5 }}
    className="glass-card p-6"
  >
    <h3 className="text-sm font-semibold text-foreground mb-4">Recent Trades</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border/50">
            <th className="text-left pb-3 font-medium">Pair</th>
            <th className="text-left pb-3 font-medium">Type</th>
            <th className="text-right pb-3 font-medium">Amount</th>
            <th className="text-right pb-3 font-medium">Price</th>
            <th className="text-right pb-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="border-b border-border/30 last:border-0"
            >
              <td className="py-3 text-sm font-medium text-foreground">{t.asset}</td>
              <td className="py-3">
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${t.type === "Buy" ? "bg-chart-green/10 text-chart-green" : "bg-chart-red/10 text-chart-red"}`}>
                  {t.type}
                </span>
              </td>
              <td className="py-3 text-sm text-right text-muted-foreground font-mono">{t.amount}</td>
              <td className="py-3 text-sm text-right text-foreground font-mono">{t.price}</td>
              <td className="py-3 text-xs text-right text-muted-foreground">{t.time}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default RecentTrades;
