import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { ToastVariant } from "./Toast";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Pass `Infinity` to require manual dismissal. @default 5000 */
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  /** Queues a toast and returns its id (e.g. for an early/manual `dismiss`). */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

let toastSequence = 0;
function nextId() {
  toastSequence += 1;
  return `toast-${toastSequence}`;
}

/**
 * Holds the queue of active toasts in React state (no module-level mutable
 * singleton) and exposes it via context. Render once near the app root,
 * alongside a `<ToastViewport />` that actually paints the queue.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId();
    setToasts((current) => [
      ...current,
      {
        ...options,
        id,
        variant: options.variant ?? "info",
        duration: options.duration ?? 5000,
      },
    ]);
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
