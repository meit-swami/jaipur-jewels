import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          ivory: "#FAF8F3",
          "ivory-dark": "#F5F1E8",
          "ivory-darker": "#EDE8DC",
          gold: "#D4AF37",
          "gold-dark": "#B8941E",
          "gold-light": "#E5D19C",
          charcoal: "#2C2C2C",
          "charcoal-light": "#4A4A4A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
