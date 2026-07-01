import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Heading } from "@/components/Heading";
import { Image, type ImageAspectRatio } from "@/components/Image";
import { Tag } from "@/components/Tag";

type HeroHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeroStoryProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The featured story's headline. */
  title: ReactNode;
  /** Optional dek/summary shown below the headline. */
  dek?: ReactNode;
  /** Image source for the full-bleed treatment. */
  imageSrc: string;
  /** Alt text for the image — forwarded to `Image`, which requires it explicitly. */
  imageAlt: string;
  /** Optional category label, rendered as a `Tag` above the headline. */
  category?: string;
  /** Image aspect ratio. @default "16/9" */
  aspectRatio?: ImageAspectRatio;
  /**
   * Semantic heading level for the title. A hero on a homepage/section front is
   * usually a secondary heading (the page's own `h1` is the site/section title), so
   * this defaults to 2 — set it explicitly to fit the surrounding outline.
   * @default 2
   */
  headingLevel?: HeroHeadingLevel;
}

/**
 * Large featured-story treatment for a homepage/section top: a full-bleed image with
 * an overlaid category tag, headline, and optional dek. Like `Card`, `HeroStory` is
 * never itself a link or button — it renders no click handler or interactive role.
 * Wrap it in your own `<a>`/router `Link` to make the whole unit clickable, the same
 * composition pattern `Card` uses.
 */
export const HeroStory = forwardRef<HTMLDivElement, HeroStoryProps>(
  (
    {
      title,
      dek,
      imageSrc,
      imageAlt,
      category,
      aspectRatio = "16/9",
      headingLevel = 2,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("group relative isolate overflow-hidden rounded-lg", className)}
        {...rest}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          aspectRatio={aspectRatio}
          className="transition-transform duration-slower motion-reduce:transition-none group-hover:scale-105"
        />
        {/*
          Fixed (non-theme-aware) scrim and text colors: this overlay sits on top of a
          photo, not the app's canvas, so it must stay legible regardless of the
          light/dark theme toggle — the same "fixed-brand element" exception
          CONTRIBUTING documents for raw ink/masthead scale usage.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-6 sm:p-8">
          {category ? (
            <Tag tone="brand" className="w-fit">
              {category}
            </Tag>
          ) : null}
          <Heading level={headingLevel} visualSize="display" className="text-ink-0">
            {title}
          </Heading>
          {dek ? (
            <p className="max-w-[65ch] font-sans text-lead text-ink-0/90">{dek}</p>
          ) : null}
        </div>
      </div>
    );
  },
);
HeroStory.displayName = "HeroStory";
