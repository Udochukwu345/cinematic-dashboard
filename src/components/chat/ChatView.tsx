import { motion } from "framer-motion";
import { ArrowLeft, Send, Paperclip, BarChart3, Image as ImageIcon, Video, MoreVertical, CheckCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Message, useMessages, Conversation, Profile } from "@/hooks/useMessages";
import { toast } from "sonner";

interface Props {
  conversation: Conversation | null;
  onBack: () => void;
}

function formatMsgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateSeparator(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
}

function getOtherParticipant(conv: Conversation | null, userId: string): Profile | undefined {
  return conv?.participants?.find((p) => p.user_id !== userId);
}

const ChatView = ({ conversation, onBack }: Props) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage, uploadMedia } = useMessages(conversation?.id || null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await sendMessage(text.trim());
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, forceType?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Only images and videos are supported");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB");
      return;
    }

    setSending(true);
    setShowAttachMenu(false);
    const url = await uploadMedia(file);
    if (url) {
      const type = forceType || (isImage ? "image" : "video");
      await sendMessage("", type, url);
    } else {
      toast.error("Failed to upload file");
    }
    setSending(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (chartInputRef.current) chartInputRef.current.value = "";
  };

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Send className="w-8 h-8 text-primary/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Select a conversation</h3>
        <p className="text-sm text-muted-foreground">Choose a chat to start messaging</p>
      </div>
    );
  }

  const otherUser = getOtherParticipant(conversation, user?.id || "");
  const chatName = conversation.name || otherUser?.display_name || "Chat";
  const chatAvatar = chatName.charAt(0).toUpperCase();

  let lastDate = "";

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-3 bg-card/50 backdrop-blur-sm">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors md:hidden">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          conversation.is_group ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
        }`}>
          {chatAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{chatName}</p>
          <p className="text-[11px] text-muted-foreground">
            {conversation.is_group
              ? `${conversation.participants?.length || 0} members`
              : "Online"}
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary/60 transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-1" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 70%)" }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user?.id;
            const msgDate = formatDateSeparator(msg.created_at);
            const showDate = msgDate !== lastDate;
            if (showDate) lastDate = msgDate;

            const prevMsg = messages[i - 1];
            const sameSender = prevMsg?.sender_id === msg.sender_id;
            const sameMinute = prevMsg && Math.abs(new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime()) < 60000;
            const grouped = sameSender && sameMinute && !showDate;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-3">
                    <span className="px-3 py-1 rounded-full bg-secondary/60 text-[10px] font-medium text-muted-foreground">
                      {msgDate}
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} ${grouped ? "mt-0.5" : "mt-2"}`}
                >
                  <div className={`max-w-[80%] md:max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && conversation.is_group && !grouped && (
                      <p className="text-[10px] font-semibold text-primary ml-2 mb-0.5">
                        {msg.sender?.display_name || "User"}
                      </p>
                    )}
                    <div
                      className={`relative px-3 py-2 ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                          : "bg-secondary/80 text-foreground rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {(msg.message_type === "image" || msg.message_type === "chart") && msg.media_url && (
                        <div className="relative">
                          {msg.message_type === "chart" && (
                            <div className="flex items-center gap-1 mb-1">
                              <BarChart3 className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-semibold uppercase">Chart</span>
                            </div>
                          )}
                          <img
                            src={msg.media_url}
                            alt={msg.message_type === "chart" ? "Shared chart" : "Shared image"}
                            className="rounded-lg max-w-full max-h-64 object-cover mb-1 cursor-pointer"
                            loading="lazy"
                            onClick={() => window.open(msg.media_url!, "_blank")}
                          />
                        </div>
                      )}
                      {msg.message_type === "video" && msg.media_url && (
                        <video
                          src={msg.media_url}
                          controls
                          className="rounded-lg max-w-full max-h-64 mb-1"
                        />
                      )}
                      {msg.content && (
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      )}
                      <div className={`flex items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[9px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {formatMsgTime(msg.created_at)}
                        </span>
                        {isMe && <CheckCheck className={`w-3 h-3 text-primary-foreground/60`} />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attach Menu */}
      {showAttachMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 pb-1 flex gap-2"
        >
          <button
            onClick={() => { fileInputRef.current?.setAttribute("accept", "image/*"); fileInputRef.current?.click(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-primary" /> Image
          </button>
          <button
            onClick={() => { fileInputRef.current?.setAttribute("accept", "video/*"); fileInputRef.current?.click(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
          >
            <Video className="w-4 h-4 text-chart-green" /> Video
          </button>
          <button
            onClick={() => chartInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 text-foreground text-xs font-medium hover:bg-secondary transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-chart-amber" /> Chart
          </button>
        </motion.div>
      )}

      {/* Input Bar */}
      <div className="px-3 py-2 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2.5 rounded-full hover:bg-secondary/60 transition-colors shrink-0 mb-0.5 ${showAttachMenu ? "bg-secondary/60" : ""}`}
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e)}
          />
          <input
            ref={chartInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, "chart")}
          />
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); handleTextareaInput(); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowAttachMenu(false)}
            placeholder="Message..."
            rows={1}
            className="flex-1 bg-secondary/50 border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0 mb-0.5"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
