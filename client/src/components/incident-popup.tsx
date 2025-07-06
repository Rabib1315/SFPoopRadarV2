import { type Incident } from "@shared/schema";
import { X } from "lucide-react";

interface IncidentPopupProps {
  incident: Incident;
  onClose: () => void;
}

export default function IncidentPopup({ incident, onClose }: IncidentPopupProps) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "human":
        return { label: "Human Poop", color: "bg-red-600" };
      case "dog":
        return { label: "Dog Poop", color: "bg-orange-500" };
      default:
        return { label: "Unknown Poop", color: "bg-gray-500" };
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const typeConfig = getTypeConfig(incident.type);

  return (
    <div className="absolute bottom-20 left-5 right-5 bg-white rounded-xl p-4 shadow-2xl z-50 slide-up">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className={`${typeConfig.color} text-white px-2 py-1 rounded text-xs font-semibold`}>
            {typeConfig.label}
          </span>
          <span className="text-xs text-gray-500">
            {getTimeAgo(incident.createdAt)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p><strong>Location:</strong> {incident.location}</p>
        <p><strong>Neighborhood:</strong> {incident.neighborhood}</p>
        <p><strong>Reported:</strong> {incident.reporter}</p>
        <p><strong>Status:</strong> <span className="text-yellow-600 capitalize">{incident.status}</span></p>
      </div>
    </div>
  );
}
