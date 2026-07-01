import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";
import { Image, type ImageAspectRatio } from "@/components/Image";
import { Modal } from "@/components/Modal";
import { ChevronLeft, ChevronRight } from "@/components/Icon";
import { Caption } from "@/patterns/Caption";

export interface GalleryImage {
  /** Image source URL. */
  src: string;
  /** Alternative text describing the image. Mandatory — forwarded as-is to `Image`. */
  alt: string;
  /** Optional descriptive caption text. */
  caption?: string;
  /** Optional photo/video credit (photographer, agency). */
  credit?: string;
}

export interface ImageGalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The set of images in the gallery, shown one at a time. */
  images: GalleryImage[];
  /**
   * Accessible label describing the gallery's content as a whole, e.g.
   * "Photos from Tuesday's march downtown" — announced alongside the
   * carousel role so assistive tech understands what the region contains.
   */
  label: string;
  /** Index of the image shown first. @default 0 */
  defaultIndex?: number;
  /** Aspect ratio applied to the displayed image (see `Image`'s `aspectRatio` prop). */
  aspectRatio?: ImageAspectRatio;
  /** Lets viewers open the current image full-size in a modal. @default true */
  enlargeable?: boolean;
}

const navButtonClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-canvas/90 text-text-primary shadow-md transition-colors hover:bg-surface-canvas";

/**
 * A multi-image set presented as a single-image-at-a-time carousel, with a
 * real `<button>` for previous/next (plus Left/Right arrow-key support) and
 * an optional full-size enlarge view composed from the existing `Modal`
 * rather than a hand-rolled lightbox. See the ImageGallery MDX docs for the
 * rationale for choosing a carousel over a plain grid.
 */
export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    { images, label, defaultIndex = 0, aspectRatio, enlargeable = true, className, ...rest },
    ref,
  ) => {
    const count = images.length;
    const clampedDefault = count > 0 ? Math.min(Math.max(defaultIndex, 0), count - 1) : 0;
    const [index, setIndex] = useState(clampedDefault);
    const [enlarged, setEnlarged] = useState(false);

    const goTo = useCallback(
      (next: number) => {
        setIndex(((next % count) + count) % count);
      },
      [count],
    );

    const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
    const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    if (count === 0) return null;

    const current = images[index];

    return (
      /* The APG carousel pattern attaches arrow-key navigation to the carousel container
         itself (not just the individual prev/next buttons), so ArrowLeft/ArrowRight work
         regardless of which descendant currently has focus — a deliberate a11y pattern, not
         a misplaced handler. */
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <div className="relative">
          <figure className="m-0">
            {enlargeable ? (
              <button
                type="button"
                onClick={() => setEnlarged(true)}
                aria-label={`Enlarge image ${index + 1} of ${count}`}
                className="block w-full cursor-zoom-in overflow-hidden rounded-md"
              >
                <Image src={current.src} alt={current.alt} aspectRatio={aspectRatio} />
              </button>
            ) : (
              <Image src={current.src} alt={current.alt} aspectRatio={aspectRatio} />
            )}
            <Caption credit={current.credit}>{current.caption}</Caption>
          </figure>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className={cn(navButtonClass, "absolute left-2 top-1/2 -translate-y-1/2")}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className={cn(navButtonClass, "absolute right-2 top-1/2 -translate-y-1/2")}
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div className="flex items-center justify-center gap-2">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === index ? "bg-masthead-500" : "bg-surface-border-strong",
                )}
              />
            ))}
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          Image {index + 1} of {count}
        </p>

        {enlargeable && (
          <Modal
            open={enlarged}
            onClose={() => setEnlarged(false)}
            title={current.alt || `Image ${index + 1} of ${count}`}
            size="lg"
          >
            <figure className="m-0">
              <Image src={current.src} alt={current.alt} />
              <Caption credit={current.credit}>{current.caption}</Caption>
            </figure>
            {count > 1 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <button type="button" onClick={goPrev} aria-label="Previous image" className={navButtonClass}>
                  <ChevronLeft aria-hidden="true" />
                </button>
                <span className="text-small text-text-secondary">
                  {index + 1} / {count}
                </span>
                <button type="button" onClick={goNext} aria-label="Next image" className={navButtonClass}>
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </Modal>
        )}
      </div>
    );
  },
);
ImageGallery.displayName = "ImageGallery";
