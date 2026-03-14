"use client";

import { useState } from "react";
import { cameraDetections, cameraZones, perimeterNodes, type CameraDetection } from "@/lib/mockData";
import { useLanguage } from "@/lib/LanguageContext";

const nodeColor: Record<string, string> = {
  alert:   "#EF4444",
  warning: "#F59E0B",
  active:  "#22C55E",
};

export default function FarmMap() {
  const [hoveredDetection, setHoveredDetection] = useState<CameraDetection | null>(null);
  const { t } = useLanguage();

  const cameraPositions: Record<string, { x: number; y: number }> = {
    "CAM-01": { x: 200, y: 34 },
    "CAM-02": { x: 210, y: 266 },
    "CAM-03": { x: 365, y: 150 },
    "CAM-04": { x: 35, y: 150 },
    "CAM-05": { x: 200, y: 80 },
    "CAM-06": { x: 360, y: 42 },
  };

  const diseaseMarkerOffset: Record<string, { x: number; y: number }> = {
    "CAM-01": { x: 12, y: -10 },
    "CAM-03": { x: 14, y: -8 },
    "CAM-05": { x: 14, y: -12 },
  };

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
        fill="#E8F5E9"
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
        {t("centralTower")}
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

      {/* Camera zone markers */}
      {cameraZones.map((camera) => {
        const position = cameraPositions[camera.id];
        if (!position) return null;

        const color = camera.alert ? "#EF4444" : "#22C55E";

        return (
          <g key={camera.id}>
            <rect
              x={position.x - 8}
              y={position.y - 6}
              width="16"
              height="12"
              rx="2"
              fill="none"
              stroke={color}
              strokeWidth="1.2"
            />
            <circle cx={position.x} cy={position.y} r="1.6" fill={color} />
            <text
              x={position.x}
              y={position.y + 16}
              textAnchor="middle"
              fill={color}
              fontSize="6.5"
              fontFamily="Sora, sans-serif"
              fontWeight="600"
            >
              {camera.id}
            </text>
          </g>
        );
      })}

      {cameraDetections
        .filter((detection) => detection.status !== "Healthy")
        .map((detection) => {
          const cameraPosition = cameraPositions[detection.cameraId];
          const offset = diseaseMarkerOffset[detection.cameraId] ?? { x: 12, y: -10 };
          const markerX = cameraPosition.x + offset.x;
          const markerY = cameraPosition.y + offset.y;
          const fill = detection.status === "Active" ? "#EF4444" : "#F59E0B";

          return (
            <g
              key={detection.cameraId}
              onMouseEnter={() => setHoveredDetection(detection)}
              onMouseLeave={() => setHoveredDetection(null)}
              style={{ cursor: "pointer" }}
            >
              <polygon
                points={`${markerX},${markerY - 5} ${markerX + 5},${markerY} ${markerX},${markerY + 5} ${markerX - 5},${markerY}`}
                fill={fill}
                stroke="#ffffff20"
                strokeWidth="1"
              />
            </g>
          );
        })}

      {hoveredDetection && (() => {
        const cameraPosition = cameraPositions[hoveredDetection.cameraId];
        const offset = diseaseMarkerOffset[hoveredDetection.cameraId] ?? { x: 12, y: -10 };
        const labelX = cameraPosition.x + offset.x + 8;
        const labelY = cameraPosition.y + offset.y - 12;
        return (
          <g>
            <rect
              x={labelX - 2}
              y={labelY - 10}
              width="86"
              height="18"
              rx="4"
              fill="#1A2E1A"
              stroke="#2D6A4F"
              strokeWidth="0.8"
            />
            <text
              x={labelX + 2}
              y={labelY + 2}
              fill="#E8F5E9"
              fontSize="6.5"
              fontFamily="Sora, sans-serif"
              fontWeight="500"
            >
              {hoveredDetection.plantId} - {hoveredDetection.disease}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
