import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/Text";

/**
 * Common IAB-style ad unit sizes. Dimensions are the industry-standard pixel sizes
 * themselves (not part of this design system's internal spacing scale), so they're
 * expressed as Tailwind arbitrary values rather than mapped to spacing tokens.
 */
export type AdSlotSize = "leaderboard" | "medium-rectangle" | "sidebar";

interface AdSlotDimensions {
  width: number;
  height: number;
}

const dimensionsBySize: Record<AdSlotSize, AdSlotDimensions> = {
  leaderboard: { width: 728, height: 90 },
  "medium-rectangle": { width: 300, height: 250 },
  sidebar: { width: 300, height: 600 },
};

const boxSizeClasses: Record<AdSlotSize, string> = {
  leaderboard: "w-[728px] h-[90px] max-w-full",
  "medium-rectangle": "w-[300px] h-[250px] max-w-full",
  sidebar: "w-[300px] h-[600px] max-w-full",
};

export interface AdSlotProps extends HTMLAttributes<HTMLDivElement> {
  /** Which standard ad unit size to render. @default "medium-rectangle" */
  size?: AdSlotSize;
  /**
   * Disclosure label shown above the slot so readers can distinguish sponsored
   * content from editorial content (also a legal/regulatory requirement for most
   * publications). @default "Advertisement"
   */
  label?: string;
  /**
   * The actual ad content (a real ad network's mount point, a house ad image, ...).
   * When omitted, a placeholder empty state is shown at the slot's documented
   * dimensions instead. This pattern has no ad network SDK of its own — it only
   * provides the labeled, correctly-sized container.
   */
  children?: ReactNode;
}

/**
 * Labeled, standard-sized placeholder container for sponsored content/advertising.
 * Renders a visible disclosure label (so readers can tell ads apart from editorial
 * content) above a container fixed to one of the common IAB-style ad sizes
 * (`leaderboard` 728x90, `medium-rectangle` 300x250, `sidebar` 300x600). Composes
 * `Text` for the label. The root element carries a `role="complementary"` landmark
 * named after the same label, so assistive tech can identify (and skip past) the ad
 * region just as easily as a sighted reader can visually distinguish it.
 */
export const AdSlot = forwardRef<HTMLDivElement, AdSlotProps>(
  (
    { size = "medium-rectangle", label = "Advertisement", children, className, ...rest },
    ref,
  ) => {
    const { width, height } = dimensionsBySize[size];

    return (
      <div
        ref={ref}
        role="complementary"
        aria-label={label}
        className={cn("flex flex-col items-start gap-2", className)}
        {...rest}
      >
        <Text
          as="span"
          size="caption"
          weight="medium"
          color="tertiary"
          className="uppercase tracking-wide"
        >
          {label}
        </Text>
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-md border border-dashed border-surface-border-strong bg-surface-sunken text-text-tertiary",
            boxSizeClasses[size],
          )}
        >
          {children ?? (
            <div className="flex flex-col items-center gap-1 p-4 text-center">
              <Text size="small" color="tertiary">
                Ad slot
              </Text>
              <Text size="caption" color="tertiary">
                {width} &times; {height}
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  },
);
AdSlot.displayName = "AdSlot";
