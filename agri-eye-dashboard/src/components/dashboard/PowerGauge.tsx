"use client";

import { useEffect, useState } from "react";
import { powerSummary } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";

const SOLAR_MAX  = 100;   // W
const SOLAR_VAL  = 87;
const BATT_VAL   = powerSummary.batteryPercent; // 74

// Semi-circle arc helpers
const R          = 70;
const CX         = 100;
const CY         = 100;
const CIRCUMF    = Math.PI * R; // half circumference for a semicircle

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function semiArcPath(cx: number, cy: number, r: number) {
  const start = polarToCartesian(cx, cy, r, 0);
  const end   = polarToCartesian(cx, cy, r, 180);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

export default function PowerGauge() {
  const [solarAnim, setSolarAnim] = useState(0);
  const [battAnim,  setBattAnim ] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const start = performance.now();
    const dur   = 1000;
    const tick  = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setSolarAnim(p * SOLAR_VAL);
      setBattAnim(p * BATT_VAL);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const trackPath      = semiArcPath(CX, CY, R);
  const progressOffset = CIRCUMF - (solarAnim / SOLAR_MAX) * CIRCUMF;

  const battColor = battAnim > 50
    ? "linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)"
    : battAnim > 25
      ? "linear-gradient(135deg, #D97706 0%, #FBBF24 100%)"
      : "linear-gradient(135deg, #DC2626 0%, #F87171 100%)";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 w-full">
      {/* Solar Arc Gauge */}
      <div className="flex flex-col items-center gap-1">
        <svg width="200" height="115" viewBox="0 0 200 115">
          <defs>
            <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F4A01C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="#E8F5E9"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d={trackPath}
            fill="none"
            stroke="url(#solarGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMF}
            strokeDashoffset={progressOffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
          {/* Labels */}
          <text x="100" y="92" textAnchor="middle" fill="#1A2E1A" fontSize="20" fontWeight="700" fontFamily="Sora,sans-serif">
            {Math.round(solarAnim)}W
          </text>
          <text x="100" y="108" textAnchor="middle" fill="#6B8F71" fontSize="10" fontFamily="Sora,sans-serif">
            / {SOLAR_MAX}W
          </text>
        </svg>
        <span className="text-xs text-muted">{t("solarOutput")}</span>
      </div>

      {/* Battery Bar */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-12 h-28 rounded-lg border-2 border-primary/40 bg-card overflow-hidden flex flex-col-reverse">
          <div
            className="w-full rounded-b-md transition-none"
            style={{
              height: `${battAnim}%`,
              background: battColor,
              transition: "height 0.05s linear",
            }}
          />
        </div>
        {/* Battery top nub */}
        <span className="text-sm font-bold text-foreground font-sora">
          {Math.round(battAnim)}%
        </span>
        <span className="text-xs text-muted">{t("battery")}</span>
      </div>
    </div>
  );
}
