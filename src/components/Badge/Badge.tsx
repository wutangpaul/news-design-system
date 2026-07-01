import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "success" | "warning" | "error" | "info" | "brand";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-sans font-medium leading-none",
  {
    variants: {
      variant: {
        neutral: "bg-surface-sunken text-text-secondary",
        // Semantic (success/warning/error/info) tokens have no light/dark CSS-variable
        // pairing in src/tokens/colors.ts (only `surface`/`text` do), so these badges keep
        // a fixed tinted background in both themes — the same "fixed-brand" treatment
        // CONTRIBUTING.md prescribes for ink-*/masthead-* usage. Flagged in the build report
        // as a candidate for a future theme-aware semantic-color token pair.
        success: "bg-success-50 text-success-700",
        warning: "bg-warning-50 text-warning-700",
        error: "bg-error-50 text-error-700",
        info: "bg-info-50 text-info-700",
        brand: "bg-masthead-50 text-masthead-700",
      },
      // NOTE: font-size classes (text-caption/text-small) are intentionally kept out of
      // this variant group — see `fontSizeBySize` below for why.
      size: {
        sm: "px-1.5 py-0.5",
        md: "px-2 py-1",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

// The shared cn() helper's tailwind-merge config doesn't know about this design
// system's custom `fontSize` tokens (text-caption/text-small) — it buckets them into the
// same conflict group as the `text-{variant}-700` color classes above, since both match
// its generic `text-{value}` pattern. Confirmed empirically:
// `twMerge("text-success-700", "text-small")` drops `text-success-700` entirely. The
// real fix belongs in `src/lib/cn.ts` (out of this component's edit boundary, flagged in
// the build report). Until then, the font-size class is applied outside of cn()/
// twMerge so it can never clobber the variant's text-color class.
const fontSizeBySize = {
  sm: "text-caption",
  md: "text-small",
} as const;

const dotColorClasses: Record<BadgeVariant, string> = {
  neutral: "bg-ink-400",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
  info: "bg-info-500",
  brand: "bg-masthead-500",
};

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Renders as a small solid dot instead of a labelled pill (e.g. an unread/live
   * indicator). If `children` is also passed, it's kept for screen readers via visually
   * hidden text — color is never the only signal.
   */
  dot?: boolean;
  children?: ReactNode;
}

/** Small status/count indicator tied to semantic color tokens. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", size = "md", dot = false, children, ...rest }, ref) => {
    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-block h-2 w-2 shrink-0 rounded-full",
            dotColorClasses[variant ?? "neutral"],
            className,
          )}
          {...rest}
        >
          {children ? <span className="sr-only">{children}</span> : null}
        </span>
      );
    }

    const resolvedSize = size ?? "md";
    return (
      <span
        ref={ref}
        className={`${cn(badgeVariants({ variant, size }), className)} ${fontSizeBySize[resolvedSize]}`}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";
