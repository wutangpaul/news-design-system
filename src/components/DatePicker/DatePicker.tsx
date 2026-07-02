import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
} from "react";
import { cn } from "@/lib/cn";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = [
  { short: "Su", full: "Sunday" },
  { short: "Mo", full: "Monday" },
  { short: "Tu", full: "Tuesday" },
  { short: "We", full: "Wednesday" },
  { short: "Th", full: "Thursday" },
  { short: "Fr", full: "Friday" },
  { short: "Sa", full: "Saturday" },
];

/** Formats a `Date` as a local (not UTC) `YYYY-MM-DD` string. */
function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parses a `YYYY-MM-DD` string into a local `Date` at midnight. Invalid input returns `null`. */
function fromISODate(value: string | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function addYears(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + amount);
  return next;
}

function clampISO(iso: string, min?: string, max?: string): string {
  if (min && iso < min) return min;
  if (max && iso > max) return max;
  return iso;
}

function formatDisplay(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Builds a fixed 6-week (42-day) grid for the month containing `monthDate`. */
function buildMonthGrid(monthDate: Date): Date[][] {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weeks: Date[][] = [];
  for (let i = 0; i < 6; i += 1) {
    weeks.push(days.slice(i * 7, i * 7 + 7));
  }
  return weeks;
}

export interface DatePickerProps {
  /** Visible label, programmatically associated with the field via htmlFor/id. */
  label?: string;
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  /**
   * Selected date as an ISO 8601 calendar date string (`YYYY-MM-DD`), matching the
   * native `<input type="date">` convention. Pass `undefined`/omit for no selection.
   */
  value?: string;
  /** Initial selected date for uncontrolled usage, same `YYYY-MM-DD` format as `value`. */
  defaultValue?: string;
  /** Called with the newly selected date (`YYYY-MM-DD`) whenever the user picks a day. */
  onChange?: (value: string) => void;
  /** Earliest selectable date, `YYYY-MM-DD`. Days before this are shown but not selectable. */
  min?: string;
  /** Latest selectable date, `YYYY-MM-DD`. Days after this are shown but not selectable. */
  max?: string;
  /** Placeholder shown when no date is selected. @default "Select a date" */
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  /** Class names applied to the wrapping `div`, not the `<input>` itself. */
  wrapperClassName?: string;
  className?: string;
}

/**
 * Single-date picker: a text-input-style field (matching `Input`'s label/helperText/errorText
 * contract) that reveals a calendar dialog on focus/click. The field itself is read-only —
 * selection happens via the calendar, so `value`/`onChange` only ever carry a clean
 * `YYYY-MM-DD` string.
 *
 * The popup follows the WAI-ARIA APG "Date Picker Dialog" pattern
 * (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/): a
 * non-modal `role="dialog"` containing a `role="grid"` of days navigated with the arrow keys,
 * Home/End, Page Up/Down (month) and Shift+Page Up/Down (year), with roving tabindex so only one
 * day is ever a Tab stop. Escape and Tab both close the popup, mirroring this design system's
 * `Dropdown` menu-button primitive.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      helperText,
      errorText,
      value,
      defaultValue,
      onChange,
      min,
      max,
      placeholder = "Select a date",
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
    const helperId = `${inputId}-helper-text`;
    const errorId = `${inputId}-error-text`;
    const dialogId = `${inputId}-dialog`;
    const monthLabelId = `${inputId}-month-label`;
    const hasError = Boolean(errorText);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedISO = isControlled ? value : internalValue;
    const selectedDate = fromISODate(selectedISO);

    const [open, setOpen] = useState(false);
    const [activeISO, setActiveISO] = useState<string>(() =>
      clampISO(selectedISO ?? toISODate(new Date()), min, max),
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const gridRef = useRef<HTMLTableElement>(null);
    const wasOpenRef = useRef(open);

    const describedBy =
      [hasError ? errorId : helperText ? helperId : undefined].filter(Boolean).join(" ") ||
      undefined;

    function openCalendar() {
      if (disabled) return;
      setActiveISO(clampISO(selectedISO ?? toISODate(new Date()), min, max));
      setOpen(true);
    }

    function closeCalendar() {
      setOpen(false);
    }

    function commitSelection(iso: string) {
      if (min && iso < min) return;
      if (max && iso > max) return;
      if (!isControlled) setInternalValue(iso);
      onChange?.(iso);
      setActiveISO(iso);
      closeCalendar();
    }

    // Move focus into the grid when the dialog opens; return it to the field when it closes.
    useEffect(() => {
      if (open && !wasOpenRef.current) {
        const button = gridRef.current?.querySelector<HTMLButtonElement>(
          `[data-date="${activeISO}"]`,
        );
        button?.focus();
      } else if (!open && wasOpenRef.current) {
        inputRef.current?.focus();
      }
      wasOpenRef.current = open;
      // Only re-run on open/close transitions; activeISO changes while open are handled by the
      // dedicated effect below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Re-focus the day button matching activeISO whenever it changes while the dialog is open
    // (arrow-key navigation, including navigation across a month boundary that re-renders the
    // grid with different days).
    useEffect(() => {
      if (!open) return;
      const button = gridRef.current?.querySelector<HTMLButtonElement>(
        `[data-date="${activeISO}"]`,
      );
      button?.focus();
    }, [activeISO, open]);

    // Click outside the field/dialog closes it.
    useEffect(() => {
      if (!open) return undefined;
      function handlePointerDown(event: PointerEvent) {
        if (!wrapperRef.current) return;
        if (!wrapperRef.current.contains(event.target as Node)) {
          closeCalendar();
        }
      }
      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    function moveActive(next: Date) {
      setActiveISO(clampISO(toISODate(next), min, max));
    }

    function handleGridKeyDown(event: ReactKeyboardEvent<HTMLTableElement>) {
      const current = fromISODate(activeISO) ?? new Date();

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          closeCalendar();
          return;
        case "Tab":
          // Per this design system's Dropdown convention, Tab exits the popup rather than
          // cycling within it.
          closeCalendar();
          return;
        case "ArrowLeft":
          event.preventDefault();
          moveActive(addDays(current, -1));
          return;
        case "ArrowRight":
          event.preventDefault();
          moveActive(addDays(current, 1));
          return;
        case "ArrowUp":
          event.preventDefault();
          moveActive(addDays(current, -7));
          return;
        case "ArrowDown":
          event.preventDefault();
          moveActive(addDays(current, 7));
          return;
        case "Home":
          event.preventDefault();
          moveActive(addDays(current, -current.getDay()));
          return;
        case "End":
          event.preventDefault();
          moveActive(addDays(current, 6 - current.getDay()));
          return;
        case "PageUp":
          event.preventDefault();
          moveActive(event.shiftKey ? addYears(current, -1) : addMonths(current, -1));
          return;
        case "PageDown":
          event.preventDefault();
          moveActive(event.shiftKey ? addYears(current, 1) : addMonths(current, 1));
          return;
        default:
      }
    }

    const activeDate = fromISODate(activeISO) ?? new Date();
    const weeks = buildMonthGrid(activeDate);
    const activeMonth = activeDate.getMonth();

    return (
      <div ref={wrapperRef} className={cn("relative flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-small font-medium text-text-primary">
            {label}
            {required && (
              <span className="text-error-500 dark:text-error-400" aria-hidden="true">
                {" "}
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            id={inputId}
            name={name}
            type="text"
            readOnly
            disabled={disabled}
            required={required}
            value={selectedDate ? formatDisplay(selectedDate) : ""}
            placeholder={placeholder}
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? dialogId : undefined}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            onClick={openCalendar}
            // Deliberately not opened on focus: closing the dialog (Escape, outside click, or
            // selecting a date) returns focus to this field via a `.focus()` call, which would
            // fire this same focus handler and immediately reopen it, undoing the close. Click
            // and ArrowDown/Enter (below) are the open triggers instead.
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "Enter") {
                event.preventDefault();
                openCalendar();
              }
            }}
            className={cn(
              "h-10 w-full cursor-pointer rounded-md border bg-surface-canvas px-3 pr-9 text-body text-text-primary",
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
            <CalendarIcon />
          </span>

          {open && (
            <div
              id={dialogId}
              role="dialog"
              aria-label="Choose date"
              className="absolute top-full z-dropdown mt-1 w-72 rounded-md border border-surface-border bg-surface-raised p-3 shadow-md"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => moveActive(addMonths(activeDate, -1))}
                  className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                >
                  <ChevronLeftIcon />
                </button>
                <p id={monthLabelId} aria-live="polite" className="text-small font-semibold text-text-primary">
                  {MONTH_NAMES[activeMonth]} {activeDate.getFullYear()}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => moveActive(addMonths(activeDate, 1))}
                  className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                >
                  <ChevronRightIcon />
                </button>
              </div>
              <table
                ref={gridRef}
                role="grid"
                aria-labelledby={monthLabelId}
                onKeyDown={handleGridKeyDown}
                className="w-full border-collapse text-center"
              >
                <thead>
                  <tr>
                    {WEEKDAYS.map((day) => (
                      <th key={day.full} scope="col" className="pb-1 text-caption font-medium text-text-tertiary">
                        <abbr title={day.full} className="no-underline">
                          {day.short}
                        </abbr>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week) => (
                    <tr key={toISODate(week[0])}>
                      {week.map((day) => {
                        const iso = toISODate(day);
                        const isOutOfRange = (min ? iso < min : false) || (max ? iso > max : false);
                        const isSelected = iso === selectedISO;
                        const isActive = iso === activeISO;
                        const isCurrentMonth = day.getMonth() === activeMonth;

                        return (
                          <td key={iso} role="gridcell" aria-selected={isSelected}>
                            <button
                              type="button"
                              data-date={iso}
                              tabIndex={isActive ? 0 : -1}
                              aria-disabled={isOutOfRange || undefined}
                              // The visible day number alone ("2") isn't a unique accessible
                              // name — this 6-week grid always shows a few leading/trailing days
                              // from adjacent months, so e.g. July 2 and August 2 would both be
                              // announced as just "2". The full date disambiguates them and
                              // gives screen reader users the month/year context regardless of
                              // which cell they land on.
                              aria-label={formatDisplay(day)}
                              aria-current={
                                iso === toISODate(new Date()) ? "date" : undefined
                              }
                              onClick={() => {
                                if (isOutOfRange) return;
                                commitSelection(iso);
                              }}
                              className={cn(
                                "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-small",
                                isCurrentMonth ? "text-text-primary" : "text-text-tertiary",
                                isOutOfRange && "cursor-not-allowed opacity-40",
                                !isOutOfRange && "hover:bg-surface-sunken",
                                isSelected && "bg-masthead-500 text-text-on-brand hover:bg-masthead-500",
                              )}
                            >
                              {day.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

DatePicker.displayName = "DatePicker";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 2.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
