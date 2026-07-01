import { forwardRef, type ReactNode, type SVGAttributes } from "react";
import { cn } from "@/lib/cn";

/** Named size tokens mapped to concrete pixel dimensions for the icon's square viewport. */
const sizeMap = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "2rem",
} as const;

export type IconSizeToken = keyof typeof sizeMap;
export type IconSize = IconSizeToken | number;

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  /** Icon size — a token (`xs`/`sm`/`md`/`lg`/`xl`) or a custom pixel number. @default 'md' */
  size?: IconSize;
  /**
   * Accessible label. When provided, the icon is exposed to assistive tech as
   * `role="img"` with this `aria-label`. When omitted, the icon is treated as
   * purely decorative (`aria-hidden="true"`) — use this when adjacent visible
   * text already conveys the meaning.
   */
  label?: string;
  /** Raw SVG path/shape content (used internally by the curated icon set). */
  children: ReactNode;
}

/**
 * Generic SVG wrapper used to build the design system's curated icon set, and
 * available directly for one-off icons. Renders a 24x24 viewBox by default and
 * inherits color via `currentColor` so it follows surrounding text color.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", label, className, children, ...rest }, ref) => {
    const dimension = typeof size === "number" ? `${size}px` : sizeMap[size];
    const a11yProps = label
      ? { role: "img" as const, "aria-label": label }
      : { "aria-hidden": true as const };

    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        width={dimension}
        height={dimension}
        fill="none"
        className={cn("inline-block shrink-0 align-[-0.125em] text-current", className)}
        {...a11yProps}
        {...rest}
      >
        {children}
      </svg>
    );
  },
);
Icon.displayName = "Icon";
