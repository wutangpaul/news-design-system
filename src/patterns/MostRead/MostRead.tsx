import { forwardRef } from "react";
import { RankedList } from "./RankedList";
import type { RankedListItem, RankedListProps } from "./RankedList";

/** Content shape for a single Most Read entry — an alias of the shared `RankedListItem`. */
export type MostReadItem = RankedListItem;

export interface MostReadProps extends Omit<RankedListProps, "title"> {
  /** Section heading. @default "Most Read" */
  title?: string;
}

/**
 * Numbered "Most Read" rail: rank number + headline, with an optional byline/timestamp
 * and (opt-in) thumbnail. Thin wrapper around `RankedList` — see this pattern's MDX for
 * why Most Read and Trending share that implementation.
 */
export const MostRead = forwardRef<HTMLElement, MostReadProps>(
  ({ title = "Most Read", ...rest }, ref) => {
    return <RankedList ref={ref} title={title} {...rest} />;
  },
);
MostRead.displayName = "MostRead";
