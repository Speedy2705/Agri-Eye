"use client";

import { useState } from "react";
import { globalEt0 } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import PageWrapper from "@/components/dashboard/PageWrapper";
import PageContainer from "@/components/dashboard/PageContainer";
import SmartIrrigationPanel from "@/components/dashboard/SmartIrrigationPanel";
import WaterCalculator from "@/components/dashboard/WaterCalculator";
import { useLanguage } from "@/lib/LanguageContext";

export default function IrrigationPage() {
  const [et0, setEt0] = useState<number>(globalEt0);
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <PageContainer title={`💧 ${t("irrigationPageTitle")}`} subtitle={t("irrigationSubtitle")}>
      <div className="flex flex-col gap-5 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground/90">{t("et0Label")}</p>
              <p className="text-sm font-semibold text-accent">{et0.toFixed(1)}</p>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.1}
              value={et0}
              onChange={(event) => setEt0(Number(event.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>1.0</span>
              <span>15.0</span>
            </div>
          </div>
        </Card>

        <SmartIrrigationPanel et0={et0} />

        <Card className="border-accent/30">
          <h2 className="text-sm font-semibold text-primary mb-1">💧 {t("generalWaterCalculator")}</h2>
          <p className="text-xs text-muted mb-4">
            {t("generalWaterCalculatorHint")}
          </p>
          <WaterCalculator />
        </Card>

        <p className="text-xs text-muted">
          {t("irrigationFooter")}
        </p>
      </div>
      </PageContainer>
    </PageWrapper>
  );
}
