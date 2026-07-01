import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// NOTE on the split below: the shared `cn()` helper (tailwind-merge with default config)
// doesn't know about this design system's custom `fontSize` token names (text-h1...h6,
// text-display, text-caption, text-small, text-body, text-lead). It buckets all of them
// into the same conflict group as `text-color` utilities (text-text-primary, etc), since
// both match its generic `text-{value}` pattern. Confirmed empirically:
// `twMerge("text-lead", "text-text-primary")` -> `"text-text-primary"` (silently drops
// the size class). The real fix belongs in `src/lib/cn.ts` (extend tailwind-merge's
// classGroups for the custom theme) — out of this component's edit boundary, flagged in
// the build report. Until then, the size class is kept out of the same `cn()` call as the
// color class so both reliably render.
const sizeClasses = {
  caption: "text-caption",
  small: "text-small",
  body: "text-body",
  lead: "text-lead",
} as const;

const colorClasses = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  tertiary: "text-text-tertiary",
} as const;

// `font-regular` has the same cn()/tailwind-merge gap: it's misclassified as a
// `font-family` utility (conflicting with `font-sans`/`font-serif`) rather than
// `font-weight`. Since 400/"regular" is the implicit browser default anyway, we simply
// omit the class for it instead of emitting a class that would erase `font-sans`.
const weightClasses = {
  regular: "",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

type TextSize = keyof typeof sizeClasses;
type TextColor = keyof typeof colorClasses;
type TextWeight = keyof typeof weightClasses;
type TextElement = "p" | "span" | "div";

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  /** Element to render. Defaults to `p`. */
  as?: TextElement;
  /** Typographic size, mapped to the typography tokens. @default 'body' */
  size?: TextSize;
  /** Theme-aware text color. @default 'primary' */
  color?: TextColor;
  /** Font weight. @default 'regular' */
  weight?: TextWeight;
  children?: ReactNode;
}

/**
 * Polymorphic body-copy component for editorial text. Size variants map to the typography
 * tokens (`caption`/`small`/`body`/`lead`); color variants use the theme-aware `text-*`
 * utilities so they adapt automatically between light/dark mode.
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    { as = "p", size = "body", color = "primary", weight = "regular", className, children, ...rest },
    ref,
  ) => {
    const Component = as as ElementType;
    // `colorClasses[color]` is intentionally concatenated *outside* of `cn()` — passing
    // it into the same tailwind-merge call as the size class is exactly the collision
    // described above (cn()/twMerge flattens every argument into one list before
    // resolving conflicts, so keeping it in a separate call doesn't help; it has to stay
    // out of cn() entirely).
    const resolvedClassName = `${cn("font-sans", sizeClasses[size], weightClasses[weight], className)} ${colorClasses[color]}`;
    return (
      <Component ref={ref} className={resolvedClassName} {...rest}>
        {children}
      </Component>
    );
  },
);
Text.displayName = "Text";
