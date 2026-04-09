"use client";

import { useEffect, useState } from "react";
import { alertStats, hornZones } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import Toast from "@/components/ui/Toast";
import Toggle from "@/components/ui/Toggle";
import PerimeterMap from "@/components/dashboard/PerimeterMap";
import AlertFeed from "@/components/dashboard/AlertFeed";
import PageWrapper from "@/components/dashboard/PageWrapper";
import PageContainer from "@/components/dashboard/PageContainer";
import HornControlPanel from "@/components/dashboard/HornControlPanel";
import { useLanguage } from "@/lib/LanguageContext";

export default function SecurityPage() {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [allZonesOverride, setAllZonesOverride] = useState(false);
  const [hornStates, setHornStates] = useState<boolean[]>(hornZones.map((zone) => zone.hornActive));
  const { t } = useLanguage();

  const triggerHornForNode = (nodeId: number) => {
    setHornStates((prev) =>
      prev.map((state, index) => (hornZones[index].nodeId === nodeId ? true : state))
    );
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setShowToast(true);
      setHornStates((prev) =>
        prev.map((state, index) => (hornZones[index].nodeId === 3 ? true : state))
      );
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (allZonesOverride) {
      setHornStates(hornZones.map(() => true));
    }
  }, [allZonesOverride]);

  const node3HornActive = hornStates[2];

  return (
    <PageWrapper>
      <PageContainer title={t("security")} subtitle={t("perimeterEventsSubtitle")}>
      <div className="flex flex-col gap-5 sm:gap-6">

        {/* Perimeter Map */}
        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">{t("perimeter")}</h2>
          <PerimeterMap hornStates={hornStates} />
        </Card>

        {/* Alert Timeline + Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="text-sm font-semibold text-primary mb-3">{t("alertTimeline")}</h2>
            <AlertFeed onTriggerHorn={triggerHornForNode} />
          </Card>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: t("totalAlerts"), value: alertStats.total },
              { label: t("animalIntrusion"), value: alertStats.animalIntrusion },
              { label: t("birdActivity"), value: alertStats.birdActivity },
              { label: t("falsePositive"), value: alertStats.falsePositive },
            ].map(({ label, value }) => (
              <Card key={label} className="flex flex-col justify-center gap-1 p-4">
                <p className="text-2xl sm:text-3xl font-bold text-accent font-sora">{value}</p>
                <p className="text-xs text-muted leading-tight">{label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Audio Deterrent */}
        <Card>
          <p className="mb-2 text-xs font-medium text-muted">{t("deterrentSystem")}</p>
          <h2 className="text-sm font-semibold text-primary mb-4">🔊 {t("zoneHornControlPerNode")}</h2>

          {node3HornActive && (
            <div className="mb-3 rounded-lg border border-danger/50 bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
              {t("activeIntrusionMessage")}
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
            <Toggle checked={allZonesOverride} onChange={setAllZonesOverride} />
            <span className="text-sm text-foreground/85">
              {t("autoAudio")} • {t("allZonesOverride")} {allZonesOverride ? `- ${t("enabled")}` : `- ${t("disabled")}`}
            </span>
          </div>

          <HornControlPanel hornStates={hornStates} setHornStates={setHornStates} />
        </Card>

        {/* Toast */}
        {showToast && (
          <Toast
            message={t("intrusionToast")}
            level="danger"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
      </PageContainer>
    </PageWrapper>
  );
}
