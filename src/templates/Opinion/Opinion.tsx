import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { ReadingProgress } from "@/patterns/ReadingProgress";

export interface OpinionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Site header configuration, forwarded as-is to `GlobalHeader`. The template composes
   * the header directly (it's chrome every page needs) rather than accepting it as a
   * slot — this prop only configures that fixed composition.
   */
  header: GlobalHeaderProps;
  /** Site footer configuration, forwarded as-is to `Footer`. See `header` above for why this isn't a slot. */
  footer: FooterProps;
  /**
   * "Opinion"/"Editorial"/"Analysis" eyebrow label rendered above the headline, marking
   * the piece as author-driven commentary rather than straight reporting. Plain
   * `ReactNode` so a caller can swap in "Op-Ed", a section-specific label, etc.
   * @default "Opinion"
   */
  eyebrow?: ReactNode;
  /**
   * Top-of-article slot, typically an `ArticleHeader` (composing a `Byline` for
   * author/date metadata).
   */
  articleHeader: ReactNode;
  /**
   * Prominent author call-out slot rendered immediately after the headline, typically an
   * `AuthorCard`. Required (unlike Article's end-of-page author mention) — opinion pieces
   * are author-driven, so who's writing is front-and-center content, not an afterthought.
   */
  authorCard: ReactNode;
  /**
   * Main long-form content slot, typically an `ArticleBody` whose children are
   * paragraphs interspersed with `PullQuote`/`BlockQuote`/`InlineImage`.
   */
  body: ReactNode;
  /** Share-this-article slot, typically a `SocialSharing`. */
  socialSharing?: ReactNode;
  /**
   * Further-reading slot, typically `RelatedArticles` (e.g. other columns by the same
   * author, or on the same topic). Secondary here since the author call-out already ran
   * prominently up top — contrast with Article, where this slot is where author info
   * usually lives.
   */
  related?: ReactNode;
  /** Reader comments slot, typically a `Comments`. */
  comments?: ReactNode;
}

/**
 * Opinion/op-ed reading page. Structurally close to `Article` (same reading-progress +
 * chrome + ~65ch reading column shape — it's still long-form reading) but editorially
 * distinct in two deliberate ways: an `eyebrow` label above the headline identifying the
 * piece as commentary, and a required, prominent `authorCard` slot placed immediately
 * after the headline rather than folded into an optional end-of-page slot. Opinion
 * writing is inseparable from who's arguing the case, so the author gets top billing
 * instead of a footnote. See this template's `.mdx` for the full rationale and a
 * side-by-side contrast with `Article`.
 */
export const Opinion = forwardRef<HTMLDivElement, OpinionProps>(
  (
    {
      header,
      footer,
      eyebrow = "Opinion",
      articleHeader,
      authorCard,
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
          className="mx-auto flex w-full max-w-[65ch] flex-1 flex-col gap-8 px-4 py-10 sm:px-6"
        >
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full border border-masthead-200 bg-masthead-50 px-3 py-1 font-sans text-small font-semibold uppercase tracking-wide text-masthead-700 dark:border-masthead-800 dark:bg-masthead-950 dark:text-masthead-300">
              {eyebrow}
            </span>
            {articleHeader}
          </div>
          <div>{authorCard}</div>
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
Opinion.displayName = "Opinion";
