import { useQuery } from "@tanstack/react-query";
import { type Neighborhood } from "@shared/schema";

export default function NeighborhoodStats() {
  const { data: neighborhoods = [], isLoading } = useQuery<Neighborhood[]>({
    queryKey: ["/api/neighborhoods"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-orange-500">🏙️</span>
          SF Neighborhoods
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (neighborhoods.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-orange-500">🏙️</span>
          SF Neighborhoods
        </h3>
        <div className="text-center text-gray-500 py-4">
          No neighborhood data available
        </div>
      </div>
    );
  }

  // Sort neighborhoods by count (descending)
  const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-orange-500">🏙️</span>
        SF Neighborhoods
      </h3>
      <div className="space-y-3">
        {sortedNeighborhoods.map((neighborhood) => (
          <div key={neighborhood.id} className="flex justify-between items-center py-2">
            <span className="text-gray-700">{neighborhood.name}</span>
            <span className="text-orange-500 font-semibold">{neighborhood.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
