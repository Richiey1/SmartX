import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./frontend/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D9488", // Teal 600
          hover: "#0F766E", // Teal 700
          light: "#2DD4BF", // Teal 400
        },
        secondary: {
          DEFAULT: "#16A34A", // Green 600
          hover: "#15803D", // Green 700
        },
        accent: {
          DEFAULT: "#059669", // Emerald 600
        },
        neutral: {
          dark: "#0F172A", // Slate 900
          card: "#1E293B", // Slate 800
          text: "#F8FAFC", // Slate 50
          muted: "#94A3B8", // Slate 400
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
