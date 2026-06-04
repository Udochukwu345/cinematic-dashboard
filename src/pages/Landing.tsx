import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Shield, Zap, Users, ArrowRight, Sparkles, BarChart3, Globe2 } from "lucide-react";
import { useRef } from "react";

const features = [
  { icon: TrendingUp, title: "Advanced Trading", desc: "Real-time market data and pro charting tools." },
  { icon: Shield, title: "Bank-Level Security", desc: "Multi-layer security with cold storage & 2FA." },
  { icon: Zap, title: "Lightning Fast", desc: "Sub-millisecond execution on a global edge network." },
  { icon: Users, title: "Global Community", desc: "Millions of traders sharing live insights." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Institutional-grade reporting at your fingertips." },
  { icon: Globe2, title: "200+ Markets", desc: "Forex, crypto, indices — one unified platform." },
];

const stats = [
  { val: "5M+", label: "Active Users" },
  { val: "$2B+", label: "Daily Volume" },
  { val: "200+", label: "Countries" },
  { val: "99.9%", label: "Uptime" },
];

// Floating particles
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 40 }).map((_, i) => (
      <motion.span
        key={i}
        className="absolute block w-1 h-1 rounded-full bg-primary/60"
        style={{
          left: `${(i * 37) % 100}%`,
          top: `${(i * 53) % 100}%`,
          boxShadow: "0 0 8px hsl(var(--primary) / 0.8)",
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4 + (i % 5),
          repeat: Infinity,
          delay: (i % 10) * 0.3,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-[Fira_Sans]">
      {/* Global animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(243 75% 59% / 0.35), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(232 70% 35% / 0.4), transparent 70%)" }}
        />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
          style={{ background: "conic-gradient(from 0deg, hsl(243 75% 59% / 0.3), transparent, hsl(232 70% 35% / 0.3), transparent)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Nav */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(243 75% 59%), hsl(232 70% 35%))" }}
          >
            <TrendingUp className="w-5 h-5 text-foreground" />
          </motion.div>
          <span className="text-2xl font-[DM_Serif_Display] italic tracking-tight">Tradexa</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#stats" className="hover:text-foreground transition">Markets</a>
          <button onClick={() => navigate("/login")} className="hover:text-foreground transition">Sign In</button>
        </div>
      </motion.nav>

      {/* HERO — Split Screen */}
      <motion.section
        ref={ref}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-8 pb-24 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
      >
        <Particles />

        {/* LEFT — Copy */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-xs mb-8"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-muted-foreground">Trusted by 5M+ traders worldwide</span>
          </motion.div>

          <h1 className="font-[DM_Serif_Display] text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            {["The", "future", "of", "trading", "is"].map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="inline-block italic"
              style={{
                background: "linear-gradient(135deg, hsl(243 75% 70%), hsl(220 90% 80%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              luminous.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-8 text-lg text-muted-foreground max-w-md leading-relaxed"
          >
            Trade forex, crypto, and indices on a platform built for precision —
            cinematic charts, instant execution, and a community that never sleeps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(user ? "/dashboard" : "/login?mode=signup")}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base text-primary-foreground overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsl(243 75% 59%), hsl(232 70% 45%))",
                boxShadow: "0 20px 50px -15px hsl(243 75% 59% / 0.6)",
              }}
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, hsl(232 70% 45%), hsl(243 75% 59%))" }}
              />
            </motion.button>

            {!user && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-full font-semibold text-base border border-border bg-card/40 backdrop-blur-sm hover:bg-card/60 transition"
              >
                Sign In
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* RIGHT — Animated visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative aspect-square max-w-lg ml-auto"
        >
          {/* Orbit rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-primary/20"
              style={{ scale: 1 - i * 0.15 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute w-3 h-3 rounded-full bg-primary"
                style={{
                  top: "-6px",
                  left: "50%",
                  boxShadow: "0 0 20px hsl(var(--primary))",
                }}
              />
            </motion.div>
          ))}

          {/* Center card */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[20%] rounded-3xl backdrop-blur-xl border border-primary/30 p-6 flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, hsl(232 70% 15% / 0.8), hsl(222 47% 8% / 0.8))",
              boxShadow: "0 30px 80px -20px hsl(243 75% 59% / 0.5)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">BTC / USD</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-emerald-400"
              />
            </div>
            <div>
              <div className="font-[DM_Serif_Display] text-3xl">$68,420</div>
              <div className="text-emerald-400 text-sm mt-1">+2.34% today</div>
            </div>
            {/* Mini sparkline */}
            <svg viewBox="0 0 100 30" className="w-full h-10">
              <motion.path
                d="M0 25 L15 18 L30 22 L45 12 L60 16 L75 6 L100 10"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
            </svg>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-4 -left-4 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-xl border border-border text-xs flex items-center gap-2"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>0.2ms latency</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            className="absolute bottom-8 -right-4 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-xl border border-border text-xs flex items-center gap-2"
          >
            <Shield className="w-3 h-3 text-primary" />
            <span>SOC 2 Certified</span>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Marquee ticker */}
      <div className="relative z-10 border-y border-border/50 bg-card/30 backdrop-blur-sm py-4 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap font-[DM_Serif_Display] text-2xl italic text-muted-foreground"
        >
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Precision", "•", "Speed", "•", "Security", "•", "Community", "•", "Insight", "•", "Liquidity", "•"].map(
              (w, i) => (
                <span key={`${k}-${i}`} className={w === "•" ? "text-primary" : ""}>
                  {w}
                </span>
              ),
            ),
          )}
        </motion.div>
      </div>

      {/* FEATURES */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-primary text-sm font-medium mb-3 tracking-wider uppercase">Why Tradexa</p>
          <h2 className="font-[DM_Serif_Display] text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Built for traders who <span className="italic">demand more.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group relative p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at 50% 0%, hsl(243 75% 59% / 0.15), transparent 70%)",
                }}
              />
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, hsl(243 75% 59% / 0.3), hsl(232 70% 35% / 0.3))" }}
              >
                <f.icon className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="font-[DM_Serif_Display] text-2xl mb-2 relative">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-24">
        <div
          className="rounded-3xl p-12 sm:p-16 border border-primary/30 backdrop-blur-xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(232 70% 15% / 0.6), hsl(222 47% 8% / 0.6))",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "hsl(243 75% 59% / 0.3)" }}
          />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-[DM_Serif_Display] text-5xl sm:text-6xl text-foreground">{s.val}</p>
                <p className="text-sm text-muted-foreground mt-2 tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-[DM_Serif_Display] text-4xl sm:text-6xl leading-tight"
        >
          Your next trade is <span className="italic text-primary">waiting.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-6 text-lg"
        >
          Join millions already trading on Tradexa.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(user ? "/dashboard" : "/login?mode=signup")}
          className="mt-10 inline-flex items-center gap-2 px-10 py-5 rounded-full font-semibold text-lg text-primary-foreground"
          style={{
            background: "linear-gradient(135deg, hsl(243 75% 59%), hsl(232 70% 45%))",
            boxShadow: "0 25px 60px -15px hsl(243 75% 59% / 0.7)",
          }}
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </section>

      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 Tradexa — Trade with precision.
      </footer>
    </div>
  );
};

export default Landing;
