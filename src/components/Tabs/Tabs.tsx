import * as React from "react";
import { cn } from "@/lib/cn";

type Orientation = "horizontal" | "vertical";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: Orientation;
  idPrefix: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside a <Tabs> root.`);
  }
  return ctx;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    });
  };
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled active tab value. Pair with `onValueChange`. */
  value?: string;
  /** Initial active tab value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new tab value whenever the active tab changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction; determines which arrow keys move focus between tabs. @default "horizontal" */
  orientation?: Orientation;
}

/**
 * Root container for the Tabs widget. Implements the WAI-ARIA Authoring Practices Guide
 * "Tabs" pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Compose with `TabsList`, `TabsTab`, and `TabsPanel`.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const idPrefix = React.useId();
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const activeValue = isControlled ? value : internalValue;

    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const contextValue = React.useMemo<TabsContextValue>(
      () => ({ value: activeValue, setValue, orientation, idPrefix }),
      [activeValue, setValue, orientation, idPrefix],
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(orientation === "vertical" && "flex gap-6", className)}
          {...rest}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

/** Container for the tab buttons. Implements roving tabindex + arrow-key navigation. */
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, onKeyDown, ...rest }, ref) => {
    const { orientation, setValue } = useTabsContext("TabsList");
    const listRef = React.useRef<HTMLDivElement | null>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const tabs = Array.from(
        listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [],
      ).filter((tab) => tab.getAttribute("aria-disabled") !== "true" && !tab.hasAttribute("disabled"));
      if (tabs.length === 0) return;

      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
      const isHorizontal = orientation === "horizontal";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

      let nextIndex: number | null = null;
      switch (event.key) {
        case nextKey:
          nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tabs.length;
          break;
        case prevKey:
          nextIndex = currentIndex === -1 ? tabs.length - 1 : (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const nextTab = tabs[nextIndex];
      const nextValue = nextTab.dataset.value;
      nextTab.focus();
      if (nextValue) setValue(nextValue);
    };

    return (
      <div
        ref={mergeRefs(listRef, ref)}
        role="tablist"
        // The tablist container itself is never a tab stop — per the APG Tabs pattern, focus
        // moves directly to (and roves between) the individual `role="tab"` elements. The
        // explicit tabIndex={-1} keeps eslint-plugin-jsx-a11y's interactive-role check satisfied
        // without making the container reachable via Tab.
        tabIndex={-1}
        aria-orientation={orientation}
        className={cn(
          "flex gap-1 border-b border-surface-border",
          orientation === "vertical" && "flex-col border-b-0 border-r",
          className,
        )}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
TabsList.displayName = "TabsList";

export interface TabsTabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Unique identifier matched against a `TabsPanel`'s `value`. */
  value: string;
}

/** A single tab button. Renders `role="tab"` with roving `tabIndex`. */
export const TabsTab = React.forwardRef<HTMLButtonElement, TabsTabProps>(
  ({ value, className, children, disabled, onClick, ...rest }, ref) => {
    const { value: activeValue, setValue, idPrefix } = useTabsContext("TabsTab");
    const isSelected = activeValue === value;
    const tabId = `${idPrefix}-tab-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        data-value={value}
        aria-selected={isSelected}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);
          if (!disabled) setValue(value);
        }}
        className={cn(
          "relative -mb-px rounded-t-md px-4 py-2 text-small font-medium text-text-secondary transition-colors",
          "hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50",
          isSelected && "border-b-2 border-masthead-500 text-text-primary",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
TabsTab.displayName = "TabsTab";

export interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique identifier matched against the corresponding `TabsTab`'s `value`. */
  value: string;
}

/** Content panel shown when its matching tab is active. */
export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, className, children, ...rest }, ref) => {
    const { value: activeValue, idPrefix } = useTabsContext("TabsPanel");
    const isSelected = activeValue === value;
    const tabId = `${idPrefix}-tab-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        hidden={!isSelected}
        tabIndex={0}
        className={cn("py-4 focus-visible:outline-none", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
TabsPanel.displayName = "TabsPanel";
