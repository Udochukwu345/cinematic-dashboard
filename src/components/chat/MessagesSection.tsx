import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Bell, Mail, Bookmark, Users, User, MoreHorizontal, Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatView from "./ChatView";
import { useConversations } from "@/hooks/useMessages";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Explore" },
  { icon: Bell, label: "Notifications" },
  { icon: Mail, label: "Messages", active: true },
  { icon: Bookmark, label: "Lists" },
  { icon: Users, label: "Communities" },
  { icon: Hash, label: "Topics" },
  { icon: User, label: "Profile" },
  { icon: MoreHorizontal, label: "More" },
];

const MessagesSection = () => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showChatView, setShowChatView] = useState(false);
  const { conversations, loading } = useConversations();

  const activeConversation = conversations.find((c) => c.id === activeConvId) || null;

  const handleSelect = (id: string) => {
    setActiveConvId(id);
    setShowChatView(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative glass-card overflow-hidden"
      style={{ height: "calc(100vh - 240px)", minHeight: "480px" }}
    >
      {/* Animated background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-chart-amber/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative flex h-full">
        {/* X-style left icon rail */}
        <motion.aside
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="hidden sm:flex flex-col items-center gap-1 py-4 px-2 border-r border-border bg-background/40 backdrop-blur-sm"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--secondary))" }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
                className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={item.active ? 2.5 : 2} />
                {item.active && (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/40"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.aside>

        {/* Conversation list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${showChatView ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 lg:w-80 border-r border-border h-full bg-background/30 backdrop-blur-sm`}
        >
          <ConversationList
            conversations={conversations}
            loading={loading}
            activeId={activeConvId}
            onSelect={handleSelect}
          />
        </motion.div>

        {/* Chat view with animated transitions */}
        <div className={`${showChatView ? "flex" : "hidden md:flex"} flex-col flex-1 h-full relative`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeConvId || "empty"}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 h-full"
            >
              <ChatView conversation={activeConversation} onBack={() => setShowChatView(false)} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default MessagesSection;
