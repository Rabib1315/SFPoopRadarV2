import { useState } from "react";
import { useLocation } from "wouter";
import MapContainer from "@/components/map-container";
import StatsGrid from "@/components/stats-grid";
import NeighborhoodStats from "@/components/neighborhood-stats";
import { BarChart3 } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleQuickReport = () => {
    setLocation("/report");
  };

  return (
    <div className="block">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-300 text-white p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12">🌉</div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">💩🔍 SF Poop Radar</h1>
          <p className="text-sm opacity-90 mb-2">Real-time poop detection in San Francisco</p>
          <div className="inline-block bg-white bg-opacity-20 rounded-xl px-3 py-1 text-xs">
            🏙️ The City by the Bay
          </div>
        </div>
      </div>

      {/* Live Map Section */}
      <MapContainer onQuickReport={handleQuickReport} />

      {/* Statistics Section */}
      <div className="px-5 mb-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Today's SF Stats
        </h2>

        <StatsGrid />
        <NeighborhoodStats />
      </div>
    </div>
  );
}
