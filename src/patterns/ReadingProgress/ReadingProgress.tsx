import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type RefObject,
} from "react";
import { cn } from "@/lib/cn";
import { Progress, type ProgressColor, type ProgressSize } from "@/components/Progress";

/**
 * Computes scroll percentage against the whole document (used when no
 * `targetRef` is supplied — the common case of "progress through the page").
 */
function computeDocumentProgress(): number {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollable = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(100, Math.max(0, (scrollTop / scrollable) * 100));
}

/**
 * Computes scroll percentage through a specific element — 0% when its top edge
 * reaches the top of the viewport, 100% when its bottom edge reaches the bottom
 * of the viewport. Lets an article's own bounds (rather than the full document,
 * which may include unrelated chrome/footer) drive the reading progress bar.
 */
function computeElementProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const total = rect.height - viewportHeight;
  if (total <= 0) {
    // Shorter than the viewport: it's either already fully visible (100%) or
    // hasn't been scrolled to yet (0%) — there's no partial range to report.
    return rect.top <= 0 ? 100 : 0;
  }
  const scrolled = -rect.top;
  return Math.min(100, Math.max(0, (scrolled / total) * 100));
}

/**
 * Tracks scroll position and returns how far through the page (or a specific
 * element, via `targetRef`) the reader has scrolled, as a 0-100 percentage.
 * Recomputes on scroll and resize (layout/content changes can shift the
 * scrollable height even without a scroll event).
 */
export function useScrollProgress(targetRef?: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = targetRef?.current;
      setProgress(target ? computeElementProgress(target) : computeDocumentProgress());
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef?.current]);

  return progress;
}

export interface ReadingProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Ref to the article/content element whose scroll bounds should drive the
   * bar. Omit to track scroll progress through the whole document.
   */
  targetRef?: RefObject<HTMLElement | null>;
  /** Accessible label for the underlying `Progress` bar. @default "Reading progress" */
  label?: string;
  /** Bar thickness, passed through to `Progress`. @default "sm" */
  size?: ProgressSize;
  /** Bar color, passed through to `Progress`. @default "brand" */
  color?: ProgressColor;
}

/**
 * Thin bar fixed to the top of the viewport showing how far through an article
 * the reader has scrolled. This pattern owns only the scroll-tracking logic
 * (`useScrollProgress`) and fixed positioning — the bar itself is a plain
 * `Progress` in determinate mode, reused rather than reimplemented.
 */
export const ReadingProgress = forwardRef<HTMLDivElement, ReadingProgressProps>(
  ({ targetRef, label = "Reading progress", size = "sm", color, className, ...rest }, ref) => {
    const percentage = useScrollProgress(targetRef);

    return (
      <div
        ref={ref}
        className={cn("fixed inset-x-0 top-0 z-stickyHeader", className)}
        {...rest}
      >
        <Progress value={percentage} max={100} label={label} size={size} color={color} />
      </div>
    );
  },
);
ReadingProgress.displayName = "ReadingProgress";
