import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, TrendingUp, BarChart3, Shield, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/dashboard");
      }
    } else {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email for a verification link!", {
          duration: 6000,
          description: "You need to verify your email before signing in.",
        });
        setIsLogin(true);
        setPassword("");
      }
    }
    setLoading(false);
  };

  const features = [
    { icon: TrendingUp, title: "Real-Time Markets", desc: "Live data across 12,000+ assets" },
    { icon: BarChart3, title: "Advanced Analytics", desc: "AI-powered insights & signals" },
    { icon: Shield, title: "Bank-Grade Security", desc: "256-bit encryption & 2FA" },
    { icon: Zap, title: "Lightning Fast", desc: "Sub-millisecond execution" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <motion.div animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
          <motion.div animate={{ x: [0, 30, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-chart-amber/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">Tradexa</span>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <h1 className="text-5xl font-bold leading-tight text-foreground">
              Trade Smarter.<br />
              <span className="text-gradient">Not Harder.</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Access institutional-grade tools, real-time analytics, and AI-driven insights — all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }} className="glass-card p-4 group hover:border-primary/30 transition-colors">
                <f.icon className="w-5 h-5 text-primary mb-2 group-hover:text-accent transition-colors" />
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }} className="relative z-10 flex gap-8">
          {[{ val: "$2.87T", label: "Market Cap" }, { val: "12,847", label: "Assets" }, { val: "99.9%", label: "Uptime" }].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-foreground">{s.val}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4 sm:mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">Tradexa</span>
          </div>

          <div className="text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? "login" : "signup"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isLogin ? "Welcome back" : "Create account"}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  {isLogin ? "Enter your credentials to access your portfolio" : "Start your trading journey in minutes"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">Sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="John Doe" />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border bg-secondary accent-primary" />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-semibold text-primary-foreground transition-all glow-primary disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setIsLogin(!isLogin); setPassword(""); }} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
