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
          green: "#1a6b2e",
          line: "rgba(255,255,255,0.25)",
        },
        brand: {
          blue: "#185FA5",
          "blue-light": "#E6F1FB",
          gold: "#BA7517",
          "gold-light": "#FAEEDA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
