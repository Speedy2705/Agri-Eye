"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs sm:text-sm text-foreground/70 tabular-nums">{time}</span>
  );
}

export default function Navbar() {
  return (
    <header className="h-14 px-3 sm:px-4 md:px-6 flex items-center justify-between backdrop-blur-sm bg-background/80 border-b border-primary/30 flex-shrink-0">
      {/* Left */}
      <p className="text-foreground/80 text-xs sm:text-sm font-medium truncate pr-2">
        Kesarwani Mango Orchard &mdash; Jabalpur
      </p>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <LiveClock />

        {/* Bell */}
        <div className="relative">
          <Bell size={18} className="text-foreground/70" />
          <span className="absolute -top-1.5 -right-1.5 bg-warning text-background text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-foreground text-[10px] sm:text-xs font-bold select-none">
          KO
        </div>
      </div>
    </header>
  );
}

