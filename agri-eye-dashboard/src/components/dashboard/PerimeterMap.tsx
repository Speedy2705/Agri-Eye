"use client";

import { useState } from "react";
import { perimeterNodes, type PerimeterNode } from "@/lib/mockData";

const nodeColor: Record<string, string> = {
  alert:   "#EF4444",
  warning: "#F59E0B",
  active:  "#22C55E",
};

interface HoveredNode extends PerimeterNode {
  svgCx: number;
  svgCy: number;
}

export default function PerimeterMap() {
  const [hovered, setHovered] = useState<HoveredNode | null>(null);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Farm boundary */}
        <rect
          x="20" y="20" width="360" height="260"
          rx="16" ry="16"
          fill="#152415"
          stroke="#2D6A4F"
          strokeWidth="1.5"
        />

        {[80, 140, 200, 260, 320].map((x) => (
          <line key={`v-${x}`} x1={x} y1="20" x2={x} y2="280" stroke="#2D6A4F" strokeWidth="0.3" opacity="0.3" />
        ))}
        {[80, 140, 200].map((y) => (
          <line key={`h-${y}`} x1="20" y1={y} x2="380" y2={y} stroke="#2D6A4F" strokeWidth="0.3" opacity="0.3" />
        ))}

        <circle cx="200" cy="150" r="8" fill="#F4A01C" />
        <circle cx="200" cy="150" r="4" fill="#fff" />

        {perimeterNodes.map((node) => {
          const cx = (node.x / 100) * 360 + 20;
          const cy = (node.y / 100) * 260 + 20;
          const color = nodeColor[node.status];
          const isAlert   = node.status === "alert";
          const isWarning = node.status === "warning";

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered({ ...node, svgCx: cx, svgCy: cy })}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {(isAlert || isWarning) && (
                <circle cx={cx} cy={cy} r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7">
                  <animate attributeName="r" from="7" to="18" dur={isAlert ? "1.5s" : "2s"} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.7" to="0" dur={isAlert ? "1.5s" : "2s"} repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={cx} cy={cy} r="6" fill={color} />
              <text x={cx} y={cy - 11} textAnchor="middle" fill={color} fontSize="7.5" fontFamily="Sora, sans-serif" fontWeight="500">
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="absolute pointer-events-none z-10 bg-card border border-primary/30 rounded-lg px-3 py-1.5 text-xs text-foreground shadow-lg -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(hovered.svgCx / 400) * 100}%`,
            top:  `${(hovered.svgCy / 300) * 100}%`,
            marginTop: "-8px",
          }}
        >
          <span className="font-semibold">{hovered.id}</span>
          <span className="mx-1 text-muted">&#8212;</span>
          <span className="capitalize font-medium" style={{ color: nodeColor[hovered.status] }}>
            {hovered.status}
          </span>
        </div>
      )}
    </div>
  );
}
