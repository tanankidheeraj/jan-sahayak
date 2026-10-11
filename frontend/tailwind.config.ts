import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#000666",
        "primary-container": "#1a237e",
        "primary-fixed": "#e0e0ff",
        "primary-fixed-dim": "#bdc2ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#8690ee",
        "on-primary-fixed": "#000767",
        "on-primary-fixed-variant": "#343d96",
        "inverse-primary": "#bdc2ff",

        "secondary": "#8f4e00",
        "secondary-container": "#fe9832",
        "secondary-fixed": "#ffdcc2",
        "secondary-fixed-dim": "#ffb77a",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#683700",
        "on-secondary-fixed": "#2e1500",
        "on-secondary-fixed-variant": "#6d3a00",

        "tertiary": "#012100",
        "tertiary-container": "#023900",
        "tertiary-fixed": "#8dfc75",
        "tertiary-fixed-dim": "#72de5c",
        "tertiary-fixed-variant": "#035300",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#41ad31",
        "on-tertiary-fixed": "#012200",
        "on-tertiary-fixed-variant": "#035300",

        "surface": "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#d0dbed",
        "surface-variant": "#d9e3f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e6eeff",
        "surface-container-high": "#dee9fc",
        "surface-container-highest": "#d9e3f6",
        "on-surface": "#121c2a",
        "on-surface-variant": "#454652",
        "inverse-surface": "#27313f",
        "inverse-on-surface": "#eaf1ff",

        "outline": "#767683",
        "outline-variant": "#c6c5d4",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Palette aliases
        saffron: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#ff9933",
          600: "#fe9832",
          700: "#c2410c",
          800: "#8f4e00",
        },
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          700: "#1e3a8a",
          800: "#1a237e",
          900: "#000666",
        },
        indiaGreen: {
          50: "#f0fdf4",
          500: "#138808",
          600: "#16a34a",
          700: "#035300",
        }
      },
      fontFamily: {
        headline: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        "headline-xl": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-lg": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-md": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-sm": ["'Plus Jakarta Sans'", "sans-serif"],
        "body-lg": ["'Inter'", "sans-serif"],
        "body-md": ["'Inter'", "sans-serif"],
        "body-sm": ["'Inter'", "sans-serif"],
        "label-lg": ["'Inter'", "sans-serif"],
        "label-md": ["'Inter'", "sans-serif"],
        "label-sm": ["'Inter'", "sans-serif"],
      },
      spacing: {
        "gutter": "1rem",
        "gutter-desktop": "1.5rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
      }
    },
  },
  plugins: [],
};
export default config;
