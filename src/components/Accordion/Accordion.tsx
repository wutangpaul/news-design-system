import * as React from "react";
import { cn } from "@/lib/cn";

interface AccordionContextValue {
  openValues: Set<string>;
  toggleValue: (value: string) => void;
  idPrefix: string;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside an <Accordion> root.`);
  }
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled?: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(component: string): AccordionItemContextValue {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside an <AccordionItem>.`);
  }
  return ctx;
}

function toArray(value: string | string[] | null | undefined): string[] {
  if (value == null || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Whether one (`"single"`) or multiple (`"multiple"`) items may be open at once. */
  type: "single" | "multiple";
  /**
   * Controlled open value(s) — a string for `type="single"` (empty string means none open),
   * a string array for `type="multiple"`.
   */
  value?: string | string[];
  /** Initial open value(s) for uncontrolled usage. */
  defaultValue?: string | string[];
  /** Called with the new open value(s) whenever an item is opened or closed. */
  onValueChange?: (value: string | string[]) => void;
  /**
   * For `type="single"`, whether the currently open item can be closed by activating its
   * trigger again. @default true
   */
  collapsible?: boolean;
}

/**
 * A vertically stacked set of interactive headings that each reveal an associated section of
 * content. Implements the WAI-ARIA Authoring Practices Guide "Accordion" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Compose with `AccordionItem`, `AccordionTrigger`, and `AccordionContent`.
 */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    { type, value, defaultValue, onValueChange, collapsible = true, className, children, ...rest },
    ref,
  ) => {
    const idPrefix = React.useId();
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<string[]>(() => toArray(defaultValue));

    const openValues = new Set(isControlled ? toArray(value) : internalValue);

    const emit = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternalValue(next);
        if (type === "single") {
          onValueChange?.(next[0] ?? "");
        } else {
          onValueChange?.(next);
        }
      },
      [isControlled, onValueChange, type],
    );

    const toggleValue = (target: string) => {
      if (type === "single") {
        const isOpen = openValues.has(target);
        if (isOpen) {
          emit(collapsible ? [] : [target]);
        } else {
          emit([target]);
        }
      } else {
        const next = new Set(openValues);
        if (next.has(target)) next.delete(target);
        else next.add(target);
        emit(Array.from(next));
      }
    };

    const contextValue: AccordionContextValue = { openValues, toggleValue, idPrefix };

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn("divide-y divide-surface-border border-y border-surface-border", className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for this item, referenced by its trigger/content pair. */
  value: string;
  /** Disables the trigger and excludes the item from being opened. */
  disabled?: boolean;
}

/** Wraps a single header/panel pair within an `Accordion`. */
export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled, className, children, ...rest }, ref) => {
    const { openValues } = useAccordionContext("AccordionItem");
    const open = openValues.has(value);

    const itemContextValue = React.useMemo<AccordionItemContextValue>(
      () => ({ value, open, disabled }),
      [value, open, disabled],
    );

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <div ref={ref} data-state={open ? "open" : "closed"} className={cn(className)} {...rest}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Heading level wrapping the trigger button, for a correct document outline. @default 3 */
  level?: 2 | 3 | 4 | 5 | 6;
}

/** The clickable header for an `AccordionItem`. Rendered as a `<button>` inside a heading element. */
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ level = 3, className, children, disabled, onClick, ...rest }, ref) => {
    const { toggleValue, idPrefix } = useAccordionContext("AccordionTrigger");
    const { value, open, disabled: itemDisabled } = useAccordionItemContext("AccordionTrigger");
    const isDisabled = disabled || itemDisabled;
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    const triggerId = `${idPrefix}-trigger-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    return (
      <HeadingTag className="m-0">
        <button
          ref={ref}
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={isDisabled}
          onClick={(event) => {
            onClick?.(event);
            if (!isDisabled) toggleValue(value);
          }}
          className={cn(
            "flex w-full items-center justify-between gap-4 py-4 text-left text-body font-semibold text-text-primary",
            "hover:text-masthead-500 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...rest}
        >
          <span>{children}</span>
          <ChevronIcon
            className={cn(
              "h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-base",
              open && "rotate-180",
            )}
          />
        </button>
      </HeadingTag>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

/** The collapsible content region for an `AccordionItem`. */
export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...rest }, ref) => {
    const { idPrefix } = useAccordionContext("AccordionContent");
    const { value, open } = useAccordionItemContext("AccordionContent");
    const triggerId = `${idPrefix}-trigger-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    return (
      <div
        ref={ref}
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!open}
        className={cn("pb-4 text-text-secondary", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
AccordionContent.displayName = "AccordionContent";
