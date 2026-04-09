"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  BatteryMedium,
  Radio,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  XCircle,
} from "lucide-react";
import {
  cameraZones,
  moduleHealth,
  plantZones,
  systemStats,
  sensorHistory,
} from "@/lib/mockData";
import { getIrrigationUrgency } from "@/lib/utils";
import TiltCard from "@/components/ui/TiltCard";
import Odometer from "@/components/ui/Odometer";
import FarmMap from "@/components/dashboard/FarmMap";
import PageContainer from "@/components/dashboard/PageContainer";
import { useLanguage } from "@/lib/LanguageContext";

// ─── Sparkline data helper ─────────────────────────────────────────────────────
function generateSparkPath(values: number[], w = 80, h = 28): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const tempHistory  = sensorHistory.map((s) => s.temperature);
const humHistory   = sensorHistory.map((s) => s.humidity);
const soilHistory  = sensorHistory.map((s) => s.soilMoisture);

const statItems = [
  { key: "temperature",  labelKey: "temperature",  unit: "°C",  icon: Thermometer,   color: "#F4A01C", spark: tempHistory  },
  { key: "humidity",     labelKey: "humidity",      unit: "%",   icon: Droplets,      color: "#52B788", spark: humHistory   },
  { key: "soilMoisture", labelKey: "soilMoisture",  unit: "%",   icon: Sprout,        color: "#2D6A4F", spark: soilHistory  },
  { key: "solarPower",   labelKey: "solarPower",    unit: "W",   icon: Sun,           color: "#F97316", spark: tempHistory  },
  { key: "battery",      labelKey: "battery",       unit: "%",   icon: BatteryMedium, color: "#16A34A", spark: soilHistory  },
  { key: "activeNodes",  labelKey: "activeNodes",   unit: "",    icon: Radio,         color: "#6366F1", spark: humHistory   },
] as const;

// ─── Hero words animation ──────────────────────────────────────────────────────
const heroWords = ["Your", "Farm.", "Always", "Watching."];

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={`w-full py-6 ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const path = generateSparkPath(data);
  return (
    <svg width="80" height="28" viewBox="0 0 80 28" fill="none" className="opacity-60">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll();

  // Parallax on hero bg gradient
  const heroBgY = useTransform(scrollYProgress, [0, 0.25], ["0%", "30%"]);

  // Farm map section scale on enter
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { amount: 0.3 });

  const alertCameras = cameraZones.filter((c) => c.alert);
  const irrigatingZones = plantZones.filter((z) => z.tapOpen).length;
  const criticalZones = plantZones.filter(
    (z) => getIrrigationUrgency(z.soilMoisture) === "critical"
  ).length;

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollHint(window.scrollY < 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <PageContainer>
      <div className="flex flex-col gap-6">

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — Hero (min-h-screen)
        ══════════════════════════════════════════════════════════════════════ */}
        <Section id="hero" className="min-h-[40vh]">
          {/* Parallax bg blob */}
          <motion.div
            style={{ y: heroBgY }}
            className="absolute inset-0 pointer-events-none -z-10"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(82,183,136,0.22) 0%, rgba(244,160,28,0.10) 50%, transparent 80%)",
              }}
            />
          </motion.div>

          <div className="relative overflow-hidden rounded-3xl bg-grad-hero px-6 py-6 sm:px-8 sm:py-7 shadow-2xl">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-accent/20 blur-2xl pointer-events-none" />

            {/* Word-by-word stagger */}
            <h1 className="relative font-sora font-black text-white leading-tight text-3xl sm:text-4xl md:text-5xl mb-4 flex flex-wrap gap-x-3 gap-y-1">
              {heroWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 + 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="relative text-sm text-white/85 mb-4 max-w-md"
            >
              {t("heroSubtitle")}
            </motion.p>

            {/* Floating key-stat pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: t("temperature"), value: systemStats.temperature, unit: "°C", delay: 0.75 },
                { label: t("humidity"),    value: systemStats.humidity,    unit: "%",  delay: 0.85 },
                { label: t("battery"),     value: systemStats.battery,     unit: "%",  delay: 0.95 },
              ].map(({ label, value, unit, delay }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white"
                >
                  <span className="text-xs font-medium opacity-80">{label}</span>
                  <span className="text-sm font-bold">{value}{unit}</span>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showScrollHint && (
                <motion.button
                  type="button"
                  aria-label="Scroll to stats"
                  onClick={() =>
                    document
                      .querySelector("#stats-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, 8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-1/2 bottom-4 -translate-x-1/2 rounded-full p-1.5 bg-white/20 border border-white/30 text-white"
                >
                  <ChevronDown size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — Live Stats bento grid
        ══════════════════════════════════════════════════════════════════════ */}
        <Section id="stats-section">
          <h2 className="text-lg font-bold text-primary font-sora mb-4 px-1">
            📊 {t("systemHealth")}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {statItems.map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-border/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {statItems.map(({ key, labelKey, unit, icon: Icon, color, spark }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 22 }}
                  className={index < 2 ? "col-span-1 lg:col-span-1" : ""}
                >
                  <TiltCard
                    className="group card-light border-t-2 p-4 rounded-2xl flex flex-col gap-2 h-full"
                    style={{ borderTopColor: color }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted">
                        <span
                          className="inline-flex items-center justify-center rounded-xl p-2"
                          style={{ background: `${color}18`, color }}
                        >
                          <Icon size={16} />
                        </span>
                        <span className="text-xs font-medium">{t(labelKey)}</span>
                      </div>
                      <Sparkline data={spark as number[]} color={color} />
                    </div>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="text-2xl font-bold font-sora text-foreground">
                        <Odometer value={systemStats[key] as number} />
                      </span>
                      {unit && <span className="text-xs text-muted mb-0.5">{unit}</span>}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          )}
        </Section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — Farm Map with viewport zoom
        ══════════════════════════════════════════════════════════════════════ */}
        <Section id="map">
          <h2 className="text-lg font-bold text-primary font-sora mb-4 px-1">
            🗺️ {t("farmLayoutLive")}
          </h2>

          <motion.div
            ref={mapRef}
            animate={{ scale: mapInView ? 1.02 : 0.92, opacity: mapInView ? 1 : 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="card-light rounded-3xl p-4 overflow-hidden"
          >
            <div className="w-full aspect-[4/3] md:aspect-[16/7]">
              <FarmMap />
            </div>
          </motion.div>

          {/* Alert count chips — spring physics */}
          <div className="flex flex-wrap gap-2 mt-4">
            <AnimatePresence>
              {alertCameras.length > 0 ? (
                alertCameras.map((cam, i) => (
                  <motion.button
                    key={cam.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 320, damping: 24 }}
                    onClick={() => router.push("/cameras")}
                    className="btn-danger px-3 py-1 text-xs flex items-center gap-1.5"
                  >
                    <AlertTriangle size={11} /> {cam.id} — {cam.zone}
                  </motion.button>
                ))
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} className="text-success" />
                  {t("noActionRequired")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — System Health arc + irrigation summary
        ══════════════════════════════════════════════════════════════════════ */}
        <Section id="health">
          <h2 className="text-lg font-bold text-primary font-sora mb-3 px-1">
            ⚙️ {t("systemHealth")}
          </h2>

          <div className="card-light p-4 flex flex-wrap gap-3 justify-center items-center">
            {moduleHealth.map((mod) => (
              <span
                key={mod.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium"
              >
                <span className={mod.status === "ok" ? "w-2 h-2 rounded-full bg-success inline-block" : "w-2 h-2 rounded-full bg-danger inline-block"} />
                {mod.name}
                {mod.status !== "ok" && <XCircle size={12} className="text-danger" />}
              </span>
            ))}
          </div>

          {/* Camera alert + irrigation cards — slide from sides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="card-light p-5" style={{ borderTop: "2px solid rgba(220,38,38,0.3)" }}>
                <h3 className="text-sm font-semibold text-primary mb-3">
                  📷 {t("cameraAlerts")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {alertCameras.length > 0 ? (
                    alertCameras.map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => router.push("/cameras")}
                        className="btn-danger px-3 py-1 text-xs"
                      >
                        {cam.id} — {t("warning")}
                      </button>
                    ))
                  ) : (
                    <p className="text-muted text-sm">{t("noActionRequired")}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="card-light p-5" style={{ borderTop: "2px solid rgba(45,106,79,0.3)" }}>
                <h3 className="text-sm font-semibold text-primary mb-3">
                  💧 {t("irrigationStatus")}
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p className="rounded-xl bg-accent/10 border border-accent/30 px-3 py-2 text-accent text-xs">
                    {t("zonesIrrigating")}: <span className="font-bold">{irrigatingZones}</span> / {plantZones.length}
                  </p>
                  <p className="rounded-xl bg-danger/10 border border-danger/30 px-3 py-2 text-danger text-xs">
                    {t("zonesCritical")}: <span className="font-bold">{criticalZones}</span>
                  </p>
                </div>
                <Link
                  href="/irrigation"
                  className="mt-3 inline-block text-xs font-semibold text-primary hover:text-accent transition-colors"
                >
                  {t("manageIrrigation")} →
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>

      </div>
      </PageContainer>
    </>
  );
}

