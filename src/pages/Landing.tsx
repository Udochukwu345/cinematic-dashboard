import { motion, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Shield, Zap, Users, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const YELLOW = "#FFD23F";
const BLUE = "#3B5BFF";
const PURPLE = "#8B5CF6";

const features = [
  { icon: TrendingUp, title: "Advanced Trading", desc: "Real-time market data and advanced charting tools for professional traders.", color: YELLOW },
  { icon: Shield, title: "Bank Level Security", desc: "Multi-layer security with cold storage and 2FA protection.", color: BLUE },
  { icon: Zap, title: "Lightning Fast", desc: "Execute trades instantly with our high-performance infrastructure.", color: YELLOW },
  { icon: Users, title: "Global Community", desc: "Join millions of traders worldwide sharing insights and strategies.", color: BLUE },
];

const stats = [
  { val: 5, suffix: "M+", label: "Active Users", color: YELLOW },
  { val: 2, suffix: "B+", prefix: "$", label: "Daily Volume", color: BLUE },
  { val: 200, suffix: "+", label: "Countries", color: YELLOW },
  { val: 99.9, suffix: "%", label: "Uptime", color: BLUE },
];

const tickerItems = [
  { sym: "BTC/USD", price: "67,432.10", chg: "+2.41%", up: true },
  { sym: "ETH/USD", price: "3,521.87", chg: "+1.82%", up: true },
  { sym: "EUR/USD", price: "1.0843", chg: "-0.12%", up: false },
  { sym: "GBP/USD", price: "1.2654", chg: "+0.34%", up: true },
  { sym: "SOL/USD", price: "182.45", chg: "+5.67%", up: true },
  { sym: "USD/JPY", price: "151.23", chg: "-0.21%", up: false },
  { sym: "XAU/USD", price: "2,341.50", chg: "+0.91%", up: true },
  { sym: "BNB/USD", price: "612.34", chg: "+1.23%", up: true },
];

// Animated counter
const Counter = ({ to, decimals = 0 }: { to: number; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const controls = animate(0, to, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (v) => setVal(v),
        });
        return () => controls.stop();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toFixed(decimals)}</span>;
};

// Floating particles background
const Particles = () => {
  const particles = Array.from({ length: 30 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const dur = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        const left = Math.random() * 100;
        const color = Math.random() > 0.5 ? YELLOW : BLUE;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: "100%",
              background: color,
              boxShadow: `0 0 ${size * 4}px ${color}`,
            }}
            animate={{ top: "-10%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
};

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
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `linear-gradient(${BLUE}55 1px, transparent 1px), linear-gradient(90deg, ${BLUE}55 1px, transparent 1px)`,
        backgroundSize: `${size / 8}px ${size / 8}px`,
      }}
    />
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
          animate={{ y: [100, c.y, c.y, 100], height: [0, c.h, c.h, 0] }}
          transition={{ delay: i * 0.15, duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 30);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 30);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden font-[Fira_Sans]"
      style={{ background: "radial-gradient(ellipse at top, #1a1547 0%, #07061f 60%, #03030f 100%)" }}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{ scaleX, background: `linear-gradient(90deg, ${YELLOW}, ${BLUE}, ${PURPLE})` }}
      />

      {/* Animated grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${BLUE} 1px, transparent 1px), linear-gradient(90deg, ${BLUE} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Floating particles */}
      <Particles />

      {/* Ambient color blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${BLUE}50, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${PURPLE}80, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${YELLOW}30, transparent 70%)` }}
        />
      </div>

      {/* Watermark logo */}
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
          <div className="font-[DM_Serif_Display] text-[12rem] leading-none tracking-tight" style={{ color: YELLOW }}>
            Tradexa
          </div>
        </motion.div>
      </motion.div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between"
      >
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
          <TradexaIcon size={40} />
          <span className="font-[DM_Serif_Display] text-2xl" style={{ color: YELLOW }}>
            Tradexa
          </span>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05, color: YELLOW }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="text-sm text-white/70 transition"
        >
          Sign In
        </motion.button>
      </motion.nav>

      {/* Live ticker */}
      <div className="relative z-10 border-y border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden py-3">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap"
        >
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-white/90">{t.sym}</span>
              <span className="text-white/70 font-mono">${t.price}</span>
              <span style={{ color: t.up ? "#22c55e" : "#ef4444" }} className="font-medium">
                {t.chg}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 pt-16 pb-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4 mb-10"
          style={{ x: mouseX, y: mouseY }}
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <TradexaIcon size={110} />
          </motion.div>
          <span className="font-[DM_Serif_Display] text-3xl" style={{ color: YELLOW }}>
            Tradexa
          </span>
        </motion.div>

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{ background: `${YELLOW}15`, border: `1px solid ${YELLOW}40`, color: YELLOW }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
            <Sparkles className="w-3 h-3" />
          </motion.div>
          Live Market • 24/7 Trading
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white"
        >
          The Most
          <br />
          <motion.span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${YELLOW}, ${BLUE}, ${PURPLE}, ${YELLOW})`,
              backgroundSize: "300% 100%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            Trusted &amp; Secure
          </motion.span>
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

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 20px 60px -10px ${YELLOW}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(user ? "/dashboard" : "/login?mode=signup")}
            className="group relative px-10 py-4 rounded-full font-semibold text-lg text-[#1a1547] overflow-hidden"
            style={{ background: YELLOW, boxShadow: `0 12px 40px -10px ${YELLOW}` }}
          >
            <motion.span
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            />
            <span className="relative inline-flex items-center gap-2">
              Get Started
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </section>

      {/* ANIMATED DASHBOARD PREVIEW */}
      <DashboardPreview />


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
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 80 }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: `0 20px 60px -10px ${f.color}80` }}
              className="relative p-6 rounded-2xl backdrop-blur-sm group overflow-hidden"
              style={{
                background: "rgba(10, 8, 35, 0.6)",
                border: `2px solid ${f.color}`,
                boxShadow: `0 0 24px -6px ${f.color}50`,
              }}
            >
              {/* Shimmer on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, transparent, ${f.color}15, transparent)` }}
              />
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}25`, border: `1px solid ${f.color}60` }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </motion.div>
              <h3 className="relative font-[DM_Serif_Display] text-2xl mb-2 text-white">{f.title}</h3>
              <p className="relative text-white/60 text-sm leading-relaxed">{f.desc}</p>
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
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, y: -4 }}
            >
              <p className="font-bold text-4xl sm:text-5xl" style={{ color: s.color, textShadow: `0 0 30px ${s.color}80` }}>
                {s.prefix}
                <Counter to={s.val} decimals={s.val % 1 !== 0 ? 1 : 0} />
                {s.suffix}
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
