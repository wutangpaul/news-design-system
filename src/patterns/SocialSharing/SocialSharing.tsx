import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/Button";
import { Share } from "@/components/Icon";

/** The URL/title context passed to every share callback. */
export interface SocialShareContext {
  url: string;
  title?: string;
}

/** A single platform-specific share control (e.g. X, Facebook, email). */
export interface SocialSharePlatform {
  /** Stable key for the control. */
  id: string;
  /**
   * Accessible name for the icon-only button (e.g. "Share on X"). Set as the
   * button's `aria-label` — required so every icon-only control has a real
   * accessible name, per this design system's accessibility standards.
   */
  label: string;
  /** Icon rendered inside the button (e.g. from `src/components/Icon`). */
  icon: ReactNode;
  /**
   * Called when the control is activated. This pattern never bakes in a
   * specific social network's SDK/embed/share-URL — the consumer decides
   * what happens (open a share-intent URL, call an SDK, log analytics...).
   */
  onShare: (context: SocialShareContext) => void;
}

export interface SocialSharingProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Canonical URL being shared. */
  url: string;
  /** Title/headline passed to the Web Share API and every platform callback. */
  title?: string;
  /**
   * Platform-specific share controls (X, Facebook, email, ...). Each entry
   * supplies its own icon, accessible label, and `onShare` handler — this
   * pattern renders the button, the consumer owns what sharing actually does.
   */
  platforms?: SocialSharePlatform[];
  /**
   * Called when "Share" is activated and the Web Share API isn't available
   * in the current browser (or the user's browser rejects the call for a
   * reason other than cancelling) — e.g. to open your own share sheet as a
   * fallback. When the Web Share API *is* available, it's used directly and
   * this is not called.
   */
  onShare?: (context: SocialShareContext) => void;
  /**
   * Called after "Copy link" attempts to copy `url` to the clipboard. This
   * pattern doesn't know whether the copy actually succeeded beyond what the
   * Clipboard API reports — use it to show your own toast/confirmation.
   */
  onCopyLink?: (context: SocialShareContext) => void;
  /** Label for the copy-link control. @default "Copy link" */
  copyLinkLabel?: string;
  /** Label announced after a successful copy. @default "Link copied" */
  copiedLabel?: string;
}

/**
 * A row of share controls: a generic "Share" button wired to the Web Share
 * API where available, a "Copy link" button, and any number of consumer-
 * supplied platform buttons (X, Facebook, email...). No specific social
 * network SDK/embed is hardcoded here — platform buttons are entirely
 * driven by the `platforms` prop, and "Share"/"Copy link" only touch
 * standard browser APIs (`navigator.share`, `navigator.clipboard`).
 */
export const SocialSharing = forwardRef<HTMLDivElement, SocialSharingProps>(
  (
    {
      url,
      title,
      platforms = [],
      onShare,
      onCopyLink,
      copyLinkLabel = "Copy link",
      copiedLabel = "Link copied",
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const context: SocialShareContext = { url, title };

    const handleNativeShare = async () => {
      const canUseWebShareApi =
        typeof navigator !== "undefined" && typeof navigator.share === "function";

      if (canUseWebShareApi) {
        try {
          await navigator.share({ url, title });
          return;
        } catch {
          // User cancelled, or the browser rejected the call — fall through
          // to the consumer's own fallback, if any.
        }
      }
      onShare?.(context);
    };

    const handleCopyLink = async () => {
      const canUseClipboardApi =
        typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText);

      if (canUseClipboardApi) {
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          // Clipboard write can be denied (permissions, insecure context);
          // still report the attempt so the consumer can decide what to do.
        }
      }
      setCopied(true);
      onCopyLink?.(context);
      window.setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Share this article"
        className={cn("flex flex-wrap items-center gap-2", className)}
        {...rest}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leadingIcon={<Share size="sm" />}
          onClick={handleNativeShare}
        >
          Share
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleCopyLink}>
          {copied ? copiedLabel : copyLinkLabel}
        </Button>
        <span role="status" className="sr-only">
          {copied ? copiedLabel : ""}
        </span>
        {platforms.map((platform) => (
          <Button
            key={platform.id}
            type="button"
            variant="ghost"
            size="sm"
            aria-label={platform.label}
            onClick={() => platform.onShare(context)}
          >
            {platform.icon}
          </Button>
        ))}
      </div>
    );
  },
);
SocialSharing.displayName = "SocialSharing";
