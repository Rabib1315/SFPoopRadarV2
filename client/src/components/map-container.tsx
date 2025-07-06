import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Incident } from "@shared/schema";
import IncidentPopup from "./incident-popup";
import { Plus } from "lucide-react";

interface MapContainerProps {
  onQuickReport: () => void;
}

export default function MapContainer({ onQuickReport }: MapContainerProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const { data: incidents = [] } = useQuery<Incident[]>({
    queryKey: ["/api/incidents"],
  });

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "human":
        return "bg-red-600";
      case "dog":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarkerEmoji = (type: string) => {
    switch (type) {
      case "human":
        return "💩";
      case "dog":
        return "🐕";
      default:
        return "❓";
    }
  };

  const getMarkerPosition = (incident: Incident) => {
    // Convert lat/lng to approximate position within the map container
    const lat = parseFloat(incident.latitude);
    const lng = parseFloat(incident.longitude);
    
    // SF approximate bounds: 37.7-37.8 lat, -122.5 to -122.4 lng
    const topPercent = ((37.8 - lat) / 0.1) * 100;
    const leftPercent = ((lng + 122.5) / 0.1) * 100;
    
    return {
      top: `${Math.max(10, Math.min(90, topPercent))}%`,
      left: `${Math.max(10, Math.min(90, leftPercent))}%`,
    };
  };

  return (
    <div className="bg-white m-5 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-orange-500">🗺️</span>
          Live SF Map
        </h2>
        <span className="text-xs text-gray-500">Updated 1 min ago</span>
      </div>

      <div className="h-60 relative bg-gradient-to-br from-blue-50 to-blue-100 map-grid">
        {/* SF Street Labels */}
        <div className="absolute top-10 left-3 text-xs text-gray-600 font-semibold bg-white bg-opacity-90 px-2 py-1 rounded">
          Geary St
        </div>
        <div className="absolute bottom-8 left-4 text-xs text-gray-600 font-semibold bg-white bg-opacity-90 px-2 py-1 rounded transform -rotate-12">
          Market St
        </div>
        <div className="absolute top-5 left-1/3 text-xs text-gray-600 font-semibold bg-white bg-opacity-90 px-2 py-1 rounded transform rotate-90">
          Van Ness
        </div>

        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-20">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping"></div>
        </div>

        {/* Incident Markers */}
        {incidents.map((incident) => {
          const position = getMarkerPosition(incident);
          return (
            <div
              key={incident.id}
              className={`poop-marker absolute w-6 h-6 ${getMarkerColor(
                incident.type
              )} border-2 border-white rounded-full shadow-lg cursor-pointer z-30 flex items-center justify-center text-white text-xs font-bold ${
                incident.isRecent ? "recent-marker" : ""
              }`}
              style={position}
              onClick={() => setSelectedIncident(incident)}
            >
              {getMarkerEmoji(incident.type)}
            </div>
          );
        })}

        {/* Quick Report Button */}
        <button
          onClick={onQuickReport}
          className="absolute bottom-4 right-4 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center text-xl z-40"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {selectedIncident && (
        <IncidentPopup
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}
