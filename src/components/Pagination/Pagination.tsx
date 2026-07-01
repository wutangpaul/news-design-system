import * as React from "react";
import { cn } from "@/lib/cn";

const ELLIPSIS = "ellipsis" as const;
type PaginationItemValue = number | typeof ELLIPSIS;

function range(start: number, end: number): number[] {
  const length = Math.max(end - start + 1, 0);
  return Array.from({ length }, (_, i) => start + i);
}

/**
 * Computes the list of page numbers (and ellipsis markers) to render for a given current page
 * and total page count, always including the first and last page plus a window of
 * `siblingCount` pages around the current page.
 */
export function getPaginationItems(
  page: number,
  pageCount: number,
  siblingCount = 1,
): PaginationItemValue[] {
  const safePageCount = Math.max(pageCount, 1);
  const safePage = Math.min(Math.max(page, 1), safePageCount);
  // first + last + current + 2 siblings + 2 ellipses
  const totalVisible = siblingCount * 2 + 5;

  if (totalVisible >= safePageCount) {
    return range(1, safePageCount);
  }

  const leftSiblingIndex = Math.max(safePage - siblingCount, 1);
  const rightSiblingIndex = Math.min(safePage + siblingCount, safePageCount);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < safePageCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    return [...range(1, leftItemCount), ELLIPSIS, safePageCount];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    return [1, ELLIPSIS, ...range(safePageCount - rightItemCount + 1, safePageCount)];
  }

  return [1, ELLIPSIS, ...range(leftSiblingIndex, rightSiblingIndex), ELLIPSIS, safePageCount];
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

const navButtonClasses =
  "inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-small font-medium text-text-secondary " +
  "hover:bg-surface-raised hover:text-text-primary disabled:pointer-events-none disabled:opacity-40";

const pageButtonClasses =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-small font-medium " +
  "text-text-secondary hover:bg-surface-raised hover:text-text-primary";

const activePageClasses = "bg-masthead-500 text-text-on-brand hover:bg-masthead-500 hover:text-text-on-brand";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Current 1-indexed page. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the target page number when the user navigates. */
  onPageChange: (page: number) => void;
  /** Number of page numbers shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Hides the Previous/Next controls, showing only the page number list. */
  hidePrevNext?: boolean;
}

/**
 * Page navigation for paginated lists of content (e.g. search results, archive listings).
 * Truncates long page ranges with an ellipsis, always keeping the first/last page and a window
 * around the current page reachable.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ page, pageCount, onPageChange, siblingCount = 1, hidePrevNext, className, ...rest }, ref) => {
    const safePageCount = Math.max(pageCount, 1);
    const items = getPaginationItems(page, safePageCount, siblingCount);
    const isFirst = page <= 1;
    const isLast = page >= safePageCount;

    const goTo = (target: number) => {
      if (target < 1 || target > safePageCount || target === page) return;
      onPageChange(target);
    };

    return (
      <nav ref={ref} aria-label="Pagination" className={cn(className)} {...rest}>
        <ul className="flex items-center gap-1">
          {!hidePrevNext && (
            <li>
              <button
                type="button"
                className={navButtonClasses}
                onClick={() => goTo(page - 1)}
                disabled={isFirst}
                aria-disabled={isFirst}
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Previous</span>
              </button>
            </li>
          )}

          {items.map((item, index) =>
            item === ELLIPSIS ? (
              <li
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="inline-flex h-9 min-w-9 items-center justify-center text-text-tertiary"
              >
                &#8230;
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  aria-current={item === page ? "page" : undefined}
                  aria-label={`Page ${item}`}
                  onClick={() => goTo(item)}
                  className={cn(pageButtonClasses, item === page && activePageClasses)}
                >
                  {item}
                </button>
              </li>
            ),
          )}

          {!hidePrevNext && (
            <li>
              <button
                type="button"
                className={navButtonClasses}
                onClick={() => goTo(page + 1)}
                disabled={isLast}
                aria-disabled={isLast}
                aria-label="Next page"
              >
                <span className="sr-only sm:not-sr-only">Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";
