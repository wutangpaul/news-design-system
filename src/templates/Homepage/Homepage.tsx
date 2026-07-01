import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";

export interface HomepageProps extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  /**
   * Site chrome: props forwarded directly to `GlobalHeader`. The header itself is fixed
   * structure (every page gets one), but everything inside it — logo, navigation, search,
   * actions — stays whatever the consumer passes, since `GlobalHeaderProps` is itself
   * already slot-shaped.
   */
  header: GlobalHeaderProps;
  /** Site chrome: props forwarded directly to `Footer`. See `header` for why this isn't a slot. */
  footer: FooterProps;
  /**
   * Lead/hero story slot, rendered full-width above the featured grid. Typically a
   * `<HeroStory />` from `src/patterns/HeroStory`, but the template has no opinion on what
   * fills it.
   */
  hero: ReactNode;
  /**
   * Featured stories slot. Typically a `<FeaturedStoryGrid />` from
   * `src/patterns/FeaturedStoryGrid`. Given the wider (2 of 3 columns) column at `lg`+.
   */
  featured: ReactNode;
  /**
   * Secondary rail slot(s) — e.g. `<MostRead />` and/or `<Trending />` stacked together.
   * Pass more than one pattern as a fragment if you need several rails; the template only
   * renders whatever `ReactNode` it's given in the narrower (1 of 3 columns) column at
   * `lg`+. Omit entirely for a two-region page (hero + featured only).
   */
  sidebar?: ReactNode;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * The site's front page: fixed `GlobalHeader`/`Footer` chrome around three content slots
 * (`hero`, `featured`, `sidebar`). Structure only — every slot accepts a `ReactNode`, and the
 * template never decides what pattern fills it (see this folder's `.mdx` for the slot
 * contract and `.stories.tsx` for a realistic composed example).
 *
 * Responsive layout per `src/docs/foundations/GridLayout.mdx`: a single column on narrow
 * viewports, with `featured` and `sidebar` splitting into a 2:1 column grid at `lg`+ so the
 * featured area carries more visual weight than the rail.
 */
export const Homepage = forwardRef<HTMLDivElement, HomepageProps>(
  (
    { header, footer, hero, featured, sidebar, mainId = "main-content", className, ...rest },
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

        <main
          id={mainId}
          className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:gap-16 lg:px-8 lg:py-12"
        >
          <section aria-label="Top story">{hero}</section>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            <section aria-label="Featured stories" className="lg:col-span-2">
              {featured}
            </section>
            {sidebar ? (
              <aside aria-label="More stories" className="flex flex-col gap-10 lg:col-span-1">
                {sidebar}
              </aside>
            ) : null}
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
Homepage.displayName = "Homepage";
