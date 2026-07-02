import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Text, type TextProps } from "@/components/Text";

/**
 * Average adult silent-reading speed used to derive a minutes estimate from a
 * word count. Documented rather than buried in a formula so consumers can
 * sanity-check (or, in a future pass, override) the assumption.
 */
export const WORDS_PER_MINUTE = 200;

/** Rounds up and floors at 1 minute — "0 min read" is never a useful estimate. */
export function minutesFromWordCount(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

type ReadingTimeContent =
  | {
      /** Pre-computed minutes estimate — used as-is when provided. */
      minutes: number;
      wordCount?: never;
    }
  | {
      minutes?: never;
      /** Word count to derive a minutes estimate from, at `WORDS_PER_MINUTE`. */
      wordCount: number;
    };

export type ReadingTimeProps = Omit<HTMLAttributes<HTMLElement>, "children"> &
  ReadingTimeContent & {
    /** Typographic size, passed through to `Text`. @default "small" */
    size?: TextProps["size"];
    /** Theme-aware color, passed through to `Text`. @default "secondary" */
    color?: TextProps["color"];
  };

/**
 * "6 min read"-style estimate. Accepts either a pre-computed `minutes` prop or
 * a `wordCount` prop (real content pipelines vary in what they have on hand —
 * a CMS might already store a minutes estimate, or only a raw word count).
 * Renders as plain text via `Text`: the curated icon set (see `src/components/
 * Icon`) has no clock/time glyph, and inventing one is out of this pattern's
 * scope, so there's deliberately no icon here.
 */
export const ReadingTime = forwardRef<HTMLElement, ReadingTimeProps>(
  ({ minutes, wordCount, size = "small", color = "secondary", className, ...rest }, ref) => {
    const resolvedMinutes = minutes ?? minutesFromWordCount(wordCount as number);

    return (
      <Text
        ref={ref}
        as="span"
        size={size}
        color={color}
        className={cn("inline-block font-mono", className)}
        {...rest}
      >
        {resolvedMinutes} min read
      </Text>
    );
  },
);
ReadingTime.displayName = "ReadingTime";
