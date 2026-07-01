import type { Config } from "tailwindcss";
import {
  ink,
  masthead,
  semantic,
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
  radius,
  shadow,
  motion,
  breakpoints,
  zIndex,
} from "./src/tokens";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: breakpoints,
    extend: {
      colors: {
        ink,
        masthead,
        success: semantic.success,
        warning: semantic.warning,
        error: semantic.error,
        info: semantic.info,
        // CSS-variable-backed semantic aliases — see src/index.css for the
        // light/dark variable definitions. Always prefer these in components
        // over raw `ink-*`/`masthead-*` so theming stays automatic.
        surface: {
          canvas: "rgb(var(--surface-canvas) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
          border: "rgb(var(--surface-border) / <alpha-value>)",
          "border-strong": "rgb(var(--surface-border-strong) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
          "on-brand": "rgb(var(--text-on-brand) / <alpha-value>)",
          inverse: "rgb(var(--text-inverse) / <alpha-value>)",
        },
      },
      fontFamily,
      fontSize,
      fontWeight,
      spacing,
      borderRadius: radius,
      boxShadow: shadow,
      transitionDuration: motion.duration,
      transitionTimingFunction: motion.easing,
      zIndex,
    },
  },
  plugins: [],
} satisfies Config;
