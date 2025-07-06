import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Incident } from "@shared/schema";
import IncidentPopup from "./incident-popup";

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

      <div className="h-60 relative bg-gray-100 overflow-hidden">
        {/* Google Maps Embed */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50590.32857729389!2d-122.46780341847656!3d37.75774166259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1609459200000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />

        {/* Incident Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {incidents.map((incident) => {
            const position = getMarkerPosition(incident);
            return (
              <div
                key={incident.id}
                className={`poop-marker absolute w-6 h-6 ${getMarkerColor(
                  incident.type
                )} border-2 border-white rounded-full shadow-lg cursor-pointer z-30 flex items-center justify-center text-white text-xs font-bold ${
                  incident.isRecent ? "recent-marker" : ""
                } pointer-events-auto`}
                style={position}
                onClick={() => setSelectedIncident(incident)}
              >
                {getMarkerEmoji(incident.type)}
              </div>
            );
          })}
        </div>

        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-20">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping"></div>
        </div>
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
