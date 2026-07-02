import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Close } from "../Icon";

// NOTE: the `text-small` font-size class is deliberately *not* part of this base string.
// The shared cn() helper's tailwind-merge config doesn't know about this design system's
// custom `fontSize` tokens (text-small, etc) — it buckets them into the same conflict
// group as the `text-color` classes below (text-text-secondary, text-masthead-700,
// text-text-on-brand), since both match its generic `text-{value}` pattern. Confirmed
// empirically: `twMerge("text-text-secondary", "text-small")` drops the color class
// entirely. The real fix belongs in `src/lib/cn.ts` (out of this component's edit
// boundary, flagged in the build report). Until then, `text-small` is applied outside
// of cn()/twMerge so it can never clobber the tone's text-color class.
const tagVariants = cva(
  "inline-flex items-center rounded-full border font-sans font-medium transition-colors duration-fast",
  {
    variants: {
      tone: {
        neutral: "border-surface-border bg-surface-raised text-text-secondary",
        // Brand tone themes explicitly (raw masthead-* utilities don't flip with the theme):
        // without the dark: variants, the pale masthead-50 chip is the brightest element on a
        // dark page.
        brand:
          "border-masthead-200 bg-masthead-50 text-masthead-700 dark:border-masthead-800 dark:bg-masthead-950 dark:text-masthead-300",
      },
      selected: {
        true: "border-masthead-500 bg-masthead-500 text-text-on-brand",
        false: "",
      },
    },
    defaultVariants: { tone: "neutral", selected: false },
  },
);

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onClick" | "color">,
    Pick<VariantProps<typeof tagVariants>, "tone"> {
  /** Renders the label as a real `<button>` (e.g. a topic filter chip). @default false */
  interactive?: boolean;
  /** When `interactive`, marks the chip as the active/selected filter (`aria-pressed`). */
  selected?: boolean;
  /** Click handler for the label, used when `interactive` is true. */
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  /** Shows a trailing remove (×) button. @default false */
  removable?: boolean;
  /** Called when the remove button is activated (click or keyboard). */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for the remove button. Defaults to `Remove {label}`. */
  removeLabel?: string;
  children: ReactNode;
}

/**
 * Editorial topic/category tag (pill shape). Static by default; set `interactive` for a
 * clickable filter chip, and `removable` to add a keyboard-operable remove button. The
 * label and remove controls are always rendered as sibling elements (never nested
 * `<button>`s) to keep the markup valid and each control independently focusable.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      tone = "neutral",
      interactive = false,
      selected = false,
      onClick,
      removable = false,
      onRemove,
      removeLabel,
      children,
      ...rest
    },
    ref,
  ) => {
    const label = typeof children === "string" ? children : undefined;

    return (
      <span
        ref={ref}
        className={`${cn(
          tagVariants({ tone, selected: interactive && selected }),
          className,
        )} text-small`}
        {...rest}
      >
        {interactive ? (
          <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className="rounded-full px-3 py-1"
          >
            {children}
          </button>
        ) : (
          <span className="px-3 py-1">{children}</span>
        )}
        {removable ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel ?? (label ? `Remove ${label}` : "Remove")}
            className="mr-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full hover:bg-surface-border-strong/60"
          >
            <Close size="xs" />
          </button>
        ) : null}
      </span>
    );
  },
);
Tag.displayName = "Tag";
