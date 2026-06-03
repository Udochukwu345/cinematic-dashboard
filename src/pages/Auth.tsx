import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const MetaMaskIcon = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5">
    <path fill="#E17726" d="M29.2 3l-11.4 8.5 2.1-5z" />
    <path fill="#E27625" d="M2.8 3l11.3 8.6-2-5.1zM25 22.3l-3 4.6 6.5 1.8 1.9-6.3zM1.6 22.4l1.9 6.3 6.5-1.8-3-4.6z" />
    <path fill="#E27625" d="M9.7 14.5l-1.9 2.8 6.4.3-.2-6.9zM22.3 14.5l-4.4-3.9-.1 7 6.4-.3zM10.1 26.9l3.9-1.9-3.4-2.6zM18 25l3.9 1.9-.5-4.5z" />
    <path fill="#D5BFB2" d="M21.9 26.9L18 25l.3 2.6v1.1zM10.1 26.9l3.6 1.8v-1.1l.3-2.6z" />
    <path fill="#233447" d="M13.8 20.7l-3.3-1 2.3-1.1zM18.2 20.7l1-2.1 2.3 1.1z" />
    <path fill="#CC6228" d="M10.1 26.9l.6-4.6-3.6.1zM21.3 22.3l.6 4.6 3-4.5zM24.2 17.3l-6.4.3.6 3.1 1-2.1 2.3 1.1zM10.5 19.7l2.3-1.1 1 2.1.6-3.1-6.4-.3z" />
    <path fill="#E27525" d="M7.8 17.3l2.7 5.3-.1-2.6zM21.6 20l-.1 2.6 2.7-5.3zM14.2 17.6l-.6 3.1.7 3.8.2-5zM17.8 17.6l-.3 1.9.2 5 .7-3.8z" />
    <path fill="#F5841F" d="M18 20.7l-.7 3.8.5.4 3.4-2.6.1-2.6zM10.5 19.7l.1 2.6 3.4 2.6.5-.4-.7-3.8z" />
    <path fill="#C0AC9D" d="M18.1 28.7v-1.1l-.3-.3h-3.6l-.3.3v1.1l-3.8-1.8 1.3 1.1 2.7 1.9h3.7l2.7-1.9 1.3-1.1z" />
    <path fill="#161616" d="M17.8 25l-.5-.4h-2.6l-.5.4-.3 2.6.3-.3h3.6l.3.3z" />
  </svg>
);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window === "undefined") return true;
    const p = new URLSearchParams(window.location.search).get("mode");
    return p !== "signup";
  });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
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
      if (error) toast.error(error.message);
      else navigate("/dashboard");
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

  const handleOAuth = async (provider: "google" | "apple") => {
    setSocialLoading(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: `${window.location.origin}/dashboard`,
      });
      if (result.error) {
        toast.error(`${provider} sign-in failed`, {
          description: (result.error as any)?.message ?? String(result.error),
        });
        setSocialLoading(null);
        return;
      }
      if (result.redirected) return;
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(`${provider} sign-in failed`, { description: err?.message });
      setSocialLoading(null);
    }
  };

  const handleMetaMask = async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      toast.error("MetaMask not detected", {
        description: "Install the MetaMask extension to continue.",
        action: { label: "Install", onClick: () => window.open("https://metamask.io/download/", "_blank") },
      });
      return;
    }
    setSocialLoading("metamask");
    try {
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      if (!address) throw new Error("No wallet account returned");

      // 1) Ask the edge function for a SIWE-style challenge
      toast.message("Requesting sign-in challenge…");
      const { data: challenge, error: chErr } = await supabase.functions.invoke("wallet-auth", {
        body: { action: "challenge", address },
      });
      if (chErr || !challenge?.message) throw new Error(chErr?.message ?? "Failed to get challenge");

      // 2) Ask the wallet to sign the challenge message
      const signature: string = await eth.request({
        method: "personal_sign",
        params: [challenge.message, address],
      });

      // 3) Send signature back for verification — server returns a one-shot token_hash
      const { data: verified, error: vErr } = await supabase.functions.invoke("wallet-auth", {
        body: {
          action: "verify",
          address,
          message: challenge.message,
          signature,
          nonce: challenge.nonce,
          expiresAt: challenge.expiresAt,
          proof: challenge.proof,
        },
      });
      if (vErr || !verified?.token_hash) {
        throw new Error(vErr?.message ?? verified?.error ?? "Signature verification failed");
      }

      // 4) Redeem the token_hash to establish a real Supabase session client-side
      const { error: otpErr } = await supabase.auth.verifyOtp({
        email: verified.email,
        token_hash: verified.token_hash,
        type: "magiclink",
      });
      if (otpErr) throw otpErr;

      toast.success("Wallet authenticated", {
        description: `${address.slice(0, 6)}…${address.slice(-4)}`,
      });
      navigate("/dashboard");
    } catch (err: any) {
      if (err?.code === 4001 || /reject/i.test(err?.message ?? "")) {
        toast.info("Sign-in cancelled");
      } else {
        toast.error("MetaMask sign-in failed", { description: err?.message?.slice(0, 140) });
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-[#05060d] text-white">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(250,204,21,0.15),_transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
        <motion.div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-yellow-400/20 blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, -70, 0], y: [0, -50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-fuchsia-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-yellow-400/40 via-fuchsia-500/20 to-blue-500/40 blur-sm opacity-70" />

        <div className="relative rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 justify-center mb-6"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
            >
              <TrendingUp className="w-6 h-6 text-black" strokeWidth={2.5} />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Tradexa
            </span>
          </motion.div>

          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center mb-5"
          >
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {isLogin ? "Sign in to access your portfolio" : "Start trading in less than a minute"}
            </p>
          </motion.div>

          {/* Social buttons */}
          <div className="grid grid-cols-1 gap-2.5 mb-5">
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-60"
            >
              {socialLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleOAuth("apple")}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-black border border-white/15 text-white font-medium hover:bg-white/5 transition-colors disabled:opacity-60"
            >
              {socialLoading === "apple" ? <Loader2 className="w-4 h-4 animate-spin" /> : <AppleIcon />}
              Continue with Apple
            </button>
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={handleMetaMask}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-black font-semibold hover:from-orange-400 hover:to-amber-400 transition-colors disabled:opacity-60"
            >
              {socialLoading === "metamask" ? <Loader2 className="w-4 h-4 animate-spin" /> : <MetaMaskIcon />}
              Continue with MetaMask
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-white/40">or email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60 transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-3.5 rounded-lg font-semibold bg-gradient-to-r from-yellow-300 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-500/30 transition-shadow disabled:opacity-60 flex items-center justify-center gap-2 overflow-hidden"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white/60 mt-5">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setPassword(""); }}
              className="text-yellow-400 font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
