import { forwardRef, type BlockquoteHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface BlockQuoteProps
  extends Omit<BlockquoteHTMLAttributes<HTMLQuoteElement>, "children"> {
  /** The quoted material, verbatim from its source (an interview, cited testimony, etc). */
  quote: string;
  /**
   * Display attribution for the quote (person's name and/or role, publication, etc),
   * rendered inside a real `<cite>`. Distinct from the native `cite` HTML attribute
   * (a source URL), which is still available via `...rest` if you have one.
   */
  attribution?: string;
}

/**
 * A real, semantic quotation from a source — an interview quote, cited testimony, or
 * other genuine quoted material. Renders a native `<blockquote>` with a `<cite>` for
 * attribution, and is never `aria-hidden`: unlike `PullQuote` (a decorative *repeat* of
 * text already in the body), this is the only place the quoted content appears, so it
 * must stay in the accessibility tree exactly like any other body content.
 */
export const BlockQuote = forwardRef<HTMLQuoteElement, BlockQuoteProps>(
  ({ quote, attribution, className, ...rest }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          "max-w-[65ch] border-l-4 border-surface-border-strong py-2 pl-6",
          className,
        )}
        {...rest}
      >
        {/* Roman, never italic: Gloock ships no italic cut, so `italic` here would render a
            browser-synthesized shear of the display face. The border rule, indent, and
            quotation marks carry the "quoted" signal instead. */}
        <p className="font-serif text-lead text-text-primary">&ldquo;{quote}&rdquo;</p>
        {attribution ? (
          <footer className="mt-3">
            <cite className="font-sans text-small not-italic text-text-secondary">
              — {attribution}
            </cite>
          </footer>
        ) : null}
      </blockquote>
    );
  },
);
BlockQuote.displayName = "BlockQuote";
