import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Advanced Trading",
    desc: "Real-time market data and advanced charting tools for professional traders.",
    accent: "yellow",
  },
  {
    icon: Shield,
    title: "Bank Level Security",
    desc: "Multi-layer security with cold storage and 2FA protection.",
    accent: "blue",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Execute trades instantly with our high-performance infrastructure.",
    accent: "yellow",
  },
  {
    icon: Users,
    title: "Global Community",
    desc: "Join millions of traders worldwide sharing insights and strategies.",
    accent: "blue",
  },
];

const stats = [
  { val: "5M+", label: "Active Users", color: "text-foreground" },
  { val: "$2B+", label: "Daily Volume", color: "text-primary" },
  { val: "200+", label: "Countries", color: "text-yellow-400" },
  { val: "99.9%", label: "Uptime", color: "text-primary" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-20 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl"
        />
      </div>

      {/* Animated watermark logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06, scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
        transition={{ opacity: { duration: 2 }, scale: { duration: 12, repeat: Infinity }, rotate: { duration: 16, repeat: Infinity } }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[28vw] font-black tracking-tighter text-primary">T</span>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 sm:py-20">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-600/30 border border-primary/40 flex items-center justify-center backdrop-blur-sm"
              style={{ boxShadow: "0 0 60px -10px hsl(var(--primary) / 0.6)" }}
            >
              <TrendingUp className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-400" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-2xl font-bold"
          >
            <span className="text-yellow-400">Tradexa</span>
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl"
          >
            The Most<br />Trusted &amp; Secure<br />Forex Trading Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md"
          >
            Best trading platform and more reliable financial transactions.
          </motion.p>

          <button
            onClick={() => navigate("/login")}
            className="mt-10 px-10 py-4 rounded-full bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 transition-colors active:scale-[0.97]"
            style={{ boxShadow: "0 10px 40px -10px rgb(250 204 21 / 0.5)" }}
          >
            Get Started
          </button>
        </div>

        {/* Why Choose */}
        <div className="mt-24 sm:mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
          >
            Why Choose Tradexa?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {features.map((f, i) => {
              const isYellow = f.accent === "yellow";
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-2xl bg-card/60 backdrop-blur-sm border-2 ${
                    isYellow ? "border-yellow-400/70" : "border-primary/70"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isYellow ? "bg-yellow-400/20" : "bg-primary/20"
                    }`}
                  >
                    <f.icon className={`w-6 h-6 ${isYellow ? "text-yellow-400" : "text-primary"}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`text-3xl sm:text-4xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
