"use client";

import { detectionHistory, canopyHealth, leafHealthScore } from "@/lib/mockData";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressRing from "@/components/ui/ProgressRing";
import CameraFeed from "@/components/dashboard/CameraFeed";
import PageWrapper from "@/components/dashboard/PageWrapper";

function statusVariant(s: string): "danger" | "warning" | "success" {
  if (s === "Active")     return "danger";
  if (s === "Monitoring") return "warning";
  return "success";
}

export default function MonitoringPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 sm:gap-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground font-sora">Crop Monitoring</h1>

      {/* Live Camera Feed */}
      <Card>
        <h2 className="text-sm font-semibold text-foreground/80 mb-3">Live Surveillance Feed</h2>
        <CameraFeed />
      </Card>

      {/* Detection grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest detection */}
        <Card>
          <h2 className="text-sm font-semibold text-foreground/80 mb-3">Latest Detection</h2>
          <p className="text-2xl font-bold text-warning font-sora">Powdery Mildew</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted">Confidence:</span>
            <Badge variant="warning">83%</Badge>
          </div>
          <p className="mt-3 text-xs text-muted">Last scan: 2 minutes ago</p>
        </Card>

        {/* Detection History */}
        <Card>
          <h2 className="text-sm font-semibold text-foreground/80 mb-3">Detection History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-xs text-muted border-b border-primary/20">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Disease</th>
                  <th className="pb-2 pr-4 font-medium">Confidence</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {detectionHistory.map((d, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-3 sm:pr-4 font-mono text-[11px] sm:text-xs text-muted">{d.time}</td>
                    <td className="py-2 pr-3 sm:pr-4 text-foreground">{d.disease}</td>
                    <td className="py-2 pr-3 sm:pr-4 text-foreground">{d.confidence}%</td>
                    <td className="py-2">
                      <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Health analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leaf Health Score */}
        <Card className="flex flex-col items-center justify-center py-6">
          <h2 className="text-sm font-semibold text-foreground/80 mb-4">Leaf Health Score</h2>
          <ProgressRing value={leafHealthScore} size={160} strokeWidth={12} color="#F4A01C" />
        </Card>

        {/* Canopy Coverage */}
        <Card>
          <h2 className="text-sm font-semibold text-foreground/80 mb-4">Canopy Coverage Breakdown</h2>
          <div className="flex rounded-full overflow-hidden h-4 w-full">
            <div className="bg-success transition-all" style={{ width: `${canopyHealth.healthy}%` }} />
            <div className="bg-warning transition-all" style={{ width: `${canopyHealth.stressed}%` }} />
            <div className="bg-danger  transition-all" style={{ width: `${canopyHealth.diseased}%` }} />
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success" />
              {canopyHealth.healthy}% Healthy
            </span>
            <span className="flex items-center gap-1.5 text-xs text-warning">
              <span className="w-2 h-2 rounded-full bg-warning" />
              {canopyHealth.stressed}% Stressed
            </span>
            <span className="flex items-center gap-1.5 text-xs text-danger">
              <span className="w-2 h-2 rounded-full bg-danger" />
              {canopyHealth.diseased}% Diseased
            </span>
          </div>
        </Card>
      </div>
      </div>
    </PageWrapper>
  );
}
