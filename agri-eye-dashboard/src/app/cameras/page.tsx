"use client";

import { cameraZones } from "@/lib/mockData";
import CameraGrid from "@/components/dashboard/CameraGrid";
import PageWrapper from "@/components/dashboard/PageWrapper";
import Card from "@/components/ui/Card";
import { useLanguage } from "@/lib/LanguageContext";

export default function CamerasPage() {
  const activeCount = cameraZones.filter((cam) => cam.status === "active").length;
  const alertCount = cameraZones.filter((cam) => cam.status === "alert").length;
  const warningCount = cameraZones.filter((cam) => cam.status === "warning").length;
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-sora">📹 {t("liveZoneSurveillance")}</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
            {t("camerasSubtitle")}
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-success">
              {t("active")}: {activeCount}
            </span>
            <span className="rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-danger">
              {t("alert")}: {alertCount}
            </span>
            <span className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-warning">
              {t("warning")}: {warningCount}
            </span>
          </div>
        </Card>

        <Card>
          <CameraGrid />
        </Card>
      </div>
    </PageWrapper>
  );
}
