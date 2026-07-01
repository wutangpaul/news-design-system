import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Image, type ImageAspectRatio } from "@/components/Image";
import { Heading, type HeadingProps } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Tag } from "@/components/Tag";

/** Visual arrangement of the thumbnail relative to the text content. */
export type StoryCardLayout = "vertical" | "horizontal";

/**
 * Content shape for a single story summary. Intentionally flat and generic —
 * this is the shape other content-discovery patterns (Featured Story Grid,
 * Related Articles, etc.) reuse when they compose Story Card, so avoid
 * layering pattern-specific fields (e.g. a rank number) onto it.
 */
export interface StoryCardContent {
  /** Headline text, rendered as the card's `Heading`. */
  headline: string;
  /** Destination URL. When present, the whole card becomes a link. */
  href?: string;
  /** Optional supporting summary/dek copy shown below the headline. */
  dek?: string;
  /** Optional category/section label rendered as a `Tag` above the headline. */
  category?: string;
  /** Thumbnail image URL. Omit to render a text-only card. */
  imageSrc?: string;
  /** Describes the thumbnail for assistive tech. Ignored when `imageSrc` is omitted. */
  imageAlt?: string;
  /** Byline, e.g. `"By Jane Doe"`. */
  byline?: string;
  /** Human-readable published/updated time, e.g. `"3 hours ago"`. */
  timestamp?: string;
  /** Machine-readable ISO 8601 datetime for the rendered `<time>` element. */
  timestampDateTime?: string;
}

export interface StoryCardProps extends Omit<HTMLAttributes<HTMLElement>, "id"> {
  /** The story summary content to render. */
  story: StoryCardContent;
  /**
   * `"vertical"` stacks the thumbnail above the text (grid/section-front
   * tiles); `"horizontal"` places it beside the text (compact lists/rails).
   * @default "vertical"
   */
  layout?: StoryCardLayout;
  /**
   * Semantic heading level for the headline (`<h1>`-`<h6>`). Keep this
   * consistent across every card in a given grid/list (commonly `3`)
   * regardless of each card's visual size — see `headingVisualSize`.
   * @default 3
   */
  headingLevel?: HeadingProps["level"];
  /**
   * Visual size of the headline, decoupled from `headingLevel` (see
   * `Heading`'s own `visualSize` prop). Defaults to a size appropriate for
   * the chosen `layout` (larger for vertical tiles, smaller for compact
   * horizontal rows).
   */
  headingVisualSize?: HeadingProps["visualSize"];
  /** Aspect ratio crop applied to the thumbnail. Defaults to a sensible ratio per `layout`. */
  imageAspectRatio?: ImageAspectRatio;
}

const DEFAULT_VISUAL_SIZE: Record<StoryCardLayout, HeadingProps["visualSize"]> = {
  vertical: 4,
  horizontal: 5,
};

const DEFAULT_ASPECT_RATIO: Record<StoryCardLayout, ImageAspectRatio> = {
  vertical: "3/2",
  horizontal: "1/1",
};

/**
 * The foundational content-discovery unit: thumbnail + category tag +
 * headline + optional dek + byline/timestamp. Composes `Card`, `Image`,
 * `Heading`, `Tag`, and `Text` rather than hand-rolled markup.
 *
 * When `story.href` is set, the entire card (including the dek and meta
 * row) is wrapped in a single `<a>`, mirroring the pattern documented in
 * Card's own MDX ("Interactive cards") — Card supplies only the hover/focus
 * affordance, the surrounding link owns click/keyboard behavior.
 */
export const StoryCard = forwardRef<HTMLElement, StoryCardProps>(
  (
    {
      story,
      layout = "vertical",
      headingLevel = 3,
      headingVisualSize,
      imageAspectRatio,
      className,
      ...rest
    },
    ref,
  ) => {
    const {
      headline,
      href,
      dek,
      category,
      imageSrc,
      imageAlt,
      byline,
      timestamp,
      timestampDateTime,
    } = story;

    const visualSize = headingVisualSize ?? DEFAULT_VISUAL_SIZE[layout];
    const resolvedAspectRatio = imageAspectRatio ?? DEFAULT_ASPECT_RATIO[layout];
    const hasMeta = Boolean(byline || timestamp);

    const cardContent = (
      <Card
        as={href ? undefined : "article"}
        variant="outlined"
        interactive={Boolean(href)}
        padding={layout === "horizontal" ? "compact" : "comfortable"}
        className={cn(
          "h-full overflow-hidden",
          layout === "horizontal" ? "flex flex-row items-stretch gap-4" : "flex flex-col",
          className,
        )}
        {...rest}
      >
        {imageSrc ? (
          <div
            className={cn(
              "shrink-0",
              layout === "horizontal" ? "w-24 sm:w-32" : "w-full",
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt ?? ""}
              aspectRatio={resolvedAspectRatio}
              containerClassName="h-full"
            />
          </div>
        ) : null}
        <Card.Body className="min-w-0 flex-1 gap-2">
          {category ? (
            <Tag tone="brand" className="self-start">
              {category}
            </Tag>
          ) : null}
          <Heading
            level={headingLevel}
            visualSize={visualSize}
            weight="bold"
            className="line-clamp-3"
          >
            {headline}
          </Heading>
          {dek ? (
            <Text size="small" color="secondary" className="line-clamp-2">
              {dek}
            </Text>
          ) : null}
          {hasMeta ? (
            <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-text-tertiary">
              {byline ? <span>{byline}</span> : null}
              {byline && timestamp ? (
                <span aria-hidden="true">&middot;</span>
              ) : null}
              {timestamp ? (
                <time dateTime={timestampDateTime}>{timestamp}</time>
              ) : null}
            </div>
          ) : null}
        </Card.Body>
      </Card>
    );

    if (!href) {
      return cardContent;
    }

    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className="block h-full rounded-lg focus-visible:outline-none"
      >
        {cardContent}
      </a>
    );
  },
);
StoryCard.displayName = "StoryCard";
