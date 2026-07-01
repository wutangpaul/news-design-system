import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";

export interface PodcastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Site header configuration, forwarded as-is to `GlobalHeader`. The template composes
   * the header directly (it's chrome every page needs) rather than accepting it as a
   * slot — this prop only configures that fixed composition.
   */
  header: GlobalHeaderProps;
  /** Site footer configuration, forwarded as-is to `Footer`. See `header` above for why this isn't a slot. */
  footer: FooterProps;
  /**
   * Show-intro slot — artwork, title, and description of the podcast itself. Plain
   * `ReactNode` so the caller can build it from whatever fits (an `Image` + `Heading` +
   * `Text` stack, or a fuller card treatment); no existing pattern is a dedicated
   * "podcast show" card, so this isn't forced through one.
   */
  showIntro: ReactNode;
  /**
   * Episode list slot, typically a `<PodcastCards />` from `src/patterns/PodcastCards`.
   * The template has no opinion on how many episodes it renders or how they're sourced.
   */
  episodes: ReactNode;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * Podcast show/episode-listing page: a show-intro region (artwork, title, description)
 * alongside a scrollable list of episodes. Laid out as a 1:2 column split at `lg`+ — the
 * show intro sits in a narrower rail (it's identity/context, read once) while the episode
 * list gets the wider column (it's the part a returning listener scans repeatedly),
 * mirroring the asymmetric-column rationale `Homepage` uses for its hero/rail split.
 *
 * Structure only — `showIntro` and `episodes` accept a `ReactNode` each, and the template
 * never decides what pattern or copy fills them (see this folder's `.mdx` for the slot
 * contract and `.stories.tsx` for a realistic composed example).
 */
export const Podcast = forwardRef<HTMLDivElement, PodcastProps>(
  ({ header, footer, showIntro, episodes, mainId = "main-content", className, ...rest }, ref) => {
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
          className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            <section aria-label="About this podcast" className="lg:col-span-1">
              {showIntro}
            </section>
            <section aria-label="Episodes" className="lg:col-span-2">
              {episodes}
            </section>
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
Podcast.displayName = "Podcast";
