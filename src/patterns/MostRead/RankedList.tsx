import { forwardRef, useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Image } from "@/components/Image";
import { Heading, type HeadingProps } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";

/**
 * Content shape for a single entry in a ranked list. Deliberately similar to Story
 * Card's `StoryCardContent`, but without the `dek`/`category` fields — ranked lists
 * (Most Read, Trending) are a denser treatment than a full Story Card.
 */
export interface RankedListItem {
  /** Headline text. */
  headline: string;
  /** Destination URL. Omit to render the headline as plain (non-interactive) text. */
  href?: string;
  /** Byline, e.g. `"By Jane Doe"`. */
  byline?: string;
  /** Human-readable published/updated time, e.g. `"3 hours ago"`. */
  timestamp?: string;
  /** Machine-readable ISO 8601 datetime for the rendered `<time>` element. */
  timestampDateTime?: string;
  /** Optional thumbnail, only rendered when the list is created with `showImages`. */
  imageSrc?: string;
  /** Describes the thumbnail for assistive tech. Ignored when `imageSrc` is omitted. */
  imageAlt?: string;
}

export interface RankedListProps extends HTMLAttributes<HTMLElement> {
  /** Section label, e.g. `"Most Read"` or `"Trending Now"`. */
  title: string;
  /** Optional supporting text under the title, e.g. `"Past 24 hours"`. */
  subtitle?: string;
  /** The ranked items, in display order. Rank numbers are derived from array position. */
  items: RankedListItem[];
  /** Semantic heading level for `title`. @default 2 */
  headingLevel?: HeadingProps["level"];
  /** Show a small thumbnail per item when it provides `imageSrc`. @default false */
  showImages?: boolean;
}

/**
 * Shared "numbered list of top stories" primitive underlying both Most Read and
 * Trending — see either pattern's MDX for why the two share this implementation
 * instead of duplicating the same markup. Not a Story Card composition: ranked lists
 * are intentionally a simpler, denser treatment (rank number + headline + optional
 * byline/timestamp, image only on request).
 */
export const RankedList = forwardRef<HTMLElement, RankedListProps>(
  (
    { title, subtitle, items, headingLevel = 2, showImages = false, className, ...rest },
    ref,
  ) => {
    const headingId = useId();
    const itemHeadingLevel = (Math.min(headingLevel + 1, 6) as HeadingProps["level"]) ?? 3;

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        className={cn("flex flex-col gap-4", className)}
        {...rest}
      >
        <div className="flex flex-col gap-1">
          <Heading id={headingId} level={headingLevel} visualSize={5} weight="bold">
            {title}
          </Heading>
          {subtitle ? (
            <Text size="caption" color="tertiary">
              {subtitle}
            </Text>
          ) : null}
        </div>
        <ol className="flex flex-col divide-y divide-surface-border">
          {items.map((item, index) => {
            const rank = index + 1;
            const hasMeta = Boolean(item.byline || item.timestamp);

            return (
              <li
                key={item.href ?? `${item.headline}-${index}`}
                className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
              >
                <Text
                  as="span"
                  aria-hidden="true"
                  size="lead"
                  weight="bold"
                  color="tertiary"
                  className="w-8 shrink-0 font-serif tabular-nums"
                >
                  {rank}
                </Text>
                {showImages && item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt ?? ""}
                    aspectRatio="1/1"
                    containerClassName="w-14 shrink-0 rounded-md"
                  />
                ) : null}
                <div className="flex min-w-0 flex-col gap-1">
                  <Heading
                    level={itemHeadingLevel}
                    visualSize={6}
                    weight="semibold"
                    className="line-clamp-2"
                  >
                    {item.href ? (
                      <Link href={item.href} tone="standalone">
                        {item.headline}
                      </Link>
                    ) : (
                      item.headline
                    )}
                  </Heading>
                  {hasMeta ? (
                    <div className="flex flex-wrap items-center gap-x-2 font-mono text-caption text-text-tertiary">
                      {item.byline ? <span>{item.byline}</span> : null}
                      {item.byline && item.timestamp ? (
                        <span aria-hidden="true">&middot;</span>
                      ) : null}
                      {item.timestamp ? (
                        <time dateTime={item.timestampDateTime}>{item.timestamp}</time>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    );
  },
);
RankedList.displayName = "RankedList";
