import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  /** Tooltip body. Keep this short — tooltips are for supplementary labels, not long copy. */
  content: ReactNode;
  /** A single focusable/hoverable element (button, link, icon button, ...). */
  children: ReactElement;
  /** Preferred side to render on; flips to the opposite side if it would overflow the viewport. */
  side?: TooltipSide;
  /** Delay, in ms, before showing on hover. Keyboard focus shows immediately. @default 200 */
  delayMs?: number;
  className?: string;
}

/** Gap, in px, between the trigger and the tooltip bubble. Mirrors `spacing[2]` (0.5rem). */
const GAP = 8;
/** Minimum distance, in px, kept between the tooltip and the viewport edge. */
const VIEWPORT_PADDING = 8;

const oppositeSide: Record<TooltipSide, TooltipSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function placement(side: TooltipSide, triggerRect: DOMRect, tooltipRect: DOMRect) {
  switch (side) {
    case "top":
      return {
        top: triggerRect.top - tooltipRect.height - GAP,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case "bottom":
      return {
        top: triggerRect.bottom + GAP,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case "left":
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - GAP,
      };
    case "right":
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + GAP,
      };
  }
}

function overflowsViewport(pos: { top: number; left: number }, tooltipRect: DOMRect) {
  return (
    pos.top < 0 ||
    pos.left < 0 ||
    pos.top + tooltipRect.height > window.innerHeight ||
    pos.left + tooltipRect.width > window.innerWidth
  );
}

/**
 * APG Tooltip pattern: shown on hover *and* keyboard focus of the trigger,
 * dismissible via Escape, and positioned with a lightweight collision flip
 * (not a full popper-grade engine) so it stays within the viewport.
 */
export function Tooltip({ content, children, side = "top", delayMs = 200, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<TooltipSide>(side);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const tooltipId = useId();

  const clearShowTimer = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
  }, []);

  const show = useCallback(
    (immediate = false) => {
      clearShowTimer();
      if (immediate) {
        setOpen(true);
        return;
      }
      showTimer.current = setTimeout(() => setOpen(true), delayMs);
    },
    [clearShowTimer, delayMs],
  );

  const hide = useCallback(() => {
    clearShowTimer();
    setOpen(false);
  }, [clearShowTimer]);

  useEffect(() => clearShowTimer, [clearShowTimer]);

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let nextSide = side;
    let pos = placement(nextSide, triggerRect, tooltipRect);

    if (overflowsViewport(pos, tooltipRect)) {
      const flipped = oppositeSide[side];
      const flippedPos = placement(flipped, triggerRect, tooltipRect);
      if (!overflowsViewport(flippedPos, tooltipRect)) {
        nextSide = flipped;
        pos = flippedPos;
      }
    }

    const clampedLeft = Math.min(
      Math.max(pos.left, VIEWPORT_PADDING),
      Math.max(window.innerWidth - tooltipRect.width - VIEWPORT_PADDING, VIEWPORT_PADDING),
    );
    const clampedTop = Math.min(
      Math.max(pos.top, VIEWPORT_PADDING),
      Math.max(window.innerHeight - tooltipRect.height - VIEWPORT_PADDING, VIEWPORT_PADDING),
    );

    setResolvedSide(nextSide);
    setCoords({ top: clampedTop + window.scrollY, left: clampedLeft + window.scrollX });
  }, [open, side]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") hide();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, hide]);

  if (!isValidElement(children)) return children;

  const describedBy = open
    ? tooltipId
    : (children.props as { "aria-describedby"?: string })["aria-describedby"];
  const trigger = cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
    "aria-describedby": describedBy,
  });

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={() => show()}
        onMouseLeave={hide}
        onFocus={() => show(true)}
        onBlur={hide}
      >
        {trigger}
      </span>
      {open &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            id={tooltipId}
            data-side={resolvedSide}
            style={{ top: coords.top, left: coords.left }}
            className={cn(
              "pointer-events-none fixed z-tooltip max-w-xs rounded-md bg-ink-900 px-2.5 py-1.5 text-caption text-ink-0 shadow-md",
              className,
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
