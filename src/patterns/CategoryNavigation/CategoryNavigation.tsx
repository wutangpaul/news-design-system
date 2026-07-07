import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Link } from "../../components/Link";

export interface CategoryNavItem {
  /** Visible label for the section link. */
  label: ReactNode;
  /** Destination URL. */
  href: string;
  /** Marks this item as the current section (`aria-current="page"`), rendered as plain text. */
  current?: boolean;
}

export interface CategoryNavigationProps extends HTMLAttributes<HTMLElement> {
  /** Ordered list of section links, e.g. World / Politics / Business / Tech / Sports. */
  items: CategoryNavItem[];
  /** Accessible label for the `nav` landmark, distinguishing it from other navigation regions. @default "Section navigation" */
  ariaLabel?: string;
}

/**
 * Horizontal list of top-level section links, typically placed just below a site's global
 * header. Scrolls horizontally on narrow viewports rather than wrapping, so the row stays a
 * single predictable line. Follows the same current-page convention as `Breadcrumbs`: the
 * current section is marked with `aria-current="page"` and rendered as plain (non-link) text,
 * since re-linking to the page the reader is already on isn't useful.
 */
export const CategoryNavigation = forwardRef<HTMLElement, CategoryNavigationProps>(
  ({ items, ariaLabel = "Section navigation", className, ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn("w-full overflow-x-auto border-b border-surface-border", className)}
        {...rest}
      >
        <ul className="flex w-max min-w-full items-center gap-1 whitespace-nowrap px-1 py-1">
          {items.map((item, index) => {
            const key = `${index}-${item.href}`;
            return (
              <li key={key}>
                {item.current ? (
                  <span
                    aria-current="page"
                    className="inline-block rounded-md px-3 py-2 text-small font-semibold text-text-primary"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    tone="standalone"
                    className="inline-block rounded-md px-3 py-2 text-small text-text-secondary hover:text-masthead-600 dark:hover:text-masthead-400"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  },
);
CategoryNavigation.displayName = "CategoryNavigation";
