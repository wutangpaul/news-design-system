// Editorial typography system: a serif for headlines/long-form reading,
// a sans for UI chrome/navigation, and a mono for metadata (timestamps, live-blog ticks).
//
// Web font loading: Gloock and Inter are loaded via Google Fonts — see the <link> tags in
// index.html (app) and .storybook/preview-head.html (Storybook canvas). Inter is requested as
// its true variable font (`wght@100..900`, one file covering the whole weight axis) rather than
// a handful of static cuts — fewer bytes over the wire and every fontWeight token renders its
// exact weight. Gloock has no variable version to request: Google Fonts only ships it as a
// single static 400 weight, so Heading's `weight="bold"` default still relies on browser
// font-synthesis for that one family — acceptable for a display face, but worth a visual check
// before leaning on `weight="bold"` in new patterns.

export const fontFamily = {
  serif: ["Gloock", "Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
  sans: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "'Segoe UI'",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
  mono: ["'IBM Plex Mono'", "'SFMono-Regular'", "Menlo", "Consolas", "monospace"],
} as const;

// Modular type scale (1.25 ratio), named for editorial intent rather than raw size
// so headline/body usage stays semantic across templates.
//
// h3 and up are fluid: clamp() interpolates from a 375px floor to the full modular-scale
// size at the 1280px (xl) breakpoint, so a display headline is 40px on a phone and 72px on
// desktop without per-breakpoint overrides. h4 and below stay fixed — already comfortable
// at every width. Keep in sync with the @theme block in src/theme.css.
export const fontSize = {
  caption: ["0.75rem", { lineHeight: "1.4" }],
  small: ["0.875rem", { lineHeight: "1.5" }],
  body: ["1rem", { lineHeight: "1.65" }],
  lead: ["1.25rem", { lineHeight: "1.6" }],
  h6: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
  h5: ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
  h4: ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
  h3: ["clamp(1.625rem, 1.37rem + 1.1vw, 2.25rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
  h2: ["clamp(1.875rem, 1.51rem + 1.55vw, 2.75rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  h1: ["clamp(2.125rem, 1.56rem + 2.43vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
  display: ["clamp(2.5rem, 1.67rem + 3.54vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
