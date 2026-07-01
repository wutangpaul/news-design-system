import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const trackVariants = cva("w-full overflow-hidden rounded-full bg-surface-sunken", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const fillVariants = cva(
  "h-full rounded-full transition-[width] duration-base ease-standard motion-reduce:transition-none",
  {
    variants: {
      color: {
        brand: "bg-masthead-500",
        success: "bg-success-500",
        warning: "bg-warning-500",
        error: "bg-error-500",
        info: "bg-info-500",
      },
    },
    defaultVariants: {
      color: "brand",
    },
  },
);

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressColor = "brand" | "success" | "warning" | "error" | "info";

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof trackVariants>,
    VariantProps<typeof fillVariants> {
  /**
   * Current value. Omit (or set `indeterminate`) for an indeterminate bar
   * when progress can't be measured (e.g. an unknown-length fetch).
   */
  value?: number;
  /** Maximum value the bar represents. @default 100 */
  max?: number;
  /** Forces indeterminate mode even if `value` is set. */
  indeterminate?: boolean;
  /** Track height. @default "md" */
  size?: ProgressSize;
  /** Fill color. @default "brand" */
  color?: ProgressColor;
  /** Accessible label for the progressbar (e.g. "Upload progress"). */
  label?: string;
}

/**
 * Linear progress bar. Determinate mode (`value`/`max`) exposes
 * `aria-valuenow`/`aria-valuemin`/`aria-valuemax`; indeterminate mode
 * (`indeterminate`, or omitting `value`) exposes `aria-valuetext="Loading"`
 * instead and animates via a pulsing fill that respects
 * `prefers-reduced-motion`.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      indeterminate,
      size,
      color,
      label,
      className,
      ...rest
    },
    ref,
  ) => {
    const isIndeterminate = indeterminate || value === undefined;
    const clampedValue = !isIndeterminate
      ? Math.min(Math.max(value as number, 0), max)
      : undefined;
    const percentage = !isIndeterminate
      ? Math.round(((clampedValue as number) / max) * 100)
      : undefined;

    return (
      <div
        {...rest}
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : max}
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuetext={isIndeterminate ? "Loading" : undefined}
        className={cn(trackVariants({ size }), className)}
      >
        {isIndeterminate ? (
          <div
            className={cn(
              fillVariants({ color }),
              "w-full origin-left animate-pulse motion-reduce:animate-none motion-reduce:opacity-70",
            )}
          />
        ) : (
          // Width is the one value here that is fundamentally dynamic
          // (a computed ratio, not a design token), so it can't be expressed
          // as a static Tailwind utility class — an inline style is the
          // narrowly-scoped, intentional exception.
          <div
            className={fillVariants({ color })}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    );
  },
);

Progress.displayName = "Progress";
