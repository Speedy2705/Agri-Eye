"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastLevel = "danger" | "warning" | "clear";

const levelClasses: Record<ToastLevel, string> = {
  danger:  "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
  clear:   "border-success/40 bg-success/10 text-success",
};

interface ToastProps {
  message: string;
  level: ToastLevel;
  onClose: () => void;
}

export default function Toast({ message, level, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm max-w-sm",
          levelClasses[level]
        )}
      >
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
