import { forwardRef, useState, type HTMLAttributes, type ReactEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-surface-sunken font-sans font-medium text-text-secondary",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-caption",
        sm: "h-8 w-8 text-caption",
        md: "h-10 w-10 text-small",
        lg: "h-14 w-14 text-body",
        xl: "h-20 w-20 text-lead",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const statusDotVariants = cva(
  "absolute rounded-full ring-2 ring-surface-canvas",
  {
    variants: {
      size: {
        xs: "h-1.5 w-1.5 bottom-0 right-0",
        sm: "h-2 w-2 bottom-0 right-0",
        md: "h-2.5 w-2.5 bottom-0 right-0",
        lg: "h-3.5 w-3.5 bottom-0.5 right-0.5",
        xl: "h-4 w-4 bottom-1 right-1",
      },
      status: {
        online: "bg-success-500",
        offline: "bg-ink-400",
      },
    },
    defaultVariants: {
      size: "md",
      status: "offline",
    },
  },
);

/** Derives up to two initials from a person's display name (e.g. "Jane Doe" -> "JD"). */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0] + words[words.length - 1]![0]).toUpperCase();
}

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof avatarVariants> {
  /** Full display name. Used to derive initials and as the accessible label. */
  name: string;
  /** Image source. When omitted, or if it fails to load, initials are shown instead. */
  src?: string;
  /** Presence indicator. Omit for no status dot. */
  status?: "online" | "offline";
}

/**
 * Circular author/user avatar. Falls back to initials derived from `name`
 * when no `src` is given or the image fails to load. Color is never the only
 * signal for status — the status dot ships with a visually-hidden label.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ name, src, status, size, className, ...rest }, ref) => {
    const [imageFailed, setImageFailed] = useState(false);
    const showImage = Boolean(src) && !imageFailed;

    const handleError: ReactEventHandler<HTMLImageElement> = () => {
      setImageFailed(true);
    };

    return (
      <span
        {...rest}
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            onError={handleError}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
        <span className="sr-only">{name}</span>
        {status && (
          <span
            aria-hidden="true"
            className={statusDotVariants({ size, status })}
          />
        )}
        {status && (
          <span className="sr-only">
            {status === "online" ? "Online" : "Offline"}
          </span>
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
