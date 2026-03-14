"use client";

import { AnimatePresence, motion } from "framer-motion";
import { alertFeed } from "@/lib/mockData";

const levelBorder: Record<string, string> = {
  danger:  "border-danger  text-danger",
  warning: "border-warning text-warning",
  clear:   "border-success text-success",
};

const levelBg: Record<string, string> = {
  danger:  "bg-danger/5",
  warning: "bg-warning/5",
  clear:   "bg-success/5",
};

export default function AlertFeed() {
  return (
    <ul className="space-y-2">
      <AnimatePresence>
        {alertFeed.map((alert, index) => (
          <motion.li
            key={alert.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ delay: index * 0.1, duration: 0.35, ease: "easeOut" }}
            className={`flex items-start gap-3 rounded-lg px-3 py-2.5 border-l-4 ${levelBorder[alert.level]} ${levelBg[alert.level]}`}
          >
            <span className="text-xs text-muted font-mono tabular-nums pt-0.5 flex-shrink-0">
              {alert.time}
            </span>
            <span className="text-sm text-foreground/90 leading-snug">{alert.message}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
