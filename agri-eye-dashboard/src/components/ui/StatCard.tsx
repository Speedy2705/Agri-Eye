"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "./Card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit?: string;
  className?: string;
}

export default function StatCard({ icon: Icon, label, value, unit, className }: StatCardProps) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number>(0);
  const frostedStyle: CSSProperties = {
    background: "rgba(240, 253, 244, 0.75)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const hasDecimals = !Number.isInteger(value);

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easing = 1 - Math.pow(1 - progress, 3);
      const current = value * easing;
      setDisplay(hasDecimals ? current.toFixed(1) : String(Math.round(current)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <Card
      className={cn("flex flex-col gap-2 animate-countup stat-glow", className)}
      style={frostedStyle}
    >
      <div className="flex items-center gap-2 text-muted">
        <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
          <Icon size={18} />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-foreground font-sora">{display}</span>
        {unit && <span className="text-sm text-muted mb-1">{unit}</span>}
      </div>
    </Card>
  );
}
