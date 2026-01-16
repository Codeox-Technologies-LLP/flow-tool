"use client";

import { useState, useEffect } from "react";

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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

  return (
    <div className="flex items-center gap-2 justify-center px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
      <div className="text-xs text-slate-500">{formatDate(time)}</div>
      <div className="text-sm font-semibold text-slate-900 tabular-nums">
        {formatTime(time)}
      </div>
    </div>
  );
}
