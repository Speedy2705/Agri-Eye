"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  cameraDetections,
  canopyHealth,
  detectionHistory,
  leafHealthScore,
  type CameraDetection,
} from "@/lib/mockData";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressRing from "@/components/ui/ProgressRing";
import MonitoringCameraCard from "@/components/dashboard/MonitoringCameraCard";
import PageWrapper from "@/components/dashboard/PageWrapper";
import PageContainer from "@/components/dashboard/PageContainer";
import { useLanguage } from "@/lib/LanguageContext";

function statusVariant(s: string): "danger" | "warning" | "success" {
  if (s === "Active")     return "danger";
  if (s === "Monitoring") return "warning";
  return "success";
}

const filterTabs = ["allZones", "activeOnly", "monitoring", "healthy"] as const;

function severityBarClass(severity: CameraDetection["severity"]) {
  if (severity === "High") return "bg-danger";
  if (severity === "Medium") return "bg-warning";
  if (severity === "Low") return "bg-yellow-400";
  return "bg-success";
}

export default function MonitoringPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filterTabs)[number]>("allZones");
  const { t } = useLanguage();

  const activeCount = cameraDetections.filter((entry) => entry.status === "Active").length;
  const monitoringCount = cameraDetections.filter((entry) => entry.status === "Monitoring").length;
  const healthyCount = cameraDetections.filter((entry) => entry.status === "Healthy").length;
  const avgConfidence = Math.round(
    cameraDetections.reduce((sum, entry) => sum + entry.confidence, 0) / cameraDetections.length
  );

  const filteredDetections = useMemo(() => {
    if (activeFilter === "activeOnly") {
      return cameraDetections.filter((entry) => entry.status === "Active");
    }

    if (activeFilter === "monitoring") {
      return cameraDetections.filter((entry) => entry.status === "Monitoring");
    }

    if (activeFilter === "healthy") {
      return cameraDetections.filter((entry) => entry.status === "Healthy");
    }

    return cameraDetections;
  }, [activeFilter]);

  const activeReports = cameraDetections.filter((entry) => entry.status !== "Healthy");
  const translateStatus = (status: string) => {
    if (status === "Active") return t("active");
    if (status === "Monitoring") return t("monitoring");
    if (status === "Healthy") return t("healthy");
    return status;
  };

  return (
    <PageWrapper>
      <PageContainer title={`🌿 ${t("cropHealthMonitoring")}`} subtitle={t("monitoringSubtitle")}>
      <div className="flex flex-col gap-5 sm:gap-6">

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
            🔴 {t("activeDiseases")}: {activeCount}
          </span>
          <span className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            🟡 {t("monitoring")}: {monitoringCount}
          </span>
          <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            🟢 {t("healthy")}: {healthyCount}
          </span>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            📊 {t("avgConfidence")}: {avgConfidence}%
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const selected = tab === activeFilter;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={selected
                  ? "rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-background"
                  : "rounded-full border border-primary/20 bg-card px-3 py-1.5 text-xs text-muted"
                }
              >
                {t(tab)}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredDetections.map((detection, index) => (
              <motion.div
                key={detection.cameraId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: index * 0.1 }}
              >
                <MonitoringCameraCard detection={detection} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h2 className="text-sm font-semibold text-primary mb-3">🔬 {t("activeDiseaseReport")}</h2>
            <div className="space-y-3">
              {activeReports.map((entry) => (
                <div key={entry.cameraId} className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{entry.zone}</span>
                      <span className="rounded-full border border-primary/20 bg-background/40 px-2 py-0.5 font-mono text-[11px] text-foreground">
                        {entry.plantId}
                      </span>
                    </div>
                    <Badge variant={statusVariant(entry.status)}>{entry.confidence}%</Badge>
                  </div>

                  <p className="mt-2 text-sm font-bold text-foreground">{entry.disease}</p>

                  <p className="mt-1 text-xs text-muted">
                    {t("lastScan")}: {entry.lastScan}
                  </p>

                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted">
                      <span>{t("affectedArea")}</span>
                      <span>{entry.affectedLeafArea}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background/60">
                      <div
                        className={severityBarClass(entry.severity)}
                        style={{ width: `${entry.affectedLeafArea}%`, height: "100%" }}
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-foreground/75">
                    <span className="font-semibold">{t("recommendation")}:</span> {entry.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-primary mb-3">📋 {t("detectionHistoryTable")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted border-b border-primary/20">
                    <th className="pb-2 pr-4 font-medium">{t("time")}</th>
                    <th className="pb-2 pr-4 font-medium">{t("disease")}</th>
                    <th className="pb-2 pr-4 font-medium">{t("confidence")}</th>
                    <th className="pb-2 font-medium">{t("status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  {detectionHistory.map((d, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-3 sm:pr-4 font-mono text-[11px] sm:text-xs text-muted">{d.time}</td>
                      <td className="py-2 pr-3 sm:pr-4 text-foreground">{d.disease}</td>
                      <td className="py-2 pr-3 sm:pr-4 text-foreground">{d.confidence}%</td>
                      <td className="py-2">
                        <Badge variant={statusVariant(d.status)}>{translateStatus(d.status)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leaf Health Score */}
        <Card className="flex flex-col items-center justify-center py-6">
          <h2 className="text-sm font-semibold text-primary mb-4">{t("leafHealth")}</h2>
          <ProgressRing value={leafHealthScore} size={160} strokeWidth={12} color="#F4A01C" />
        </Card>

        {/* Canopy Coverage */}
        <Card>
          <h2 className="text-sm font-semibold text-primary mb-4">{t("canopyCoverage")}</h2>
          <div className="flex rounded-full overflow-hidden h-4 w-full">
            <div className="bg-success transition-all" style={{ width: `${canopyHealth.healthy}%` }} />
            <div className="bg-warning transition-all" style={{ width: `${canopyHealth.stressed}%` }} />
            <div className="bg-danger  transition-all" style={{ width: `${canopyHealth.diseased}%` }} />
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success" />
              {canopyHealth.healthy}% {t("healthy")}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-warning">
              <span className="w-2 h-2 rounded-full bg-warning" />
              {canopyHealth.stressed}% {t("stressed")}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-danger">
              <span className="w-2 h-2 rounded-full bg-danger" />
              {canopyHealth.diseased}% {t("diseased")}
            </span>
          </div>
        </Card>
        </div>
      </div>
      </PageContainer>
    </PageWrapper>
  );
}
