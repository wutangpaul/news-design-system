import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "../../components/Badge";
import { Link } from "../../components/Link";
import { Close } from "../../components/Icon";

export interface BreakingNewsBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Headline text, rendered as a `Link` to the full story. */
  headline: string;
  /** Destination for the headline link. */
  href: string;
  /** Visible text for the leading badge. @default "Breaking" */
  label?: string;
  /** Called when the dismiss button is activated (in addition to the banner hiding itself). */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default "Dismiss breaking news banner" */
  dismissLabel?: string;
}

/**
 * Urgent, full-width banner for breaking news, typically pinned to the top of the page.
 * Composes `Badge` for the "Breaking" label and `Link` for the headline. Dismissible via a
 * real `<button>` — this is genuinely time-sensitive content the reader should be able to
 * clear once seen, same as any other transient notification.
 *
 * Because the dismissed state is tracked internally, mount a *new* banner (e.g. `key={href}`)
 * when a genuinely new breaking story replaces this one — reusing the same element with just
 * new props would keep it hidden if the reader had already dismissed the previous story.
 */
export const BreakingNewsBanner = forwardRef<HTMLDivElement, BreakingNewsBannerProps>(
  (
    {
      headline,
      href,
      label = "Breaking",
      onDismiss,
      dismissLabel = "Dismiss breaking news banner",
      className,
      ...rest
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = useState(false);

    // A new `headline`/`href` represents a genuinely new story even if the consumer didn't
    // remount via `key` — re-show the banner rather than leave it hidden from a previous story.
    useEffect(() => {
      setDismissed(false);
    }, [headline, href]);

    if (dismissed) return null;

    function handleDismiss() {
      setDismissed(true);
      onDismiss?.();
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "flex w-full items-center gap-3 bg-error-500 px-4 py-3 text-text-on-brand",
          className,
        )}
        {...rest}
      >
        <Badge variant="error" size="sm" className="shrink-0">
          {label}
        </Badge>
        <Link
          href={href}
          tone="standalone"
          // `Link`'s base styles dim `:visited` links to `text-text-tertiary` (a common
          // editorial "already read" affordance) — overridden back to the on-brand color
          // here so a read breaking-news link never loses contrast against the solid
          // error-500 background.
          className="min-w-0 flex-1 truncate font-semibold text-text-on-brand visited:text-text-on-brand hover:text-text-on-brand"
        >
          {headline}
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={dismissLabel}
          className="shrink-0 rounded-md p-1 opacity-80 transition-opacity hover:opacity-100"
        >
          <Close size="sm" />
        </button>
      </div>
    );
  },
);
BreakingNewsBanner.displayName = "BreakingNewsBanner";
