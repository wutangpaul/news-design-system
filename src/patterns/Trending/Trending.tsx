import { forwardRef } from "react";
import { RankedList } from "@/patterns/MostRead";
import type { RankedListItem, RankedListProps } from "@/patterns/MostRead";

/** Content shape for a single Trending entry — an alias of the shared `RankedListItem`. */
export type TrendingItem = RankedListItem;

export interface TrendingProps extends Omit<RankedListProps, "title"> {
  /** Section heading. @default "Trending Now" */
  title?: string;
}

/**
 * Numbered "Trending Now" rail: rank number + headline, with an optional byline/timestamp
 * and (opt-in) thumbnail. Structurally identical to Most Read — both are thin wrappers
 * around the shared `RankedList` primitive that lives in `src/patterns/MostRead/RankedList.tsx`.
 * See this pattern's MDX (and Most Read's) for why the implementation is shared.
 */
export const Trending = forwardRef<HTMLElement, TrendingProps>(
  ({ title = "Trending Now", ...rest }, ref) => {
    return <RankedList ref={ref} title={title} {...rest} />;
  },
);
Trending.displayName = "Trending";
