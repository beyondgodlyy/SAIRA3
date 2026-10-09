import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8F1D2C", // Dark Cherry Red — از لوگو
          dark: "#6E1622",
          light: "#A8394A",
        },
        gold: {
          DEFAULT: "#C7A567", // Champagne / Muted Gold
          light: "#DCC28E",
        },
        ivory: {
          DEFAULT: "#F7F3ED", // پس‌زمینه اصلی
          soft: "#FCFAF7", // پس‌زمینه دوم
        },
        ink: {
          DEFAULT: "#191919", // متن اصلی
          muted: "#77716B", // متن ثانویه
        },
      },
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
        display: ["Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(25, 25, 25, 0.06)",
        card: "0 2px 12px rgba(25, 25, 25, 0.05)",
      },
      letterSpacing: {
        wide2: "0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
