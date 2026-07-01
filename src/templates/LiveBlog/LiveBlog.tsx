import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";

export interface LiveBlogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Props forwarded as-is to the site-wide `GlobalHeader` (logo, primary navigation,
   * search, actions). Every page needs the same chrome, so this template composes
   * `GlobalHeader` directly rather than treating "whether to show a header" as a slot —
   * only its content is left to the consumer.
   */
  header: GlobalHeaderProps;
  /** Props forwarded as-is to the site-wide `Footer` (link groups, social, legal). */
  footer: FooterProps;
  /**
   * Optional urgent-story banner slot, rendered directly below the global header and
   * above the blog's own title. Typically a `<BreakingNewsBanner />`. Omit when this
   * live blog isn't currently tied to a separate breaking-news alert.
   */
  breakingNewsBanner?: ReactNode;
  /**
   * The live blog's own title/context block — headline, standfirst, byline, whatever
   * the consumer needs to orient the reader on what event this feed is covering.
   * Rendered as-is above the feed.
   */
  pageHeader: ReactNode;
  /**
   * Optional small status area shown between `pageHeader` and the feed — e.g. a "Live"
   * indicator plus a last-updated timestamp, or an entry count. This template has no
   * opinion on its content or how it's computed; pass whatever the consumer's data
   * source can produce.
   */
  feedStatus?: ReactNode;
  /**
   * The feed itself: one entry per timestamped update, ordered newest-first by the
   * consumer (typically `<LiveBlogEntry />` elements). This template renders exactly
   * what it's given, in the order given — it never sorts, caches, truncates, or assumes
   * a fixed length. Real live blogs grow this array over time by unshifting a new entry
   * onto the front; pass the updated array back in on every re-render.
   *
   * Each entry should carry its own stable `key` (e.g. `key={entry.id}`), the same as
   * any other React list — the array is rendered directly as children rather than
   * re-wrapped or re-keyed by index, so consumer-supplied keys survive re-ordering.
   */
  entries: ReactNode[];
}

/**
 * Page-level layout for a running live-blog feed covering a breaking/ongoing event: site
 * chrome, an optional breaking-news banner, a title/context header, an arbitrary-length
 * feed of timestamped updates (newest-first), and the site footer. Structure only — every
 * slot's content is supplied by the consumer (typically real `LiveBlogEntry` instances with
 * sample or CMS-driven copy in the `.stories.tsx`/real app).
 */
export const LiveBlog = forwardRef<HTMLDivElement, LiveBlogProps>(
  (
    { header, footer, breakingNewsBanner, pageHeader, feedStatus, entries, className, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-screen flex-col bg-surface-canvas", className)}
        {...rest}
      >
        <GlobalHeader {...header} />
        {breakingNewsBanner}
        <main className="flex-1">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <div>{pageHeader}</div>
            {feedStatus ? (
              <div className="flex flex-wrap items-center gap-2 border-y border-surface-border py-3 text-small text-text-secondary">
                {feedStatus}
              </div>
            ) : null}
            <div
              role="feed"
              aria-label="Live updates, newest first"
              aria-busy="false"
              className="flex flex-col gap-6"
            >
              {entries}
            </div>
          </div>
        </main>
        <Footer {...footer} />
      </div>
    );
  },
);
LiveBlog.displayName = "LiveBlog";
