import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { StoryCard, type StoryCardContent } from "@/patterns/StoryCard";
import type { HeadingProps } from "@/components/Heading";

/**
 * A single grid item's content. Extends `StoryCardContent` (Story Card's own content
 * shape) with the one field this pattern adds: whether the item should span a larger
 * area of the grid (e.g. a homepage lead story).
 */
export interface FeaturedStoryGridItem extends StoryCardContent {
  /**
   * Marks this item as the lead/featured story: it spans 2 grid columns at `sm`+ and
   * renders with a larger visual headline size. Mark at most one item per grid `true`
   * for the conventional "one big lead story" layout — the component does not enforce
   * this, so marking several is possible but will produce several enlarged tiles.
   */
  featured?: boolean;
}

export interface FeaturedStoryGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The stories to render, in display order. Not required while `loading` is set — see
   * `loadingCount`.
   */
  stories?: FeaturedStoryGridItem[];
  /**
   * Semantic heading level applied to every card's headline. Kept as a single value
   * (not per-item) so the grid always produces a consistent, correct document outline —
   * see Story Card's MDX ("Semantic level vs. visual size").
   * @default 3
   */
  headingLevel?: HeadingProps["level"];
  /**
   * When `true`, renders `loadingCount` loading `StoryCard`s (see its own `loading` prop)
   * in place of `stories` — no real data is required yet. Use this while the actual
   * stories for this grid are still being fetched.
   * @default false
   */
  loading?: boolean;
  /**
   * Number of loading placeholder cards to render when `loading` is `true`. Ignored
   * otherwise.
   * @default 6
   */
  loadingCount?: number;
}

/**
 * Responsive grid of Story Cards for homepage/section-front layouts, built on Tailwind's
 * grid utilities directly (per `src/docs/foundations/GridLayout.mdx` — no custom 12-column
 * abstraction). One item may opt into spanning 2 columns via `featured` for a lead story.
 */
export const FeaturedStoryGrid = forwardRef<HTMLDivElement, FeaturedStoryGridProps>(
  ({ stories, headingLevel = 3, loading = false, loadingCount = 6, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role={loading ? "status" : undefined}
        aria-live={loading ? "polite" : undefined}
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <>
            <span className="sr-only">Loading stories…</span>
            {Array.from({ length: loadingCount }, (_, index) => (
              <StoryCard key={`loading-${index}`} loading layout="vertical" />
            ))}
          </>
        ) : (
          (stories ?? []).map((story, index) => (
            <StoryCard
              key={story.href ?? `${story.headline}-${index}`}
              story={story}
              layout="vertical"
              headingLevel={headingLevel}
              // Regular tiles sit in a 1-of-3 column (~280px at lg): StoryCard's default
              // visual size 4 sets one word per line there, so step down to 5. The featured
              // card spans 2 columns and can carry the bigger size.
              headingVisualSize={story.featured ? 3 : 5}
              imageAspectRatio={story.featured ? "16/9" : undefined}
              className={cn(story.featured && "sm:col-span-2")}
            />
          ))
        )}
      </div>
    );
  },
);
FeaturedStoryGrid.displayName = "FeaturedStoryGrid";
