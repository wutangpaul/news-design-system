import { forwardRef, useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Heading } from "@/components/Heading";
import { Image } from "@/components/Image";
import { Tag } from "@/components/Tag";
import { Link } from "@/components/Link";

type RelatedArticlesHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Content shape for a single "you might also like" summary. */
export interface RelatedArticle {
  /** Stable key for the list item — doesn't need to be visible content. */
  id: string;
  /** Destination URL for the article. */
  href: string;
  /** Headline. */
  title: string;
  /** Thumbnail image source. */
  imageSrc: string;
  /** Alt text for the thumbnail — required, forwarded to `Image`. */
  imageAlt: string;
  /** Optional category/topic label, rendered as a small `Tag` above the headline. */
  category?: string;
}

export interface RelatedArticlesProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Section heading text. @default "You might also like" */
  heading?: string;
  /**
   * Semantic level for the section heading — set it to fit the surrounding
   * document outline (this section usually follows the article body, so a
   * heading level under the article's own `h1` is typical). @default 2
   */
  headingLevel?: RelatedArticlesHeadingLevel;
  /** The article summaries to display. */
  articles: RelatedArticle[];
}

/**
 * Compact "you might also like" list at the end of an article — headline,
 * thumbnail, and an optional category tag per item.
 *
 * This deliberately renders minimal, bespoke markup per item (`Image` +
 * `Tag` + `Heading` wrapped in a `Link`) rather than a full-featured reusable
 * card component. A "Story Card" pattern covering the general
 * image+category+headline+byline card shape may be built separately (see the
 * Content Discovery pattern group) — once both exist, a future integration
 * pass should consider having `RelatedArticles` render `Story Card` instead
 * of its own markup, to avoid two parallel implementations of the same
 * visual unit drifting apart. Until then, keeping this pattern's own
 * rendering intentionally small limits the blast radius of that duplication.
 */
export const RelatedArticles = forwardRef<HTMLElement, RelatedArticlesProps>(
  (
    { heading = "You might also like", headingLevel = 2, articles, className, ...rest },
    ref,
  ) => {
    const headingId = useId();
    // Each card's own headline is one level under the section heading, never
    // fixed at a specific number — a fixed level would skip levels (and trip
    // axe-core's heading-order rule) whenever a consumer sets headingLevel
    // higher than 3, since heading levels must never jump by more than one.
    const itemHeadingLevel = (Math.min(headingLevel + 1, 6) as RelatedArticlesHeadingLevel);

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        className={cn("flex flex-col gap-6", className)}
        {...rest}
      >
        <Heading id={headingId} level={headingLevel}>
          {heading}
        </Heading>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={article.href}
                tone="standalone"
                className="group flex flex-col gap-3 no-underline hover:no-underline"
              >
                <Image
                  src={article.imageSrc}
                  alt={article.imageAlt}
                  aspectRatio="16/9"
                  containerClassName="rounded-md"
                  className="transition-transform duration-slower motion-reduce:transition-none group-hover:scale-105"
                />
                {article.category ? (
                  <Tag tone="brand" className="w-fit">
                    {article.category}
                  </Tag>
                ) : null}
                <Heading
                  level={itemHeadingLevel}
                  visualSize={5}
                  className="group-hover:text-masthead-600 group-hover:underline"
                >
                  {article.title}
                </Heading>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  },
);
RelatedArticles.displayName = "RelatedArticles";
