"use client";

import { useState } from "react";
import { Circle, Maximize2, Square } from "lucide-react";
import type { CameraZone } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";
import LiveStreamFeed from "@/components/dashboard/LiveStreamFeed";

interface ZoneCameraCardProps {
  camera: CameraZone;
  onExpand: () => void;
  className?: string;
}

export default function ZoneCameraCard({
  camera,
  onExpand,
  className,
}: ZoneCameraCardProps) {
  const [isRecording, setIsRecording] = useState(camera.recording);
  const { t } = useLanguage();

  const scanLineColor = camera.status === "alert" ? "bg-danger/70" : "bg-success/60";

  return (
    <div
      className={cn(
        "group relative aspect-video overflow-hidden rounded-xl bg-black/70 border border-primary/20 transition-all duration-300 hover:border-primary/45 hover:shadow-lg hover:shadow-black/40",
        camera.alert && "ring-2 ring-danger animate-pulse",
        className
      )}
    >
      {camera.streamUrl ? (
        <div className="absolute inset-0 z-0">
          <LiveStreamFeed streamUrl={camera.streamUrl} className="h-full w-full" />
        </div>
      ) : (
        /* Existing decorative background for all other cameras */
        <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-primary/5 to-black/35 transition-opacity group-hover:opacity-80" />
      )}

      {/* Shared gradient overlay so text stays legible over the video */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Scan line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 animate-scanLine z-20",
          scanLineColor
        )}
      />

      {!isRecording && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none">
          <span className="rounded-md bg-warning/20 px-2 py-1 text-xs font-semibold tracking-wide text-warning border border-warning/40">
            {t("recPaused")}
          </span>
        </div>
      )}

      <div className="absolute top-2 left-3 z-20">
        <span className="text-[10px] font-mono tracking-widest text-surface/70">{camera.id}</span>
      </div>

      {!camera.streamUrl && (
        <div className="absolute top-2 right-3 z-30 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
          </span>
          <span className="text-[10px] font-bold tracking-widest text-danger">
            {t("liveFeed")}
          </span>
        </div>
      )}

      <div className="absolute bottom-2 left-3 z-20">
        <span className="text-xs font-medium text-surface/90">{camera.zone}</span>
      </div>

      <button
        type="button"
        onClick={() => setIsRecording((prev) => !prev)}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1 rounded-md border border-primary/30 bg-black/45 px-2 py-1 text-[11px] text-surface/85 transition-all hover:bg-black/65 hover:border-primary/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      >
        {isRecording ? (
          <Circle className="h-3.5 w-3.5 text-danger fill-danger animate-pulse" />
        ) : (
          <Square className="h-3.5 w-3.5 text-muted" />
        )}
        <span>{isRecording ? t("recording") : t("recPaused")}</span>
      </button>

      <button
        type="button"
        onClick={onExpand}
        className="absolute bottom-2 right-2 z-20 rounded-md border border-primary/30 bg-black/45 p-1.5 text-surface/85 transition-all hover:bg-black/65 hover:border-primary/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        aria-label={`${t("expandCamera")} ${camera.zone}`}
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  );
}
