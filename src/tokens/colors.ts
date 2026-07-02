// Color tokens — single source of truth for the palette.
// "ink" = neutral/grayscale axis (text, surfaces, borders).
// "masthead" = brand accent, used sparingly for editorial authority (links, CTAs, breaking-news).

export const ink = {
  0: "#ffffff",
  50: "#f7f7f5",
  100: "#eeeeec",
  200: "#dcdcd8",
  300: "#bfbfb9",
  400: "#97968d",
  500: "#75746a",
  600: "#57564e",
  700: "#3f3e38",
  800: "#282721",
  900: "#181813",
  950: "#0d0d0a",
  1000: "#000000",
} as const;

export const masthead = {
  50: "#fdf2f2",
  100: "#fbe1e1",
  200: "#f5bcbc",
  300: "#ea8e8e",
  400: "#d85d5d",
  500: "#b91c1c", // primary brand red — links, CTAs, emphasis
  600: "#991414",
  700: "#7a1010",
  800: "#5c0c0c",
  900: "#3d0808",
  950: "#240404",
} as const;

export const semantic = {
  success: { 50: "#f0fdf4", 500: "#16a34a", 700: "#15803d" },
  warning: { 50: "#fffbeb", 500: "#d97706", 700: "#b45309" },
  // error carries an extra 400 step: it's the only semantic family used as *text on a dark
  // surface* (Button's outlined destructive variant), and 500 falls short of AA there.
  error: { 50: "#fef2f2", 400: "#f87171", 500: "#dc2626", 700: "#b91c1c" },
  info: { 50: "#eff6ff", 500: "#2563eb", 700: "#1d4ed8" },
} as const;

// Theme-aware surface/text aliases. Consumed by tailwind.config.ts as CSS-variable-backed
// utilities (bg-surface, text-ink, etc.) so components don't hardcode light/dark pairs.
export const surface = {
  light: {
    canvas: ink[0],
    raised: ink[50],
    sunken: ink[100],
    border: ink[200],
    borderStrong: ink[300],
  },
  dark: {
    canvas: ink[950],
    raised: ink[900],
    sunken: ink[1000],
    border: ink[800],
    borderStrong: ink[700],
  },
} as const;

export const text = {
  light: {
    primary: ink[900],
    secondary: ink[600],
    tertiary: ink[500],
    onBrand: ink[0],
    inverse: ink[0],
  },
  dark: {
    primary: ink[50],
    secondary: ink[300],
    tertiary: ink[400],
    onBrand: ink[0],
    inverse: ink[900],
  },
} as const;
