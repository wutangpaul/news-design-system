import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium",
    "transition-colors duration-fast ease-standard",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-masthead-500 text-text-on-brand hover:bg-masthead-600 active:bg-masthead-700",
        secondary:
          "border border-surface-border-strong bg-surface-raised text-text-primary hover:bg-surface-sunken active:bg-surface-sunken",
        ghost: "bg-transparent text-text-primary hover:bg-surface-raised active:bg-surface-sunken",
        // Outlined rather than filled: the brand accent (masthead red) and the error family
        // are near-identical hues, so a filled destructive button reads as a primary CTA.
        // The outline is the shape signal that separates "dangerous" from "brand" — it only
        // fills red at the moment of committed intent (hover/active).
        destructive:
          "border border-error-500 bg-transparent text-error-700 hover:bg-error-500 hover:text-ink-0 active:bg-error-700 active:text-ink-0 dark:text-error-400 dark:hover:text-ink-0 dark:active:text-ink-0",
      },
      // NOTE: font-size classes (text-small/text-body/text-lead) are intentionally kept
      // out of this variant group — see the `fontSizeBySize` map below for why.
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// The shared cn() helper's tailwind-merge config doesn't know about this design
// system's custom `fontSize` tokens (text-small/text-body/text-lead, etc) — it buckets
// them into the same conflict group as `text-color` utilities (text-text-on-brand,
// text-text-primary, ...) used above, since both match its generic `text-{value}`
// pattern. Confirmed empirically: `twMerge("text-text-on-brand", "text-body")` drops
// `text-text-on-brand` entirely, which would silently make button text invisible/
// low-contrast against a colored background. The real fix belongs in `src/lib/cn.ts`
// (extend tailwind-merge's classGroups for the custom theme) — out of this component's
// edit boundary, flagged in the build report. Until then, the font-size class is applied
// outside of cn()/twMerge so it can never clobber the variant's text-color class.
const fontSizeBySize = {
  sm: "text-small",
  md: "text-body",
  lg: "text-lead",
} as const;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows an inline spinner and puts the button in a busy, non-interactive state. */
  isLoading?: boolean;
  /** Icon (or other node) rendered before the label. Hidden while `isLoading`. */
  leadingIcon?: ReactNode;
  /** Icon (or other node) rendered after the label. Hidden while `isLoading`. */
  trailingIcon?: ReactNode;
}

/** Minimal inline spinner — intentionally hand-rolled so Button has no component deps. */
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="opacity-25"
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/**
 * Primary interactive control of the design system. Renders a native `<button>` with
 * full keyboard support (Enter/Space activation, focus-visible ring) out of the box.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled = false,
      leadingIcon,
      trailingIcon,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const resolvedSize = size ?? "md";

    return (
      <button
        ref={ref}
        type={type}
        className={`${cn(buttonVariants({ variant, size }), className)} ${fontSizeBySize[resolvedSize]}`}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {isLoading ? <Spinner /> : leadingIcon}
        {children}
        {!isLoading ? trailingIcon : null}
      </button>
    );
  },
);
Button.displayName = "Button";
