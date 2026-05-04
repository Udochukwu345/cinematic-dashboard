import { motion } from "framer-motion";
import { Menu, Search, Settings, MessageSquarePlus, Phone, Bookmark, Archive, Users2, Bot } from "lucide-react";
import { useState } from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatView from "@/components/chat/ChatView";
import { useConversations } from "@/hooks/useMessages";

const folderTabs = [
  { id: "all", label: "All", icon: MessageSquarePlus },
  { id: "personal", label: "Personal", icon: Users2 },
  { id: "groups", label: "Groups", icon: Users2 },
  { id: "bots", label: "Bots", icon: Bot },
  { id: "archived", label: "Archived", icon: Archive },
];

const Messenger = () => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [folder, setFolder] = useState("all");
  const { conversations, loading } = useConversations();

  const active = conversations.find((c) => c.id === activeConvId) || null;

  const filtered = conversations.filter((c) => {
    if (folder === "personal") return !c.is_group;
    if (folder === "groups") return c.is_group;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-screen md:h-screen overflow-hidden bg-[hsl(220,15%,8%)]">
      {/* Telegram-style top header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 flex items-center justify-between px-4 border-b border-border bg-[hsl(220,18%,12%)]/80 backdrop-blur-xl shrink-0"
      >
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-secondary/60 transition-colors">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center">
              <MessageSquarePlus className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Messenger</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-secondary/60 transition-colors" title="Calls">
            <Phone className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary/60 transition-colors" title="Saved">
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary/60 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.header>

      <div className="flex flex-1 min-h-0">
        {/* Left: Folders + Conversations */}
        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`${showChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-[340px] lg:w-[380px] border-r border-border bg-[hsl(220,18%,10%)]`}
        >
          {/* Folder tabs */}
          <div className="flex gap-1 p-2 overflow-x-auto border-b border-border scrollbar-hide">
            {folderTabs.map((f) => {
              const Icon = f.icon;
              const active = folder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFolder(f.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="folder-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0">
            <ConversationList
              conversations={filtered}
              loading={loading}
              activeId={activeConvId}
              onSelect={(id) => {
                setActiveConvId(id);
                setShowChat(true);
              }}
            />
          </div>
        </motion.aside>

        {/* Right: Chat with patterned background */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={`${showChat ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0 relative`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--chart-amber) / 0.05) 0%, transparent 50%)",
            backgroundColor: "hsl(220, 15%, 8%)",
          }}
        >
          {/* subtle dot pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex flex-col flex-1 min-h-0">
            <ChatView conversation={active} onBack={() => setShowChat(false)} />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Messenger;
