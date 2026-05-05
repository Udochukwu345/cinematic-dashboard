import { motion } from "framer-motion";
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus, Flame } from "lucide-react";

const articles = [
  { title: "Bitcoin Surges Past $68K as Institutional Inflows Hit Record Highs", source: "CoinDesk", time: "2h ago", sentiment: "bullish", hot: true, summary: "BlackRock's Bitcoin ETF saw $780M in single-day inflows, pushing BTC past key resistance levels.", url: "https://www.coindesk.com/markets" },
  { title: "Ethereum Layer 2 TVL Reaches All-Time High of $45B", source: "The Block", time: "4h ago", sentiment: "bullish", hot: true, summary: "Arbitrum and Base lead the charge as L2 ecosystem experiences unprecedented growth in Q2 2026.", url: "https://www.theblock.co/latest" },
  { title: "SEC Delays Decision on Solana ETF Applications", source: "Reuters", time: "6h ago", sentiment: "neutral", hot: false, summary: "The Securities and Exchange Commission has pushed back its deadline for reviewing multiple Solana ETF filings.", url: "https://www.reuters.com/technology/" },
  { title: "DeFi Protocol Suffers $12M Exploit on Arbitrum", source: "Decrypt", time: "8h ago", sentiment: "bearish", hot: false, summary: "A flash loan attack targeted an unaudited lending protocol, resulting in significant losses for liquidity providers.", url: "https://decrypt.co/news" },
  { title: "Ripple Partners with Major Asian Banks for Cross-Border Payments", source: "Bloomberg", time: "10h ago", sentiment: "bullish", hot: false, summary: "Three of Asia's largest banks join Ripple's payment network, expanding XRP's institutional use case.", url: "https://www.bloomberg.com/crypto" },
  { title: "Federal Reserve Signals Potential Rate Cut in June Meeting", source: "CNBC", time: "12h ago", sentiment: "bullish", hot: true, summary: "Fed Chair hints at easing monetary policy as inflation data continues to cool, boosting risk asset sentiment.", url: "https://www.cnbc.com/finance/" },
];

const feeds = [
  { name: "CoinDesk", url: "https://www.coindesk.com" },
  { name: "The Block", url: "https://www.theblock.co" },
  { name: "Decrypt", url: "https://decrypt.co" },
  { name: "Bloomberg Crypto", url: "https://www.bloomberg.com/crypto" },
  { name: "Reuters", url: "https://www.reuters.com" },
  { name: "CNBC", url: "https://www.cnbc.com/finance/" },
];

const sentimentIcon = (s: string) => s === "bullish" ? <TrendingUp className="w-3.5 h-3.5 text-green-400" /> : s === "bearish" ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> : <Minus className="w-3.5 h-3.5 text-yellow-400" />;
const sentimentStyle = (s: string) => s === "bullish" ? "bg-green-400/10 text-green-400" : s === "bearish" ? "bg-red-400/10 text-red-400" : "bg-yellow-400/10 text-yellow-400";

const News = () => (
  <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">News</h1>
      <p className="text-sm text-muted-foreground mt-1">Latest crypto & market headlines — tap any article to read on the source</p>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="flex flex-wrap gap-2">
      {feeds.map((f) => (
        <a
          key={f.name}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-full glass-card hover:border-primary/40 hover:text-primary transition-colors"
        >
          {f.name} ↗
        </a>
      ))}
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3 md:space-y-4">
      {articles.map((a, i) => (
        <motion.a
          key={i}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="block glass-card p-4 md:p-5 hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{a.title}</h2>
            <div className="flex items-center gap-1.5 shrink-0">
              {a.hot && <Flame className="w-4 h-4 text-orange-400" />}
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{a.summary}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</span>
            <span className="text-[11px] text-muted-foreground">{a.source}</span>
            <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md capitalize ${sentimentStyle(a.sentiment)}`}>
              {sentimentIcon(a.sentiment)} {a.sentiment}
            </span>
          </div>
        </motion.a>
      ))}
    </motion.div>
  </div>
);

export default News;
