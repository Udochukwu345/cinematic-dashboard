import { motion } from "framer-motion";
import { MessageSquare, Plus, Users, Search, ArrowLeft, X, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation, Profile, useAllUsers, useCreateConversation } from "@/hooks/useMessages";
import { toast } from "sonner";

interface Props {
  conversations: Conversation[];
  loading: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onBack?: () => void;
}

function getConversationName(conv: Conversation, currentUserId: string): string {
  if (conv.name) return conv.name;
  const other = conv.participants?.find((p) => p.user_id !== currentUserId);
  return other?.display_name || "Unknown User";
}

function getAvatar(conv: Conversation, currentUserId: string): string {
  if (conv.is_group) return conv.name?.charAt(0)?.toUpperCase() || "G";
  const other = conv.participants?.find((p) => p.user_id !== currentUserId);
  return other?.display_name?.charAt(0)?.toUpperCase() || "?";
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

const ConversationList = ({ conversations, loading, activeId, onSelect, onBack }: Props) => {
  const { user } = useAuth();
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const allUsers = useAllUsers();
  const { createDM, createGroup } = useCreateConversation();

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const name = getConversationName(c, user?.id || "");
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleNewDM = async (profile: Profile) => {
    const convId = await createDM(profile.user_id);
    if (convId) {
      onSelect(convId);
      setShowNewChat(false);
      toast.success(`Chat started with ${profile.display_name}`);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error("Select at least one member");
      return;
    }
    setCreatingGroup(true);
    const convId = await createGroup(groupName.trim(), selectedMembers);
    if (convId) {
      onSelect(convId);
      setShowGroupCreate(false);
      setShowNewChat(false);
      setGroupName("");
      setSelectedMembers([]);
      toast.success("Group created!");
    } else {
      toast.error("Failed to create group");
    }
    setCreatingGroup(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors md:hidden">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <h2 className="text-lg font-bold text-foreground flex-1">Messages</h2>
        <button
          onClick={() => { setShowNewChat(!showNewChat); setShowGroupCreate(false); }}
          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* New Chat Panel */}
      {showNewChat && !showGroupCreate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-b border-border">
          <div className="px-3 py-1.5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Start a new chat</p>
            <button
              onClick={() => setShowGroupCreate(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <Users className="w-3.5 h-3.5" /> New Group
            </button>
          </div>
          <div className="max-h-48 overflow-auto">
            {allUsers.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground text-center">No other users found</p>
            ) : (
              allUsers.map((u) => (
                <button
                  key={u.user_id}
                  onClick={() => handleNewDM(u)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                    {u.display_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <span className="text-sm font-medium text-foreground">{u.display_name || "User"}</span>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Group Create Panel */}
      {showGroupCreate && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-b border-border">
          <div className="px-3 py-2 flex items-center gap-2">
            <button onClick={() => setShowGroupCreate(false)} className="p-1 rounded hover:bg-secondary/60">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <p className="text-xs font-semibold text-foreground flex-1">Create Group</p>
            <button
              onClick={() => { setShowGroupCreate(false); setShowNewChat(false); setSelectedMembers([]); setGroupName(""); }}
              className="p-1 rounded hover:bg-secondary/60"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="px-3 pb-2">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name..."
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {selectedMembers.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {selectedMembers.map((id) => {
                const u = allUsers.find((u) => u.user_id === id);
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {u?.display_name || "User"}
                    <button onClick={() => toggleMember(id)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <p className="px-3 py-1 text-[10px] text-muted-foreground">Select members</p>
          <div className="max-h-36 overflow-auto">
            {allUsers.map((u) => (
              <button
                key={u.user_id}
                onClick={() => toggleMember(u.user_id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/40 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedMembers.includes(u.user_id) ? "bg-primary text-primary-foreground" : "bg-accent/20 text-accent"
                }`}>
                  {selectedMembers.includes(u.user_id) ? <Check className="w-4 h-4" /> : u.display_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span className="text-sm font-medium text-foreground">{u.display_name || "User"}</span>
              </button>
            ))}
          </div>
          <div className="px-3 py-2">
            <button
              onClick={handleCreateGroup}
              disabled={creatingGroup || !groupName.trim() || selectedMembers.length === 0}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              {creatingGroup ? "Creating..." : `Create Group (${selectedMembers.length})`}
            </button>
          </div>
        </motion.div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Start a new chat to begin messaging</p>
          </div>
        ) : (
          filtered.map((conv, i) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onSelect(conv.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 transition-colors border-b border-border/30 ${
                activeId === conv.id ? "bg-primary/10" : "hover:bg-secondary/40"
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                conv.is_group ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
              }`}>
                {conv.is_group ? <Users className="w-5 h-5" /> : getAvatar(conv, user?.id || "")}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {getConversationName(conv, user?.id || "")}
                  </span>
                  {conv.last_message && (
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {formatTime(conv.last_message.created_at)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {conv.last_message
                    ? conv.last_message.message_type !== "text"
                      ? `📎 ${conv.last_message.message_type}`
                      : conv.last_message.content || ""
                    : "No messages yet"}
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
