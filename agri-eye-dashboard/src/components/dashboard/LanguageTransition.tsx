"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageTransition({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={language}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
