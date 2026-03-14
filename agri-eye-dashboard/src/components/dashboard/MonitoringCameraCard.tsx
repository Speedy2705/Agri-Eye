"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { CameraDetection } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface MonitoringCameraCardProps {
  detection: CameraDetection;
}

const statusColor: Record<CameraDetection["status"], string> = {
  Active: "#EF4444",
  Monitoring: "#F59E0B",
  Healthy: "#22C55E",
};

const severityClasses: Record<CameraDetection["severity"], string> = {
  High: "border-danger/40 bg-danger/15 text-danger",
  Medium: "border-warning/40 bg-warning/15 text-warning",
  Low: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
  None: "border-success/40 bg-success/15 text-success",
};

export default function MonitoringCameraCard({ detection }: MonitoringCameraCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();
  const color = statusColor[detection.status];

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border border-primary/20 bg-black/70",
        detection.status === "Active" && "ring-2 ring-danger/50 shadow-lg shadow-danger/20"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-primary/5 to-black/35" />
      <div
        className="absolute inset-x-0 top-0 h-0.5 animate-scanLine"
        style={{ backgroundColor: detection.status === "Healthy" ? "rgba(34, 197, 94, 0.7)" : "rgba(34, 197, 94, 0.55)" }}
      />

      <div className="absolute left-3 top-2 z-20">
        <div className="text-[10px] font-mono tracking-widest text-surface/75">{detection.cameraId}</div>
        <div className="mt-0.5 text-xs font-medium text-surface/95">{detection.zone}</div>
      </div>

      <div className="absolute right-3 top-2 z-20 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
        </span>
        <span className="text-[10px] font-bold tracking-widest text-danger">{t("liveFeed")}</span>
      </div>

      <div
        className="absolute z-20"
        style={{ left: `${detection.plantLocation.x}%`, top: `${detection.plantLocation.y}%`, transform: "translate(-50%, -50%)" }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-surface/30 bg-black/80 px-2 py-1 text-[10px] text-surface shadow-lg backdrop-blur-sm">
            {detection.plantId} • {detection.disease}
          </div>
        )}

        {detection.status === "Healthy" ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-success/40 bg-success/20 shadow shadow-success/20">
            <Check className="h-3.5 w-3.5 text-success" />
          </div>
        ) : (
          <div className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60" style={{ backgroundColor: color }} />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-3 z-20 rounded-full border border-surface/25 bg-black/55 px-2.5 py-1 text-[11px] text-surface/90 backdrop-blur-sm">
        <span className="font-semibold">{detection.disease}</span>
        <span className="mx-1 text-surface/40">•</span>
        <span>{detection.confidence}%</span>
      </div>

      <div className={cn("absolute bottom-2 right-3 z-20 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm", severityClasses[detection.severity])}>
        {detection.severity}
      </div>
    </div>
  );
}
