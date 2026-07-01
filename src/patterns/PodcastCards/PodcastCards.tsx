import { forwardRef, useId, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Image } from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";

/** A single podcast episode's summary data. */
export interface PodcastCardItem {
  /** Unique id, used as the React list key. */
  id: string;
  /** Episode title. */
  title: string;
  /** Name of the show/podcast this episode belongs to. */
  show: string;
  /** Destination URL for the episode's listen page. */
  href: string;
  /** Human-readable duration label, e.g. "32:10". */
  duration: string;
  /** Optional show/episode artwork URL. Omitted renders a simple decorative audio glyph instead. */
  artworkSrc?: string;
  /** Accessible alt text for the artwork. Required when `artworkSrc` is provided. */
  artworkAlt?: string;
}

export interface PodcastCardsProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section heading. @default "Podcasts" */
  title?: string;
  /** Episodes to render, in display order. */
  episodes: PodcastCardItem[];
}

/**
 * Decorative waveform glyph shown in place of artwork when an episode has
 * none. Purely visual (aria-hidden) — the card's accessible name comes from
 * its headline, not this graphic. Kept as a small inline shape (bars built
 * from plain divs) rather than a new entry in the shared icon set, since no
 * existing icon in that set represents audio content.
 */
function WaveformGlyph() {
  const barHeights = ["h-3", "h-5", "h-2.5", "h-6", "h-3.5", "h-2"];
  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center gap-0.5 bg-surface-sunken"
    >
      {barHeights.map((height, index) => (
        <span key={index} className={cn("w-1 rounded-full bg-text-tertiary", height)} />
      ))}
    </span>
  );
}

/**
 * A grid of podcast episode cards: optional show artwork (or a decorative
 * waveform placeholder), a duration badge, the show name, and the episode
 * title. The audio counterpart to a video/story summary card.
 */
export const PodcastCards = forwardRef<HTMLElement, PodcastCardsProps>(
  ({ title = "Podcasts", episodes, className, ...rest }, ref) => {
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
        {episodes.length === 0 ? (
          <p className="text-small text-text-secondary">No episodes available right now.</p>
        ) : (
          /* role="list" restores list semantics Safari/VoiceOver otherwise strip from a `ul`
              once it has `display: grid`/`flex` — a deliberate a11y fix, not redundant. */
          /* eslint-disable-next-line jsx-a11y/no-redundant-roles */
          <ul role="list" className="flex flex-col gap-3">
            {episodes.map((episode) => (
              <li key={episode.id}>
                <a
                  href={episode.href}
                  className="block rounded-lg focus-visible:outline-none"
                >
                  <Card variant="outlined" interactive>
                    <Card.Body className="flex-row items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                        {episode.artworkSrc ? (
                          <Image
                            src={episode.artworkSrc}
                            alt={episode.artworkAlt ?? ""}
                            aspectRatio="1/1"
                          />
                        ) : (
                          <WaveformGlyph />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <Text size="caption" color="tertiary" className="uppercase tracking-wide">
                          {episode.show}
                        </Text>
                        <Heading level={3} visualSize={6}>
                          {episode.title}
                        </Heading>
                        <Badge size="sm" className="self-start">
                          {episode.duration}
                        </Badge>
                      </div>
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
PodcastCards.displayName = "PodcastCards";
