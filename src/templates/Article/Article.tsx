import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { ReadingProgress } from "@/patterns/ReadingProgress";

export interface ArticleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Site header configuration, forwarded as-is to `GlobalHeader`. The template composes
   * the header directly (it's chrome every page needs) rather than accepting it as a
   * slot — this prop only configures that fixed composition.
   */
  header: GlobalHeaderProps;
  /** Site footer configuration, forwarded as-is to `Footer`. See `header` above for why this isn't a slot. */
  footer: FooterProps;
  /**
   * Top-of-article slot, typically an `ArticleHeader` (composing a `Byline` for
   * author/date metadata).
   */
  articleHeader: ReactNode;
  /**
   * Main long-form content slot, typically an `ArticleBody` whose children are
   * paragraphs interspersed with `PullQuote`/`BlockQuote`/`InlineImage`.
   */
  body: ReactNode;
  /** Share-this-article slot, typically a `SocialSharing`. */
  socialSharing?: ReactNode;
  /**
   * "More from this author" / further-reading slot, typically an `AuthorCard`
   * and/or `RelatedArticles` composed together by the caller.
   */
  related?: ReactNode;
  /** Reader comments slot, typically a `Comments`. */
  comments?: ReactNode;
}

/**
 * Standard single-story reading page: a reading-progress bar pinned to the top of the
 * viewport, the site's `GlobalHeader`, a reading-measure-constrained column of
 * article-specific slots, and the site's `Footer`.
 *
 * This template owns exactly two things: the fixed page chrome (reading progress bar +
 * header + footer, identical on every article) and the ~65ch reading-measure column that
 * every slot below the header sits inside (per the Grid & Layout foundations). It has no
 * opinion on what fills `articleHeader`/`body`/etc — those are plain `ReactNode` slots so
 * the same template works for any real editorial content later.
 */
export const Article = forwardRef<HTMLDivElement, ArticleProps>(
  (
    {
      header,
      footer,
      articleHeader,
      body,
      socialSharing,
      related,
      comments,
      className,
      ...rest
    },
    ref,
  ) => {
    const contentRef = useRef<HTMLElement>(null);

    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <ReadingProgress targetRef={contentRef} />
        <GlobalHeader {...header} />
        <main
          ref={contentRef}
          className="mx-auto flex w-full max-w-[65ch] flex-1 flex-col gap-10 px-4 py-10 sm:px-6"
        >
          {articleHeader}
          {body}
          {socialSharing ? <div>{socialSharing}</div> : null}
          {related ? <div className="flex flex-col gap-8">{related}</div> : null}
          {comments ? <div>{comments}</div> : null}
        </main>
        <Footer {...footer} />
      </div>
    );
  },
);
Article.displayName = "Article";
