import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FooterLink {
  label: string;
  href: string;
  /** Marks the link as pointing off-site (opens in a new tab). */
  external?: boolean;
}

export interface FooterLinkGroup {
  /** Group heading (e.g. "Sections", "Company", "Legal"). */
  heading: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  /** Accessible label, e.g. "Follow us on X". */
  label: string;
  href: string;
  /** Icon content — typically an `Icon`/named icon from `src/components/Icon`. */
  icon: ReactNode;
}

export interface FooterProps {
  /** Masthead/logo slot. */
  logo?: ReactNode;
  /** Columns of grouped links (sections, company, legal, etc). */
  groups: FooterLinkGroup[];
  /**
   * Newsletter signup slot, typically a `<NewsletterSignup />` pattern. Accepted as a slot
   * rather than built here, since that form's validation/submission logic is its own pattern.
   */
  newsletterSlot?: ReactNode;
  /** Social/follow links, rendered with consumer-supplied icons. */
  socialLinks?: FooterSocialLink[];
  /** Copyright/legal line at the very bottom (e.g. "© 2026 The Daily Ledger."). */
  copyrightText?: ReactNode;
  /** Compact legal links shown alongside the copyright line (Privacy, Terms, etc). */
  legalLinks?: FooterLink[];
  className?: string;
}

/**
 * Site-wide bottom area: grouped link columns, an optional newsletter signup slot, social
 * links, and a bottom legal/copyright bar. Renders a real `<footer>` (the `contentinfo`
 * landmark) with a single `<nav>` grouping the link columns.
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    { logo, groups, newsletterSlot, socialLinks, copyrightText, legalLinks, className },
    ref,
  ) => {
    return (
      <footer
        ref={ref}
        className={cn("border-t border-surface-border bg-surface-canvas", className)}
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            {logo && (
              <div className="font-serif text-h6 font-bold text-text-primary">{logo}</div>
            )}

            {/*
              A single nav landmark groups every link column: each column's heading acts as a
              visual/structural sub-grouping without requiring a separate landmark per column,
              which would otherwise clutter the page's landmark list for screen-reader users
              navigating by landmark.
            */}
            <nav aria-label="Footer" className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-2xl">
              {groups.map((group) => (
                <div key={group.heading}>
                  <h2 className="mb-3 text-small font-semibold text-text-primary">
                    {group.heading}
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="text-small text-text-secondary hover:text-text-primary hover:underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {newsletterSlot && <div className="lg:w-80 lg:shrink-0">{newsletterSlot}</div>}
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <ul className="mt-10 flex items-center gap-3 border-t border-surface-border pt-6">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {(copyrightText || (legalLinks && legalLinks.length > 0)) && (
            <div
              className={cn(
                "flex flex-col gap-3 border-surface-border pt-6 text-caption text-text-tertiary sm:flex-row sm:items-center sm:justify-between",
                !(socialLinks && socialLinks.length > 0) && "mt-10 border-t",
              )}
            >
              {copyrightText && <p>{copyrightText}</p>}
              {legalLinks && legalLinks.length > 0 && (
                <ul className="flex flex-wrap gap-4">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="hover:text-text-primary hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </footer>
    );
  },
);
Footer.displayName = "Footer";
