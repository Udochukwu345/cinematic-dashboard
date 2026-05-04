import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageSquare, ThumbsUp, Share2, TrendingUp, TrendingDown, Flame, Star, Send, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import MessagesSection from "@/components/chat/MessagesSection";

const trendingTopics = [
  { tag: "#BTC100K", posts: "12.4K", trend: "up" },
  { tag: "#ETHMerge", posts: "8.2K", trend: "up" },
  { tag: "#SOLSeason", posts: "5.7K", trend: "up" },
  { tag: "#CryptoTax", posts: "3.1K", trend: "down" },
];

const posts = [
  {
    id: 1, author: "CryptoWhale", avatar: "CW", time: "2h ago",
    content: "BTC just broke through key resistance at $68K. If it holds above this level, we could see a run to $72K by end of week. Volume is confirming the move. 🚀",
    likes: 234, comments: 56, shares: 18, sentiment: "bullish", liked: false,
  },
  {
    id: 2, author: "DeFiDegen", avatar: "DD", time: "4h ago",
    content: "New yield farming opportunity on Aave V3 — ETH/USDC pool offering 12% APY with minimal IL risk. Already deployed 50% of my portfolio. DYOR.",
    likes: 187, comments: 43, shares: 31, sentiment: "bullish", liked: false,
  },
  {
    id: 3, author: "ChartMaster", avatar: "CM", time: "5h ago",
    content: "Bearish divergence forming on SOL 4H chart. RSI trending down while price makes higher highs. Could see a pullback to $140 support. Setting stop losses tight.",
    likes: 156, comments: 89, shares: 24, sentiment: "bearish", liked: false,
  },
  {
    id: 4, author: "NFTCollector", avatar: "NC", time: "7h ago",
    content: "The correlation between on-chain metrics and price action has been insane this cycle. Whale wallets accumulating heavily in the $62-64K range. Smart money is positioning.",
    likes: 312, comments: 67, shares: 45, sentiment: "bullish", liked: false,
  },
];

const topTraders = [
  { name: "AlphaTrader", winRate: "87%", pnl: "+$124K", avatar: "AT", rank: 1 },
  { name: "SwingKing", winRate: "82%", pnl: "+$98K", avatar: "SK", rank: 2 },
  { name: "ScalpMaster", winRate: "79%", pnl: "+$76K", avatar: "SM", rank: 3 },
  { name: "TrendFollower", winRate: "76%", pnl: "+$61K", avatar: "TF", rank: 4 },
];

const Community = () => {
  const [postList, setPostList] = useState(posts);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState<"feed" | "messages" | "trending" | "leaderboard">("feed");

  const toggleLike = (id: number) => {
    setPostList((prev) =>
      prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPostList((prev) => [
      { id: Date.now(), author: "You", avatar: "YO", time: "Just now", content: newPost, likes: 0, comments: 0, shares: 0, sentiment: "bullish", liked: false },
      ...prev,
    ]);
    setNewPost("");
  };


  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Community</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect with fellow traders</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-1 bg-secondary rounded-lg p-1 w-fit flex-wrap">
        {(["feed", "messages", "trending", "leaderboard"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Messages Tab - X-style animated section */}
      {activeTab === "messages" && <MessagesSection />}

      {/* Feed / Trending / Leaderboard */}
      {activeTab !== "messages" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-2 space-y-4">
            {activeTab === "feed" && (
              <>
                {/* Compose */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">YO</div>
                    <div className="flex-1">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share your trade idea..."
                        className="w-full bg-secondary/50 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button onClick={handlePost} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                          <Send className="w-4 h-4" /> Post
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Posts */}
                <AnimatePresence>
                  {postList.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="glass-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          post.sentiment === "bullish" ? "bg-chart-green/20 text-chart-green" : "bg-chart-red/20 text-chart-red"
                        }`}>
                          {post.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-foreground">{post.author}</span>
                            <span className="text-xs text-muted-foreground">· {post.time}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              post.sentiment === "bullish" ? "bg-chart-green/10 text-chart-green" : "bg-chart-red/10 text-chart-red"
                            }`}>
                              {post.sentiment === "bullish" ? "BULLISH" : "BEARISH"}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90 mt-2 leading-relaxed">{post.content}</p>
                          <div className="flex items-center gap-5 mt-3">
                            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-xs transition-colors ${post.liked ? "text-chart-red" : "text-muted-foreground hover:text-chart-red"}`}>
                              <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} /> {post.likes}
                            </button>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MessageCircle className="w-4 h-4" /> {post.comments}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Share2 className="w-4 h-4" /> {post.shares}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}

            {activeTab === "trending" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {trendingTopics.map((topic, i) => (
                  <motion.div key={topic.tag} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{topic.tag}</p>
                        <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                      </div>
                    </div>
                    {topic.trend === "up" ? <TrendingUp className="w-5 h-5 text-chart-green" /> : <TrendingDown className="w-5 h-5 text-chart-red" />}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "leaderboard" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {topTraders.map((trader, i) => (
                  <motion.div key={trader.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        trader.rank === 1 ? "bg-chart-amber/20 text-chart-amber" : trader.rank === 2 ? "bg-muted-foreground/20 text-muted-foreground" : "bg-orange-400/20 text-orange-400"
                      }`}>
                        {trader.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          {trader.rank <= 3 && <Star className="w-3.5 h-3.5 text-chart-amber fill-chart-amber" />}
                          {trader.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Win Rate: {trader.winRate}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-chart-green">{trader.pnl}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Community Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Active Traders", value: "24.8K" },
                  { label: "Posts Today", value: "1,247" },
                  { label: "Avg Sentiment", value: "Bullish" },
                  { label: "Top Asset", value: "BTC" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Flame className="w-4 h-4 text-chart-amber" /> Hot Right Now
              </h3>
              <div className="space-y-2">
                {trendingTopics.slice(0, 3).map((t) => (
                  <div key={t.tag} className="flex items-center justify-between py-1.5">
                    <span className="text-sm font-medium text-primary">{t.tag}</span>
                    <span className="text-xs text-muted-foreground">{t.posts}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Community;
