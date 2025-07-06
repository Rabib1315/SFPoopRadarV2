import { useLocation } from "wouter";
import { Home, Bell, Settings } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/report", label: "Report Poop", icon: null, special: true },
    { path: "/alerts", label: "Alerts", icon: Bell },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex items-center justify-around px-2">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => setLocation(item.path)}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${
            item.special
              ? "text-orange-500 font-bold transform scale-110"
              : location === item.path
              ? "text-orange-500"
              : "text-gray-400"
          }`}
        >
          {item.special ? (
            <div className="text-2xl">💩</div>
          ) : (
            item.icon && <item.icon className="w-5 h-5" />
          )}
          <span className={item.special ? "uppercase tracking-wide" : ""}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
