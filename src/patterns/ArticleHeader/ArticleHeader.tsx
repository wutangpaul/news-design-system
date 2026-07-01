import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

export interface ArticleHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  /**
   * The article's headline. Rendered as a real `h1` — this pattern sits at the top of
   * an article page, so its heading is the page's own title, not a secondary heading.
   */
  title: ReactNode;
  /** Optional standfirst/deck copy summarizing the piece, shown below the headline. */
  standfirst?: ReactNode;
  /**
   * Composition slot for byline/metadata (author name, avatar, publish date, read
   * time, etc.), rendered below the standfirst. `ArticleHeader` intentionally does not
   * build byline markup itself — Byline is a separate pattern built independently, so
   * this just accepts its rendered output (or any other node) as-is.
   */
  byline?: ReactNode;
}

/**
 * Top-of-article block: headline, optional standfirst/deck, and a composition slot for
 * byline/metadata. Renders a real `<header>` with a real `h1` — use once per article
 * page, at the top of the document outline.
 */
export const ArticleHeader = forwardRef<HTMLElement, ArticleHeaderProps>(
  ({ title, standfirst, byline, className, ...rest }, ref) => {
    return (
      <header ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>
        <Heading level={1} visualSize="display">
          {title}
        </Heading>
        {standfirst ? (
          <Text as="p" size="lead" color="secondary">
            {standfirst}
          </Text>
        ) : null}
        {byline ? <div>{byline}</div> : null}
      </header>
    );
  },
);
ArticleHeader.displayName = "ArticleHeader";
