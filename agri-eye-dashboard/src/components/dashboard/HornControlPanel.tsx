"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hornZones } from "@/lib/mockData";
import Toggle from "@/components/ui/Toggle";
import HornZoneCard from "@/components/dashboard/HornZoneCard";
import { useLanguage } from "@/lib/LanguageContext";

interface HornControlPanelProps {
  hornStates: boolean[];
  setHornStates: Dispatch<SetStateAction<boolean[]>>;
}

export default function HornControlPanel({
  hornStates,
  setHornStates,
}: HornControlPanelProps) {
  const [autoModes, setAutoModes] = useState<boolean[]>(hornZones.map((zone) => zone.autoMode));
  const { t } = useLanguage();

  const allAuto = useMemo(() => autoModes.every(Boolean), [autoModes]);

  const triggerAll = () => {
    setHornStates(hornZones.map(() => true));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 p-3 sm:p-3.5">
        <button
          type="button"
          onClick={triggerAll}
          className="btn-danger px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/70"
        >
          🔊 {t("triggerAll")}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/85">{t("autoMode")}</span>
          <Toggle
            checked={allAuto}
            onChange={(next) => setAutoModes(hornZones.map(() => next))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {hornZones.map((zone, index) => (
            <motion.div
              key={zone.nodeId}
              whileHover={{ y: -2 }}
              animate={hornStates[index] ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <HornZoneCard
                zone={zone}
                hornActive={hornStates[index]}
                autoMode={autoModes[index]}
                onHornChange={(active) =>
                  setHornStates((prev) => prev.map((state, i) => (i === index ? active : state)))
                }
                onAutoModeChange={(active) =>
                  setAutoModes((prev) => prev.map((mode, i) => (i === index ? active : mode)))
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
