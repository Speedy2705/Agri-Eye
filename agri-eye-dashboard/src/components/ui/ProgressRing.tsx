"use client";

import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number;        // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export default function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  color = "#2D6A4F",
  className,
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const start = performance.now();
    const duration = 900;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setAnimatedValue(progress * value);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1A2E1A"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-foreground font-sora">
        {Math.round(animatedValue)}%
      </span>
    </div>
  );
}
