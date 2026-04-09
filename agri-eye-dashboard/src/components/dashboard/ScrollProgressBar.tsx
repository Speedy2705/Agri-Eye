"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Find the scrollable main element
    const scroller = document.querySelector("main");
    if (!scroller) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? scrollTop / max : 0);
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "4px",
        top: "60px",
        bottom: "16px",
        width: "4px",
        borderRadius: "4px",
        background: "rgba(200,230,201,0.35)",
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: `${progress * 100}%`,
          borderRadius: "4px",
          background: "linear-gradient(180deg, #52B788 0%, #2D6A4F 100%)",
          boxShadow: "0 0 8px rgba(82,183,136,0.5)",
          transition: "height 0.05s linear",
        }}
      />
    </div>
  );
}
