import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";

export interface AuthorCardSocialLink {
  /** Platform/service label, e.g. "Twitter", "Email", "Website". */
  label: string;
  /** Destination URL (or `mailto:`/`tel:` URI). */
  href: string;
  /** Whether this points off-site. Passed through to `Link`'s `external` prop. @default true */
  external?: boolean;
}

export interface AuthorCardContent {
  /** Author's display name. */
  name: string;
  /** Author photo URL. Omit to fall back to initials (via `Avatar`). */
  avatarSrc?: string;
  /** Job title or beat, e.g. "Politics Reporter". */
  title?: string;
  /** Short bio, a sentence or two. */
  bio?: string;
  /** Link to the author's full profile page. When given, the name is rendered as a link. */
  href?: string;
  /** Social/contact links shown at the bottom of the card. */
  socialLinks?: AuthorCardSocialLink[];
}

export interface AuthorCardProps
  extends AuthorCardContent,
    Omit<HTMLAttributes<HTMLElement>, keyof AuthorCardContent> {
  /**
   * Semantic heading level for the author's name, so the document outline stays correct
   * wherever the card is placed (e.g. `1` on a standalone author profile page, `3` in an
   * inline "more from this author" callout within an article).
   * @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Fuller author bio block — photo, name, title/beat, short bio, and optional
 * social/contact links. Composes `Avatar`, `Heading`, `Text`, and `Link`
 * inside a `Card`. Used on author profile pages and inline "more from this
 * author" call-outs.
 */
export const AuthorCard = forwardRef<HTMLElement, AuthorCardProps>(
  (
    { name, avatarSrc, title, bio, href, socialLinks, headingLevel = 2, className, ...rest },
    ref,
  ) => {
    return (
      <Card
        as="section"
        ref={ref}
        variant="outlined"
        aria-label={`About ${name}`}
        className={cn(className)}
        {...rest}
      >
        <Card.Body className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar name={name} src={avatarSrc} size="xl" />
          <div className="flex flex-col gap-1">
            <Heading level={headingLevel} visualSize={5}>
              {href ? (
                <Link href={href} tone="standalone">
                  {name}
                </Link>
              ) : (
                name
              )}
            </Heading>
            {title && (
              <Text size="small" color="secondary">
                {title}
              </Text>
            )}
          </div>
        </Card.Body>
        {bio && (
          <Card.Body className="pt-0">
            <Text size="body" color="secondary">
              {bio}
            </Text>
          </Card.Body>
        )}
        {socialLinks && socialLinks.length > 0 && (
          <Card.Footer className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <Link key={link.label} href={link.href} tone="standalone" external={link.external ?? true}>
                {link.label}
              </Link>
            ))}
          </Card.Footer>
        )}
      </Card>
    );
  },
);
AuthorCard.displayName = "AuthorCard";
