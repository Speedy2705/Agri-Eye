"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

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
    <span className="font-mono text-xs sm:text-sm text-muted tabular-nums">{time}</span>
  );
}

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="h-14 px-3 sm:px-4 md:px-6 flex items-center justify-between bg-white/75 backdrop-blur-xl border-b border-border/60 flex-shrink-0">
      {/* Left */}
      <p className="text-foreground text-xs sm:text-sm font-semibold truncate pr-2">
        {t("farmName")}
      </p>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <LiveClock />
        <LanguageSwitcher />

        {/* Bell */}
        <div className="relative">
          <Bell size={18} className="text-primary" />
          <span className="absolute -top-1.5 -right-1.5 bg-grad-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-grad-success flex items-center justify-center text-white text-[10px] sm:text-xs font-bold select-none shadow-sm">
          KO
        </div>
      </div>
    </header>
  );
}

