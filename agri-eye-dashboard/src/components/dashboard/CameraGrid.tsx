"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cameraZones } from "@/lib/mockData";
import ZoneCameraCard from "@/components/dashboard/ZoneCameraCard";
import { useLanguage } from "@/lib/LanguageContext";

export default function CameraGrid() {
  const [expandedCam, setExpandedCam] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cameraZones.map((cam, index) => {
          const isExpanded = expandedCam === cam.id;

          return (
            <motion.div
              key={cam.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04 }}
              className={isExpanded ? "fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6" : ""}
            >
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => setExpandedCam(null)}
                  className="absolute right-3 top-3 sm:right-5 sm:top-5 rounded-md border border-foreground/20 bg-black/40 p-2 text-foreground transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  aria-label={t("closeExpandedCamera")}
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              <motion.div
                initial={false}
                animate={isExpanded ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={isExpanded ? "w-full max-w-5xl" : "w-full"}
              >
                <ZoneCameraCard
                  camera={cam}
                  onExpand={() => setExpandedCam(isExpanded ? null : cam.id)}
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
