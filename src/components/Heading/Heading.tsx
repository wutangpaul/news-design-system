import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type VisualSize = HeadingLevel | "display";

const sizeClasses: Record<VisualSize, string> = {
  1: "text-h1",
  2: "text-h2",
  3: "text-h3",
  4: "text-h4",
  5: "text-h5",
  6: "text-h6",
  display: "text-display",
};

// `font-regular` is omitted (mapped to "") rather than emitted as a class: the shared
// cn() helper's tailwind-merge config misclassifies it as a `font-family` utility, so
// combining it with `font-serif` in the same cn() call silently drops `font-serif`.
// 400/"regular" is the implicit browser default anyway, so omitting it is visually a
// no-op. See Text.tsx for the fuller writeup of this cn()/tailwind-merge gap (flagged in
// the build report as a `src/lib/cn.ts` fix that's out of this component's boundary).
const weightClasses = {
  regular: "",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level (1-6) — determines the rendered tag (`h1`...`h6`). */
  level: HeadingLevel;
  /**
   * Visual size, decoupled from the semantic `level`. Useful in editorial layouts where,
   * e.g., an `h2` needs to look like the design scale's `h4` in a dense rail without
   * giving up correct document structure. Defaults to match `level`.
   */
  visualSize?: VisualSize;
  /** Font weight. Defaults to `bold` for editorial headlines. */
  weight?: keyof typeof weightClasses;
  children?: ReactNode;
}

/**
 * Polymorphic editorial heading. Always renders a real `h1`-`h6` element based on
 * `level` for correct document outline/semantics, with serif type for headline voice.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, visualSize, weight = "bold", className, children, ...rest }, ref) => {
    const Tag = `h${level}` as ElementType;
    const size = visualSize ?? level;

    return (
      <Tag
        ref={ref}
        // text-balance: evens out line lengths so multi-line headlines don't break as
        // "Inside the Multi- / Billion-Dollar Race…" with a near-empty last line. Browsers
        // only apply it up to ~6 lines and ignore it beyond that, so it's safe at every size.
        className={cn(
          "text-balance font-serif",
          sizeClasses[size],
          weightClasses[weight],
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
Heading.displayName = "Heading";
