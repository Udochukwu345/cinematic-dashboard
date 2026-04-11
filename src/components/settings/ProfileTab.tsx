import { Mail, Save } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfileTab = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  });

  const handleSave = () => {
    toast.success("Profile saved successfully!");
  };

  return (
    <div className="glass-card p-5 md:p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display Name</label>
          <input
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            placeholder="Your display name"
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
          <div className="flex items-center gap-2 bg-secondary/30 border border-border rounded-lg px-3 py-2.5">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">{user?.email || "—"}</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell the community about yourself..."
            rows={3}
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Location</label>
          <input
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            placeholder="City, Country"
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Website</label>
          <input
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            placeholder="https://..."
            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
