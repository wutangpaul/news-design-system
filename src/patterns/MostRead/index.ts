export { MostRead } from "./MostRead";
export type { MostReadProps, MostReadItem } from "./MostRead";

// RankedList is the shared "numbered list of top stories" primitive underlying both
// Most Read and Trending (see each pattern's MDX). Re-exported here so Trending can
// import it via this folder's public surface (`../MostRead`) instead of reaching into
// a non-index file.
export { RankedList } from "./RankedList";
export type { RankedListProps, RankedListItem } from "./RankedList";
