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
        gis: {
          bg: "#1e293b",
          panel: "rgba(15, 23, 42, 0.85)",
          panelBorder: "rgba(255, 255, 255, 0.15)",
          accent: "#10b981", // verde esmeralda para áreas verdes
          muitoBoa: "#10b981", // verde
          boa: "#84cc16",      // verde claro
          regular: "#f59e0b",  // amarelo/laranja
          ruim: "#ef4444",     // vermelho
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
