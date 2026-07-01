import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CaptionProps extends HTMLAttributes<HTMLElement> {
  /** Descriptive text about the media — what's shown, and any context a caption typically carries. */
  children?: ReactNode;
  /**
   * Photo/video credit (e.g. a photographer or agency name), rendered as a visually
   * de-emphasized run after the description.
   */
  credit?: string;
}

/**
 * Small caption text for media (photo/video credit + description). Renders a real
 * `<figcaption>`, but deliberately does **not** render the surrounding `<figure>` —
 * that wrapper is owned by whichever pattern places the media (e.g. `InlineImage`),
 * since `<figcaption>` is only valid as a direct child of `<figure>` alongside the
 * media it describes. Compose `Caption` inside your own `<figure>`:
 *
 * ```tsx
 * <figure>
 *   <Image src="..." alt="..." />
 *   <Caption credit="Jane Doe/Wire Service">Firefighters battling a blaze downtown.</Caption>
 * </figure>
 * ```
 *
 * Renders nothing when neither `children` nor `credit` is provided, so consumers can
 * pass optional caption data straight through without an extra conditional.
 */
export const Caption = forwardRef<HTMLElement, CaptionProps>(
  ({ children, credit, className, ...rest }, ref) => {
    if (!children && !credit) return null;

    return (
      <figcaption
        ref={ref}
        className={cn("mt-2 text-caption text-text-secondary", className)}
        {...rest}
      >
        {children}
        {children && credit ? <span aria-hidden="true"> — </span> : null}
        {credit ? <span className="text-text-tertiary">{credit}</span> : null}
      </figcaption>
    );
  },
);
Caption.displayName = "Caption";
