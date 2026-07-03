// Chart color system for data visualization (LineChart, BarChart, Sparkline). Unlike the
// rest of this file, these values are consumed as literal color strings by chart-drawing
// code (visx/SVG props), not as Tailwind utility classes — so there's no @theme entry for
// them, just this token module.
//
// Every value here was derived and validated per the dataviz skill's method: color is
// assigned by job (categorical/sequential/diverging/status), never hand-picked, and every
// categorical/ordinal set was run through its WCAG + CVD-safety validator (relative
// luminance, OKLCH lightness band, Machado-2009 CVD simulation) before being committed here.
// See each export's comment for the exact validation command used — re-run it if a value
// here ever changes.

/**
 * Categorical palette: series *identity* (which line, which bar group), never magnitude.
 * 8 hues in a fixed order — the order itself is the CVD-safety mechanism, so consumers must
 * assign slots in sequence (`categorical[seriesIndex % categorical.length]`), never pick by
 * hue name or re-sort by value. 4 slots reuse this system's existing brand/semantic hues
 * (blue/info, amber/warning, green/success, red/masthead) rather than inventing new ones;
 * the other 4 (teal, violet, magenta, orange) fill gaps this system's palette doesn't cover,
 * chosen and nudged specifically to pass CVD separation against the reused hues.
 *
 * Validated (adjacent pairs — the correct check for ordered bar/line/sparkline series, per
 * the skill's own scoping; re-validate with `--pairs all` before reusing this set for a
 * scatter/bubble/choropleth chart, where any two slots can sit side by side):
 *   node validate_palette.js "<8 hexes>" --mode light --surface "#ffffff"  → PASS, worst adjacent ΔE 16.2
 *   node validate_palette.js "<8 hexes>" --mode dark  --surface "#0d0d0a" → PASS, worst adjacent ΔE 16.2
 * The same 8 hex values pass both modes (the near-black canvas gives every mid-tone hue
 * plenty of headroom) — deliberately checked per-mode, not assumed from one pass.
 */
export const categorical = [
  "#2563eb", // 1. blue    — reused: info-500
  "#0d9488", // 2. teal    — new
  "#d97706", // 3. amber   — reused: warning-500
  "#16a34a", // 4. green   — reused: success-500
  "#9333ea", // 5. violet  — new
  "#b91c1c", // 6. red     — reused: masthead-500
  "#db2777", // 7. magenta — new
  "#c2410c", // 8. orange  — new
] as const;

/**
 * Sequential ramp: single hue (blue, matching `info`), magnitude only (heatmap-style
 * continuous encoding). The anchor flips per mode — light mode's near-zero end is the
 * lightest step; dark mode's near-zero end is the *darkest* step (a light step would
 * vanish into a light background, but on a dark canvas it's a dark step that recedes).
 * Never reuse these for series identity — magnitude and identity are different jobs.
 *
 * Validated with `--ordinal` (monotone lightness, ≥0.06 adjacent steps, near-surface step
 * clears 2:1 contrast):
 *   light: "#86b6ef,#5598e7,#2a78d6,#1c5cab" --mode light --surface "#ffffff" → PASS
 *   dark:  "#184f95,#2a78d6,#86b6ef,#cde2fb" --mode dark  --surface "#0d0d0a" → PASS
 */
export const sequential = {
  light: ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab"] as const,
  dark: ["#184f95", "#2a78d6", "#86b6ef", "#cde2fb"] as const,
};

/**
 * Diverging pair: polarity (which side of a baseline — up/down, positive/negative).
 * Warm/cool opposite poles so the two sides read as truly different, not just "two blues."
 * Reuses this system's existing brand red and info blue directly — this is exactly the
 * skill's own validated reference pattern (blue↔red; blue↔aqua was rejected there because
 * both read as cool and the midpoint stops signaling "neutral").
 */
export const diverging = {
  negative: "#b91c1c", // masthead-500
  positive: "#2563eb", // info-500
  midpoint: { light: "#eeeeec", dark: "#282721" }, // ink-100 / ink-800
};

/**
 * Status: state (good/warning/critical), reserved meaning, distinct from the categorical
 * slots so a status color never impersonates a series. This is exactly the existing
 * success/warning/error semantic tokens — already contrast-audited (see
 * Foundations/AccessibilityStandards.mdx) — not a new scale. Per the skill's rule, a status
 * color always ships with an icon + label, never alone; consumers should reuse
 * `Badge`/`Alert`'s existing tone system for that pairing rather than drawing raw dots.
 * No "serious" fourth tier: this system's semantic scale only has three status-shaped
 * tokens (success/warning/error/info are 4, but `info` is neutral-state, not part of the
 * good→critical axis), and inventing a tier nothing else in the system uses would be its
 * own inconsistency.
 */
export const status = {
  good: "#16a34a", // success-500
  warning: "#d97706", // warning-500
  critical: "#dc2626", // error-500
};

/**
 * Chart chrome (gridlines, axis lines, muted tick/label text) reuses this system's existing
 * theme-aware CSS variables directly — `var(--surface-border)` etc. resolve against
 * whichever value `:root`/`.dark` currently defines, so chart chrome adapts to dark mode
 * automatically through the exact same mechanism every other component already uses. No new
 * tokens, no JS theme detection: these are literal strings usable directly as SVG
 * `stroke`/`fill` attribute values.
 */
export const chrome = {
  grid: "var(--surface-border)",
  axis: "var(--surface-border-strong)",
  mutedText: "var(--text-tertiary)",
  text: "var(--text-secondary)",
} as const;

/** Assigns a fixed categorical slot by index — never by value/rank. Wraps past 8 series,
 * but per the skill's own rule a 9th distinct series should fold into "Other" or small
 * multiples rather than actually reuse a hue; the wrap is a safety net, not a design. */
export function categoricalColor(index: number): string {
  return categorical[index % categorical.length]!;
}
