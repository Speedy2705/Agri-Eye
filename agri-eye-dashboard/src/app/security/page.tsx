"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { alertStats } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import PerimeterMap from "@/components/dashboard/PerimeterMap";
import AlertFeed from "@/components/dashboard/AlertFeed";
import PageWrapper from "@/components/dashboard/PageWrapper";

const waveBarCount = 3;

export default function SecurityPage() {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [deterrent, setDeterrent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground font-sora">Security</h1>

      {/* Perimeter Map */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-3">Live Perimeter Surveillance</h2>
        <PerimeterMap />
      </Card>

      {/* Alert Timeline + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold text-foreground/80 mb-3">Alert Timeline</h2>
          <AlertFeed />
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Total Alerts",       value: alertStats.total          },
            { label: "Animal Intrusions",  value: alertStats.animalIntrusion },
            { label: "Bird Activity",      value: alertStats.birdActivity   },
            { label: "False Positives",    value: alertStats.falsePositive  },
          ].map(({ label, value }) => (
            <Card key={label} className="flex flex-col gap-1 justify-center">
              <p className="text-3xl font-bold text-accent font-sora">{value}</p>
              <p className="text-xs text-muted leading-tight">{label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Audio Deterrent */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-4">🔊 Audio Deterrent System</h2>
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <Toggle checked={deterrent} onChange={setDeterrent} />
          <span className={`text-sm font-medium transition-colors ${deterrent ? "text-success" : "text-muted"}`}>
            Auto Audio Deterrent {deterrent ? "- Active" : "- Off"}
          </span>

          {/* Waveform animation */}
          <div className="flex items-end gap-1 h-6 ml-2">
            {Array.from({ length: waveBarCount }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-success"
                style={{ originY: 1 }}
                animate={deterrent ? { scaleY: [1, 1.8, 1] } : { scaleY: 1 }}
                transition={
                  deterrent
                    ? { repeat: Infinity, duration: 0.7, delay: i * 0.15, ease: "easeInOut" }
                    : {}
                }
                initial={{ height: 12, scaleY: 1 }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Toast */}
      {showToast && (
        <Toast
          message="⚠️ Animal intrusion detected at Node 3 — Audio deterrent activated"
          level="danger"
          onClose={() => setShowToast(false)}
        />
      )}
      </div>
    </PageWrapper>
  );
}
