"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { hourlyPower, componentPower, powerSummary } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import PowerGauge from "@/components/dashboard/PowerGauge";
import PageWrapper from "@/components/dashboard/PageWrapper";
import PageContainer from "@/components/dashboard/PageContainer";
import { useLanguage } from "@/lib/LanguageContext";

const tooltipStyle = {
  contentStyle: {
    background: "#FFFFFF",
    border: "1px solid #C8E6C9",
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(45, 106, 79, 0.12)",
  },
  labelStyle: { color: "#1A2E1A" },
  itemStyle: { color: "#1A2E1A" },
};

export default function PowerPage() {
  const totalWatts = componentPower.reduce((sum, item) => sum + item.watts, 0);
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <PageContainer title={t("power")}>
      <div className="flex flex-col gap-5 sm:gap-6">
      {/* Live Power Gauges */}
      <Card>
        <h2 className="text-sm font-semibold text-primary mb-4">{t("livePowerStatus")}</h2>
        <PowerGauge />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-xs text-muted">{t("dailyGenerated")}</p>
            <p className="text-lg font-bold text-accent font-sora">{powerSummary.dailyGenerated} kWh</p>
          </div>
          <div>
            <p className="text-xs text-muted">{t("dailyConsumed")}</p>
            <p className="text-lg font-bold text-foreground font-sora">{powerSummary.dailyConsumed} kWh</p>
          </div>
          <div>
            <p className="text-xs text-muted">{t("gridDraw")}</p>
            <p className="text-lg font-bold text-success font-sora">{powerSummary.gridDrawing} kW</p>
          </div>
        </div>
      </Card>

      {/* Hourly Power Chart */}
      <Card>
        <h2 className="text-sm font-semibold text-primary mb-3">24-Hour {t("energyOverview")}</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hourlyPower} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" opacity={0.9} />
            <XAxis dataKey="hour" tick={{ fill: "#6B8F71", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
            <YAxis tick={{ fill: "#6B8F71", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ color: "#6B8F71", fontSize: 12 }} />
            <Bar dataKey="generated" name={t("generated")} fill="#F4A01C" radius={[2, 2, 0, 0]} isAnimationActive />
            <Bar dataKey="consumed"  name={t("consumed")}  fill="#2D6A4F" radius={[2, 2, 0, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Source */}
        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">{t("powerSource")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="rounded-lg border border-accent bg-grad-accent text-white px-4 py-3 text-sm font-semibold text-center">
              ☀️ {t("solarPower")}
            </div>
            <div className="rounded-lg border border-border bg-surface text-foreground px-4 py-3 text-sm font-semibold text-center">
              🔋 {t("battery")}
            </div>
            <div className="rounded-lg border border-border bg-surface text-foreground px-4 py-3 text-sm font-semibold text-center">
              ⚡ {t("grid")}
            </div>
          </div>
        </Card>

        {/* Component Power Draw */}
        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">{t("componentPower")}</h2>
          <div className="space-y-2">
            {componentPower.map((component) => {
              const percent = (component.watts / totalWatts) * 100;
              return (
                <div key={component.name} className="space-y-1">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-2 items-center text-xs">
                    <span className="sm:col-span-5 text-foreground">{component.name}</span>
                    <span className="sm:col-span-2 text-accent font-semibold sm:text-center">
                      {component.watts.toFixed(1)}W
                    </span>
                    <div className="sm:col-span-5 bg-primary/30 rounded h-2 overflow-hidden">
                      <div className="h-full bg-accent rounded" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-3 mt-3 border-t border-primary/20 flex justify-between items-center">
              <span className="text-sm text-foreground font-medium">{t("totalSystemDraw")}</span>
              <span className="text-lg font-bold text-accent font-sora">{totalWatts.toFixed(1)}W</span>
            </div>
          </div>
        </Card>
      </div>
      </div>
      </PageContainer>
    </PageWrapper>
  );
}
