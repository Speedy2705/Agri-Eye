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
        background: "transparent",
        card: "#FFFFFF",
        foreground: "#1A2E1A",
        muted: "#6B8F71",
        danger: "#DC2626",
        success: "#16A34A",
        warning: "#D97706",
        border: "#C8E6C9",
        surface: "rgba(232, 245, 233, 0.6)",
      },
      backgroundImage: {
        "grad-hero": "linear-gradient(135deg, #2D6A4F 0%, #52B788 50%, #F4A01C 100%)",
        "grad-card": "linear-gradient(145deg, #FFFFFF 0%, #E8F5E9 100%)",
        "grad-accent": "linear-gradient(135deg, #F4A01C 0%, #F97316 100%)",
        "grad-success": "linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)",
        "grad-danger": "linear-gradient(135deg, #DC2626 0%, #F87171 100%)",
        "grad-sidebar": "linear-gradient(180deg, #1A2E1A 0%, #2D6A4F 50%, #1A3A2A 100%)",
        "grad-navbar": "linear-gradient(90deg, #FFFFFF 0%, #F0F7F4 100%)",
        "grad-stat": "linear-gradient(145deg, #F0FDF4 0%, #DCFCE7 100%)",
        "grad-warning": "linear-gradient(135deg, #D97706 0%, #FBBF24 100%)",
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
      zIndex: {
        modal: "99999",
      },
    },
  },
  plugins: [],
};
export default config;
