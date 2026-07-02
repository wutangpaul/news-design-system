import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { EmptyState } from "@/components/EmptyState";

export interface ArchiveProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Props forwarded to the site-wide `GlobalHeader` chrome (logo, nav, search, actions). */
  header: GlobalHeaderProps;
  /** Props forwarded to the site-wide `Footer` chrome (link groups, social, legal). */
  footer: FooterProps;
  /**
   * The archive's own page title, e.g. `"Politics"` or `"March 2026 archive"`. Rendered as the
   * page's single `<h1>`. Content-only string rather than a `ReactNode` slot, since it plays a
   * fixed structural role (the page heading) rather than being an arbitrary composed pattern.
   */
  title: string;
  /** Optional supporting copy under the title, e.g. a date-range or section description. */
  description?: ReactNode;
  /**
   * Filter/date-range controls slot — a page-specific concern (date picker, section filter
   * form, etc.) outside this design system's current component set, so Archive only reserves
   * space for it rather than building filter UI itself.
   */
  filters?: ReactNode;
  /**
   * The story listing itself, typically a grid/list of `StoryCard`s (e.g. a
   * `FeaturedStoryGrid`) built by the consumer. Omit or pass `null`/`undefined` together with
   * `isEmpty` to show the template's built-in empty state instead.
   */
  listing?: ReactNode;
  /**
   * When `true`, Archive renders its own empty state ("No stories found for this range")
   * instead of the `listing` slot — this is a real structural state every archive/filtered
   * listing page needs to handle consistently, so it's the template's own responsibility
   * rather than left to each consumer to reimplement.
   * @default false
   */
  isEmpty?: boolean;
  /** Heading shown in the built-in empty state. @default "No stories found" */
  emptyStateTitle?: string;
  /** Supporting copy shown in the built-in empty state. */
  emptyStateDescription?: ReactNode;
  /**
   * Pagination slot — typically a `<Pagination />` from `src/components/Pagination` wired up
   * to the consumer's current page/page count/page-change handler. Hidden automatically
   * whenever `isEmpty` is set, since there's nothing to page through.
   */
  pagination?: ReactNode;
}

/**
 * Date/filter-driven listing page: site chrome, a page title + optional description, an
 * optional filter/date-range controls slot, the story listing itself (or a built-in empty
 * state), and pagination. Structure-only — Archive never decides what fills `listing` or
 * `filters`, it only arranges them ("Browse articles from March 2026", "All Politics coverage
 * since 2020", etc. are all the same shape).
 */
export const Archive = forwardRef<HTMLDivElement, ArchiveProps>(
  (
    {
      header,
      footer,
      title,
      description,
      filters,
      listing,
      isEmpty = false,
      emptyStateTitle = "No stories found",
      emptyStateDescription = "Try a different date range or filter — nothing published matches this one.",
      pagination,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <GlobalHeader {...header} />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              <Heading level={1} visualSize="display">
                {title}
              </Heading>
              {description ? (
                <Text size="lead" color="secondary" className="max-w-2xl">
                  {description}
                </Text>
              ) : null}
            </div>

            {filters ? (
              <div className="mt-8 border-b border-surface-border pb-8">{filters}</div>
            ) : null}

            <div className="mt-8">
              {isEmpty ? (
                <EmptyState
                  className="py-20"
                  iconVariant="calendar"
                  heading={emptyStateTitle}
                  description={emptyStateDescription}
                />
              ) : (
                listing
              )}
            </div>

            {!isEmpty && pagination ? (
              <div className="mt-10 flex justify-center">{pagination}</div>
            ) : null}
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
Archive.displayName = "Archive";
