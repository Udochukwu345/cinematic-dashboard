import { motion } from "framer-motion";
import { User, Shield, Bell, Palette, Camera } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileTab from "@/components/settings/ProfileTab";
import SecurityTab from "@/components/settings/SecurityTab";
import NotificationsTab from "@/components/settings/NotificationsTab";
import PreferencesTab from "@/components/settings/PreferencesTab";

const tabs = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "security" as const, label: "Security", icon: Shield },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "preferences" as const, label: "Preferences", icon: Palette },
];

const ProfileSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "preferences">("profile");

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Mobile tab bar */}
      <div className="flex lg:hidden overflow-x-auto gap-2 pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground bg-secondary/30 hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Profile Card + Desktop Tabs */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 hidden lg:block">
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
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-3"
        >
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "preferences" && <PreferencesTab />}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;
