import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";

export interface PaywallProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onClick"> {
  /**
   * The gated content itself (typically the rest of an `ArticleBody`). Always stays in
   * the DOM regardless of `locked` — real search-engine crawlers still get the full
   * article; only the *visual* presentation (and, when locked, screen-reader exposure —
   * see the Accessibility notes in this pattern's `.mdx`) changes.
   */
  children: ReactNode;
  /**
   * Whether the reader is gated from this content. This pattern has no real
   * entitlement/auth logic of its own — it's a dumb `boolean` a real app sets from its
   * own subscription-check result. @default false
   */
  locked?: boolean;
  /** Heading on the upsell card. @default "Subscribe to keep reading" */
  heading?: string;
  /** Supporting copy on the upsell card. */
  description?: string;
  /** Label for the primary subscribe CTA. @default "Subscribe now" */
  ctaLabel?: string;
  /**
   * Called when the primary CTA is clicked. This pattern doesn't know how your
   * subscribe flow works (checkout page, modal, router navigation, ...) — wire it up
   * here, the same way `NewsletterSignup`'s `onSubmit` has no real backend of its own.
   */
  onCtaClick?: () => void;
  /**
   * Href for the secondary "already a subscriber" link. Omit to hide the secondary
   * link entirely.
   */
  signInHref?: string;
  /** Label for the secondary sign-in link. @default "Already a subscriber? Sign in" */
  signInLabel?: string;
  /**
   * Semantic heading level for the upsell card's heading — set this to whatever is
   * correct in the surrounding document outline (e.g. `2` if the paywall sits directly
   * under the article's `h1`). @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Tailwind max-height class applied to the clamped content when `locked`, controlling
   * how much of the article shows through before the fade. @default "max-h-72"
   */
  previewHeightClassName?: string;
}

/**
 * Soft-paywall overlay for gating article content behind a subscription upsell.
 * Composes `Card` (upsell CTA), `Heading`/`Text` (copy), `Button` (primary CTA), and
 * `Link` (secondary sign-in link).
 *
 * `children` renders normally for subscribers. When `locked` is true, the content is
 * visually clamped (`max-height` + `overflow-hidden`) with a gradient fade over the
 * last portion, and an upsell `Card` overlaps the bottom of the fade. The content
 * itself is never removed from the DOM — see this pattern's `.mdx` for the
 * accessibility reasoning behind also `aria-hidden`-ing it from screen readers while
 * locked.
 */
export const Paywall = forwardRef<HTMLDivElement, PaywallProps>(
  (
    {
      children,
      locked = false,
      heading = "Subscribe to keep reading",
      description = "You've reached your free article limit. Subscribe for unlimited access to award-winning journalism.",
      ctaLabel = "Subscribe now",
      onCtaClick,
      signInHref,
      signInLabel = "Already a subscriber? Sign in",
      headingLevel = 2,
      previewHeightClassName = "max-h-72",
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...rest}>
        <div
          // See the "Accessibility" section of Paywall.mdx for why the entire clamped
          // region (not just the portion hidden by the fade) is aria-hidden while
          // locked, rather than left exposed to screen readers.
          aria-hidden={locked || undefined}
          className={cn("relative", locked && cn("overflow-hidden", previewHeightClassName))}
        >
          {children}
          {locked ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-canvas to-transparent"
            />
          ) : null}
        </div>

        {locked ? (
          <Card
            variant="elevated"
            padding="spacious"
            className="relative z-10 mx-auto -mt-16 max-w-md"
          >
            <Card.Body className="items-center text-center">
              <Heading level={headingLevel} visualSize={4}>
                {heading}
              </Heading>
              <Text color="secondary">{description}</Text>
              <Button onClick={onCtaClick} className="mt-2 w-full sm:w-auto">
                {ctaLabel}
              </Button>
              {signInHref ? (
                <Link href={signInHref} tone="inline" className="mt-1">
                  {signInLabel}
                </Link>
              ) : null}
            </Card.Body>
          </Card>
        ) : null}
      </div>
    );
  },
);
Paywall.displayName = "Paywall";
