import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { Badge, type BadgeProps } from "@/components/Badge";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

/**
 * Plan/subscription status shown on the account page. Plain data rather than a `ReactNode`
 * slot — like `CategoryLanding`'s `categoryName`, this is "genuinely just text" (a plan name
 * plus an optional detail string), not a rendered pattern with its own markup or behavior.
 */
export interface AccountPlanStatus {
  /** Plan name, e.g. `"Premium"`, `"Digital + Print"`. Rendered as a `Badge` label. */
  planName: string;
  /**
   * Semantic tone for the plan `Badge` (e.g. `"success"` for active, `"warning"` for a
   * past-due or expiring plan, `"error"` for canceled). @default "success"
   */
  tone?: BadgeProps["variant"];
  /**
   * Human-readable status detail shown under the badge, e.g. `"Renews July 15, 2026"` or
   * `"Cancels at the end of the current term"`.
   */
  detail?: ReactNode;
}

export interface AccountProps extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  /**
   * Site chrome: props forwarded directly to `GlobalHeader`. Same prop-bag convention every
   * template in this system uses — see `Homepage`'s MDX for the rationale.
   */
  header: GlobalHeaderProps;
  /** Site chrome: props forwarded directly to `Footer`. */
  footer: FooterProps;
  /**
   * The signed-in subscriber's display name. Plain `string` rather than a slot — see
   * `AccountPlanStatus` above for the same "genuinely just text" reasoning.
   */
  name: string;
  /** The signed-in subscriber's email address. */
  email: string;
  /** Subscriber photo URL. Omit to fall back to initials (via `Avatar`). */
  avatarSrc?: string;
  /** Current subscription/plan status, rendered via `Badge`/`Card`/`Text`. */
  plan: AccountPlanStatus;
  /**
   * Billing/payment-method area. A `ReactNode` slot — real billing UI (payment forms,
   * invoice history, a hosted billing-portal iframe, etc.) is out of scope for this design
   * system, so this template only reserves the layout space for it. Omit entirely for an
   * account with no billing UI to show (e.g. a comped or staff account).
   */
  billing?: ReactNode;
  /**
   * Called when the sign-out action is activated. Like `SocialSharing`'s callback props,
   * this template never implements the actual sign-out behavior (clearing a session,
   * redirecting, calling an auth provider) — that's entirely up to the consumer.
   */
  onSignOut: () => void;
  /** Label for the sign-out button. @default "Sign out" */
  signOutLabel?: string;
  /** id applied to the `<main>` landmark, used as the skip-link target. @default "main-content" */
  mainId?: string;
}

/**
 * A signed-in subscriber's account/subscription-management page: fixed `GlobalHeader`/
 * `Footer` chrome, an account summary (name/email/avatar), the current plan status, an
 * optional billing/payment-method slot, and a sign-out action. This template does not depend
 * on or compose the `Paywall` pattern — gating article content and managing an existing
 * subscription are different concerns. See this folder's `.mdx` for the full prop contract
 * and `.stories.tsx` for a realistic composed example.
 */
export const Account = forwardRef<HTMLDivElement, AccountProps>(
  (
    {
      header,
      footer,
      name,
      email,
      avatarSrc,
      plan,
      billing,
      onSignOut,
      signOutLabel = "Sign out",
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
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
        >
          <Heading level={1} visualSize="display">
            Account
          </Heading>

          <section aria-label="Account summary">
            <Card variant="outlined">
              <Card.Body className="flex-row items-center gap-4">
                <Avatar name={name} src={avatarSrc} size="lg" />
                <div className="flex flex-col gap-0.5">
                  <Text as="span" size="lead" weight="semibold">
                    {name}
                  </Text>
                  <Text as="span" size="small" color="secondary">
                    {email}
                  </Text>
                </div>
              </Card.Body>
            </Card>
          </section>

          <section aria-label="Subscription" className="flex flex-col gap-3">
            <Heading level={2} visualSize={5}>
              Subscription
            </Heading>
            <Card variant="outlined">
              <Card.Body className="gap-2">
                <Badge variant={plan.tone ?? "success"} className="w-fit">
                  {plan.planName}
                </Badge>
                {plan.detail ? (
                  <Text size="small" color="secondary">
                    {plan.detail}
                  </Text>
                ) : null}
              </Card.Body>
            </Card>
          </section>

          {billing ? (
            <section aria-label="Payment method" className="flex flex-col gap-3">
              <Heading level={2} visualSize={5}>
                Payment method
              </Heading>
              {billing}
            </section>
          ) : null}

          <div>
            <Button type="button" variant="secondary" onClick={onSignOut}>
              {signOutLabel}
            </Button>
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
Account.displayName = "Account";
