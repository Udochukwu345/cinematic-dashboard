import { motion } from "framer-motion";

const FearGreedIndex = () => {
  const value = 71;
  const angle = (value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-6 flex flex-col items-center justify-center"
    >
      <p className="text-sm text-muted-foreground mb-4">Fear & Greed Index</p>

      <div className="relative w-48 h-28">
        {/* Gauge background */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 72%, 51%)" />
              <stop offset="25%" stopColor="hsl(25, 95%, 53%)" />
              <stop offset="50%" stopColor="hsl(48, 96%, 53%)" />
              <stop offset="75%" stopColor="hsl(120, 60%, 50%)" />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Needle */}
          <motion.line
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ delay: 0.8, duration: 1.2, type: "spring", damping: 15 }}
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="hsl(210, 40%, 98%)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transformOrigin: "100px 100px" }}
          />
          <circle cx="100" cy="100" r="5" fill="hsl(210, 40%, 98%)" />
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-4xl font-bold text-foreground mt-2"
      >
        {value}
      </motion.p>
      <p className="text-sm font-medium text-chart-green mt-1">Greed</p>
    </motion.div>
  );
};

export default FearGreedIndex;
