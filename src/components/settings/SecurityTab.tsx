import { Key, Smartphone, Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SecurityTab = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
        <button onClick={() => toast.success("Security settings updated!")} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Key className="w-4 h-4" /> Update Security
        </button>
      </div>
    </div>
  );
};

export default SecurityTab;
