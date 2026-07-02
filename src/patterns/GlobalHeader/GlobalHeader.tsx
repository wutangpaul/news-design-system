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
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          {/* min-w-0 + truncate: the wordmark yields and ellipsizes before the actions cluster
              (search/CTA) can be pushed off-screen on narrow viewports */}
          <div className="min-w-0 shrink truncate font-serif text-h6 font-bold text-text-primary sm:text-h5">
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
