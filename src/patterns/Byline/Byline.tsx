import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/Avatar";
import { Link } from "@/components/Link";

export interface BylineAuthor {
  /** Author's display name. */
  name: string;
  /** Link to the author's profile page. Omit to render the name as plain text. */
  href?: string;
  /** Author photo URL, passed through to `Avatar`'s `src`. Omit to fall back to initials. */
  avatarSrc?: string;
}

export interface BylineProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** One or more authors credited on the piece, rendered as "By A", "By A and B", or "By A, B, and C". */
  authors: BylineAuthor[];
  /** Publish timestamp. Accepts a `Date` or an ISO 8601 string; always rendered with a real `dateTime` attribute. */
  publishedAt: string | Date;
  /** Optional last-updated timestamp, shown as "Updated {date}" after the publish date. */
  updatedAt?: string | Date;
  /** Shows a small avatar per author. @default true */
  showAvatar?: boolean;
  /** Locale used to format the human-readable date label. @default "en-US" */
  locale?: string;
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/** Machine-readable value for `<time dateTime>` — always a real ISO 8601 string. */
function toISOString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : toDate(value).toISOString();
}

/** Human-readable date label, e.g. "June 30, 2026". */
function formatDate(value: string | Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(toDate(value));
}

/** Joins author name nodes with commas and a trailing "and", e.g. "A, B, and C". */
function joinAuthors(nodes: ReactNode[]): ReactNode[] {
  return nodes.flatMap((node, index) => {
    if (index === 0) return [node];
    const isLast = index === nodes.length - 1;
    if (!isLast) return [", ", node];
    return [nodes.length > 2 ? ", and " : " and ", node];
  });
}

/**
 * "By [Author Name], Updated [time]" byline line. Composes `Avatar` (optional
 * small author photo), `Link` (author name linking to their author page,
 * falling back to plain text when no `href` is given), and a real `<time>`
 * element with a machine-readable `dateTime` for the publish/update
 * timestamps. Works standalone — it does not need to be rendered inside
 * `ArticleHeader` or any other pattern.
 */
export const Byline = forwardRef<HTMLDivElement, BylineProps>(
  (
    { authors, publishedAt, updatedAt, showAvatar = true, locale = "en-US", className, ...rest },
    ref,
  ) => {
    const nameNodes = authors.map((author) =>
      author.href ? (
        <Link key={author.name} href={author.href} tone="standalone" className="font-medium">
          {author.name}
        </Link>
      ) : (
        <span key={author.name} className="font-medium text-text-primary">
          {author.name}
        </span>
      ),
    );

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3 text-small text-text-secondary", className)}
        {...rest}
      >
        {showAvatar && authors.length > 0 && (
          <div className="flex -space-x-2">
            {authors.map((author) => (
              <Avatar
                key={author.name}
                name={author.name}
                src={author.avatarSrc}
                size="sm"
                className="ring-2 ring-surface-canvas"
              />
            ))}
          </div>
        )}
        <span>
          By {joinAuthors(nameNodes).map((node, index) => (
            <Fragment key={index}>{node}</Fragment>
          ))}
          <span aria-hidden="true"> · </span>
          <time dateTime={toISOString(publishedAt)}>{formatDate(publishedAt, locale)}</time>
          {updatedAt && (
            <>
              <span aria-hidden="true"> · </span>
              Updated <time dateTime={toISOString(updatedAt)}>{formatDate(updatedAt, locale)}</time>
            </>
          )}
        </span>
      </div>
    );
  },
);
Byline.displayName = "Byline";
