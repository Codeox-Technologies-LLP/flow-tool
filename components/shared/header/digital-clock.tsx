"use client";

import { useState, useEffect } from "react";

export function DigitalClock() {
  // Initialize with null to prevent hydration mismatch
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // This is acceptable: subscribing to an external system (timer)
    // and updating state in the callback
    const updateTime = () => setTime(new Date());
    
    // Set initial time
    updateTime();
    
    // Subscribe to interval updates
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Prevent hydration mismatch by not rendering until time is set
  if (!time) {
    return (
      <div className="flex items-center gap-2 justify-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 invisible">Wed, Jan 16</div>
        <div className="text-sm font-semibold text-slate-900 tabular-nums invisible">
          00:00:00 AM
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
      <div className="text-xs text-slate-500">{formatDate(time)}</div>
      <div className="text-sm font-semibold text-slate-900 tabular-nums">
        {formatTime(time)}
      </div>
    </div>
  );
}
