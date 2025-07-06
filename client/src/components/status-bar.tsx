export default function StatusBar() {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300 h-11 flex items-center justify-between px-5 text-white text-sm font-semibold">
      <span>9:41</span>
      <span className="text-lg font-bold">SF Poop Radar</span>
      <div className="flex items-center gap-1">
        <span className="text-xs">📍</span>
        <span className="text-xs">SF</span>
      </div>
    </div>
  );
}
