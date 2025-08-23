import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1220",
        cardbg: "#121a2b",
        text: "#eaf1ff",
        mutedText: "#8aa0c6",
        brand: "#4da3ff",
      },
      boxShadow: { soft: "0 10px 40px rgba(0,0,0,.25)" },
      borderRadius: { "2xl": "18px", xxl: "18px" },
    },
  },
  plugins: [],
} satisfies Config;
