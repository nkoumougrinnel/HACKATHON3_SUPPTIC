import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        songo: {
          mapDark: "#141920",
          blockDark: "#1A2030",
          police: "#378ADD",
          policeBg: "#F0F5FC",
          policeText: "#0C447C",
          ambulance: "#E24B4A",
          ambulanceBg: "#FEF0F0",
          ambulanceText: "#791F1F",
          pompiers: "#EF9F27",
          pompiersBg: "#FFFBF0",
          pompiersText: "#633806",
          success: "#1D9E75",
          danger: "#E24B4A",
          warning: "#EF9F27",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        songoInput: "10px",
        songoCard: "12px",
        songoButton: "14px",
        songoSheet: "22px",
      },
    },
  },
  plugins: [],
};

export default config;
