import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const skeletonVariants = cva(
  // Animated shimmer by default; under prefers-reduced-motion, drop the
  // infinite animation entirely and fall back to a static, low-opacity
  // block instead (no non-stoppable infinite animation).
  "block bg-surface-sunken animate-pulse motion-reduce:animate-none motion-reduce:opacity-70",
  {
    variants: {
      shape: {
        text: "h-4 w-full rounded-sm",
        circle: "aspect-square h-10 w-10 rounded-full",
        rect: "h-24 w-full rounded-md",
      },
    },
    defaultVariants: {
      shape: "text",
    },
  },
);

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Placeholder shape. @default "text" */
  shape?: "text" | "circle" | "rect";
}

/**
 * Loading placeholder block. Always `aria-hidden` — Skeleton has no idea
 * *what* is loading, so it can't announce anything meaningful on its own.
 * Pair it with a visually-hidden "Loading…" live region in the parent
 * component that knows the context (see the MDX for the pattern).
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape, className, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ shape }), className)}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
