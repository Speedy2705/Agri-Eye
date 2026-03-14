"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Eye,
  Leaf,
  Shield,
  Video,
  Droplets,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

const navItems = [
  { labelKey: "overview", href: "/", icon: LayoutDashboard },
  { labelKey: "monitoring", href: "/monitoring", icon: Eye },
  { labelKey: "environment", href: "/environment", icon: Leaf },
  { labelKey: "security", href: "/security", icon: Shield },
  { labelKey: "cameras", href: "/cameras", icon: Video },
  { labelKey: "power", href: "/power", icon: Zap },
  { labelKey: "irrigation", href: "/irrigation", icon: Droplets },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <>
      <aside className="hidden md:flex flex-shrink-0 w-16 lg:w-64 bg-grad-sidebar border-r border-primary/35 flex-col h-full">
        {/* Logo */}
        <div className="h-14 flex items-center px-3 lg:px-5 border-b border-white/15">
          <motion.div
            whileHover={{ filter: "drop-shadow(0 0 8px #2D6A4F)" }}
            className="flex items-center gap-2 cursor-default select-none"
          >
            <span className="text-2xl">🥭</span>
            <span className="hidden lg:block text-surface font-bold text-lg font-sora tracking-tight">
              Agri-Eye
            </span>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ labelKey, href, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-accent border-l-2 border-accent bg-accent/20 pl-[10px]"
                    : "text-surface/75 hover:text-surface hover:bg-white/10 border-l-2 border-transparent"
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="hidden lg:block">{t(labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-grad-sidebar border-t border-white/15 flex justify-around py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {navItems.map(({ labelKey, href, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-[54px]",
                isActive ? "text-accent" : "text-surface/80"
              )}
            >
              <Icon size={24} />
              <span className="text-[9px] leading-none">{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

