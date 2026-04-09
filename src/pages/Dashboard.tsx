import { Search } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import MarketTicker from "@/components/dashboard/MarketTicker";
import StatsCards from "@/components/dashboard/StatsCards";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import FearGreedIndex from "@/components/dashboard/FearGreedIndex";
import TopMovers from "@/components/dashboard/TopMovers";
import RecentTrades from "@/components/dashboard/RecentTrades";

const Dashboard = () => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      {/* Search bar */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <MarketTicker />

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's what's moving.</p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PortfolioChart />
          </div>
          <FearGreedIndex />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentTrades />
          </div>
          <TopMovers />
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
