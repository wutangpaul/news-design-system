import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Axis the divider runs along. @default 'horizontal' */
  orientation?: "horizontal" | "vertical";
  /**
   * Optional content rendered inline within the divider (e.g. "OR", or a section label
   * like "MORE FROM THIS SECTION"). When present, the divider becomes a labelled
   * `role="separator"` instead of a purely decorative rule.
   */
  label?: ReactNode;
}

/**
 * A horizontal or vertical rule, optionally with a label centered within it. Purely
 * decorative rules are hidden from assistive tech (`aria-hidden`); labelled rules expose
 * `role="separator"` with the label as their accessible name.
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", label, className, ...rest }, ref) => {
    const isVertical = orientation === "vertical";
    const ruleClassName = cn(
      "border-surface-border",
      isVertical ? "w-px flex-1 border-l" : "h-px flex-1 border-t",
    );

    if (!label) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          className={cn(
            "shrink-0 border-surface-border",
            isVertical ? "h-full w-px border-l" : "w-full border-t",
            className,
          )}
          {...rest}
        />
      );
    }

    const accessibleLabel = typeof label === "string" ? label : undefined;

    // NOTE: `text-caption` (font-size) and `text-text-tertiary` (color) can't both go
    // through the same cn() call — the shared cn() helper's tailwind-merge config
    // doesn't know about this design system's custom `fontSize` tokens, so it buckets
    // `text-caption` into the same conflict group as `text-color` utilities (both match
    // its generic `text-{value}` pattern) and silently drops one. Confirmed empirically:
    // `twMerge("text-caption", "text-text-tertiary")` drops `text-caption`. The real fix
    // belongs in `src/lib/cn.ts` (out of this component's edit boundary, flagged in the
    // build report). Until then, `text-caption` is appended outside of cn()/twMerge.
    const labelledClassName = `${cn(
      "flex items-center gap-3 font-sans text-text-tertiary",
      isVertical ? "h-full flex-col" : "w-full flex-row",
      className,
    )} text-caption`;

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={isVertical ? "vertical" : "horizontal"}
        aria-label={accessibleLabel}
        className={labelledClassName}
        {...rest}
      >
        <span aria-hidden="true" className={ruleClassName} />
        <span className="shrink-0">{label}</span>
        <span aria-hidden="true" className={ruleClassName} />
      </div>
    );
  },
);
Divider.displayName = "Divider";
