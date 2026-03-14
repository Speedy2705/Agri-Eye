"use client";

import { perimeterNodes } from "@/lib/mockData";

const nodeColor: Record<string, string> = {
  alert:   "#EF4444",
  warning: "#F59E0B",
  active:  "#22C55E",
};

export default function FarmMap() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Farm boundary */}
      <rect
        x="20" y="20" width="360" height="260"
        rx="16" ry="16"
        fill="#1A2E1A"
        stroke="#2D6A4F"
        strokeWidth="2"
      />

      {/* Grid lines */}
      {[80, 140, 200, 260, 320].map((x) => (
        <line key={`vg-${x}`} x1={x} y1="20" x2={x} y2="280" stroke="#2D6A4F" strokeWidth="0.4" opacity="0.4" />
      ))}
      {[80, 140, 200].map((y) => (
        <line key={`hg-${y}`} x1="20" y1={y} x2="380" y2={y} stroke="#2D6A4F" strokeWidth="0.4" opacity="0.4" />
      ))}

      {/* Central Tower pulse ring (background) */}
      <circle cx="200" cy="150" r="28" fill="none" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="r" from="20" to="38" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="150" r="16" fill="none" stroke="#2D6A4F" strokeWidth="1.5" opacity="0.5">
        <animate attributeName="r" from="14" to="24" dur="2s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </circle>

      {/* Central Tower dot */}
      <circle cx="200" cy="150" r="8" fill="#F4A01C" />
      <circle cx="200" cy="150" r="4" fill="#fff" />

      {/* Central Tower label */}
      <text x="200" y="172" textAnchor="middle" fill="#F4A01C" fontSize="9" fontFamily="Sora, sans-serif" fontWeight="600">
        Central Tower
      </text>

      {/* Perimeter nodes */}
      {perimeterNodes.map((node) => {
        const cx = (node.x / 100) * 360 + 20;
        const cy = (node.y / 100) * 260 + 20;
        const color = nodeColor[node.status];

        return (
          <g key={node.id}>
            {/* Pulse ring */}
            <circle cx={cx} cy={cy} r="10" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7">
              <animate attributeName="r" from="7" to="16" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="2.5s" repeatCount="indefinite" />
            </circle>
            {/* Node dot */}
            <circle cx={cx} cy={cy} r="5" fill={color} />
            {/* Node label */}
            <text
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              fill={color}
              fontSize="7.5"
              fontFamily="Sora, sans-serif"
              fontWeight="500"
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
