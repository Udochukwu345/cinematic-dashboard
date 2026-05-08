import { ExternalLink, ShieldCheck } from "lucide-react";

const brokers = [
  { name: "Exness", url: "https://www.exness.com", desc: "Tight spreads, instant withdrawals", tag: "Popular" },
  { name: "HFM", url: "https://www.hfm.com", desc: "HotForex — global multi-asset broker", tag: "Verified" },
  { name: "XM", url: "https://www.xm.com", desc: "1000+ instruments, low minimums", tag: "Verified" },
  { name: "FXTM", url: "https://www.fxtm.com", desc: "ForexTime — copy trading & education", tag: "Verified" },
  { name: "Octa", url: "https://www.octabroker.com", desc: "Global broker with 300+ instruments", tag: "Verified" },
  { name: "Pepperstone", url: "https://pepperstone.com", desc: "Razor-thin spreads, fast execution", tag: "Top Rated" },
  { name: "IC Markets", url: "https://www.icmarkets.com", desc: "True ECN trading environment", tag: "Top Rated" },
  { name: "Deriv", url: "https://deriv.com", desc: "Synthetic indices & multipliers", tag: "Verified" },
  { name: "OANDA", url: "https://www.oanda.com", desc: "Award-winning forex since 1996", tag: "Verified" },
  { name: "BlackBull Markets", url: "https://blackbull.com", desc: "ECN broker from New Zealand", tag: "Verified" },
  { name: "FxPro", url: "https://www.fxpro.com", desc: "Trusted since 2006, multi-regulated", tag: "Verified" },
];

const Brokers = () => (
  <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Brokerage Firms</h1>
      <p className="text-sm md:text-base text-muted-foreground mt-1">
        Verified brokers available to registered Tradexa members.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {brokers.map((b) => (
        <a
          key={b.name}
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-5 group hover:border-primary/40 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold text-lg">
              {b.name[0]}
            </div>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="w-3 h-3" />
              {b.tag}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            {b.name}
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
        </a>
      ))}
    </div>
  </div>
);

export default Brokers;
