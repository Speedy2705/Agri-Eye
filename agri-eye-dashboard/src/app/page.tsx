"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  BatteryMedium,
  Radio,
} from "lucide-react";
import { systemStats, moduleHealth } from "@/lib/mockData";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import FarmMap from "@/components/dashboard/FarmMap";
import PageWrapper from "@/components/dashboard/PageWrapper";

const statItems = [
  { key: "temperature",  label: "Temperature",  unit: "°C", icon: Thermometer  },
  { key: "humidity",     label: "Humidity",      unit: "%",  icon: Droplets     },
  { key: "soilMoisture", label: "Soil Moisture", unit: "%",  icon: Sprout       },
  { key: "solarPower",   label: "Solar Power",   unit: "W",  icon: Sun          },
  { key: "battery",      label: "Battery",       unit: "%",  icon: BatteryMedium },
  { key: "activeNodes",  label: "Active Nodes",  unit: "",   icon: Radio        },
] as const;

export default function Home() {
  const [loading, setLoading] = useState(true);

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
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground font-sora leading-tight">
            Agri-Eye 🌿 Smart Farm Intelligence
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Real-time monitoring of Kesarwani Mango Orchard - Jabalpur
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? statItems.map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : statItems.map(({ key, label, unit, icon }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <StatCard
                    icon={icon}
                    label={label}
                    value={systemStats[key] as number}
                    unit={unit}
                  />
                </motion.div>
              ))}
        </div>

        {/* Farm Map */}
        <Card>
          <h2 className="text-sm font-semibold text-foreground/80 mb-3">
            Farm Layout - Live Node Status
          </h2>
          <div className="w-full aspect-[4/3] md:aspect-[16/7]">
            <FarmMap />
          </div>
        </Card>

        {/* System Health */}
        <Card>
          <h2 className="text-sm font-semibold text-foreground/80 mb-3">System Health</h2>
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
      </div>
    </PageWrapper>
  );
}
