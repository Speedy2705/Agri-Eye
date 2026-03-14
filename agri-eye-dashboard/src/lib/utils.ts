import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcWaterReq(
  et0: number,
  kc: number,
  area: number,
  efficiency = 0.9
): number {
  return parseFloat(((et0 * kc * area) / efficiency).toFixed(1));
}

export function getIrrigationUrgency(
  soilMoisture: number
): "critical" | "needed" | "optimal" | "excess" {
  if (soilMoisture < 30) return "critical";
  if (soilMoisture < 40) return "needed";
  if (soilMoisture <= 55) return "optimal";
  return "excess";
}