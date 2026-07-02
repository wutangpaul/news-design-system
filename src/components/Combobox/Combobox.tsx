import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from "react";
import { cn } from "@/lib/cn";

export interface ComboboxOption {
  /** Visible text for the option, also used by the default client-side filter. */
  label: string;
  /** Stable value submitted/returned on selection. Must be unique within `options`. */
  value: string;
}

export interface ComboboxProps {
  /** Visible label, programmatically associated with the field via htmlFor/id. */
  label?: string;
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  /** Full option list. Filtered client-side by default as the user types (see `filterOptions`). */
  options: ComboboxOption[];
  /** Selected option's `value`. */
  value?: string;
  /** Initial selected option's `value`, for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the selected option's `value` when the user picks one. */
  onChange?: (value: string) => void;
  /**
   * Called with the raw typed text on every keystroke — wire this up to drive async/
   * server-side filtering (fetch, then pass the results back in via `options`).
   */
  onInputChange?: (query: string) => void;
  /**
   * Whether the component filters `options` itself by substring match against `label`.
   * Set to `false` when `options` is already filtered upstream (e.g. server-side search) to
   * avoid double-filtering. @default true
   */
  filterOptions?: boolean;
  /** Message shown in the listbox when no options match. @default "No matches" */
  noOptionsMessage?: string;
  placeholder?: string;
  id?: string;
  /** Name of a hidden `<input type="hidden">` that mirrors the selected value, so the
   * component participates in native form submission (e.g. inside this design system's
   * `Form`). Omit if you read the value entirely through `onChange`. */
  name?: string;
  disabled?: boolean;
  required?: boolean;
  /** Class names applied to the wrapping `div`, not the `<input>` itself. */
  wrapperClassName?: string;
  className?: string;
}

function defaultFilter(options: ComboboxOption[], query: string): ComboboxOption[] {
  if (!query.trim()) return options;
  const q = query.trim().toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(q));
}

/**
 * Typeahead/autocomplete text field implementing the WAI-ARIA APG Combobox pattern
 * (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): `role="combobox"` on the input,
 * `aria-expanded`/`aria-controls` pointing at a `role="listbox"` popup, options as
 * `role="option"`, and `aria-activedescendant` tracking the highlighted option as arrow keys
 * move it. Keyboard focus never leaves the input — options are highlighted, not focused,
 * per the pattern's "collapsible listbox" variant.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      label,
      helperText,
      errorText,
      options,
      value,
      defaultValue,
      onChange,
      onInputChange,
      filterOptions = true,
      noOptionsMessage = "No matches",
      placeholder,
      id,
      name,
      disabled,
      required,
      wrapperClassName,
      className,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const labelId = `${inputId}-label`;
    const helperId = `${inputId}-helper-text`;
    const errorId = `${inputId}-error-text`;
    const listboxId = `${inputId}-listbox`;
    const hasError = Boolean(errorText);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? value : internalValue;
    const selectedOption = options.find((option) => option.value === selectedValue);

    const [query, setQuery] = useState(selectedOption?.label ?? "");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Keep the displayed text in sync when the selected value changes from outside (controlled
    // usage) while the field isn't being actively edited.
    useEffect(() => {
      if (!open) {
        setQuery(selectedOption?.label ?? "");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedValue]);

    const filteredOptions = useMemo(
      () => (filterOptions ? defaultFilter(options, query) : options),
      [filterOptions, options, query],
    );

    const describedBy =
      [hasError ? errorId : helperText ? helperId : undefined].filter(Boolean).join(" ") ||
      undefined;

    function optionDomId(option: ComboboxOption) {
      return `${inputId}-option-${option.value}`;
    }

    function openList() {
      if (disabled) return;
      setOpen(true);
      // Highlight the currently selected option if there is one; otherwise leave nothing
      // highlighted until the user presses an arrow key, per the APG combobox pattern.
      setActiveIndex(filteredOptions.findIndex((option) => option.value === selectedValue));
    }

    function closeAndRevert() {
      setOpen(false);
      setActiveIndex(-1);
      setQuery(selectedOption?.label ?? "");
    }

    function commitSelection(option: ComboboxOption) {
      if (!isControlled) setInternalValue(option.value);
      onChange?.(option.value);
      setQuery(option.label);
      setOpen(false);
      setActiveIndex(-1);
    }

    function handleInputChange(nextQuery: string) {
      setQuery(nextQuery);
      setOpen(true);
      onInputChange?.(nextQuery);
    }

    function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          if (!open) {
            openList();
            return;
          }
          if (filteredOptions.length === 0) {
            setActiveIndex(-1);
            return;
          }
          setActiveIndex(activeIndex < 0 ? 0 : (activeIndex + 1) % filteredOptions.length);
          return;
        }
        case "ArrowUp": {
          event.preventDefault();
          if (!open) {
            openList();
            return;
          }
          if (filteredOptions.length === 0) {
            setActiveIndex(-1);
            return;
          }
          setActiveIndex(
            activeIndex < 0
              ? filteredOptions.length - 1
              : (activeIndex - 1 + filteredOptions.length) % filteredOptions.length,
          );
          return;
        }
        case "Home":
          if (!open) return;
          event.preventDefault();
          setActiveIndex(filteredOptions.length > 0 ? 0 : -1);
          return;
        case "End":
          if (!open) return;
          event.preventDefault();
          setActiveIndex(filteredOptions.length > 0 ? filteredOptions.length - 1 : -1);
          return;
        case "Enter":
          if (!open) return;
          event.preventDefault();
          if (activeIndex >= 0 && filteredOptions[activeIndex]) {
            commitSelection(filteredOptions[activeIndex]);
          } else {
            setOpen(false);
          }
          return;
        case "Escape":
          if (!open) return;
          event.preventDefault();
          closeAndRevert();
          return;
        default:
      }
    }

    function handleBlur() {
      if (open) closeAndRevert();
    }

    const activeOption =
      activeIndex >= 0 && filteredOptions[activeIndex] ? filteredOptions[activeIndex] : undefined;

    return (
      <div ref={wrapperRef} className={cn("relative flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label id={labelId} htmlFor={inputId} className="text-small font-medium text-text-primary">
            {label}
            {required && (
              <span className="text-error-500" aria-hidden="true">
                {" "}
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={(node) => {
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            id={inputId}
            type="text"
            role="combobox"
            autoComplete="off"
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={open && activeOption ? optionDomId(activeOption) : undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            value={query}
            onChange={(event) => handleInputChange(event.target.value)}
            onFocus={openList}
            onClick={openList}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={cn(
              "h-10 w-full rounded-md border bg-surface-canvas px-3 pr-9 text-body text-text-primary",
              "placeholder:text-text-tertiary transition-colors duration-fast",
              "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-tertiary disabled:opacity-70",
              hasError
                ? "border-error-500 focus-visible:outline-error-500"
                : "border-surface-border focus:border-surface-border-strong",
              className,
            )}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 flex h-4 w-4 items-center justify-center text-text-tertiary"
          >
            <ChevronDownIcon />
          </span>
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : "Options"}
            hidden={!open}
            className="absolute top-full z-dropdown mt-1 max-h-60 w-full overflow-auto rounded-md border border-surface-border bg-surface-raised py-1 shadow-md"
          >
            {filteredOptions.length === 0 ? (
              <li
                role="option"
                aria-disabled="true"
                aria-selected="false"
                className="px-3 py-2 text-small text-text-tertiary"
              >
                {noOptionsMessage}
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                // Options are never directly focused/tabbed to (standard APG combobox roving
                // active-descendant pattern — focus stays on the input the whole time), so this
                // click handler is a mouse-only convenience; the keyboard equivalent (arrow keys
                // to move aria-activedescendant, Enter to select) is already handled by the
                // input's own onKeyDown above.
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <li
                  key={option.value}
                  id={optionDomId(option)}
                  role="option"
                  aria-selected={option.value === selectedValue}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commitSelection(option)}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-small text-text-primary",
                    index === activeIndex && "bg-surface-sunken",
                    option.value === selectedValue && "font-medium",
                  )}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
        {name && <input type="hidden" name={name} value={selectedValue ?? ""} readOnly />}
        {helperText && !hasError && (
          <p id={helperId} className="text-small text-text-tertiary">
            {helperText}
          </p>
        )}
        {hasError && (
          <p id={errorId} role="alert" className="flex items-start gap-1 text-small text-error-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M8.485 3.495c.673-1.165 2.357-1.165 3.03 0l6.28 10.875c.673 1.166-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.459-1.515-2.625L8.485 3.495ZM10 7a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 7Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errorText}</span>
          </p>
        )}
      </div>
    );
  },
);

Combobox.displayName = "Combobox";

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
