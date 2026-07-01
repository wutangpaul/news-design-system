import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";

export interface AuthorProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Props forwarded straight through to the site's `GlobalHeader`, rendered as page chrome.
   * Every real page needs the header, so it's composed directly rather than accepted as a
   * pre-built `ReactNode` slot — but its own content (logo, navigation, search, actions) still
   * flows in from here rather than being hardcoded by this template.
   */
  header: GlobalHeaderProps;
  /** Props forwarded straight through to the site's `Footer`, rendered as page chrome. */
  footer: FooterProps;
  /**
   * The author bio/intro slot. Typically a larger `AuthorCard` placement — pass
   * `headingLevel={1}` on it, since the author's name is this page's main heading.
   */
  authorIntro: ReactNode;
  /**
   * The author's story list slot — typically a `FeaturedStoryGrid` or a manually arranged
   * grid/list of `StoryCard`s for this author's bylined stories. This template has no opinion
   * on which; it only reserves the layout region below the author intro.
   */
  storyList: ReactNode;
  /**
   * Pagination controls slot for the story list, typically a `<Pagination />` instance wired
   * to page-level data-fetching state (current page, total pages, fetch-on-change). Omit
   * entirely for authors with few enough stories that pagination isn't needed. The template
   * owns no paging logic itself — it only reserves layout space below the story list and
   * renders whatever pagination control the consumer passes in.
   */
  pagination?: ReactNode;
}

/**
 * A journalist's bio/archive page: site chrome (`GlobalHeader`/`Footer`) wrapped around a
 * prominent author intro and that author's story list, with an optional pagination slot below
 * it. Structure only — every piece of real content (the author's bio, their stories, the page
 * numbers) is supplied by the consumer through this template's slots.
 */
export const AuthorProfile = forwardRef<HTMLDivElement, AuthorProfileProps>(
  ({ header, footer, authorIntro, storyList, pagination, className, ...rest }, ref) => {
    const storiesHeadingId = useId();

    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <GlobalHeader {...header} />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section aria-label="About the author">{authorIntro}</section>

            <section aria-labelledby={storiesHeadingId} className="mt-12">
              <Heading id={storiesHeadingId} level={2} visualSize={5} className="mb-6">
                Latest stories
              </Heading>
              <div className="flex flex-col gap-6">{storyList}</div>
              {pagination && <div className="mt-10 flex justify-center">{pagination}</div>}
            </section>
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
AuthorProfile.displayName = "AuthorProfile";
