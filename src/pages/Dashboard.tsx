import { Search } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import MarketTicker from "@/components/dashboard/MarketTicker";
import StatsCards from "@/components/dashboard/StatsCards";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import FearGreedIndex from "@/components/dashboard/FearGreedIndex";
import TopMovers from "@/components/dashboard/TopMovers";
import RecentTrades from "@/components/dashboard/RecentTrades";
import Markets from "@/pages/Markets";
import Portfolio from "@/pages/Portfolio";
import Analysis from "@/pages/Analysis";
import TradeNotes from "@/pages/TradeNotes";
import News from "@/pages/News";
import WalletPage from "@/pages/WalletPage";

const DashboardHome = () => (
  <>
    <MarketTicker />
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Market Overview</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Welcome back. Here's what's moving.</p>
      </div>
      <StatsCards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2"><PortfolioChart /></div>
        <FearGreedIndex />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2"><RecentTrades /></div>
        <TopMovers />
      </div>
    </div>
  </>
);

const Dashboard = () => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 pt-[56px] md:pt-0">
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="markets" element={<Markets />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="notes" element={<TradeNotes />} />
        <Route path="news" element={<News />} />
        <Route path="wallet" element={<WalletPage />} />
      </Routes>
    </div>
  </div>
);

export default Dashboard;
