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
          "max-w-[65ch] py-4 font-serif",
          align === "center" && "mx-auto text-center",
          className,
        )}
        {...rest}
      >
        {/*
          No left rule here — that's BlockQuote's device (quoted source material inside the
          reading flow). A pull quote is the article's one typographic event, and its signal
          is the oversized Gloock quote mark in the brand red: display-scale punctuation
          instead of a hairline. leading-[0.5] pulls the mark's line box tight so the quote
          text tucks up under its bowl rather than floating a full line-height below.
        */}
        <span className="block select-none text-display leading-[0.5] text-masthead-500 dark:text-masthead-400">
          &ldquo;
        </span>
        {/* h3, not h2: big enough to read as an event, but a multi-line quote still can't
            out-shout the article's own h1/display headline. */}
        <p className="mt-4 text-balance text-h3 text-text-primary">{quote}</p>
        {attribution ? (
          /* Attribution is metadata — a name and role, data of record — so it takes the
             system's mono-caps metadata voice, not the serif of the quote itself. */
          <p className="mt-5 font-mono text-caption uppercase tracking-wider text-text-tertiary">
            — {attribution}
          </p>
        ) : null}
      </div>
    );
  },
);
PullQuote.displayName = "PullQuote";
