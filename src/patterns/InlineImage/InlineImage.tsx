import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Image, type ImageAspectRatio } from "@/components/Image";
import { Caption } from "@/patterns/Caption";

const inlineImageVariants = cva("", {
  variants: {
    align: {
      /** Breaks the image out to the full width of its container. */
      full: "w-full",
      /** Centered, capped to a readable width — for a standalone image within a text column. */
      center: "mx-auto w-full max-w-2xl",
      /** Floats left so body text wraps around the right side. */
      "inset-left": "float-left clear-left mr-6 mb-4 w-full max-w-[45%] sm:max-w-xs",
      /** Floats right so body text wraps around the left side. */
      "inset-right": "float-right clear-right ml-6 mb-4 w-full max-w-[45%] sm:max-w-xs",
    },
  },
  defaultVariants: {
    align: "full",
  },
});

export type InlineImageAlign = NonNullable<VariantProps<typeof inlineImageVariants>["align"]>;

export interface InlineImageContent {
  /** Image source URL. */
  src: string;
  /** Alternative text describing the image. Mandatory — forwarded as-is to `Image`. */
  alt: string;
  /** Optional descriptive caption text, rendered below the image. */
  caption?: ReactNode;
  /** Optional photo/video credit (photographer, agency), rendered alongside the caption. */
  credit?: string;
}

export interface InlineImageProps
  extends InlineImageContent,
    Omit<HTMLAttributes<HTMLElement>, keyof InlineImageContent>,
    VariantProps<typeof inlineImageVariants> {
  /**
   * How the image sits relative to surrounding Article Body text.
   * `inset-left`/`inset-right` float the image so text wraps around it;
   * `full` and `center` are block-level and interrupt the text flow instead.
   * @default "full"
   */
  align?: InlineImageAlign;
  /** Crops the image into a fixed aspect ratio (see `Image`'s `aspectRatio` prop). */
  aspectRatio?: ImageAspectRatio;
}

/**
 * An image embedded within Article Body flow. Composes the design system's
 * `Image` (mandatory `alt`, loading/error handling) and `Caption` inside a
 * real `<figure>`, plus width/alignment variants for text wrap.
 */
export const InlineImage = forwardRef<HTMLElement, InlineImageProps>(
  (
    { src, alt, caption, credit, align = "full", aspectRatio, className, ...rest },
    ref,
  ) => {
    return (
      <figure
        ref={ref}
        className={cn(inlineImageVariants({ align }), className)}
        {...rest}
      >
        <Image src={src} alt={alt} aspectRatio={aspectRatio} />
        <Caption credit={credit}>{caption}</Caption>
      </figure>
    );
  },
);
InlineImage.displayName = "InlineImage";
