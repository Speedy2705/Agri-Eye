// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertSeverity = "info" | "warning" | "danger";
export type CameraStatus = "online" | "offline" | "recording";
export type DeviceStatus = "active" | "inactive" | "fault";

// ─── Sensor / Environment ─────────────────────────────────────────────────────

export interface SensorReading {
  timestamp: string;
  temperature: number; // °C
  humidity: number;    // %
  soilMoisture: number; // %
  co2: number;         // ppm
  lightLux: number;
}

export const sensorHistory: SensorReading[] = [
  { timestamp: "00:00", temperature: 21.2, humidity: 62, soilMoisture: 45, co2: 412, lightLux: 0 },
  { timestamp: "02:00", temperature: 20.8, humidity: 64, soilMoisture: 44, co2: 408, lightLux: 0 },
  { timestamp: "04:00", temperature: 20.1, humidity: 67, soilMoisture: 43, co2: 405, lightLux: 15 },
  { timestamp: "06:00", temperature: 20.5, humidity: 65, soilMoisture: 42, co2: 410, lightLux: 120 },
  { timestamp: "08:00", temperature: 22.3, humidity: 60, soilMoisture: 41, co2: 420, lightLux: 4800 },
  { timestamp: "10:00", temperature: 25.7, humidity: 54, soilMoisture: 39, co2: 435, lightLux: 18000 },
  { timestamp: "12:00", temperature: 28.4, humidity: 48, soilMoisture: 36, co2: 445, lightLux: 32000 },
  { timestamp: "14:00", temperature: 29.1, humidity: 46, soilMoisture: 34, co2: 450, lightLux: 28000 },
  { timestamp: "16:00", temperature: 27.3, humidity: 50, soilMoisture: 35, co2: 440, lightLux: 15000 },
  { timestamp: "18:00", temperature: 24.6, humidity: 55, soilMoisture: 37, co2: 430, lightLux: 3200 },
  { timestamp: "20:00", temperature: 22.9, humidity: 59, soilMoisture: 40, co2: 418, lightLux: 0 },
  { timestamp: "22:00", temperature: 21.7, humidity: 61, soilMoisture: 43, co2: 413, lightLux: 0 },
];

export const currentSensor: SensorReading = {
  timestamp: "14:32",
  temperature: 27.8,
  humidity: 49,
  soilMoisture: 35,
  co2: 443,
  lightLux: 22400,
};

export interface ZoneSensorStatus {
  zone: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  status: DeviceStatus;
}

export const zoneSensors: ZoneSensorStatus[] = [
  { zone: "Zone A – Wheat",  temperature: 27.8, humidity: 49, soilMoisture: 35, status: "active" },
  { zone: "Zone B – Corn",   temperature: 28.3, humidity: 51, soilMoisture: 38, status: "active" },
  { zone: "Zone C – Orchard",temperature: 26.5, humidity: 55, soilMoisture: 42, status: "active" },
  { zone: "Zone D – Nursery",temperature: 24.1, humidity: 70, soilMoisture: 60, status: "active" },
  { zone: "Zone E – Storage",temperature: 18.0, humidity: 40, soilMoisture: 0,  status: "inactive" },
  { zone: "Zone F – Greenhouse", temperature: 30.2, humidity: 80, soilMoisture: 55, status: "fault" },
];

// ─── Security / Cameras ───────────────────────────────────────────────────────

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: CameraStatus;
  lastMotion: string;
  thumbnailColor: string; // placeholder colour for the video tile
}

export const cameras: Camera[] = [
  { id: "cam-01", name: "North Gate",     location: "Perimeter North", status: "recording", lastMotion: "2 min ago",  thumbnailColor: "#1A3A2A" },
  { id: "cam-02", name: "South Gate",     location: "Perimeter South", status: "recording", lastMotion: "14 min ago", thumbnailColor: "#1A2E1A" },
  { id: "cam-03", name: "Barn Interior",  location: "Barn Alpha",      status: "online",    lastMotion: "1 hr ago",   thumbnailColor: "#152415" },
  { id: "cam-04", name: "Greenhouse A",   location: "Zone D",          status: "recording", lastMotion: "5 min ago",  thumbnailColor: "#1B3520" },
  { id: "cam-05", name: "Storage Unit",   location: "Zone E",          status: "offline",   lastMotion: "3 hrs ago",  thumbnailColor: "#111C11" },
  { id: "cam-06", name: "Water Pump",     location: "Irrigation Hub",  status: "online",    lastMotion: "32 min ago", thumbnailColor: "#162816" },
];

export interface MotionEvent {
  id: string;
  cameraId: string;
  cameraName: string;
  time: string;
  severity: AlertSeverity;
  description: string;
}

export const motionEvents: MotionEvent[] = [
  { id: "me-1", cameraId: "cam-01", cameraName: "North Gate",    time: "14:30", severity: "danger",  description: "Unidentified person detected near gate" },
  { id: "me-2", cameraId: "cam-04", cameraName: "Greenhouse A",  time: "13:58", severity: "warning", description: "Unusual movement in restricted zone" },
  { id: "me-3", cameraId: "cam-02", cameraName: "South Gate",    time: "12:20", severity: "info",    description: "Vehicle entered farm premises" },
  { id: "me-4", cameraId: "cam-03", cameraName: "Barn Interior", time: "10:45", severity: "info",    description: "Staff member logged entry" },
  { id: "me-5", cameraId: "cam-01", cameraName: "North Gate",    time: "08:07", severity: "warning", description: "Motion detected during restricted hours" },
];

// ─── Power / Energy ───────────────────────────────────────────────────────────

export interface PowerReading {
  timestamp: string;
  solar: number;   // kW
  grid: number;    // kW
  consumed: number; // kW
}

export const powerHistory: PowerReading[] = [
  { timestamp: "00:00", solar: 0,    grid: 1.2, consumed: 1.2 },
  { timestamp: "02:00", solar: 0,    grid: 0.9, consumed: 0.9 },
  { timestamp: "04:00", solar: 0,    grid: 1.0, consumed: 1.0 },
  { timestamp: "06:00", solar: 0.8,  grid: 0.6, consumed: 1.4 },
  { timestamp: "08:00", solar: 2.4,  grid: 0.2, consumed: 2.6 },
  { timestamp: "10:00", solar: 4.1,  grid: 0.0, consumed: 4.1 },
  { timestamp: "12:00", solar: 5.6,  grid: 0.0, consumed: 5.6 },
  { timestamp: "14:00", solar: 5.1,  grid: 0.0, consumed: 5.1 },
  { timestamp: "16:00", solar: 3.8,  grid: 0.0, consumed: 3.8 },
  { timestamp: "18:00", solar: 1.2,  grid: 0.8, consumed: 2.0 },
  { timestamp: "20:00", solar: 0,    grid: 1.5, consumed: 1.5 },
  { timestamp: "22:00", solar: 0,    grid: 1.3, consumed: 1.3 },
];

export interface PowerDevice {
  id: string;
  name: string;
  zone: string;
  consumption: number; // kW
  status: DeviceStatus;
}

export const powerDevices: PowerDevice[] = [
  { id: "pd-1", name: "Irrigation Pump A",  zone: "Zone A", consumption: 1.8, status: "active" },
  { id: "pd-2", name: "Irrigation Pump B",  zone: "Zone B", consumption: 1.6, status: "active" },
  { id: "pd-3", name: "Greenhouse HVAC",    zone: "Zone F", consumption: 2.1, status: "fault"  },
  { id: "pd-4", name: "Cold Storage Unit",  zone: "Zone E", consumption: 0.9, status: "active" },
  { id: "pd-5", name: "Security Lighting",  zone: "Perimeter", consumption: 0.4, status: "active" },
  { id: "pd-6", name: "Sensor Network Hub", zone: "All Zones",  consumption: 0.2, status: "active" },
];

export const powerSummary = {
  solarGenerating: 5.1,   // kW current
  gridDrawing: 0.0,
  totalConsuming: 5.1,
  batteryPercent: 74,
  dailyGenerated: 38.6,   // kWh today
  dailyConsumed: 34.2,    // kWh today
};

// ─── Monitoring / Crop Health ─────────────────────────────────────────────────

export interface CropZone {
  id: string;
  name: string;
  crop: string;
  healthScore: number;  // 0–100
  ndvi: number;         // 0–1
  irrigationDue: boolean;
  lastirrigated: string;
  area: number;         // acres
  status: DeviceStatus;
}

export const cropZones: CropZone[] = [
  { id: "z-a", name: "Zone A", crop: "Wheat",      healthScore: 88, ndvi: 0.82, irrigationDue: false, lastirrigated: "Today 06:00",    area: 12.5, status: "active" },
  { id: "z-b", name: "Zone B", crop: "Corn",       healthScore: 74, ndvi: 0.70, irrigationDue: true,  lastirrigated: "Yesterday 18:00", area: 9.0,  status: "active" },
  { id: "z-c", name: "Zone C", crop: "Orchard",    healthScore: 91, ndvi: 0.87, irrigationDue: false, lastirrigated: "Today 05:30",    area: 6.0,  status: "active" },
  { id: "z-d", name: "Zone D", crop: "Seedlings",  healthScore: 65, ndvi: 0.58, irrigationDue: true,  lastirrigated: "2 days ago",      area: 2.0,  status: "fault"  },
  { id: "z-e", name: "Zone E", crop: "Fallow",     healthScore: 40, ndvi: 0.30, irrigationDue: false, lastirrigated: "N/A",             area: 5.5,  status: "inactive"},
  { id: "z-f", name: "Zone F", crop: "Tomatoes",   healthScore: 79, ndvi: 0.74, irrigationDue: false, lastirrigated: "Today 08:00",    area: 3.0,  status: "active" },
];

export interface CropHealthHistory {
  week: string;
  ndvi: number;
  healthScore: number;
}

export const cropHealthHistory: CropHealthHistory[] = [
  { week: "W1", ndvi: 0.55, healthScore: 62 },
  { week: "W2", ndvi: 0.60, healthScore: 67 },
  { week: "W3", ndvi: 0.65, healthScore: 71 },
  { week: "W4", ndvi: 0.70, healthScore: 74 },
  { week: "W5", ndvi: 0.74, healthScore: 78 },
  { week: "W6", ndvi: 0.78, healthScore: 82 },
  { week: "W7", ndvi: 0.80, healthScore: 85 },
  { week: "W8", ndvi: 0.82, healthScore: 88 },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  time: string;
  source: string;
  acknowledged: boolean;
}

export const alerts: Alert[] = [
  { id: "al-1", title: "Intruder Alert",         description: "Unidentified person near North Gate perimeter fence.", severity: "danger",  time: "14:30", source: "Security – cam-01",   acknowledged: false },
  { id: "al-2", title: "Greenhouse Fault",        description: "HVAC system in Zone F reporting fault code E3.",      severity: "danger",  time: "13:15", source: "Power – pd-3",        acknowledged: false },
  { id: "al-3", title: "Irrigation Due – Zone B", description: "Soil moisture dropped below 35% threshold.",          severity: "warning", time: "12:45", source: "Environment – Zone B", acknowledged: false },
  { id: "al-4", title: "Irrigation Due – Zone D", description: "Soil moisture critically low at 28%.",                severity: "warning", time: "11:30", source: "Environment – Zone D", acknowledged: false },
  { id: "al-5", title: "Pest Detection",          description: "Abnormal leaf pattern detected in Zone D seedlings.", severity: "warning", time: "09:20", source: "Monitoring – Zone D", acknowledged: true  },
  { id: "al-6", title: "Solar Output Low",        description: "Solar panel output 18% below daily average.",         severity: "info",    time: "07:00", source: "Power – Solar Array",  acknowledged: true  },
  { id: "al-7", title: "Co₂ Spike",               description: "CO₂ reading at 858 ppm in Greenhouse Zone F.",        severity: "warning", time: "06:45", source: "Environment – Zone F", acknowledged: true  },
];

// ─── Dashboard Summary Stats ──────────────────────────────────────────────────

export const dashboardStats = {
  totalZones: 6,
  activeZones: 4,
  camerasOnline: 5,
  camerasTotal: 6,
  openAlerts: 4,
  avgHealthScore: 73,
  solarKw: 5.1,
  batteryPercent: 74,
};

// ─── System Stats & Module Health ────────────────────────────────────────────

export const systemStats = {
  temperature: 34.2,
  humidity: 67,
  soilMoisture: 42,
  solarPower: 87,
  battery: 73,
  activeNodes: 6,
};

export type ModuleStatus = "ok" | "fault";

export interface ModuleHealth {
  name: string;
  status: ModuleStatus;
}

export const moduleHealth: ModuleHealth[] = [
  { name: "Power",   status: "ok" },
  { name: "Camera",  status: "ok" },
  { name: "LoRa",    status: "ok" },
  { name: "Radar",   status: "ok" },
  { name: "Speaker", status: "ok" },
  { name: "ESP32",   status: "ok" },
];

export const leafHealthScore = 74;

export const canopyHealth = {
  healthy: 68,
  stressed: 21,
  diseased: 11,
};

// ─── Environmental Time Series ────────────────────────────────────────────────

export interface EnvironmentalPoint {
  hour: number;
  temperature: number; // °C — sine curve, peaks ~hour 13
  humidity: number;    // % — inverse of temperature
  soilMoisture: number; // % — drains during day
}

export const environmentalData: EnvironmentalPoint[] = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  temperature:  Math.round((32 + 4  * Math.sin(((h - 7) * Math.PI) / 12)) * 10) / 10,
  humidity:     Math.round( 65 - 10 * Math.sin(((h - 7) * Math.PI) / 12)),
  soilMoisture: Math.round( 42 -  7 * Math.sin(((h - 7) * Math.PI) / 12)),
}));

// ─── Detections, Alerts, Perimeter Nodes ─────────────────────────────────────

export type DetectionStatus = "Active" | "Monitoring" | "Resolved";

export interface Detection {
  time: string;
  disease: string;
  confidence: number;
  status: DetectionStatus;
}

export const detectionHistory: Detection[] = [
  { time: "14:12", disease: "Powdery Mildew", confidence: 83, status: "Active"     },
  { time: "11:45", disease: "Anthracnose",    confidence: 71, status: "Monitoring" },
  { time: "09:30", disease: "Healthy",        confidence: 96, status: "Resolved"   },
  { time: "07:15", disease: "Healthy",        confidence: 94, status: "Resolved"   },
  { time: "05:00", disease: "Healthy",        confidence: 91, status: "Resolved"   },
];

export interface AlertFeedEntry {
  id: string;
  time: string;
  level: "danger" | "warning" | "clear";
  message: string;
}

export const alertFeed: AlertFeedEntry[] = [
  { id: "af-1", time: "14:30", level: "danger",  message: "Intruder detected at North Gate perimeter" },
  { id: "af-2", time: "13:15", level: "danger",  message: "HVAC fault in Greenhouse Zone F" },
  { id: "af-3", time: "12:45", level: "warning", message: "Soil moisture below threshold in Zone B" },
  { id: "af-4", time: "10:20", level: "warning", message: "Bird activity detected near Zone C orchard" },
  { id: "af-5", time: "08:05", level: "clear",   message: "All systems nominal – morning check passed" },
];

export const alertStats = {
  total: 4,
  animalIntrusion: 1,
  birdActivity: 2,
  falsePositive: 1,
};

export type NodeStatus = "alert" | "warning" | "active";

export interface PerimeterNode {
  id: string;
  x: number;
  y: number;
  status: NodeStatus;
}

export const perimeterNodes: PerimeterNode[] = [
  { id: "Node 1", x: 15, y: 15, status: "active"  },
  { id: "Node 2", x: 85, y: 12, status: "active"  },
  { id: "Node 3", x: 90, y: 55, status: "alert"   },
  { id: "Node 4", x: 80, y: 85, status: "active"  },
  { id: "Node 5", x: 25, y: 88, status: "warning" },
  { id: "Node 6", x: 10, y: 50, status: "active"  },
];

// ─── Power Data ───────────────────────────────────────────────────────────────

export interface HourlyPower {
  hour: number;
  generated: number; // W — solar bell curve, peaks ~90 W at noon
  consumed: number;  // W — 12–17 W baseline
}

export const hourlyPower: HourlyPower[] = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  generated: Math.round(Math.max(0, 90 * Math.sin(((h - 6) * Math.PI) / 12)) * 10) / 10,
  consumed:  Math.round((14.5 + 2.5 * Math.sin(((h - 8) * Math.PI) / 12)) * 10) / 10,
}));

export interface ComponentPower {
  name: string;
  watts: number;
}

export const componentPower: ComponentPower[] = [
  { name: "ESP32-S3", watts: 0.5 },
  { name: "Camera",   watts: 3.2 },
  { name: "LoRa",     watts: 0.4 },
  { name: "Radar ×6", watts: 4.8 },
  { name: "Speaker",  watts: 2.0 },
  { name: "Misc",     watts: 1.1 },
];

