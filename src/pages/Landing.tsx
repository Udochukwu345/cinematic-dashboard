import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";

const YELLOW = "#FFD23F";
const BLUE = "#3B5BFF";

const features = [
  { icon: TrendingUp, title: "Advanced Trading", desc: "Real-time market data and advanced charting tools for professional traders.", color: YELLOW },
  { icon: Shield, title: "Bank Level Security", desc: "Multi-layer security with cold storage and 2FA protection.", color: BLUE },
  { icon: Zap, title: "Lightning Fast", desc: "Execute trades instantly with our high-performance infrastructure.", color: YELLOW },
  { icon: Users, title: "Global Community", desc: "Join millions of traders worldwide sharing insights and strategies.", color: BLUE },
];

const stats = [
  { val: "5M+", label: "Active Users", color: YELLOW },
  { val: "$2B+", label: "Daily Volume", color: BLUE },
  { val: "200+", label: "Countries", color: YELLOW },
  { val: "99.9%", label: "Uptime", color: BLUE },
];

// Animated Tradexa app icon (chart with rising arrow)
const TradexaIcon = ({ size = 96 }: { size?: number }) => (
  <div
    className="relative rounded-2xl overflow-hidden flex items-center justify-center"
    style={{
      width: size,
      height: size,
      background: "linear-gradient(145deg, #0b1a4a, #050a25)",
      boxShadow: `0 12px 40px -8px ${BLUE}80, inset 0 1px 0 rgba(255,255,255,0.08)`,
      border: `1px solid ${BLUE}40`,
    }}
  >
    {/* Grid */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `linear-gradient(${BLUE}55 1px, transparent 1px), linear-gradient(90deg, ${BLUE}55 1px, transparent 1px)`,
        backgroundSize: `${size / 8}px ${size / 8}px`,
      }}
    />
    {/* Candles */}
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-3">
      {[
        { x: 12, y: 55, h: 22, up: false },
        { x: 24, y: 45, h: 30, up: true },
        { x: 36, y: 50, h: 18, up: false },
        { x: 48, y: 35, h: 35, up: true },
        { x: 60, y: 40, h: 22, up: true },
        { x: 72, y: 28, h: 38, up: true },
      ].map((c, i) => (
        <motion.rect
          key={i}
          x={c.x}
          width="6"
          fill={c.up ? YELLOW : BLUE}
          initial={{ y: 100, height: 0 }}
          animate={{ y: c.y, height: c.h }}
          transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
          rx="1"
        />
      ))}
      <motion.path
        d="M10 70 L30 55 L50 60 L70 35 L90 20"
        fill="none"
        stroke={YELLOW}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      />
      <motion.polygon
        points="90,20 84,18 88,28"
        fill={YELLOW}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      />
    </svg>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden font-[Fira_Sans]"
      style={{ background: "radial-gradient(ellipse at top, #1a1547 0%, #07061f 60%, #03030f 100%)" }}
    >
      {/* Ambient color blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${BLUE}50, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, #6b21a880, transparent 70%)` }}
        />
      </div>

      {/* === ANIMATED WATERMARK LOGO === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.07, scale: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div style={{ filter: "blur(0.5px)" }}>
            <TradexaIcon size={360} />
          </div>
          <div
            className="font-[DM_Serif_Display] text-[12rem] leading-none tracking-tight"
            style={{ color: YELLOW }}
          >
            Tradexa
          </div>
        </motion.div>
      </motion.div>

      {/* Nav */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TradexaIcon size={40} />
          <span className="font-[DM_Serif_Display] text-2xl" style={{ color: YELLOW }}>
            Tradexa
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-white/70 hover:text-white transition"
        >
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4 mb-10"
        >
          <TradexaIcon size={110} />
          <span className="font-[DM_Serif_Display] text-3xl" style={{ color: YELLOW }}>
            Tradexa
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white"
        >
          The Most
          <br />
          Trusted &amp; Secure
          <br />
          Forex Trading Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-white/60 text-lg max-w-xl mx-auto"
        >
          Best trading platform and more reliable financial transactions.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05, boxShadow: `0 20px 50px -10px ${YELLOW}` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(user ? "/dashboard" : "/login?mode=signup")}
          className="mt-10 px-10 py-4 rounded-full font-semibold text-lg text-[#1a1547]"
          style={{ background: YELLOW, boxShadow: `0 12px 40px -10px ${YELLOW}` }}
        >
          Get Started
        </motion.button>
      </section>

      {/* WHY CHOOSE */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[DM_Serif_Display] text-3xl sm:text-4xl text-center text-white mb-12"
        >
          Why Choose Tradexa?
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative p-6 rounded-2xl backdrop-blur-sm"
              style={{
                background: "rgba(10, 8, 35, 0.6)",
                border: `2px solid ${f.color}`,
                boxShadow: `0 0 24px -6px ${f.color}50`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${f.color}25`,
                  border: `1px solid ${f.color}60`,
                }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-[DM_Serif_Display] text-2xl mb-2 text-white">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pb-32">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-bold text-4xl sm:text-5xl" style={{ color: s.color }}>
                {s.val}
              </p>
              <p className="text-sm text-white/60 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-sm text-white/40">
        © 2026 Tradexa — Trade with precision.
      </footer>
    </div>
  );
};

export default Landing;
