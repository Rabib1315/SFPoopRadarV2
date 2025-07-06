import { useQuery } from "@tanstack/react-query";

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery<{
    reportsToday: number;
    tenderLoin: number;
    nearUser: number;
    lastHour: number;
  }>({
    queryKey: ["/api/stats/today"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500 text-center">
          <div className="text-gray-500">No data available</div>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: "Reports Today", value: stats.reportsToday },
    { label: "In Tenderloin", value: stats.tenderLoin },
    { label: "Near You (500m)", value: stats.nearUser },
    { label: "Last Hour", value: stats.lastHour },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-500 mb-1">{item.value}</div>
          <div className="text-sm text-gray-600">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
