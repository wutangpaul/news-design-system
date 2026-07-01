import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface SecondaryNavLink {
  /** Visible label. */
  label: string;
  /** Destination URL. */
  href: string;
  /** Marks this item as the current page (`aria-current="page"`). */
  current?: boolean;
}

export interface SecondaryNavigationProps {
  /** Ordered list of sub-section links. */
  items: SecondaryNavLink[];
  /** Accessible label for the `<nav>` landmark. @default "Secondary" */
  ariaLabel?: string;
  className?: string;
}

/**
 * A lower-emphasis navigation for sub-sections within a category page (e.g. "World > Africa /
 * Americas / Asia / Europe"). Renders as a real `<nav>` with a horizontally scrollable link
 * list, styled to look tab-like, with the active sub-section marked `aria-current="page"`.
 *
 * This intentionally does **not** reuse the `Tabs` component. `Tabs` implements the WAI-ARIA
 * APG Tabs pattern, whose contract is a single page with `role="tab"`/`role="tabpanel"` pairs
 * that swap visibility via JavaScript — every tab shares one URL. Secondary section navigation
 * is the opposite: each item is a distinct, bookmarkable, server-rendered page reached via a
 * real `href`. Giving those anchors `role="tab"` (and hiding "other" content as a `tabpanel`)
 * would misrepresent genuine page navigation as in-page panel switching to assistive
 * technology, and would cost the roving-tabindex/arrow-key contract Tabs users expect but that
 * doesn't apply to plain links (which already navigate correctly via Tab/Enter). A plain
 * `<nav>` link list is the semantically correct choice here.
 */
export const SecondaryNavigation = forwardRef<HTMLElement, SecondaryNavigationProps>(
  ({ items, ariaLabel = "Secondary", className }, ref) => {
    return (
      <nav ref={ref} aria-label={ariaLabel} className={cn("border-b border-surface-border", className)}>
        <ul className="flex gap-1 overflow-x-auto">
          {items.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "relative -mb-px inline-block whitespace-nowrap border-b-2 border-transparent px-3 py-2",
                  "text-small font-medium text-text-secondary transition-colors hover:text-text-primary",
                  item.current && "border-masthead-500 text-text-primary",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  },
);
SecondaryNavigation.displayName = "SecondaryNavigation";
