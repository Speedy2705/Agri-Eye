import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",
        accent: "#F4A01C",
        background: "#0F1A0F",
        card: "#1A2E1A",
        foreground: "#E8F5E9",
        danger: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
        muted: "#4B6B50",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      keyframes: {
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.4)", opacity: "0" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        countup: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseRing: "pulseRing 2s ease-out infinite",
        scanLine: "scanLine 3s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        countup: "countup 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
