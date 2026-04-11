import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const notificationItems = [
  { key: "priceAlerts" as const, label: "Price Alerts", desc: "Get notified when assets hit your target price" },
  { key: "tradeUpdates" as const, label: "Trade Updates", desc: "Receive updates on your open positions" },
  { key: "communityMentions" as const, label: "Community Mentions", desc: "Notify when someone mentions you" },
  { key: "newsletter" as const, label: "Weekly Newsletter", desc: "Weekly market summary and insights" },
  { key: "pushNotifications" as const, label: "Push Notifications", desc: "Browser push notifications" },
];

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    tradeUpdates: true,
    communityMentions: false,
    newsletter: true,
    pushNotifications: false,
  });

  return (
    <div className="glass-card p-5 md:p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
      <div className="space-y-3">
        {notificationItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between bg-secondary/30 border border-border rounded-lg p-4">
            <div className="min-w-0 mr-3">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${notifications[item.key] ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications[item.key] ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={() => toast.success("Notification preferences saved!")} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab;
