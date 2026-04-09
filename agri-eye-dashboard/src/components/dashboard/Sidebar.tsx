"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Droplets,
  Eye,
  LayoutDashboard,
  Leaf,
  Shield,
  Video,
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
] as const;

const mobileItems = navItems.slice(0, 5);

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const expanded = isDesktop && (isPinnedOpen || isHovering);

  useEffect(() => {
    const sync = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <>
      <motion.aside
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        animate={{ width: expanded ? 220 : 64 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="hidden md:flex fixed left-0 top-0 z-30 h-screen overflow-y-auto py-4 px-2"
        style={{
          background: "rgba(26,46,26,0.78)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRight: "1px solid rgba(200,230,201,0.25)",
        }}
      >
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">🥭</span>
              {expanded && <span className="text-sm text-white font-semibold truncate">Agri-Eye</span>}
            </div>
            <button
              type="button"
              onClick={() => setIsPinnedOpen((prev) => !prev)}
              className="rounded-md p-1 text-surface/80 hover:text-surface hover:bg-white/10"
              aria-label="Toggle sidebar"
            >
              <ChevronRight size={16} className={cn("transition-transform", expanded && "rotate-180")} />
            </button>
          </div>

          <nav className="mt-2 flex flex-col gap-1.5">
            {navItems.map(({ labelKey, href, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-all",
                    isActive ? "text-white" : "text-surface/80 hover:text-surface hover:bg-white/10"
                  )}
                  style={isActive ? {
                    background: "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)",
                    boxShadow: "0 0 14px rgba(82,183,136,0.45)",
                  } : {}}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg">
                    <Icon size={18} />
                  </span>
                  <motion.span
                    animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {t(labelKey)}
                  </motion.span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderTop: "1px solid rgba(200,230,201,0.7)",
        }}
      >
        {mobileItems.map(({ labelKey, href, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="relative flex min-w-[56px] flex-col items-center gap-0.5 py-1">
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(45,106,79,0.14)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={20} className={cn("relative z-10", isActive ? "text-primary" : "text-muted")} />
              <span className={cn("relative z-10 text-[9px]", isActive ? "text-primary" : "text-muted")}>{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
