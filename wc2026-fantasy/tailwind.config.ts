/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          green: "#0d7a3a",
          line: "rgba(255,255,255,0.3)",
        },
        brand: {
          blue: "#1d4ed8",
          violet: "#7c3aed",
          gold: "#f59e0b",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        pitch: "0 20px 60px -10px rgba(13, 122, 58, 0.4)",
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
