"use client";

import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import type { PlantZone } from "@/lib/mockData";
import { calcWaterReq, cn, getIrrigationUrgency } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

type Urgency = ReturnType<typeof getIrrigationUrgency>;

interface PlantZoneCardProps {
  zone: PlantZone;
  et0: number;
  tapOpen: boolean;
  onToggle: (open: boolean) => void;
}

const urgencyStyles: Record<
  Urgency,
  {
    ring: string;
    bar: string;
    label: string;
  }
> = {
  critical: {
    ring: "ring-2 ring-danger bg-danger/5",
    bar: "bg-danger",
    label: "⚠️ Critical - Open tap now",
  },
  needed: {
    ring: "ring-1 ring-warning/50",
    bar: "bg-warning",
    label: "💧 Irrigation needed",
  },
  optimal: {
    ring: "ring-1 ring-success/30",
    bar: "bg-success",
    label: "✅ Soil moisture optimal",
  },
  excess: {
    ring: "ring-1 ring-primary/20",
    bar: "bg-slate-500",
    label: "🚫 Do not irrigate",
  },
};

export default function PlantZoneCard({ zone, et0, tapOpen, onToggle }: PlantZoneCardProps) {
  const { t } = useLanguage();
  const waterReq = calcWaterReq(et0, zone.kc, zone.area);
  const urgency = getIrrigationUrgency(zone.soilMoisture);
  const style = urgencyStyles[urgency];
  const disableTap = urgency === "excess";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-grad-card p-4 transition-all duration-300 hover:border-primary/40",
        style.ring
      )}
    >
      <p
        className={cn(
          "mb-3 inline-flex rounded-md px-2 py-1 text-[11px] font-semibold",
          urgency === "critical" && "bg-danger/15 text-danger",
          urgency === "needed" && "bg-warning/15 text-warning",
          urgency === "optimal" && "bg-success/15 text-success",
          urgency === "excess" && "bg-muted/20 text-muted"
        )}
      >
        {urgency === "critical" && `⚠️ ${t("critical")}`}
        {urgency === "needed" && `💧 ${t("needed")}`}
        {urgency === "optimal" && `✅ ${t("optimal")}`}
        {urgency === "excess" && `🚫 ${t("excess")}`}
      </p>

      <h3 className="text-sm font-semibold text-foreground leading-snug">{zone.name}</h3>

      <div className="mt-3 space-y-2.5 text-xs sm:text-[13px]">
        <div className="flex items-center justify-between">
          <span className="text-muted">{t("cropStage")}</span>
          <span className="text-foreground/90">{zone.stage}</span>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-muted">{t("soilMoisture")}</span>
            <span className="text-foreground/90">{zone.soilMoisture}%</span>
          </div>
          <div className="h-2 rounded-full bg-background/60 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", style.bar)}
              style={{ width: `${Math.min(zone.soilMoisture, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted">{t("waterRequired")}</span>
          <span className="font-semibold text-accent">{waterReq} {t("litersPerDay")}</span>
        </div>

        <div className={cn("rounded-lg border border-primary/20 p-2.5", tapOpen ? "bg-success/10" : "bg-primary/5")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-foreground/90">
              <Droplets className="h-4 w-4" />
              <span>{tapOpen ? t("closeTap") : t("openTap")}</span>
            </div>
            <Toggle
              checked={tapOpen}
              onChange={onToggle}
              disabled={disableTap}
              className={tapOpen ? "bg-grad-success" : undefined}
            />
          </div>

          <div className="mt-1 min-h-4">
            {tapOpen ? (
              <motion.span
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-xs font-medium text-success"
              >
                💧 {t("irrigating")}
              </motion.span>
            ) : (
              <span className="text-xs text-muted">{t("tapClosed")}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
