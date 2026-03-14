"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  BatteryMedium,
  Radio,
} from "lucide-react";
import { cameraZones, moduleHealth, plantZones, systemStats } from "@/lib/mockData";
import { getIrrigationUrgency } from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import FarmMap from "@/components/dashboard/FarmMap";
import PageWrapper from "@/components/dashboard/PageWrapper";
import { useLanguage } from "@/lib/LanguageContext";

const statItems = [
  { key: "temperature", labelKey: "temperature", unit: "°C", icon: Thermometer },
  { key: "humidity", labelKey: "humidity", unit: "%", icon: Droplets },
  { key: "soilMoisture", labelKey: "soilMoisture", unit: "%", icon: Sprout },
  { key: "solarPower", labelKey: "solarPower", unit: "W", icon: Sun },
  { key: "battery", labelKey: "battery", unit: "%", icon: BatteryMedium },
  { key: "activeNodes", labelKey: "activeNodes", unit: "", icon: Radio },
] as const;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  const alertCameras = cameraZones.filter((camera) => camera.alert);
  const irrigatingZones = plantZones.filter((zone) => zone.tapOpen).length;
  const criticalZones = plantZones.filter(
    (zone) => getIrrigationUrgency(zone.soilMoisture) === "critical"
  ).length;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-grad-hero px-5 py-5 sm:px-6 sm:py-6 shadow-lg"
        >
          <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-28 w-28 rounded-full bg-accent/20 blur-2xl" />

          <h1 className="relative text-xl sm:text-2xl md:text-3xl font-bold text-white font-sora leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="relative mt-1 text-xs sm:text-sm text-white/90">
            {t("heroSubtitle")}
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? statItems.map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : statItems.map(({ key, labelKey, unit, icon }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <StatCard
                    icon={icon}
                    label={t(labelKey)}
                    value={systemStats[key] as number}
                    unit={unit}
                  />
                </motion.div>
              ))}
        </div>

        {/* Farm Map */}
        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">
            {t("farmLayoutLive")}
          </h2>
          <div className="w-full aspect-[4/3] md:aspect-[16/7]">
            <FarmMap />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">{t("cameraAlerts")}</h2>
          <div className="flex flex-wrap gap-2">
            {alertCameras.length > 0 ? (
              alertCameras.map((camera) => (
                <button
                  key={camera.id}
                  type="button"
                  onClick={() => router.push("/cameras")}
                  className="btn-danger px-3 py-1 text-xs"
                >
                  {camera.id} - {camera.zone} - {t("warning")}
                </button>
              ))
            ) : (
              <span className="text-xs text-muted">{t("noActionRequired")}</span>
            )}
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">{t("systemHealth")}</h2>
          <div className="flex flex-wrap gap-2">
            {moduleHealth.map((mod) => (
              <span
                key={mod.name}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${
                  mod.status === "ok"
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-danger/40 bg-danger/10 text-danger"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    mod.status === "ok" ? "bg-success" : "bg-danger"
                  }`}
                />
                {mod.name}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-primary mb-3">💧 {t("irrigationStatus")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <p className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-2 text-accent">
              {t("zonesIrrigating")}: {irrigatingZones} / {plantZones.length}
            </p>
            <p className="rounded-lg bg-danger/10 border border-danger/30 px-3 py-2 text-danger">
              {t("zonesCritical")}: {criticalZones}
            </p>
          </div>
          <Link
            href="/irrigation"
            className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent/85"
          >
            {t("manageIrrigation")} -&gt;
          </Link>
        </Card>
      </div>
    </PageWrapper>
  );
}
