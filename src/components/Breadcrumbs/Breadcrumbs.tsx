import * as React from "react";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  /** Visible label for the crumb. */
  label: React.ReactNode;
  /** Destination URL. Omit for the current page (it will render as plain text). */
  href?: string;
  /**
   * Explicitly mark this item as the current page. If no item sets this, the last item in
   * `items` is treated as the current page.
   */
  current?: boolean;
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered list of crumbs, from root to current page. */
  items: BreadcrumbItem[];
  /** Custom separator rendered between crumbs. @default a chevron icon */
  separator?: React.ReactNode;
}

/**
 * Shows the user's location within a site hierarchy as a trail of links.
 * `nav[aria-label="Breadcrumb"]` > `ol` > `li` per common breadcrumb conventions
 * (https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).
 */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, separator, className, ...rest }, ref) => {
    const hasExplicitCurrent = items.some((item) => item.current);

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn("text-small", className)} {...rest}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrent = hasExplicitCurrent ? !!item.current : isLast;
            const key = `${index}-${item.href ?? ""}`;

            return (
              <li key={key} className="flex items-center gap-1.5">
                {isCurrent || !item.href ? (
                  <span
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "text-text-secondary",
                      isCurrent && "font-medium text-text-primary",
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className="text-text-secondary underline-offset-2 hover:text-masthead-500 hover:underline"
                  >
                    {item.label}
                  </a>
                )}
                {!isLast && (
                  <span aria-hidden="true" className="text-text-tertiary">
                    {separator ?? <ChevronRightIcon className="h-3.5 w-3.5" />}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
Breadcrumbs.displayName = "Breadcrumbs";
