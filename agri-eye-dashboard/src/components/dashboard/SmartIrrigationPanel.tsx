"use client";

import { useEffect, useMemo, useState } from "react";
import { plantZones, globalEt0 } from "@/lib/mockData";
import PlantZoneCard from "@/components/dashboard/PlantZoneCard";
import { calcWaterReq, getIrrigationUrgency } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

interface IrrigationSuggestion {
  zoneId: string;
  message: string;
}

interface SmartIrrigationPanelProps {
  et0?: number;
}

export default function SmartIrrigationPanel({ et0 = globalEt0 }: SmartIrrigationPanelProps) {
  const [tapStates, setTapStates] = useState<Record<string, boolean>>(
    plantZones.reduce<Record<string, boolean>>((acc, zone) => {
      acc[zone.id] = zone.tapOpen;
      return acc;
    }, {})
  );
  const [suggestions, setSuggestions] = useState<IrrigationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const criticalSuggestions = plantZones
      .filter((zone) => {
        const urgency = getIrrigationUrgency(zone.soilMoisture);
        return urgency === "critical" && !tapStates[zone.id];
      })
      .map((zone) => ({
        zoneId: zone.id,
        message: `${zone.id} (${zone.name.split(" - ")[1] ?? zone.name}) - ${t("soilMoisture")}: ${zone.soilMoisture}% - ${t("zoneShouldOpenTap")}`,
      }));

    setSuggestions(criticalSuggestions);
  }, [tapStates, t]);

  const stats = useMemo(() => {
    const zonesCritical = plantZones.filter(
      (zone) => getIrrigationUrgency(zone.soilMoisture) === "critical"
    ).length;

    const zonesIrrigating = Object.values(tapStates).filter(Boolean).length;

    const totalWaterToday = plantZones.reduce((sum, zone) => {
      if (!tapStates[zone.id]) return sum;
      return sum + calcWaterReq(et0, zone.kc, zone.area);
    }, 0);

    return {
      zonesCritical,
      zonesIrrigating,
      totalWaterToday: parseFloat(totalWaterToday.toFixed(1)),
    };
  }, [et0, tapStates]);

  const openAllCriticalTaps = () => {
    setTapStates((prev) => {
      const next = { ...prev };
      for (const zone of plantZones) {
        if (getIrrigationUrgency(zone.soilMoisture) === "critical") {
          next[zone.id] = true;
        }
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-primary/25 bg-card p-3 sm:p-3.5">
          <p className="text-xs text-muted">{t("totalWaterToday")}</p>
          <p className="text-xl font-bold text-accent font-sora">{stats.totalWaterToday} L</p>
        </div>
        <div className="rounded-xl border border-primary/25 bg-card p-3 sm:p-3.5">
          <p className="text-xs text-muted">{t("zonesIrrigating")}</p>
          <p className="text-xl font-bold text-primary font-sora">{stats.zonesIrrigating}</p>
        </div>
        <div className="rounded-xl border border-primary/25 bg-card p-3 sm:p-3.5">
          <p className="text-xs text-muted">{t("zonesCritical")}</p>
          <p className="text-xl font-bold text-danger font-sora">{stats.zonesCritical}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={openAllCriticalTaps}
        className="btn-danger px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/70"
      >
        {t("openAllCriticalTaps")}
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-warning">💡 {t("smartIrrigationSuggestions")}</p>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="text-xs text-warning/90 transition-colors hover:text-warning"
            >
              {t("dismiss")}
            </button>
          </div>
          <ul className="space-y-2 text-xs text-foreground/85">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.zoneId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-warning/30 bg-background/30 px-2.5 py-2"
              >
                <span>{suggestion.message}</span>
                <button
                  type="button"
                  onClick={() =>
                    setTapStates((prev) => ({
                      ...prev,
                      [suggestion.zoneId]: true,
                    }))
                  }
                  className="btn-accent px-2 py-1 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning/70"
                >
                  {t("openTap")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plantZones.map((zone) => (
          <PlantZoneCard
            key={zone.id}
            zone={zone}
            et0={et0}
            tapOpen={tapStates[zone.id]}
            onToggle={(open) =>
              setTapStates((prev) => ({
                ...prev,
                [zone.id]: open,
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}
