"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function CameraFeed() {
  const { t } = useLanguage();

  return (
    <div className="relative w-full aspect-video bg-black/60 rounded-xl overflow-hidden">
      {/* Scan line */}
      <div className="absolute inset-x-0 h-0.5 bg-green-400/40 animate-scanLine" />

      {/* Placeholder text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col gap-1 pointer-events-none">
        <span className="text-xs text-surface/80 font-mono">{t("liveFeed")}</span>
        <span className="text-xs text-surface/70 font-mono">{t("canopyLevel")}</span>
        <span className="text-xs text-surface/70 font-mono">{t("cameraActive")}</span>
      </div>

      {/* Top-left label */}
      <div className="absolute top-2 left-3">
        <span className="text-[10px] font-mono text-surface/70 tracking-wider">CAM-01</span>
      </div>

      {/* Top-right LIVE badge */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-[10px] font-bold tracking-widest text-red-400 font-mono">{t("liveFeed")}</span>
      </div>

      {/* Corner overlay for aesthetics */}
      <div className="absolute inset-0 border border-primary/20 rounded-xl pointer-events-none" />
    </div>
  );
}
