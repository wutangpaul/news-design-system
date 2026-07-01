import {
  forwardRef,
  useState,
  type ImgHTMLAttributes,
  type ReactEventHandler,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Common editorial aspect ratios. Mapped to static Tailwind `aspect-[...]`
 * classes so the JIT compiler can discover them at build time (dynamic
 * arbitrary-value strings built from arbitrary user input would not be
 * discoverable by Tailwind's content scanner). Pass a value outside this
 * set and the component falls back to the image's natural ratio — use
 * `className` to layer on a custom `aspect-[...]` utility if you need one
 * that isn't listed here.
 */
const ASPECT_RATIO_CLASSES = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-[1/1]",
  "9/16": "aspect-[9/16]",
  "21/9": "aspect-[21/9]",
} as const satisfies Record<string, string>;

export type ImageAspectRatio = keyof typeof ASPECT_RATIO_CLASSES;

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "loading"> {
  /**
   * Alternative text describing the image. Mandatory — decorative images
   * must explicitly pass `alt=""` rather than omitting the prop, so the
   * choice is always a conscious one.
   */
  alt: string;
  /**
   * Crops the image into a fixed aspect ratio using `object-cover`. Accepts
   * one of the editorial presets; omit it to keep the image's natural ratio.
   */
  aspectRatio?: ImageAspectRatio;
  /** Native lazy-loading behavior. Defaults to "lazy". */
  loading?: "lazy" | "eager";
  /** Extra classes for the wrapping container (useful for sizing). */
  containerClassName?: string;
}

/**
 * Image wraps the native `<img>` element with a mandatory `alt`, an
 * editorial aspect-ratio crop, and a self-contained shimmer placeholder
 * shown while the image is loading or if it fails to load.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt,
      aspectRatio,
      loading = "lazy",
      className,
      containerClassName,
      onLoad,
      onError,
      ...rest
    },
    ref,
  ) => {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">(
      "loading",
    );

    const handleLoad: ReactEventHandler<HTMLImageElement> = (event) => {
      setStatus("loaded");
      onLoad?.(event);
    };

    const handleError: ReactEventHandler<HTMLImageElement> = (event) => {
      setStatus("error");
      onError?.(event);
    };

    const aspectClass = aspectRatio ? ASPECT_RATIO_CLASSES[aspectRatio] : undefined;

    return (
      <span
        className={cn(
          "relative block overflow-hidden bg-surface-sunken",
          aspectClass,
          containerClassName,
        )}
      >
        {status !== "loaded" && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 block bg-surface-sunken",
              status === "loading" &&
                "animate-pulse motion-reduce:animate-none motion-reduce:opacity-70",
            )}
          >
            {status === "error" && (
              <span className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5 8 11l3 3 5.5-5.5L21 13M3 5h18v14H3V5Z"
                  />
                </svg>
                <span className="text-caption text-text-tertiary">{alt}</span>
              </span>
            )}
          </span>
        )}
        <img
          {...rest}
          ref={ref}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "relative block h-full w-full object-cover transition-opacity duration-slow",
            status === "loaded" ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      </span>
    );
  },
);

Image.displayName = "Image";
