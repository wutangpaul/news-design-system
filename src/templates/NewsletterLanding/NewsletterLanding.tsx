import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";

export interface NewsletterLandingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Site header configuration, forwarded as-is to `GlobalHeader`. The template composes
   * the header directly (it's chrome every page needs) rather than accepting it as a
   * slot — this prop only configures that fixed composition.
   */
  header: GlobalHeaderProps;
  /** Site footer configuration, forwarded as-is to `Footer`. See `header` above for why this isn't a slot. */
  footer: FooterProps;
  /**
   * Hero/intro slot describing the newsletter itself — name, description, cadence (e.g.
   * "The Weekly Ledger — every Friday morning"). Plain `ReactNode` so the template has no
   * opinion on the copy or which components (`Heading`, `Text`, `Badge`, etc.) build it.
   */
  intro: ReactNode;
  /**
   * The conversion centerpiece, typically a `<NewsletterSignup />` from
   * `src/patterns/NewsletterSignup`. Rendered prominently in its own section — this is a
   * single-purpose landing page, so the signup form is the visual focus, not one slot
   * among many.
   */
  signup: ReactNode;
  /**
   * Optional "what you'll get" / sample-issues slot — e.g. a short list of what the
   * newsletter covers, or a couple of past issue call-outs. Omit for the leanest possible
   * conversion page.
   */
  sampleIssues?: ReactNode;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * Dedicated subscribe/landing page for a single newsletter product. Deliberately narrower
 * and simpler than the multi-region hub templates (`Homepage`, `Video`): a single centered
 * column carries exactly three things in order — what the newsletter is (`intro`), the
 * signup form itself (`signup`), and, optionally, a preview of its value (`sampleIssues`).
 * This is a conversion-focused page, so the template intentionally has no sidebar/rail slot
 * to compete for attention with the signup form.
 *
 * Structure only — every content slot accepts a `ReactNode`, and the template never decides
 * what pattern or copy fills it (see this folder's `.mdx` for the slot contract and
 * `.stories.tsx` for a realistic composed example).
 */
export const NewsletterLanding = forwardRef<HTMLDivElement, NewsletterLandingProps>(
  (
    { header, footer, intro, signup, sampleIssues, mainId = "main-content", className, ...rest },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <a
          href={`#${mainId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-tooltip focus:rounded-md focus:bg-surface-canvas focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-text-primary focus:shadow-md"
        >
          Skip to main content
        </a>

        <GlobalHeader {...header} />

        <main
          id={mainId}
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-4 py-12 sm:px-6 lg:py-20"
        >
          <section aria-label="About this newsletter" className="text-center">
            {intro}
          </section>

          <section
            aria-label="Sign up"
            className="rounded-lg border border-surface-border bg-surface-raised p-6 sm:p-10"
          >
            {signup}
          </section>

          {sampleIssues ? (
            <section aria-label="What you'll get">{sampleIssues}</section>
          ) : null}
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
NewsletterLanding.displayName = "NewsletterLanding";
