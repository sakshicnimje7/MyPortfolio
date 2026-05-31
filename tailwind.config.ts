import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          DEFAULT: "var(--cream)",
          "2": "var(--cream-2)",
          "3": "var(--cream-3)",
        },
        sage: {
          light: "var(--sage-light)",
          DEFAULT: "var(--sage)",
          mid: "var(--sage-mid)",
        },
        forest: "var(--forest)",
        amber: {
          DEFAULT: "var(--amber)",
          light: "var(--amber-light)",
        },
        ink: "var(--ink)",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        dm: ["var(--font-dm)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
