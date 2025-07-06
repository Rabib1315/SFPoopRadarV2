import { ReactNode } from "react";
import StatusBar from "./status-bar";
import BottomNavigation from "./bottom-navigation";

interface MobileAppContainerProps {
  children: ReactNode;
}

export default function MobileAppContainer({ children }: MobileAppContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-black rounded-3xl p-2 shadow-2xl">
        <div className="bg-white rounded-2xl overflow-hidden h-screen max-h-[640px] relative">
          <StatusBar />
          <div className="h-full overflow-y-auto pb-20" style={{ height: "calc(100% - 124px)" }}>
            {children}
          </div>
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}
