"use client";

import { motion } from "framer-motion";

interface WaveformProps {
  active: boolean;
}

export default function Waveform({ active }: WaveformProps) {
  return (
    <div className="flex h-8 items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] h-5 rounded-[2px]"
          style={{ backgroundColor: "#F4A01C", originY: 1 }}
          animate={active ? { scaleY: [0.4, 1.6, 0.4] } : { scaleY: 0.4 }}
          transition={
            active
              ? { repeat: Infinity, duration: 0.6, delay: i * 0.1 }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}
