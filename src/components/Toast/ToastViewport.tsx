import { useCallback, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Toast } from "./Toast";
import { ToastContext, type ToastItem } from "./ToastProvider";
import { cn } from "@/lib/cn";

interface TimedToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Wraps a single `<Toast>` with its own auto-dismiss timer. The timer is
 * paused on hover/focus and resumed (for the remaining duration, not the
 * full duration) on mouse leave/blur — WCAG 2.2 SC 2.2.1 requires users be
 * able to stop or extend time limits.
 */
function TimedToast({ item, onDismiss }: TimedToastProps) {
  const remainingRef = useRef(item.duration);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const start = useCallback(() => {
    if (!Number.isFinite(remainingRef.current)) return;
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => onDismiss(item.id), remainingRef.current);
  }, [item.id, onDismiss]);

  const pause = useCallback(() => {
    clearTimer();
    if (!Number.isFinite(remainingRef.current)) return;
    remainingRef.current = Math.max(remainingRef.current - (Date.now() - startedAtRef.current), 0);
  }, [clearTimer]);

  useEffect(() => {
    start();
    return clearTimer;
    // Only re-arm if a *different* toast instance takes this slot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  return (
    <Toast
      variant={item.variant}
      title={item.title}
      description={item.description}
      onDismiss={() => onDismiss(item.id)}
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
    />
  );
}

export type ToastViewportPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const positionClassName: Record<ToastViewportPosition, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
};

export interface ToastViewportProps {
  position?: ToastViewportPosition;
  className?: string;
}

/**
 * Renders the queue of active toasts from `<ToastProvider>` into a portal.
 * Render exactly one of these near the app root, inside `<ToastProvider>`.
 */
export function ToastViewport({ position = "bottom-right", className }: ToastViewportProps) {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("ToastViewport must be rendered within a <ToastProvider>.");
  }
  const { toasts, dismiss } = context;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none fixed z-toast flex max-h-screen w-full max-w-sm flex-col gap-2 p-4",
        positionClassName[position],
        className,
      )}
      aria-label="Notifications"
    >
      {toasts.map((item) => (
        <TimedToast key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </div>,
    document.body,
  );
}
