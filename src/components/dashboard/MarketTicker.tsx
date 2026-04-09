import { TrendingUp, TrendingDown } from "lucide-react";

const tickers = [
  { symbol: "BTC", price: "67,234.50", change: "+2.34%", up: true },
  { symbol: "ETH", price: "3,456.78", change: "-0.87%", up: false },
  { symbol: "NVDA", price: "875.44", change: "+3.82%", up: true },
  { symbol: "MSFT", price: "421.56", change: "+0.89%", up: true },
  { symbol: "EUR/USD", price: "1.0842", change: "-0.12%", up: false },
  { symbol: "GBP/USD", price: "1.2734", change: "+0.08%", up: true },
  { symbol: "GOLD", price: "2,342.10", change: "+0.64%", up: true },
  { symbol: "OIL", price: "78.34", change: "-2.11%", up: false },
  { symbol: "SOL", price: "142.67", change: "+5.21%", up: true },
  { symbol: "AAPL", price: "198.45", change: "+1.12%", up: true },
];

const MarketTicker = () => (
  <div className="w-full bg-card/50 border-b border-border overflow-hidden">
    <div className="ticker-scroll flex items-center gap-8 py-2.5 px-4 whitespace-nowrap" style={{ width: "max-content" }}>
      {[...tickers, ...tickers].map((t, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{t.symbol}</span>
          <span className="text-muted-foreground font-mono">{t.price}</span>
          <span className={`flex items-center gap-0.5 font-medium ${t.up ? "text-chart-green" : "text-chart-red"}`}>
            {t.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {t.change}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default MarketTicker;
