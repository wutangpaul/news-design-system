import { forwardRef, type HTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Image, type ImageAspectRatio } from "@/components/Image";
import { Heading, type HeadingProps } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Tag } from "@/components/Tag";
import { Skeleton } from "@/components/Skeleton";

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
  /**
   * The story summary content to render. Required unless `loading` is `true` — a loading
   * card has no real content yet, so `story` may be omitted entirely in that case.
   */
  story?: StoryCardContent;
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
  /**
   * When `true`, renders a loading placeholder built from `Skeleton` — matching this
   * card's own image/headline/dek/meta areas for the chosen `layout` — instead of
   * `story`'s real content. `story` is ignored (and may be omitted) while `loading` is set.
   * @default false
   */
  loading?: boolean;
}

const DEFAULT_VISUAL_SIZE: Record<StoryCardLayout, HeadingProps["visualSize"]> = {
  vertical: 4,
  horizontal: 5,
};

const DEFAULT_ASPECT_RATIO: Record<StoryCardLayout, ImageAspectRatio> = {
  vertical: "3/2",
  horizontal: "1/1",
};

// Mirrors `Image`'s own static aspect-ratio class map (see its comment for why these are
// spelled out rather than built dynamically) so the loading skeleton's image placeholder
// takes up the same box the real thumbnail will occupy once it loads.
const ASPECT_RATIO_SKELETON_CLASSES: Record<ImageAspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-[1/1]",
  "9/16": "aspect-[9/16]",
  "21/9": "aspect-[21/9]",
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
      loading = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedAspectRatio = imageAspectRatio ?? DEFAULT_ASPECT_RATIO[layout];

    if (loading) {
      return (
        <Card
          ref={ref}
          variant="outlined"
          padding={layout === "horizontal" ? "compact" : "comfortable"}
          aria-hidden="true"
          className={cn(
            "h-full overflow-hidden",
            layout === "horizontal" ? "flex flex-row items-stretch gap-4" : "flex flex-col",
            className,
          )}
          {...rest}
        >
          <div className={cn("shrink-0", layout === "horizontal" ? "w-24 sm:w-32" : "w-full")}>
            <Skeleton
              shape="rect"
              className={cn("h-auto w-full rounded-md", ASPECT_RATIO_SKELETON_CLASSES[resolvedAspectRatio])}
            />
          </div>
          <Card.Body className="min-w-0 flex-1 gap-2">
            <Skeleton shape="text" className="h-4 w-16" />
            <Skeleton shape="text" className="h-5 w-full" />
            <Skeleton shape="text" className="h-5 w-2/3" />
            <Skeleton shape="text" className={cn("h-4 w-full", layout === "horizontal" && "hidden sm:block")} />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton shape="text" className="h-3 w-24" />
            </div>
          </Card.Body>
        </Card>
      );
    }

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
    } = story!;

    const visualSize = headingVisualSize ?? DEFAULT_VISUAL_SIZE[layout];
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
          // When href is set the <a> wrapper below is the card's root element (and, in a
          // grid, the grid item) — className must land there or layout utilities passed by
          // composing patterns (e.g. FeaturedStoryGrid's col-span) silently do nothing.
          !href && className,
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
              containerClassName="h-full w-full"
            />
          </div>
        ) : null}
        <Card.Body className="min-w-0 flex-1 gap-2">
          {category ? (
            <Tag tone="brand" className="self-start">
              {category}
            </Tag>
          ) : null}
          {/* The headline is never clamped: an ellipsized headline is an editorial failure
              (the headline IS the product). Length is managed by sizing (headingVisualSize)
              and by the dek clamp below, not by truncating the one thing readers scan. */}
          <Heading level={headingLevel} visualSize={visualSize} weight="bold">
            {headline}
          </Heading>
          {dek ? (
            <Text size="small" color="secondary" className="line-clamp-2">
              {dek}
            </Text>
          ) : null}
          {/* font-mono: byline/timestamp strips are "data of record" and render in the mono
              face system-wide — see CONTRIBUTING's "Metadata typography" convention.
              No mt-auto here: in an equal-height grid row it would pin the byline to the
              card's bottom edge and tear a void open mid-card between dek and byline.
              Letting content flow top-down pools the leftover space below the byline
              instead, which reads as breathing room rather than a rendering bug. */}
          {hasMeta ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-caption text-text-tertiary">
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
        className={cn("block h-full rounded-lg focus-visible:outline-none", className)}
      >
        {cardContent}
      </a>
    );
  },
);
StoryCard.displayName = "StoryCard";
