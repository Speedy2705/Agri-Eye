"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Eye,
  Leaf,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview",    href: "/",            icon: LayoutDashboard },
  { label: "Monitoring",  href: "/monitoring",  icon: Eye             },
  { label: "Environment", href: "/environment", icon: Leaf            },
  { label: "Security",    href: "/security",    icon: Shield          },
  { label: "Power",       href: "/power",       icon: Zap             },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:flex flex-shrink-0 w-16 lg:w-64 bg-card border-r border-primary/20 flex-col h-full">
        {/* Logo */}
        <div className="h-14 flex items-center px-3 lg:px-5 border-b border-primary/20">
          <motion.div
            whileHover={{ filter: "drop-shadow(0 0 8px #2D6A4F)" }}
            className="flex items-center gap-2 cursor-default select-none"
          >
            <span className="text-2xl">🥭</span>
            <span className="hidden lg:block text-foreground font-bold text-lg font-sora tracking-tight">
              Agri-Eye
            </span>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-accent border-l-2 border-accent bg-primary/10 pl-[10px]"
                    : "text-muted hover:text-foreground hover:bg-primary/5 border-l-2 border-transparent"
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-primary/30 flex justify-around py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-[54px]",
                isActive ? "text-accent" : "text-muted"
              )}
            >
              <Icon size={24} />
              <span className="text-[9px] leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

