import { forwardRef, useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Image } from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Badge } from "@/components/Badge";

/** A single video's summary data. */
export interface VideoCardItem {
  /** Unique id, used as the React list key. */
  id: string;
  /** Video title. */
  title: string;
  /** Destination URL for the video's watch page. */
  href: string;
  /** Thumbnail/poster image URL. */
  thumbnailSrc: string;
  /** Accessible alt text for the thumbnail. */
  thumbnailAlt: string;
  /** Human-readable duration label, e.g. "4:32". */
  duration: string;
}

export interface VideoCardsProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section heading. @default "Videos" */
  title?: string;
  /** Videos to render, in display order. */
  videos: VideoCardItem[];
}

/**
 * Decorative play-button glyph overlaid on a video thumbnail. Purely visual —
 * the whole card is the single clickable/focusable unit (the surrounding
 * `<a>`), so this never renders as its own `<button>` or picks up its own
 * interaction handlers. Marked `aria-hidden` for the same reason `Tag`'s
 * interactive+removable variant keeps its label and remove controls as
 * separate real elements rather than nesting one interactive control inside
 * another: a card should have exactly one interactive element, not two.
 */
function PlayGlyph() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-950/60 text-ink-0 transition-transform duration-fast group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

/**
 * A grid of video story cards: thumbnail with a decorative play-button
 * overlay, a duration badge, and a headline — the video analog of a story
 * summary card. Each card's whole surface is a single link; the play glyph
 * is decorative only, so there's never a second nested interactive element.
 */
export const VideoCards = forwardRef<HTMLElement, VideoCardsProps>(
  ({ title = "Videos", videos, className, ...rest }, ref) => {
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
        {videos.length === 0 ? (
          <p className="text-small text-text-secondary">No videos available right now.</p>
        ) : (
          /* role="list" restores list semantics Safari/VoiceOver otherwise strip from a `ul`
              once it has `display: grid`/`flex` — a deliberate a11y fix, not redundant. */
          /* eslint-disable-next-line jsx-a11y/no-redundant-roles */
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <li key={video.id}>
                <a
                  href={video.href}
                  className="group block h-full rounded-lg focus-visible:outline-none"
                >
                  <Card variant="outlined" interactive className="h-full">
                    <Card.Body className="gap-3">
                      <div className="relative">
                        <Image
                          src={video.thumbnailSrc}
                          alt={video.thumbnailAlt}
                          aspectRatio="16/9"
                          containerClassName="rounded-md"
                        />
                        <PlayGlyph />
                        <Badge
                          size="sm"
                          className="absolute bottom-2 right-2 bg-ink-950/80 text-ink-0"
                        >
                          {video.duration}
                        </Badge>
                      </div>
                      <Heading level={3} visualSize={6}>
                        {video.title}
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
VideoCards.displayName = "VideoCards";
