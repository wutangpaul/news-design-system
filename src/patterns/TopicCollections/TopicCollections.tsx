import { forwardRef, useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Image } from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Tag } from "@/components/Tag";

/** A single story curated under a topic collection. */
export interface TopicCollectionArticle {
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
  /** Optional secondary label (e.g. "Analysis", "Opinion", a dateline) shown as a `Tag`. */
  label?: string;
}

export interface TopicCollectionsProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Name of the topic/theme, e.g. "2026 Midterms: Full Coverage". */
  topic: string;
  /** Optional supporting description/dek for the collection. */
  description?: string;
  /** Stories curated under this topic, in display order. */
  articles: TopicCollectionArticle[];
}

/**
 * A curated collection of stories grouped under a named editorial topic or
 * theme (e.g. "2026 Midterms: Full Coverage"). Similar visual treatment to a
 * front-page featured grid, but framed around a persistent topic rather than
 * a moment in time — the heading names the topic, not "Top Stories" or a
 * date.
 *
 * Renders a minimal, self-contained story-summary card (thumbnail + optional
 * label tag + headline) composed from `Card`, `Image`, `Tag`, and `Heading`.
 */
export const TopicCollections = forwardRef<HTMLElement, TopicCollectionsProps>(
  ({ topic, description, articles, className, ...rest }, ref) => {
    const headingId = useId();

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        className={cn("flex flex-col gap-4", className)}
        {...rest}
      >
        <div className="flex flex-col gap-1">
          <Heading id={headingId} level={2} visualSize={3}>
            {topic}
          </Heading>
          {description ? (
            <Text size="body" color="secondary">
              {description}
            </Text>
          ) : null}
        </div>
        {articles.length === 0 ? (
          <p className="text-small text-text-secondary">
            No stories have been added to this collection yet.
          </p>
        ) : (
          /* role="list" restores list semantics Safari/VoiceOver otherwise strip from a `ul`
              once it has `display: grid`/`flex` — a deliberate a11y fix, not redundant. */
          /* eslint-disable-next-line jsx-a11y/no-redundant-roles */
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      {article.label ? <Tag tone="neutral">{article.label}</Tag> : null}
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
TopicCollections.displayName = "TopicCollections";
