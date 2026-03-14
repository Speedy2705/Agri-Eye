"use client";

import { useEffect, useState } from "react";
import Toggle from "@/components/ui/Toggle";
import Waveform from "@/components/ui/Waveform";
import type { HornZone } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface HornZoneCardProps {
  zone: HornZone;
  hornActive: boolean;
  autoMode: boolean;
  onHornChange: (active: boolean) => void;
  onAutoModeChange: (active: boolean) => void;
}

export default function HornZoneCard({
  zone,
  hornActive,
  autoMode,
  onHornChange,
  onAutoModeChange,
}: HornZoneCardProps) {
  const { t } = useLanguage();
  const [lastTriggered, setLastTriggered] = useState<string | null>(zone.lastTriggered);

  useEffect(() => {
    if (!hornActive) return;

    setLastTriggered(t("justNow"));
    const timer = setTimeout(() => onHornChange(false), 5000);
    return () => clearTimeout(timer);
  }, [hornActive, onHornChange, t]);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40",
        hornActive && "bg-danger/5 ring-2 ring-danger/40 shadow-lg shadow-danger/20"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{zone.zone}</p>
          <p className="text-xs text-muted">{t("node")} {zone.nodeId}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
            hornActive ? "bg-danger/15 text-danger" : "bg-muted/20 text-muted"
          )}
        >
          {hornActive ? t("active") : t("idle")}
        </span>
      </div>

      <div className="mb-4 flex justify-center">
        <Waveform active={hornActive} />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onHornChange(true)}
          className={cn(
            "rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
            hornActive
              ? "btn-danger border-transparent text-white"
              : "btn-primary border-transparent text-white"
          )}
        >
          🔊 {t("triggerHorn")}
        </button>

        <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/5 px-2.5 py-2">
          <span className="text-xs text-foreground/85">{t("autoMode")}</span>
          <Toggle checked={autoMode} onChange={onAutoModeChange} />
        </div>
      </div>

      <p className="text-xs text-muted">
        {t("latestTriggered")}: {lastTriggered ?? t("never")}
      </p>
    </div>
  );
}
