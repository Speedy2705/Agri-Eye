"use client";

import { motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(82,183,136,0.12) 0%, transparent 70%)",
        }}
      />
      {children}
    </motion.div>
  );
}
