import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface GlobalHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Masthead/logo slot (e.g. a linked wordmark or `<img>`). */
  logo: ReactNode;
  /**
   * The site's primary navigation, typically a `<PrimaryNavigation items={...} />` from
   * `src/patterns/PrimaryNavigation`. Accepted as a slot rather than a list of nav items so
   * this pattern stays a pure composition shell — it has no opinion on what "primary
   * navigation" means.
   */
  primaryNavigation?: ReactNode;
  /**
   * Search trigger slot, typically a `<SearchExperience />` from
   * `src/patterns/SearchExperience`.
   */
  search?: ReactNode;
  /** Subscribe/account/CTA slot (e.g. a `Button`, `Avatar`, or `Dropdown` account menu). */
  actions?: ReactNode;
  /** Sticks the header to the top of the viewport using the shared `stickyHeader` z-index layer. @default false */
  sticky?: boolean;
}

/**
 * Site-wide top bar: masthead/logo, primary navigation, search trigger, and an account/
 * subscribe CTA. This is a composition shell only — it accepts the actual navigation, search,
 * and actions as slots (props) rather than hardcoding them, since each is its own pattern
 * (`PrimaryNavigation`, `SearchExperience`) built and tested independently.
 */
export const GlobalHeader = forwardRef<HTMLElement, GlobalHeaderProps>(
  ({ logo, primaryNavigation, search, actions, sticky = false, className, ...rest }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "border-b border-surface-border bg-surface-canvas",
          sticky && "sticky top-0 z-stickyHeader",
          className,
        )}
        {...rest}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-6 lg:px-8">
          {/* The masthead never truncates — a brand that reads "The Dail…" is worse than any
              layout compromise. It scales down instead (clamp: 1rem at a 375px viewport up to
              h5 at the xl breakpoint), and when the wordmark + nav + actions genuinely can't
              share one row, flex-wrap drops the actions cluster to a second right-aligned row
              (the classic two-tier mobile news header) rather than squeezing the brand. */}
          <div className="shrink-0 font-serif text-[clamp(1rem,0.45rem+2.35vw,1.5rem)] font-bold text-text-primary">
            {logo}
          </div>

          {primaryNavigation && <div className="flex flex-1 items-center">{primaryNavigation}</div>}

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {search}
            {actions}
          </div>
        </div>
      </header>
    );
  },
);
GlobalHeader.displayName = "GlobalHeader";
