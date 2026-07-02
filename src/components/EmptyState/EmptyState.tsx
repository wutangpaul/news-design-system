import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Names for the small set of hand-drawn icons EmptyState ships with, covering the most
 * common "nothing here" cases (a search that returned nothing, a date/filter range with
 * no matches, an empty comments/messages list). Pass `icon` instead for anything else —
 * `iconVariant` is a convenience, not the only way to illustrate an empty state.
 */
export type EmptyStateIconVariant = "search" | "calendar" | "message" | "inbox";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Custom icon (or any other decorative node) shown above the heading. Takes precedence
   * over `iconVariant` when both are given. Always rendered inside an `aria-hidden`
   * wrapper — EmptyState has no idea what the icon means on its own, the heading/
   * description carry the actual message. Omit both `icon` and `iconVariant` for a
   * text-only empty state.
   */
  icon?: ReactNode;
  /** One of a small set of built-in preset icons. Ignored when `icon` is provided. */
  iconVariant?: EmptyStateIconVariant;
  /**
   * The empty state's own heading, e.g. `"No results found"`, `"No stories in this range"`,
   * `"No comments yet"`. Rendered as a real heading element — see `headingLevel`.
   */
  heading: ReactNode;
  /** Supporting copy: why this is empty and/or what the reader can do about it. */
  description?: ReactNode;
  /**
   * Semantic heading level (`1`-`6`) for `heading`, so EmptyState fits correctly into
   * whatever document outline the surrounding page already has (e.g. `2` when the page's
   * own `<h1>` lives elsewhere in a template's chrome). @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Optional call to action rendered below the description — typically a `Button` or
   * `Link` ("Clear filters", "Browse all sections", "Back to homepage"). EmptyState
   * renders whatever is passed as-is; it has no opinion on what the action does.
   */
  action?: ReactNode;
}

function PresetIcon({ variant }: { variant: EmptyStateIconVariant }) {
  switch (variant) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
          <circle cx={11} cy={11} r={7} stroke="currentColor" strokeWidth={1.5} />
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
          <rect
            x={3.5}
            y={5}
            width={17}
            height={15}
            rx={2}
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <path
            d="M3.5 9.5h17M8 3v3.5M16 3v3.5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      );
    case "message":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
          <path
            d="M4 5.5h16a1 1 0 011 1V16a1 1 0 01-1 1H9l-4.5 4V17H4a1 1 0 01-1-1V6.5a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "inbox":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
          <path
            d="M3.5 13h5l1.5 2.5h4L15.5 13h5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d="M3.5 13V7a1 1 0 011-1h15a1 1 0 011 1v6"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path
            d="M3.5 13v5a1 1 0 001 1h15a1 1 0 001-1v-5"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

/**
 * Generic "nothing to show" state: an optional icon, a heading, optional supporting copy,
 * and an optional action. Deliberately content-agnostic — every prop is supplied by the
 * caller, nothing is hardcoded — so the same component covers "no search results," "no
 * stories in this date range," "no comments yet," or any other empty list/collection.
 *
 * EmptyState renders no `role`/`aria-live` of its own: whether an empty state should
 * interrupt as a live announcement (e.g. right after a search) or sit quietly as part of
 * the initial page (e.g. an empty comments section) depends on context only the caller
 * has. Pass `role="status"` (or whatever is appropriate) through the spread props when
 * you need it — see the MDX for the recommended pattern.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, iconVariant, heading, description, headingLevel = 2, action, className, ...rest },
    ref,
  ) => {
    const HeadingTag = `h${headingLevel}` as ElementType;
    const resolvedIcon = icon ?? (iconVariant ? <PresetIcon variant={iconVariant} /> : null);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border border-dashed border-surface-border px-6 py-16 text-center",
          className,
        )}
        {...rest}
      >
        {resolvedIcon ? (
          <span className="text-text-tertiary" aria-hidden="true">
            {resolvedIcon}
          </span>
        ) : null}
        <HeadingTag className="font-serif text-h5 font-bold text-text-primary">
          {heading}
        </HeadingTag>
        {description ? (
          <p className="max-w-md font-sans text-body text-text-secondary">{description}</p>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";
