import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const updateTime = () => setCurrentTime(formatTime(new Date()));
    const intervalId = window.setInterval(updateTime, 1000 * 30);

    updateTime();

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0">
      <span className="text-sm font-semibold text-foreground-950">{currentTime}</span>
      <div className="flex items-center gap-1">
        <i className="ri-wifi-line text-foreground-950 text-xs w-4 h-4 flex items-center justify-center" />
        <i className="ri-battery-fill text-foreground-950 text-xs w-4 h-4 flex items-center justify-center" />
      </div>
    </div>
  );
}
