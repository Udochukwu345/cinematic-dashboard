import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, LineChart, Briefcase, FileText, Newspaper, Wallet, TrendingUp } from "lucide-react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/markets", icon: BarChart3, label: "Markets" },
  { to: "/dashboard/analysis", icon: LineChart, label: "Analysis" },
  { to: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
  { to: "/dashboard/notes", icon: FileText, label: "Trade Notes" },
  { to: "/dashboard/news", icon: Newspaper, label: "News" },
  { to: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
];

const Sidebar = () => (
  <aside className="w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
    <div className="p-6 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>
      <span className="text-xl font-bold text-foreground">Tradexa</span>
    </div>

    <nav className="flex-1 px-3 space-y-1">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === "/dashboard"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-sidebar-accent text-sidebar-primary-foreground border border-primary/20"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`
          }
        >
          <l.icon className="w-[18px] h-[18px]" />
          {l.label}
        </NavLink>
      ))}
    </nav>

    <div className="p-4 m-3 glass-card">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
          T
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Trader</p>
          <p className="text-xs text-muted-foreground">Pro Account</p>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;
