"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface OdometerProps {
  value: number;
  className?: string;
}

function Digit({ digit }: { digit: string }) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", height: "1em", lineHeight: "1em", position: "relative" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ display: "block" }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Odometer({ value, className }: OdometerProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    const from = display;
    const to = value;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easing = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * easing);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const chars = String(display).split("");
  return (
    <span className={className} style={{ display: "inline-flex" }}>
      {chars.map((ch, i) => (
        <Digit key={i} digit={ch} />
      ))}
    </span>
  );
}
