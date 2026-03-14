"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { environmentalData } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import WaterCalculator from "@/components/dashboard/WaterCalculator";
import PageWrapper from "@/components/dashboard/PageWrapper";

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

function StatPills({ min, max, avg, unit }: { min: number; max: number; avg: number; unit: string }) {
  return (
    <div className="flex gap-3 flex-wrap mt-2">
      {[{ label: "Min", val: min }, { label: "Max", val: max }, { label: "Avg", val: avg }].map(({ label, val }) => (
        <span key={label} className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-foreground/70">
          {label}: <span className="font-semibold text-foreground">{val}{unit}</span>
        </span>
      ))}
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { background: "#1A2E1A", border: "1px solid #2D6A4F", borderRadius: 8 },
  labelStyle: { color: "#E8F5E9" },
  itemStyle: { color: "#E8F5E9" },
};

export default function EnvironmentPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground font-sora">Environment</h1>

      {/* Temperature */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-1">Temperature (°C)</h2>
        <StatPills {...tempStats} unit="°C" />
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D6A4F" opacity={0.2} />
              <XAxis dataKey="hour" tick={{ fill: "#4B6B50", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#4B6B50", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="temperature" stroke="#F4A01C" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Humidity */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-1">Humidity (%)</h2>
        <StatPills {...humStats} unit="%" />
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D6A4F" opacity={0.2} />
              <XAxis dataKey="hour" tick={{ fill: "#4B6B50", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#4B6B50", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="humidity" stroke="#2D6A4F" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Soil Moisture */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-1">Soil Moisture (%)</h2>
        <StatPills {...soilStats} unit="%" />
        <div className="mt-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D6A4F" opacity={0.2} />
              <XAxis dataKey="hour" tick={{ fill: "#4B6B50", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#4B6B50", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="soilMoisture" stroke="#22C55E" strokeWidth={2} dot={false} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Water Calculator */}
      <Card className="border-accent/30">
        <h2 className="text-sm font-semibold text-foreground/80 mb-1">💧 Water Requirement Calculator</h2>
        <p className="text-xs text-muted mb-4">
          Calculate daily irrigation needs based on current crop stage and environmental conditions.
        </p>
        <WaterCalculator />
      </Card>
      </div>
    </PageWrapper>
  );
}
