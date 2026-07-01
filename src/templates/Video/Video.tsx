import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";

export interface VideoProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Site header configuration, forwarded as-is to `GlobalHeader`. The template composes
   * the header directly (it's chrome every page needs) rather than accepting it as a
   * slot — this prop only configures that fixed composition.
   */
  header: GlobalHeaderProps;
  /** Site footer configuration, forwarded as-is to `Footer`. See `header` above for why this isn't a slot. */
  footer: FooterProps;
  /**
   * Featured/hero video slot, rendered full-width above the grid — typically a larger,
   * single-video treatment (bigger thumbnail, headline, dek) built from `Card`/`Image`
   * directly by the caller, since no existing pattern is a dedicated "hero video" card.
   */
  featured: ReactNode;
  /**
   * The rest of the section's videos, typically a `<VideoCards />` from
   * `src/patterns/VideoCards`. The template has no opinion on how many videos it renders
   * or how they're sourced.
   */
  videos: ReactNode;
  /**
   * Optional grouping slot for named video series/collections, e.g. a
   * `<TopicCollections />` per series. Omit for a single flat grid with no sub-grouping.
   */
  collections?: ReactNode;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * Video section/hub page: a full-width featured video above a grid of the rest of the
 * section's videos, with an optional area for named series/collections further down.
 * Structurally close to `Homepage` (fixed chrome + full-width `max-w-7xl` container) but
 * with a single-column flow rather than a hero/rail split — a video hub has one primary
 * scanning path (featured, then everything else) rather than competing hero and sidebar
 * regions.
 *
 * Structure only — every content slot accepts a `ReactNode`, and the template never decides
 * what pattern fills it (see this folder's `.mdx` for the slot contract and `.stories.tsx`
 * for a realistic composed example).
 */
export const Video = forwardRef<HTMLDivElement, VideoProps>(
  (
    { header, footer, featured, videos, collections, mainId = "main-content", className, ...rest },
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
          className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 py-8 sm:px-6 lg:gap-16 lg:px-8 lg:py-12"
        >
          <section aria-label="Featured video">{featured}</section>

          <section aria-label="More videos">{videos}</section>

          {collections ? (
            <section aria-label="Video series" className="flex flex-col gap-10">
              {collections}
            </section>
          ) : null}
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
Video.displayName = "Video";
