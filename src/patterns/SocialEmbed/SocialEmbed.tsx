import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";

/**
 * The social network the embedded post came from. Used to derive a default
 * platform label — this pattern has no brand icon set for any of these (see
 * `SocialSharing`'s docs for why: the curated icon set in `src/components/Icon`
 * intentionally has no social-network brand marks), so `"other"` is just as
 * valid a choice as any named platform when a brand mark isn't needed.
 */
export type SocialEmbedPlatform = "x" | "instagram" | "facebook" | "threads" | "other";

const defaultPlatformLabels: Record<SocialEmbedPlatform, string> = {
  x: "X",
  instagram: "Instagram",
  facebook: "Facebook",
  threads: "Threads",
  other: "Social post",
};

export interface SocialEmbedProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Which social network the embedded post is from. Drives the default platform label. */
  platform: SocialEmbedPlatform;
  /**
   * Overrides the default label derived from `platform` (e.g. a rebranded platform, or a
   * more specific label than `"Social post"` for `platform="other"`).
   */
  platformLabel?: string;
  /**
   * Optional platform mark, e.g. a brand icon a consuming app supplies itself. Omitted by
   * default — see the `platform` doc comment above for why this pattern doesn't ship one.
   */
  icon?: ReactNode;
  /** The embedded post's author display name. */
  authorName: string;
  /** The embedded post's author handle/username, without a leading "@" (added when rendered). */
  authorHandle: string;
  /** Author photo URL. Omit to fall back to initials (via `Avatar`). */
  authorAvatarSrc?: string;
  /** The post's text/caption content. */
  text: ReactNode;
  /** Link to view the original post on the source platform. */
  href: string;
  /** Optional human-readable timestamp (e.g. "3h ago", "Jun 12"), shown next to the link. */
  timestamp?: string;
}

/**
 * A static, bordered placeholder for embedding a social post (tweet/Instagram-style) within
 * article body content. This is **not** a live embed — see this folder's `.mdx` for why —
 * it's a generic card showing a platform label, the author's name/handle, the post text, an
 * optional timestamp, and a link to the original post, all driven by plain props rather than
 * a real platform SDK/iframe. Composes `Card`, `Avatar`, `Badge`, `Text`, and `Link`.
 */
export const SocialEmbed = forwardRef<HTMLElement, SocialEmbedProps>(
  (
    {
      platform,
      platformLabel,
      icon,
      authorName,
      authorHandle,
      authorAvatarSrc,
      text,
      href,
      timestamp,
      className,
      ...rest
    },
    ref,
  ) => {
    const label = platformLabel ?? defaultPlatformLabels[platform];

    return (
      <Card
        as="figure"
        ref={ref}
        variant="outlined"
        aria-label={`${label} post by ${authorName}`}
        className={cn("max-w-prose", className)}
        {...rest}
      >
        <Card.Body className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={authorName} src={authorAvatarSrc} size="sm" />
            <div className="flex flex-col">
              <Text as="span" size="small" weight="semibold">
                {authorName}
              </Text>
              <Text as="span" size="caption" color="secondary">
                @{authorHandle}
              </Text>
            </div>
          </div>
          <Badge variant="neutral" className={icon ? "gap-1.5" : undefined}>
            {icon}
            {label}
          </Badge>
        </Card.Body>

        <Card.Body className="pt-0">
          <Text as="p" size="body">
            {text}
          </Text>
        </Card.Body>

        <Card.Footer className="items-center gap-3">
          {timestamp ? (
            <Text as="span" size="caption" color="tertiary">
              {timestamp}
            </Text>
          ) : null}
          <Link href={href} tone="standalone" external className={timestamp ? undefined : "ml-auto"}>
            View original post
          </Link>
        </Card.Footer>
      </Card>
    );
  },
);
SocialEmbed.displayName = "SocialEmbed";
