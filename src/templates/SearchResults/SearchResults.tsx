import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { EmptyState } from "@/components/EmptyState";

export interface SearchResultsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Props forwarded straight through to the site's `GlobalHeader`, rendered as page chrome.
   * Pass a `search` slot (typically `<SearchExperience defaultValue={query} .../>`) so the
   * current query stays visible/editable from this page too.
   */
  header: GlobalHeaderProps;
  /** Props forwarded straight through to the site's `Footer`, rendered as page chrome. */
  footer: FooterProps;
  /**
   * The search query this page is showing results for. A plain string (not a `ReactNode`
   * slot) because the template itself renders the results-summary sentence and the built-in
   * empty state from it — but the string always comes from the consumer, never hardcoded here.
   */
  query: string;
  /**
   * Total number of matching results. Drives both the "N results for ..." summary text and
   * the decision of whether to render `resultsList` or the empty state.
   */
  resultCount: number;
  /**
   * The results list slot — typically a column of `StoryCard`s. Only rendered when
   * `resultCount` is greater than 0.
   */
  resultsList?: ReactNode;
  /**
   * Pagination controls slot for the results list, typically a `<Pagination />` instance
   * wired to page-level data-fetching state. The template owns no paging logic itself; it
   * only renders whatever control is passed in, and only alongside a non-empty results list.
   */
  pagination?: ReactNode;
  /**
   * Optional override for the zero-results state. When omitted and `resultCount` is `0`, the
   * template renders a built-in empty state referencing `query`. Deciding *whether* to show
   * `resultsList` or an empty state is a structural/layout call this template makes based on
   * `resultCount` — but the empty state's actual content can still be fully replaced here.
   */
  emptyState?: ReactNode;
}

function DefaultEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      role="status"
      className="bg-surface-sunken"
      iconVariant="search"
      heading="No results found"
      description={
        query
          ? `We couldn't find any stories matching "${query}". Try different or fewer keywords.`
          : "Try searching for a topic, story, or author."
      }
    />
  );
}

/**
 * A query results page: site chrome (`GlobalHeader`/`Footer`) wrapped around a results
 * summary, the matching results list, pagination, and a deliberate empty state when there are
 * zero matches. Structure only — the query string, result count, results list, and pagination
 * controls are all supplied by the consumer through this template's slots/props.
 */
export const SearchResults = forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      header,
      footer,
      query,
      resultCount,
      resultsList,
      pagination,
      emptyState,
      className,
      ...rest
    },
    ref,
  ) => {
    const hasResults = resultCount > 0;
    const resultWord = resultCount === 1 ? "result" : "results";
    const summary = query
      ? `${resultCount} ${resultWord} for "${query}"`
      : `${resultCount} ${resultWord}`;

    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <GlobalHeader {...header} />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Heading level={1} visualSize={3}>
              Search results
            </Heading>
            <Text size="body" color="secondary" className="mt-2">
              {summary}
            </Text>

            {hasResults ? (
              <>
                <div className="mt-8 flex flex-col gap-6">{resultsList}</div>
                {pagination && <div className="mt-10 flex justify-center">{pagination}</div>}
              </>
            ) : (
              <div className="mt-8">{emptyState ?? <DefaultEmptyState query={query} />}</div>
            )}
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
SearchResults.displayName = "SearchResults";
