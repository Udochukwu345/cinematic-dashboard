import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, Palette, Globe, Camera, Save, Key, Smartphone, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "preferences">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  });
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    tradeUpdates: true,
    communityMentions: false,
    newsletter: true,
    pushNotifications: false,
  });

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
  ];

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
          <div className="glass-card p-5 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto">
                {user?.email?.[0]?.toUpperCase() || "T"}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
            <p className="text-sm font-semibold text-foreground mt-3 truncate">{user?.email || "Trader"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pro Account</p>
          </div>

          {/* Tab Navigation */}
          <div className="glass-card mt-3 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
          {activeTab === "profile" && (
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
                    <Mail className="w-4 h-4 text-muted-foreground" />
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
          )}

          {activeTab === "security" && (
            <div className="glass-card p-5 md:p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Confirm Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between bg-secondary/30 border border-border rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">2FA via Authenticator App</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">Enable</button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Key className="w-4 h-4" /> Update Security
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card p-5 md:p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: "priceAlerts" as const, label: "Price Alerts", desc: "Get notified when assets hit your target price" },
                  { key: "tradeUpdates" as const, label: "Trade Updates", desc: "Receive updates on your open positions" },
                  { key: "communityMentions" as const, label: "Community Mentions", desc: "Notify when someone mentions you" },
                  { key: "newsletter" as const, label: "Weekly Newsletter", desc: "Weekly market summary and insights" },
                  { key: "pushNotifications" as const, label: "Push Notifications", desc: "Browser push notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between bg-secondary/30 border border-border rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                      className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key] ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications[item.key] ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="glass-card p-5 md:p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">App Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default Currency</label>
                  <select className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Timezone</label>
                  <select className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>UTC (GMT+0)</option>
                    <option>EST (GMT-5)</option>
                    <option>PST (GMT-8)</option>
                    <option>CET (GMT+1)</option>
                    <option>JST (GMT+9)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Chart Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Candlestick", "Line", "Area"].map((style) => (
                      <button key={style} className="px-3 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all first:bg-primary/10 first:text-primary first:border-primary/30">
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;
