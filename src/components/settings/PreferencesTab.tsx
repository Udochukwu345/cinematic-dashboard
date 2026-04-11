import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PreferencesTab = () => {
  const [chartStyle, setChartStyle] = useState("Candlestick");

  return (
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
              <button
                key={style}
                onClick={() => setChartStyle(style)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  chartStyle === style
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => toast.success("Preferences saved!")} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesTab;
