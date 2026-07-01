import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** Elements that can receive keyboard focus, used by the focus trap. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * WAI-ARIA APG focus trap: on activation, moves focus into `containerRef`
 * (first focusable descendant, falling back to the container itself) and
 * remembers the previously-focused element. While active, Tab/Shift+Tab are
 * cycled so focus never leaves the container, and Escape invokes `onClose`.
 * On deactivation, focus is restored to the element that was focused before
 * the trap activated.
 */
function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  active: boolean,
  onClose: () => void,
) {
  const triggerRef = useRef<HTMLElement | null>(null);
  // Consumers typically pass an inline `onClose` (e.g. `onClose={() => setOpen(false)}`), so
  // its reference changes on every render. Reading it via a ref (kept current by the effect
  // below, which has no dependency array so it runs after every render) lets the main effect's
  // dependency array omit `onClose` — otherwise the main effect would re-run on every keystroke
  // typed into a field inside the trap, re-capturing `document.activeElement` and re-focusing
  // the first focusable element, yanking focus away from whatever the user just focused.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return undefined;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    if (container) {
      const [first] = getFocusableElements(container);
      (first ?? container).focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !container) return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, containerRef]);
}

/** Locks body scroll while `active`, restoring the previous value on cleanup. */
function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

const modalPanelVariants = cva(
  "relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg bg-surface-raised text-text-primary shadow-xl",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-3xl",
        fullscreen: "h-full max-h-full max-w-none rounded-none",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type ModalSize = "sm" | "md" | "lg" | "fullscreen";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Whether the modal is open. Renders nothing in the DOM while closed. */
  open: boolean;
  /** Invoked on Escape, backdrop click, or the built-in close button. */
  onClose: () => void;
  /** Heading rendered in the dialog header and referenced by `aria-labelledby`. */
  title: ReactNode;
  /** Optional supporting copy referenced by `aria-describedby`. */
  description?: ReactNode;
  /** Controls the dialog panel's max width (or fills the viewport for `fullscreen`). */
  size?: ModalSize;
  /** Hides the built-in close (X) button in the header. */
  hideCloseButton?: boolean;
  children?: ReactNode;
}

/**
 * Modal dialog implementing the WAI-ARIA APG Dialog (Modal) pattern: a focus
 * trap while open, Escape-to-close, backdrop-click-to-close, body scroll
 * lock, and focus return to the triggering element on close.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    description,
    size = "md",
    hideCloseButton = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(panelRef, open, onClose);
  useBodyScrollLock(open);

  if (!open) return null;

  function handleBackdropMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return createPortal(
    // Backdrop is a mouse-only convenience dismissal; Escape (handled by the focus trap) is
    // the keyboard equivalent, and the backdrop itself carries no meaning for assistive tech.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-ink-950/60 p-4"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(modalPanelVariants({ size }), className)}
        {...rest}
      >
        <div className="flex items-start justify-between gap-4 border-b border-surface-border px-6 py-4">
          <h2 id={titleId} className="font-serif text-h6 font-semibold">
            {title}
          </h2>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="shrink-0 rounded-md p-1 text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
            >
              <CloseIcon />
            </button>
          )}
        </div>
        {description && (
          <p id={descriptionId} className="px-6 pt-4 text-small text-text-secondary">
            {description}
          </p>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
});

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
