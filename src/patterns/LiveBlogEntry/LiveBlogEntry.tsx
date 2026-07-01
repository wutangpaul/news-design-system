import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "../../components/Badge";
import { Heading } from "../../components/Heading";

type LiveBlogEntryLabel = "breaking" | "update";

const labelVariant = {
  breaking: "error",
  update: "info",
} as const;

const defaultLabelText: Record<LiveBlogEntryLabel, string> = {
  breaking: "Breaking",
  update: "Update",
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export interface LiveBlogEntryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** ISO 8601 timestamp for this update, rendered via a real, machine-readable `<time>`. */
  timestamp: string;
  /** Short headline-ish title for this update. */
  title: ReactNode;
  /**
   * Semantic heading level for `title` (determines the rendered `h1`-`h6` tag). Pick
   * whatever is correct for this entry's position in the surrounding document outline —
   * the visual size stays small regardless. @default 3
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Optional "BREAKING"/"UPDATE" badge. Omit for a plain update with no badge. */
  label?: LiveBlogEntryLabel;
  /** Overrides the badge's visible text. Defaults to "Breaking"/"Update" based on `label`. */
  labelText?: string;
  /** Body content for this update. */
  children?: ReactNode;
}

/**
 * A single timestamped update in a running live-blog feed. Stateless by design: a real live
 * blog inserts new entries at the top of the feed as they arrive, so this component never
 * caches or remembers anything about a previous render — passing it new `timestamp`/`title`/
 * `children` on a re-render (or mounting a fresh one) always reflects exactly those props.
 */
export const LiveBlogEntry = forwardRef<HTMLElement, LiveBlogEntryProps>(
  (
    { timestamp, title, headingLevel = 3, label, labelText, children, className, ...rest },
    ref,
  ) => {
    return (
      <article
        ref={ref}
        className={cn(
          "flex flex-col gap-2 border-b border-surface-border pb-6 last:border-b-0 last:pb-0",
          className,
        )}
        {...rest}
      >
        <div className="flex flex-wrap items-center gap-2">
          <time dateTime={timestamp} className="text-caption font-medium text-text-tertiary">
            {formatTimestamp(timestamp)}
          </time>
          {label && (
            <Badge variant={labelVariant[label]} size="sm">
              {labelText ?? defaultLabelText[label]}
            </Badge>
          )}
        </div>
        <Heading level={headingLevel} visualSize={5}>
          {title}
        </Heading>
        {children && <div className="text-body text-text-secondary">{children}</div>}
      </article>
    );
  },
);
LiveBlogEntry.displayName = "LiveBlogEntry";
