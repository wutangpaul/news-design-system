import { forwardRef, useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Image } from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Tag } from "@/components/Tag";

/** A single personalized story recommendation. */
export interface RecommendedArticle {
  /** Unique id, used as the React list key. */
  id: string;
  /** Article headline. */
  headline: string;
  /** Destination URL for the full article. */
  href: string;
  /** Thumbnail image URL. */
  thumbnailSrc: string;
  /** Accessible alt text for the thumbnail. */
  thumbnailAlt: string;
  /** Editorial section/category label, rendered as a `Tag`. */
  category: string;
}

export interface RecommendedArticlesProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section heading. @default "Recommended for you" */
  title?: string;
  /** Recommended stories, in display order. */
  articles: RecommendedArticle[];
}

/**
 * Personalized "recommended for you" grid of story summaries. Structurally
 * similar to a "related articles" rail, but framed around the reader's
 * inferred interests rather than "more on this specific story" — so it takes
 * a flat `articles` list with no notion of a current/source article.
 *
 * Renders a minimal, self-contained story-summary card (thumbnail + category
 * tag + headline) composed from `Card`, `Image`, `Tag`, and `Heading` rather
 * than depending on any other pattern's card implementation.
 */
export const RecommendedArticles = forwardRef<HTMLElement, RecommendedArticlesProps>(
  ({ title = "Recommended for you", articles, className, ...rest }, ref) => {
    const headingId = useId();

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        className={cn("flex flex-col gap-4", className)}
        {...rest}
      >
        <Heading id={headingId} level={2} visualSize={4}>
          {title}
        </Heading>
        {articles.length === 0 ? (
          <p className="text-small text-text-secondary">
            No recommendations available right now.
          </p>
        ) : (
          /* role="list" restores list semantics Safari/VoiceOver otherwise strip from a `ul`
              once it has `display: grid`/`flex` — a deliberate a11y fix, not redundant. */
          /* eslint-disable-next-line jsx-a11y/no-redundant-roles */
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <li key={article.id}>
                <a
                  href={article.href}
                  className="block h-full rounded-lg focus-visible:outline-none"
                >
                  <Card variant="outlined" interactive className="h-full">
                    <Card.Body className="gap-3">
                      <Image
                        src={article.thumbnailSrc}
                        alt={article.thumbnailAlt}
                        aspectRatio="16/9"
                        containerClassName="rounded-md"
                      />
                      <Tag tone="brand">{article.category}</Tag>
                      <Heading level={3} visualSize={6}>
                        {article.headline}
                      </Heading>
                    </Card.Body>
                  </Card>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  },
);
RecommendedArticles.displayName = "RecommendedArticles";
