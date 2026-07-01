import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface PullQuoteProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * The pulled quote text. In real editorial use this is typically a shortened or
   * lightly-adapted excerpt of text that already appears in the surrounding
   * `ArticleBody` — not new, exclusive content — which is what makes the decorative
   * a11y treatment below correct. See the Accessibility section in the docs before
   * using `PullQuote` for content that doesn't also appear in the body text.
   */
  quote: string;
  /** Optional attribution (name/role) shown below the quote. */
  attribution?: string;
  /** Text alignment. @default "left" */
  align?: "left" | "center";
}

/**
 * Large decorative quote pulled from within the article body for visual emphasis.
 * Renders as a plain `div`, not a `<blockquote>`, and is `aria-hidden` — see the
 * Accessibility section in the docs for the reasoning, and contrast with `BlockQuote`
 * for genuine quoted source material that must stay in the accessibility tree.
 */
export const PullQuote = forwardRef<HTMLDivElement, PullQuoteProps>(
  ({ quote, attribution, align = "left", className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "max-w-[65ch] border-l-4 border-masthead-500 py-2 pl-6 font-serif",
          align === "center" &&
            "mx-auto border-l-0 border-t-4 pl-0 pt-6 text-center",
          className,
        )}
        {...rest}
      >
        <p className="text-h2 leading-tight text-text-primary">{quote}</p>
        {attribution ? (
          <p className="mt-4 font-sans text-body font-medium text-text-secondary">
            — {attribution}
          </p>
        ) : null}
      </div>
    );
  },
);
PullQuote.displayName = "PullQuote";
