import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { ExternalLink as ExternalLinkIcon } from "../Icon";

const linkVariants = cva(
  [
    "rounded-sm font-sans underline-offset-4 transition-colors duration-fast",
    // Visited-state awareness: color is one of the few CSS properties browsers honor for
    // `:visited`, so we dim visited links to help readers see what they've already read —
    // a common editorial/news pattern. Underline distance (underline-offset) stays constant
    // across visited/unvisited so only color communicates the state (never the sole signal,
    // since the href/content itself is unchanged and still fully readable).
    "visited:text-text-tertiary",
  ].join(" "),
  {
    variants: {
      tone: {
        /** Underlined run-in text within a sentence/paragraph. */
        inline: "text-masthead-600 underline hover:text-masthead-700",
        /** Stand-alone link (card title, nav item) — underline appears on hover/focus only. */
        standalone: "text-text-primary no-underline hover:text-masthead-600 hover:underline",
      },
    },
    defaultVariants: { tone: "inline" },
  },
);

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /**
   * Marks the link as pointing off-site. Appends a small external-link icon and forces
   * `target="_blank"` with `rel="noopener noreferrer"` for safety.
   */
  external?: boolean;
  children?: ReactNode;
}

/**
 * Wraps a native `<a>` with the design system's editorial link styling. Always renders a
 * real anchor, so keyboard focus/activation and browser context-menu behavior work
 * out of the box.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ tone, external = false, className, children, target, rel, ...rest }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          linkVariants({ tone }),
          external && "inline-flex items-center gap-1",
          className,
        )}
        target={external ? "_blank" : target}
        rel={external ? "noopener noreferrer" : rel}
        {...rest}
      >
        {children}
        {external ? <ExternalLinkIcon size="sm" className="shrink-0" /> : null}
      </a>
    );
  },
);
Link.displayName = "Link";
