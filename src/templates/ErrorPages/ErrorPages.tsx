import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GlobalHeader, type GlobalHeaderProps } from "@/patterns/GlobalHeader";
import { Footer, type FooterProps } from "@/patterns/Footer";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Link } from "@/components/Link";
import { Compass, Server, WifiOff } from "@/components/Icon";

/** Which error condition the page represents. Selects the default code/heading/copy/icon. */
export type ErrorPagesVariant = "not-found" | "server-error" | "offline";

interface VariantDefaults {
  code: string;
  heading: string;
  description: string;
  icon: ReactNode;
  /** Whether the default action includes a "Try again" (reload) button ahead of the homepage link. */
  showsTryAgain: boolean;
}

const VARIANT_DEFAULTS: Record<ErrorPagesVariant, VariantDefaults> = {
  "not-found": {
    code: "404",
    heading: "This page couldn't be found",
    description:
      "The article or section you're looking for may have been moved, renamed, or retired. Check the address, or start again from the homepage.",
    icon: <Compass size={64} className="text-text-tertiary" />,
    showsTryAgain: false,
  },
  "server-error": {
    code: "500",
    heading: "Something went wrong on our end",
    description:
      "Our systems hit an unexpected error while loading this page. It isn't something you did — our engineers have been notified. Try again in a moment.",
    icon: <Server size={64} className="text-text-tertiary" />,
    showsTryAgain: true,
  },
  offline: {
    code: "Offline",
    heading: "You're offline",
    description:
      "We couldn't reach The Daily Ledger. Check your connection and try again — anything you already had open will still be here.",
    icon: <WifiOff size={64} className="text-text-tertiary" />,
    showsTryAgain: true,
  },
};

export interface ErrorPagesProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Props forwarded to the site-wide `GlobalHeader` chrome (logo, nav, search, actions). */
  header: GlobalHeaderProps;
  /** Props forwarded to the site-wide `Footer` chrome (link groups, social, legal). */
  footer: FooterProps;
  /** Which error condition to present. Selects the default code/heading/copy/icon below. */
  variant: ErrorPagesVariant;
  /** Overrides the variant's default short code/eyebrow (e.g. `"404"`). */
  code?: ReactNode;
  /** Overrides the variant's default heading copy. Still rendered as the page's `<h1>`. */
  heading?: ReactNode;
  /** Overrides the variant's default supporting copy. */
  description?: ReactNode;
  /**
   * Recovery action slot. Defaults to a real "Back to homepage" `Link` for `not-found`, or a
   * primary "Try again" `Button` (reloads the page) plus a "Back to homepage" `Link` for
   * `server-error`/`offline`. Pass your own `Button`/`Link` (or several) to override — e.g. to
   * wire "Back to homepage" to a router `Link` instead of a plain anchor, or "Try again" to a
   * retry callback instead of a full reload.
   */
  action?: ReactNode;
  /** `href` used by the default "Back to homepage" link. @default "/" */
  homeHref?: string;
}

/**
 * Full-page error state: site chrome, a large code/heading, calm supporting copy, and at least
 * one recovery action. One component with a `variant` covers all three error conditions (404,
 * 500, offline) rather than three near-duplicate components, since they share an identical
 * structural shape (chrome + code + heading + copy + action) and differ only in copy/icon/
 * default action — see the MDX for the fuller rationale.
 */
export const ErrorPages = forwardRef<HTMLDivElement, ErrorPagesProps>(
  (
    {
      header,
      footer,
      variant,
      code,
      heading,
      description,
      action,
      homeHref = "/",
      className,
      ...rest
    },
    ref,
  ) => {
    const defaults = VARIANT_DEFAULTS[variant];
    const resolvedCode = code ?? defaults.code;
    const resolvedHeading = heading ?? defaults.heading;
    const resolvedDescription = description ?? defaults.description;

    // `text-lead`/`font-semibold` are applied on a wrapping element (rather than passed as
    // `className` straight into `Link`) because Link's `cn()` call would otherwise merge the
    // custom `text-lead` font-size token into the same tailwind-merge conflict group as its own
    // `text-text-primary`/`text-masthead-600` color classes (the same `cn()`/tailwind-merge gap
    // documented in Button/Text/Heading) and silently drop one of them. Font-size cascades to
    // the anchor via inheritance instead, since Link itself sets no font-size class.
    const homeLink = (
      <div className="text-lead font-semibold">
        <Link href={homeHref} tone="standalone">
          Back to homepage
        </Link>
      </div>
    );

    const defaultAction = defaults.showsTryAgain ? (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          type="button"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
        {homeLink}
      </div>
    ) : (
      homeLink
    );

    return (
      <div ref={ref} className={cn("flex min-h-screen flex-col", className)} {...rest}>
        <GlobalHeader {...header} />

        <main className="flex flex-1 items-center justify-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6 lg:px-8">
            {defaults.icon}
            <Text
              as="p"
              size="small"
              weight="semibold"
              color="tertiary"
              className="uppercase tracking-wide"
            >
              {resolvedCode}
            </Text>
            <Heading level={1} visualSize="display">
              {resolvedHeading}
            </Heading>
            <Text size="lead" color="secondary" className="max-w-lg">
              {resolvedDescription}
            </Text>
            <div className="mt-4">{action ?? defaultAction}</div>
          </div>
        </main>

        <Footer {...footer} />
      </div>
    );
  },
);
ErrorPages.displayName = "ErrorPages";
