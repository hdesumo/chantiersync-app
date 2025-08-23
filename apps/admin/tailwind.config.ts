// tailwind.config.ts (reprise, prêt à l’emploi)
// =============================
import type { Config } from "tailwindcss";


const config: Config = {
darkMode: ["class"],
content: [
"./pages/**/*.{ts,tsx}",
"./components/**/*.{ts,tsx}",
"./app/**/*.{ts,tsx}",
"./src/**/*.{ts,tsx}",
],
theme: {
container: {
center: true,
padding: "2rem",
screens: { "2xl": "1400px" },
},
extend: {
colors: {
border: "hsl(var(--border))",
input: "hsl(var(--input))",
ring: "hsl(var(--ring))",
background: "hsl(var(--background))",
foreground: "hsl(var(--foreground))",
primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
bg: "#0b1220",
cardbg: "#121a2b",
text: "#eaf1ff",
mutedText: "#8aa0c6",
brand: "#4da3ff",
borderg: "rgba(255,255,255,0.08)",
},
borderRadius: {
"2xl": "18px",
xxl: "18px",
lg: "var(--radius)",
md: "calc(var(--radius) - 2px)",
sm: "calc(var(--radius) - 4px)",
},
boxShadow: { soft: "0 10px 40px rgba(0,0,0,.25)" },
backgroundImage: {
"hero-radial": "radial-gradient(1200px 600px at 70% -20%, #15213a, #0b1220)",
},
fontFamily: {
sans: ["var(--font-sans)", "system-ui", "ui-sans-serif", "sans-serif"],
},
keyframes: {
"accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
"accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
},
animation: {
"accordion-down": "accordion-down 0.2s ease-out",
"accordion-up": "accordion-up 0.2s ease-out",
},
},
},
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;