import * as React from "react";
import { cn } from "@/lib/cn";

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}

type PendingFocus = "first" | "last" | "none";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean, pendingFocus?: PendingFocus) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  idPrefix: string;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext(component: string): DropdownContextValue {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside a <Dropdown> root.`);
  }
  return ctx;
}

function getMenuItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) => item.getAttribute("aria-disabled") !== "true" && !item.hasAttribute("disabled"),
  );
}

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes (trigger click, item select, Escape, outside click). */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Generic menu-button dropdown primitive. Implements the WAI-ARIA Authoring Practices Guide
 * "Menu Button" pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 *
 * Accepts arbitrary trigger content (`DropdownTrigger`) and menu items (`DropdownMenu` +
 * `DropdownItem`/`DropdownSeparator`) as children — it has no knowledge of what the menu is
 * used for, so it composes into higher-level patterns (e.g. a Mega Menu) unchanged.
 */
export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, open, defaultOpen = false, onOpenChange, className, ...rest }, ref) => {
    const idPrefix = React.useId();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const pendingFocusRef = React.useRef<PendingFocus>("none");

    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = React.useCallback(
      (next: boolean, pendingFocus: PendingFocus = "none") => {
        pendingFocusRef.current = pendingFocus;
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    // Move focus into the menu when it opens; return focus to the trigger when it closes.
    const wasOpenRef = React.useRef(isOpen);
    React.useEffect(() => {
      if (isOpen && !wasOpenRef.current) {
        const items = getMenuItems(menuRef.current);
        const target = pendingFocusRef.current === "last" ? items[items.length - 1] : items[0];
        target?.focus();
      } else if (!isOpen && wasOpenRef.current) {
        triggerRef.current?.focus();
      }
      wasOpenRef.current = isOpen;
    }, [isOpen]);

    // Click-outside closes the menu.
    React.useEffect(() => {
      if (!isOpen) return;
      const handlePointerDown = (event: PointerEvent) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isOpen, setOpen]);

    const contextValue: DropdownContextValue = { open: isOpen, setOpen, triggerRef, menuRef, idPrefix };

    return (
      <DropdownContext.Provider value={contextValue}>
        <div ref={mergeRefs(rootRef, ref)} className={cn("relative inline-block", className)} {...rest}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  },
);
Dropdown.displayName = "Dropdown";

export type DropdownTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/** The button that opens/closes the menu. Accepts arbitrary children as trigger content. */
export const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ className, children, onClick, onKeyDown, ...rest }, ref) => {
    const { open, setOpen, triggerRef, idPrefix } = useDropdownContext("DropdownTrigger");
    const menuId = `${idPrefix}-menu`;
    const triggerId = `${idPrefix}-trigger`;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true, "first");
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true, "last");
      }
    };

    return (
      <button
        ref={mergeRefs(triggerRef, ref)}
        type="button"
        id={triggerId}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(event) => {
          onClick?.(event);
          setOpen(!open, "first");
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-surface-border bg-surface-canvas px-3 py-2",
          "text-small font-medium text-text-primary hover:bg-surface-raised",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
DropdownTrigger.displayName = "DropdownTrigger";

export interface DropdownMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Horizontal alignment of the menu relative to the trigger. @default "start" */
  align?: "start" | "end";
}

/** The popup menu container. Renders `role="menu"` and is hidden when closed. */
export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ align = "start", className, children, onKeyDown, ...rest }, ref) => {
    const { open, setOpen, menuRef, idPrefix } = useDropdownContext("DropdownMenu");
    const menuId = `${idPrefix}-menu`;
    const triggerId = `${idPrefix}-trigger`;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        // Tab leaves the menu entirely (per APG, Tab is not used to navigate within a menu).
        setOpen(false);
        return;
      }

      const items = getMenuItems(menuRef.current);
      if (items.length === 0) return;
      const currentIndex = items.findIndex((item) => item === document.activeElement);

      let nextIndex: number | null = null;
      switch (event.key) {
        case "ArrowDown":
          nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
          break;
        case "ArrowUp":
          nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = items.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      items[nextIndex]?.focus();
    };

    return (
      <div
        ref={mergeRefs(menuRef, ref)}
        role="menu"
        id={menuId}
        aria-labelledby={triggerId}
        hidden={!open}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          "absolute top-full z-dropdown mt-1 min-w-[12rem] rounded-md border border-surface-border",
          "bg-surface-raised py-1 shadow-md",
          align === "start" ? "left-0" : "right-0",
          className,
          // The `hidden` attribute above is enough on its own for a bare DropdownMenu, but a
          // consumer-supplied `className` that sets its own display utility (e.g. MegaMenu's
          // `flex`) has the same CSS specificity as the browser's default `[hidden]{display:
          // none}` rule — and same-specificity author rules always beat user-agent rules
          // regardless of source order, so that display utility would render even while
          // `hidden`. Appending this last lets tailwind-merge drop any earlier display utility
          // from `className` and keeps the menu genuinely hidden when closed.
          !open && "hidden",
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
DropdownMenu.displayName = "DropdownMenu";

export interface DropdownItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Called when the item is activated (click, Enter, or Space). */
  onSelect?: () => void;
}

/** A single actionable item within a `DropdownMenu`. */
export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, children, disabled, onSelect, onClick, ...rest }, ref) => {
    const { setOpen } = useDropdownContext("DropdownItem");

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        tabIndex={-1}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          onClick?.(event);
          if (disabled) return;
          onSelect?.();
          setOpen(false);
        }}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left text-small text-text-primary",
          "hover:bg-surface-sunken focus-visible:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
DropdownItem.displayName = "DropdownItem";

export type DropdownSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

/** A visual divider between groups of `DropdownItem`s. */
export const DropdownSeparator = React.forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn("my-1 h-px bg-surface-border", className)}
      {...rest}
    />
  ),
);
DropdownSeparator.displayName = "DropdownSeparator";
