import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, LineChart, Briefcase, FileText, Newspaper, Wallet, TrendingUp, Menu, X, LogOut, Users, Settings, CandlestickChart, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/markets", icon: BarChart3, label: "Markets" },
  { to: "/dashboard/chart", icon: CandlestickChart, label: "Market Chart" },
  { to: "/dashboard/analysis", icon: LineChart, label: "Analysis" },
  { to: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
  { to: "/dashboard/notes", icon: FileText, label: "Trade Notes" },
  { to: "/dashboard/news", icon: Newspaper, label: "News" },
  { to: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { to: "/dashboard/community", icon: Users, label: "Community" },
  { to: "/dashboard/messenger", icon: Send, label: "Messenger" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full">
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
            onClick={onNavClick}
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
            {user?.email?.[0]?.toUpperCase() || "T"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.email || "Trader"}</p>
            <p className="text-xs text-muted-foreground">Pro Account</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">Tradexa</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-foreground">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen bg-sidebar border-r border-sidebar-border flex-col shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
