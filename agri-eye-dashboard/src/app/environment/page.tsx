"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { environmentalData } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import PageWrapper from "@/components/dashboard/PageWrapper";
import PageContainer from "@/components/dashboard/PageContainer";
import { useLanguage } from "@/lib/LanguageContext";

function calcStats(arr: number[]) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const avg = Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
  return { min, max, avg };
}

const tempVals  = environmentalData.map((d) => d.temperature);
const humVals   = environmentalData.map((d) => d.humidity);
const soilVals  = environmentalData.map((d) => d.soilMoisture);

const tempStats  = calcStats(tempVals);
const humStats   = calcStats(humVals);
const soilStats  = calcStats(soilVals);

function StatPills({
  min,
  max,
  avg,
  unit,
  t,
}: {
  min: number;
  max: number;
  avg: number;
  unit: string;
  t: (key: string) => string;
}) {
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      {[
        { label: t("min"), val: min },
        { label: t("max"), val: max },
        { label: t("avg"), val: avg },
      ].map(({ label, val }) => (
        <span key={label} className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-foreground/70">
          {label}: <span className="font-semibold text-foreground">{val}{unit}</span>
        </span>
      ))}
    </div>
  );
}

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

export default function EnvironmentPage() {
  const { t } = useLanguage();

  return (
    <PageWrapper>
      <PageContainer title={t("environment")}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Temperature */}
      <Card>
        <h2 className="text-sm font-semibold text-primary mb-1">{t("temperature")} (°C)</h2>
        <StatPills {...tempStats} unit="°C" t={t} />
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" opacity={0.9} />
              <XAxis dataKey="hour" tick={{ fill: "#6B8F71", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#6B8F71", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="temperature" stroke="#F4A01C" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Humidity */}
      <Card>
        <h2 className="text-sm font-semibold text-primary mb-1">{t("humidity")} (%)</h2>
        <StatPills {...humStats} unit="%" t={t} />
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" opacity={0.9} />
              <XAxis dataKey="hour" tick={{ fill: "#6B8F71", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#6B8F71", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="humidity" stroke="#2D6A4F" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Soil Moisture */}
      <Card>
        <h2 className="text-sm font-semibold text-primary mb-1">{t("soilMoisture")} (%)</h2>
        <StatPills {...soilStats} unit="%" t={t} />
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" opacity={0.9} />
              <XAxis dataKey="hour" tick={{ fill: "#6B8F71", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#6B8F71", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22C55E" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      </div>
      </PageContainer>
    </PageWrapper>
  );
}
