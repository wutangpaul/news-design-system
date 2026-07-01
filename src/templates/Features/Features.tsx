import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";

export interface FeaturesProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Props forwarded as-is to the site-wide `GlobalHeader`. Every page needs the same
   * chrome, so this template composes `GlobalHeader` directly rather than treating
   * "whether to show a header" as a slot — only its content is left to the consumer.
   */
  header: GlobalHeaderProps;
  /** Props forwarded as-is to the site-wide `Footer`. */
  footer: FooterProps;
  /**
   * Large hero/header treatment for the piece, rendered full-width above the
   * constrained reading column — typically a bigger-scale `HeroStory` or
   * `ArticleHeader`. This template has no opinion on which pattern fills it, only that
   * it gets the full page width to work with (unlike `body`, which is constrained to a
   * readable measure).
   */
  hero: ReactNode;
  /**
   * The story's long-form content — typically an `ArticleBody` composing paragraphs
   * alongside heavier visual moments (`ImageGallery`, `InlineImage`, `PullQuote`).
   * Rendered as-is inside a constrained reading column; this template doesn't inspect
   * or rewrite its children, so any full-bleed treatment inside it (e.g. `InlineImage
   * align="full"`) is the consumer's own composition choice.
   */
  body: ReactNode;
  /**
   * Optional share-this-story controls, typically a `<SocialSharing />`, shown directly
   * below the body content.
   */
  socialSharing?: ReactNode;
}

/**
 * Page-level layout for a rich, long-form, heavily-visual "digital feature" story — the
 * interactive-narrative treatment newsrooms reach for on major investigative or visual
 * pieces. Structure only: site chrome, a full-width hero slot, a constrained-width body
 * slot, and an optional social-sharing slot. See the MDX docs for how this differs from the
 * plain Article template.
 */
export const Features = forwardRef<HTMLDivElement, FeaturesProps>(
  ({ header, footer, hero, body, socialSharing, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-screen flex-col bg-surface-canvas", className)}
        {...rest}
      >
        <GlobalHeader {...header} />
        <main className="flex-1">
          <div className="w-full">{hero}</div>
          <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
            {body}
            {socialSharing ? <div>{socialSharing}</div> : null}
          </div>
        </main>
        <Footer {...footer} />
      </div>
    );
  },
);
Features.displayName = "Features";
