import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";

export interface CategoryLandingProps extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  /**
   * Site chrome: props forwarded directly to `GlobalHeader`. See `Homepage`'s MDX for why
   * this is typed as the pattern's own props rather than a bare `ReactNode` slot.
   */
  header: GlobalHeaderProps;
  /** Site chrome: props forwarded directly to `Footer`. */
  footer: FooterProps;
  /**
   * The section's display name, e.g. `"Politics"` or `"Business"`. Rendered as the page's
   * own `<h1>` — genuinely just text, so it's a plain prop rather than a `ReactNode` slot
   * (there's no pattern to compose here).
   */
  categoryName: string;
  /** Optional one-line description of the section, shown under the heading. */
  description?: ReactNode;
  /**
   * Section-jump navigation slot, typically a `<CategoryNavigation />` from
   * `src/patterns/CategoryNavigation`, rendered near the top so readers can jump to
   * sibling sections (World, Business, Culture, etc.) without a full round trip through
   * the header.
   */
  categoryNavigation: ReactNode;
  /**
   * The category's own lead/featured story slot, typically a `<StoryCard />` or
   * `<HeroStory />` sized up for this section front.
   */
  featured: ReactNode;
  /**
   * The remaining stories in this category, typically a `<FeaturedStoryGrid />` or a list
   * of `<StoryCard />`s.
   */
  stories: ReactNode;
  /**
   * Optional pagination control rendered below `stories`, typically a `<Pagination />`
   * from `src/components/Pagination`. Omit for a simple, non-paginated listing.
   */
  pagination?: ReactNode;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * A section-front page (e.g. "Politics", "Business"): fixed `GlobalHeader`/`Footer` chrome,
 * a `categoryNavigation` slot for jumping to sibling sections, a plain-text `categoryName`
 * heading, and two content slots (`featured`, `stories`) plus optional `pagination`. Like
 * `Homepage`, this is structure only — see this folder's `.mdx` for the slot contract and
 * `.stories.tsx` for a realistic composed example.
 */
export const CategoryLanding = forwardRef<HTMLDivElement, CategoryLandingProps>(
  (
    {
      header,
      footer,
      categoryName,
      description,
      categoryNavigation,
      featured,
      stories,
      pagination,
      mainId = "main-content",
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <a
          href={`#${mainId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-tooltip focus:rounded-md focus:bg-surface-canvas focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-text-primary focus:shadow-md"
        >
          Skip to main content
        </a>

        <GlobalHeader {...header} />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{categoryNavigation}</div>

        <main
          id={mainId}
          className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="flex flex-col gap-2">
            <Heading level={1} visualSize="display">
              {categoryName}
            </Heading>
            {description ? (
              <p className="max-w-[65ch] font-sans text-lead text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>

          <section aria-label={`Featured in ${categoryName}`}>{featured}</section>

          <section aria-label={`More in ${categoryName}`} className="flex flex-col gap-6">
            {stories}
            {pagination}
          </section>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
CategoryLanding.displayName = "CategoryLanding";
