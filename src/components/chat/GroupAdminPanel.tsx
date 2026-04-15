import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldOff, UserPlus, UserMinus, Crown, Edit2, Check, X, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation, Participant, Profile, useAllUsers, useGroupAdmin } from "@/hooks/useMessages";
import { toast } from "sonner";

interface Props {
  conversation: Conversation;
  onClose: () => void;
  onRefresh: () => void;
}

const GroupAdminPanel = ({ conversation, onClose, onRefresh }: Props) => {
  const { user } = useAuth();
  const { addMember, removeMember, toggleAdmin, renameGroup, isCurrentUserAdmin } = useGroupAdmin(conversation.id);
  const allUsers = useAllUsers();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(conversation.name || "");
  const [showAddMember, setShowAddMember] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAdmin = isCurrentUserAdmin(conversation.participants);
  const participantIds = conversation.participants?.map((p) => p.user_id) || [];
  const nonMembers = allUsers.filter((u) => !participantIds.includes(u.user_id));

  const handleRename = async () => {
    if (!newName.trim()) return;
    setBusy(true);
    const ok = await renameGroup(newName.trim());
    if (ok) {
      toast.success("Group renamed");
      onRefresh();
    } else {
      toast.error("Failed to rename");
    }
    setEditingName(false);
    setBusy(false);
  };

  const handleRemove = async (userId: string, name: string) => {
    setBusy(true);
    const ok = await removeMember(userId);
    if (ok) {
      toast.success(`${name} removed`);
      onRefresh();
    } else {
      toast.error("Failed to remove member");
    }
    setBusy(false);
  };

  const handleToggleAdmin = async (userId: string, currentAdmin: boolean, name: string) => {
    setBusy(true);
    const ok = await toggleAdmin(userId, !currentAdmin);
    if (ok) {
      toast.success(`${name} ${!currentAdmin ? "promoted to admin" : "demoted"}`);
      onRefresh();
    } else {
      toast.error("Failed to update role");
    }
    setBusy(false);
  };

  const handleAdd = async (profile: Profile) => {
    setBusy(true);
    const ok = await addMember(profile.user_id);
    if (ok) {
      toast.success(`${profile.display_name} added`);
      setShowAddMember(false);
      onRefresh();
    } else {
      toast.error("Failed to add member");
    }
    setBusy(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 bg-card z-20 flex flex-col"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center gap-3">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-semibold text-foreground flex-1">Group Info</h3>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Group Name */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            {editingName && isAdmin ? (
              <div className="flex items-center gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button onClick={handleRename} disabled={busy} className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditingName(false)} className="p-1.5 rounded-lg hover:bg-secondary/60">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-foreground">{conversation.name || "Group"}</p>
                {isAdmin && (
                  <button onClick={() => { setNewName(conversation.name || ""); setEditingName(true); }} className="p-1 rounded hover:bg-secondary/60">
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">{conversation.participants?.length || 0} members</p>
          </div>
        </div>

        {/* Add Member */}
        {isAdmin && (
          <div>
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors w-full"
            >
              <UserPlus className="w-4 h-4" /> Add Member
            </button>
            <AnimatePresence>
              {showAddMember && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 max-h-40 overflow-auto rounded-lg border border-border">
                  {nonMembers.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-3 text-center">No users to add</p>
                  ) : (
                    nonMembers.map((u) => (
                      <button
                        key={u.user_id}
                        onClick={() => handleAdd(u)}
                        disabled={busy}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/40 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                          {u.display_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-sm text-foreground">{u.display_name || "User"}</span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Members List */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Members</p>
          <div className="space-y-1">
            {conversation.participants?.map((p) => (
              <div key={p.user_id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                  {p.display_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                    {p.display_name || "User"}
                    {p.user_id === user?.id && <span className="text-[10px] text-muted-foreground">(You)</span>}
                  </p>
                  {p.is_admin && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                      <Crown className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
                {isAdmin && p.user_id !== user?.id && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAdmin(p.user_id, p.is_admin, p.display_name || "User")}
                      disabled={busy}
                      className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors"
                      title={p.is_admin ? "Remove admin" : "Make admin"}
                    >
                      {p.is_admin ? <ShieldOff className="w-4 h-4 text-chart-amber" /> : <Shield className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <button
                      onClick={() => handleRemove(p.user_id, p.display_name || "User")}
                      disabled={busy}
                      className="p-1.5 rounded-lg hover:bg-chart-red/10 transition-colors"
                      title="Remove member"
                    >
                      <UserMinus className="w-4 h-4 text-chart-red" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupAdminPanel;
