import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // QIMO Grécia — paleta "Greek Riviera"
        deep: {
          DEFAULT: "#123C4A", // Egeu profundo (seções premium, headlines)
          900: "#10333F", // footer
          800: "#123C4A",
          700: "#1B6E8F", // primary teal
          600: "#145D78",
        },
        offwhite: "#F6FBFC", // branco claro do verão (leve tom de mar, sem pastel)
        sand: {
          DEFAULT: "#CFE6EA", // azul-mar claro (bordas/detalhes)
          light: "#E4EFF0", // faixa azul clara do Egeu (seções alternadas)
          dark: "#B9D9DE",
        },
        gold: {
          DEFAULT: "#1B6E8F", // azul do Egeu (CTAs, botões) — sem laranja
          light: "#8FCCC9", // sea glass claro
          soft: "#8FCCC9", // sea glass (detalhes sobre fundo escuro)
          deep: "#145D78", // azul mais fundo (hover/CTA sobre claro)
        },
        // semantic (shadcn-style)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wide2: "0.18em",
      },
      maxWidth: {
        editorial: "44rem",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.16)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "ken-burns": "ken-burns 18s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
