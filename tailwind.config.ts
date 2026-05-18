import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        atelier: {
          canvas: "#f7f5ef",
          surface: "#fffdf8",
          ink: "#171717",
          muted: "#6f675d",
          line: "#ddd4c4",
          amber: "#b7791f",
          green: "#1f766f",
          danger: "#b42318",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(80, 61, 30, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
