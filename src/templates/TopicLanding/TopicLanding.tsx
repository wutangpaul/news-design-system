import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";

export interface TopicLandingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "id" | "content"> {
  /**
   * Site chrome: props forwarded directly to `GlobalHeader`. Same prop-bag convention every
   * template in this system uses — see `Homepage`'s MDX for the rationale.
   */
  header: GlobalHeaderProps;
  /** Site chrome: props forwarded directly to `Footer`. */
  footer: FooterProps;
  /**
   * The topic/theme's display name, e.g. `"2026 Midterms: Full Coverage"`. Rendered as the
   * page's own `<h1>` — like `CategoryLanding`'s `categoryName`, this is "genuinely just
   * text" with no markup or behavior of its own, so it's a plain prop rather than a
   * `ReactNode` slot.
   */
  topicName: string;
  /** Optional one-line description of the topic, shown under the heading. */
  description?: ReactNode;
  /**
   * Main content slot. Intended for the existing `TopicCollections` pattern (composed in
   * this folder's `.stories.tsx`), but kept a generic `ReactNode` per the templates-are-
   * content-agnostic convention — the template itself has no opinion on what fills it.
   */
  content: ReactNode;
  /**
   * Called when the "Follow this topic" action is activated. Omit entirely for a topic that
   * doesn't support following (e.g. a static explainer page) — the button only renders when
   * this is provided. Like `SocialSharing`'s callback props, this template never implements
   * the actual follow behavior (persisting a preference, subscribing to notifications) —
   * that's up to the consumer.
   */
  onFollowTopic?: () => void;
  /** Whether the current reader already follows this topic. @default false */
  isFollowing?: boolean;
  /** Label for the follow action when not yet followed. @default "Follow this topic" */
  followLabel?: string;
  /** Label for the follow action once followed. @default "Following" */
  followingLabel?: string;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * A page for a specific ongoing topic/theme (e.g. "2026 Midterms: Full Coverage") — distinct
 * from `CategoryLanding`, which is for a permanent site section (e.g. "Politics"). A topic
 * page tracks a subject that persists across many publish dates rather than a fixed part of
 * the site's navigation, so it adds an optional "follow this topic" action `CategoryLanding`
 * has no equivalent for. Fixed `GlobalHeader`/`Footer` chrome, a plain-text `topicName`
 * heading, and a single `content` slot — see this folder's `.mdx` for the slot contract and
 * `.stories.tsx` for a realistic composed example (a real `TopicCollections` instance).
 */
export const TopicLanding = forwardRef<HTMLDivElement, TopicLandingProps>(
  (
    {
      header,
      footer,
      topicName,
      description,
      content,
      onFollowTopic,
      isFollowing = false,
      followLabel = "Follow this topic",
      followingLabel = "Following",
      mainId = "main-content",
      className,
      ...rest
    },
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
          className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <Heading level={1} visualSize="display">
                {topicName}
              </Heading>
              {description ? (
                <p className="max-w-[65ch] font-sans text-lead text-text-secondary">
                  {description}
                </p>
              ) : null}
            </div>

            {onFollowTopic ? (
              <Button
                type="button"
                variant={isFollowing ? "secondary" : "primary"}
                onClick={onFollowTopic}
                aria-pressed={isFollowing}
                className="shrink-0"
              >
                {isFollowing ? followingLabel : followLabel}
              </Button>
            ) : null}
          </div>

          <section aria-label={`Coverage of ${topicName}`}>{content}</section>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
TopicLanding.displayName = "TopicLanding";
