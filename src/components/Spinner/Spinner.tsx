import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

const spinnerSizeClasses: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const dotSizeClasses: Record<SpinnerSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Size of the spinner glyph. @default "md" */
  size?: SpinnerSize;
  /** Accessible label announced by assistive tech. @default "Loading" */
  label?: string;
}

/**
 * Small inline loading indicator. Spins via `animate-spin` by default; under
 * `prefers-reduced-motion`, swaps to a non-spinning pulsing dot instead of a
 * rotating glyph some users find disorienting.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", label = "Loading", className, ...rest }, ref) => {
    return (
      <span
        {...rest}
        ref={ref}
        role="status"
        aria-label={label}
        className={cn("inline-flex items-center justify-center", className)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            spinnerSizeClasses[size],
            "animate-spin motion-reduce:hidden text-text-tertiary",
          )}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-25"
          />
          <path
            d="M22 12a10 10 0 0 0-10-10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span
          aria-hidden="true"
          className={cn(
            "hidden motion-reduce:block animate-pulse rounded-full bg-text-tertiary",
            dotSizeClasses[size],
          )}
        />
      </span>
    );
  },
);

Spinner.displayName = "Spinner";
