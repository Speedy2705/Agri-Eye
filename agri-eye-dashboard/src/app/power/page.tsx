"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { hourlyPower, componentPower, powerSummary } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import PowerGauge from "@/components/dashboard/PowerGauge";
import PageWrapper from "@/components/dashboard/PageWrapper";

const tooltipStyle = {
  contentStyle: { background: "#1A2E1A", border: "1px solid #2D6A4F", borderRadius: 8 },
  labelStyle: { color: "#E8F5E9" },
  itemStyle: { color: "#E8F5E9" },
};

export default function PowerPage() {
  const totalWatts = componentPower.reduce((sum, item) => sum + item.watts, 0);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground font-sora">Power</h1>

      {/* Live Power Gauges */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-4">Live Power Status</h2>
        <PowerGauge />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-xs text-muted">Daily Generated</p>
            <p className="text-lg font-bold text-accent font-sora">{powerSummary.dailyGenerated} kWh</p>
          </div>
          <div>
            <p className="text-xs text-muted">Daily Consumed</p>
            <p className="text-lg font-bold text-foreground font-sora">{powerSummary.dailyConsumed} kWh</p>
          </div>
          <div>
            <p className="text-xs text-muted">Grid Draw</p>
            <p className="text-lg font-bold text-success font-sora">{powerSummary.gridDrawing} kW</p>
          </div>
        </div>
      </Card>

      {/* Power Source */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-3">Power Source</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-accent bg-accent/10 text-accent px-4 py-3 text-sm font-semibold text-center">
            ☀️ Solar
          </div>
          <div className="rounded-lg border border-primary/20 bg-card text-muted px-4 py-3 text-sm font-semibold text-center">
            🔋 Battery
          </div>
          <div className="rounded-lg border border-primary/20 bg-card text-muted px-4 py-3 text-sm font-semibold text-center">
            ⚡ Grid
          </div>
        </div>
      </Card>

      {/* Hourly Power Chart */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-3">24-Hour Energy Overview</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hourlyPower} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D6A4F" opacity={0.2} />
            <XAxis dataKey="hour" tick={{ fill: "#4B6B50", fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
            <YAxis tick={{ fill: "#4B6B50", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ color: "#4B6B50", fontSize: 12 }} />
            <Bar dataKey="generated" name="Generated" fill="#F4A01C" radius={[2, 2, 0, 0]} isAnimationActive />
            <Bar dataKey="consumed"  name="Consumed"  fill="#2D6A4F" radius={[2, 2, 0, 0]} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Component Power Draw */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-3">Component Power Draw</h2>
        <div className="space-y-2">
          {componentPower.map((component) => {
            const percent = (component.watts / totalWatts) * 100;
            return (
              <div key={component.name} className="space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-2 items-center text-xs">
                  <span className="sm:col-span-5 text-foreground/80">{component.name}</span>
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
            <span className="text-sm text-foreground/80 font-medium">Total System Draw</span>
            <span className="text-lg font-bold text-accent font-sora">{totalWatts.toFixed(1)}W</span>
          </div>
        </div>
      </Card>
      </div>
    </PageWrapper>
  );
}
