"use client";

import { useState } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, unit, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground/80">{label}</span>
        <span className="text-sm font-semibold text-accent font-mono">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-primary/20"
      />
      <div className="flex justify-between text-[10px] text-muted">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function WaterCalculator() {
  const [et0,        setEt0       ] = useState(8);
  const [kc,         setKc        ] = useState(0.75);
  const [area,       setArea      ] = useState(78);
  const [efficiency, setEfficiency] = useState(0.9);

  const result = (et0 * kc * area) / efficiency;

  return (
    <div className="flex flex-col gap-5">
      <Slider label="ET₀ (Reference Evapotranspiration)" value={et0}        min={2}   max={15}  step={0.1} unit=" mm/day" onChange={setEt0} />
      <Slider label="Kc (Crop Coefficient)"               value={kc}         min={0.2} max={1.5} step={0.01} unit=""      onChange={setKc}  />
      <Slider label="Area"                                 value={area}       min={10}  max={200} step={1}   unit=" m²"   onChange={setArea} />
      <Slider label="Irrigation Efficiency"                value={efficiency} min={0.5} max={1.0} step={0.01} unit=""     onChange={setEfficiency} />

      {/* Result */}
      <div className="mt-2 rounded-xl bg-primary/10 border border-primary/20 px-5 py-4 text-center">
        <p className="text-4xl font-bold text-accent font-sora tracking-tight">
          {result.toFixed(1)}{" "}
          <span className="text-xl font-medium text-foreground/70">L/day</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          Fruit Development stage — peak water demand.
        </p>
      </div>
    </div>
  );
}
