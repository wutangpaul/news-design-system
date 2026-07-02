import { forwardRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export type ToastVariant = "info" | "success" | "warning" | "error";

const toastVariants = cva(
  "pointer-events-auto flex w-full max-w-sm gap-3 rounded-lg border px-4 py-3 text-small shadow-lg",
  {
    variants: {
      variant: {
        info: "border-info-500/30 bg-surface-raised text-text-primary",
        success: "border-success-500/30 bg-surface-raised text-text-primary",
        warning: "border-warning-500/30 bg-surface-raised text-text-primary",
        error: "border-error-500/30 bg-surface-raised text-text-primary",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const iconColor: Record<ToastVariant, string> = {
  info: "text-info-500",
  success: "text-success-500",
  // warning-500 against bg-surface-raised is 2.97:1 in light mode — just under the 3:1 AA
  // floor for non-text/UI components (1.4.11). warning-700 clears it (4.68:1) and still
  // passes in dark mode (3.55:1), unlike every other variant here which only needed one shade.
  warning: "text-warning-700 dark:text-warning-500",
  error: "text-error-500",
};

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  title: ReactNode;
  description?: ReactNode;
  /** Called when the user dismisses the toast (close button or Escape). */
  onDismiss?: () => void;
}

/**
 * The visual presentation of a single transient notification. Pair with
 * `ToastProvider`/`useToast`/`ToastViewport` to actually queue and
 * auto-dismiss toasts from anywhere in the app — see `ToastViewport.tsx`.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = "info", title, description, onDismiss, className, onKeyDown, ...rest },
  ref,
) {
  const isAssertive = variant === "error";

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.key === "Escape" && onDismiss) onDismiss();
  }

  return (
    <div
      ref={ref}
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
      aria-atomic="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(toastVariants({ variant }), className)}
      {...rest}
    >
      <span className={cn("mt-0.5 shrink-0", iconColor[variant])} aria-hidden="true">
        <StatusIcon variant={variant} />
      </span>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-text-secondary">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 self-start rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});

function StatusIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "success":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="10" cy="10" r="7.25" />
          <polyline points="6.5 10.25 9 12.75 13.5 7.5" />
        </svg>
      );
    case "warning":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <polygon points="10 2.5 18 16.5 2 16.5" />
          <line x1="10" y1="8" x2="10" y2="12" />
          <circle cx="10" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
    case "error":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <circle cx="10" cy="10" r="7.25" />
          <line x1="7.5" y1="7.5" x2="12.5" y2="12.5" />
          <line x1="12.5" y1="7.5" x2="7.5" y2="12.5" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="h-5 w-5"
        >
          <circle cx="10" cy="10" r="7.25" />
          <line x1="10" y1="9" x2="10" y2="13.5" />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </svg>
  );
}
