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

  return <span className="font-mono text-xs text-muted tabular-nums">{time}</span>;
}

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-40 px-3 pt-3 md:px-4 md:pb-0">
      <header
        className="relative mx-auto max-w-4xl px-4 py-2.5 rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.80)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(200, 230, 201, 0.7)",
          boxShadow: "0 4px 24px rgba(45,106,79,0.10), 0 1px 4px rgba(45,106,79,0.06)",
        }}
      >
        <div className="relative z-10 flex items-center justify-between">
          {/* Farm name with shimmer */}
          <div className="flex items-center gap-2">
            <span className="text-base">🥭</span>
            <p className="text-foreground text-sm font-bold font-sora truncate shimmer-text">
              {t("farmName")}
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LiveClock />
            <LanguageSwitcher />

            {/* Bell */}
            <div className="relative">
              <Bell size={17} className="text-primary" />
              <span className="absolute -top-1.5 -right-1.5 bg-grad-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>

            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-grad-success flex items-center justify-center text-white text-[10px] font-bold select-none shadow-sm">
              KO
            </div>
          </div>
        </div>

      </header>
    </div>
  );
}

