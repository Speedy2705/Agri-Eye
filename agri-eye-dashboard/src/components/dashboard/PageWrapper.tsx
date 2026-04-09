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
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ position: "relative", zIndex: 20 }}
      className="relative min-h-screen w-full"
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
