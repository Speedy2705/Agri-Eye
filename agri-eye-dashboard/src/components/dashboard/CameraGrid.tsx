"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cameraZones } from "@/lib/mockData";
import ZoneCameraCard from "@/components/dashboard/ZoneCameraCard";
import { useLanguage } from "@/lib/LanguageContext";

export default function CameraGrid() {
  const [expandedCam, setExpandedCam] = useState<string | null>(null);
  const { t } = useLanguage();

  const selectedCamera = useMemo(
    () => cameraZones.find((cam) => cam.id === expandedCam) ?? null,
    [expandedCam]
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cameraZones.map((cam, index) => (
          <motion.div
            key={cam.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04 }}
          >
            <ZoneCameraCard
              camera={cam}
              onExpand={() => setExpandedCam(cam.id)}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
          >
            <button
              type="button"
              onClick={() => setExpandedCam(null)}
              className="absolute right-3 top-3 sm:right-5 sm:top-5 rounded-md border border-foreground/20 bg-black/40 p-2 text-foreground transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              aria-label={t("closeExpandedCamera")}
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl"
            >
              <ZoneCameraCard
                camera={selectedCamera}
                onExpand={() => setExpandedCam(null)}
                className="w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
