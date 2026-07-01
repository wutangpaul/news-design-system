import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type RadioSize = "sm" | "md" | "lg";

interface RadioGroupContextValue {
  name: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  size: RadioSize;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const circleSizes: Record<RadioSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const dotSizes: Record<RadioSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

export interface RadioGroupProps {
  /** Accessible name for the group, rendered as visible text and wired via aria-labelledby. */
  label?: ReactNode;
  /** Helper text rendered below the group and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid` on the group, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  /** `name` shared by all radios in the group. Auto-generated if omitted. */
  name?: string;
  /** Currently selected value (controlled). */
  value?: string | null;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Lay options out horizontally instead of vertically. */
  orientation?: "horizontal" | "vertical";
  /** Size applied to every `Radio` in the group. */
  size?: RadioSize;
  /** `Radio` elements. */
  children: ReactNode;
  /** Class names applied to the outer wrapping `div`. */
  className?: string;
}

/**
 * Groups `Radio` options, managing shared `name`/`value`/`onChange` via context.
 * Renders `role="radiogroup"` with an accessible group label. Arrow-key navigation
 * between options works for free because the underlying inputs are native radios
 * sharing one `name`.
 */
export function RadioGroup({
  label,
  helperText,
  errorText,
  name,
  value,
  defaultValue,
  onChange,
  disabled,
  orientation = "vertical",
  size = "md",
  children,
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const labelId = useId();
  const helperId = useId();
  const errorId = useId();
  const hasError = Boolean(errorText);

  // Uncontrolled fallback so RadioGroup also works without a value/onChange pair.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const describedBy =
    [hasError ? errorId : helperText ? helperId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <span
          id={labelId}
          className="text-small font-medium text-text-primary"
        >
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={cn(
          "flex gap-3",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        )}
      >
        <RadioGroupContext.Provider
          value={{
            name: groupName,
            value: currentValue,
            onChange: handleChange,
            disabled,
            size,
          }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
      {helperText && !hasError && (
        <p id={helperId} className="text-small text-text-tertiary">
          {helperText}
        </p>
      )}
      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1 text-small text-error-700"
        >
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
}

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "checked" | "onChange" | "type" | "size"
  > {
  /** The value this option represents within its `RadioGroup`. */
  value: string;
  /** Visible label, programmatically associated with the radio via htmlFor/id. */
  label?: ReactNode;
}

/**
 * A single radio option. Must be rendered inside a `RadioGroup`, which supplies
 * `name`, the current value, and the change handler via context.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, id, className, disabled: disabledProp, ...rest }, ref) => {
    const ctx = useContext(RadioGroupContext);
    if (!ctx) {
      throw new Error("Radio must be rendered inside a RadioGroup");
    }

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const checked = ctx.value === value;
    const disabled = disabledProp ?? ctx.disabled;
    const size = ctx.size;

    return (
      <div className="flex items-center gap-2">
        <div className={cn("relative inline-flex shrink-0", circleSizes[size])}>
          <input
            ref={ref}
            type="radio"
            id={inputId}
            name={ctx.name}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={() => ctx.onChange(value)}
            className={cn(
              "peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed",
              circleSizes[size],
              className,
            )}
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full border-2 border-surface-border-strong bg-surface-canvas transition-colors",
              "peer-checked:border-masthead-500",
              "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-masthead-500",
              "peer-disabled:opacity-50",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 m-auto rounded-full bg-masthead-500 opacity-0 transition-opacity peer-checked:opacity-100",
              dotSizes[size],
            )}
          />
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-body text-text-primary",
              disabled && "opacity-50",
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Radio.displayName = "Radio";
