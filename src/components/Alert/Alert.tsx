import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

const alertVariants = cva("flex gap-3 rounded-lg border px-4 py-3 text-small", {
  variants: {
    variant: {
      info: "border-info-500/30 bg-info-50 text-info-700 dark:border-info-500/40 dark:bg-info-500/10 dark:text-info-50",
      success:
        "border-success-500/30 bg-success-50 text-success-700 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-50",
      warning:
        "border-warning-500/30 bg-warning-50 text-warning-700 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-50",
      error:
        "border-error-500/30 bg-error-50 text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-50",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const iconColor: Record<AlertVariant, string> = {
  info: "text-info-500",
  success: "text-success-500",
  warning: "text-warning-500",
  error: "text-error-500",
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Visual/semantic variant. Each has a distinguishing icon — color is never the only signal. */
  variant?: AlertVariant;
  /** Optional bold lead-in rendered above the message body. */
  title?: ReactNode;
  children: ReactNode;
  /** Shows a dismiss (X) button. */
  dismissible?: boolean;
  /** Called when the dismiss button is activated, before the alert removes itself from the DOM. */
  onDismiss?: () => void;
}

/**
 * Inline, persistent status banner — it does not auto-dismiss. Uses
 * `role="alert"` (assertive) for warning/error so it interrupts, and
 * `role="status"` (polite) for info/success.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "info", title, children, dismissible = false, onDismiss, className, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isAssertive = variant === "warning" || variant === "error";

  function handleDismiss() {
    onDismiss?.();
    setVisible(false);
  }

  return (
    <div
      ref={ref}
      role={isAssertive ? "alert" : "status"}
      aria-live={isAssertive ? "assertive" : "polite"}
      className={cn(alertVariants({ variant }), className)}
      {...rest}
    >
      <span className={cn("mt-0.5 shrink-0", iconColor[variant])} aria-hidden="true">
        <StatusIcon variant={variant} />
      </span>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && "mt-1")}>{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 self-start rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});

function StatusIcon({ variant }: { variant: AlertVariant }) {
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
