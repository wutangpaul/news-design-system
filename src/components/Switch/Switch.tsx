import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SwitchSize = "sm" | "md" | "lg";

// Dimensions stick to keys that exist in the spacing scale (src/tokens/spacing.ts) —
// there is no key for 7, 9, 11, 13, etc., so sizes are chosen from 4/5/6/8/10/12.
const trackSizes: Record<SwitchSize, string> = {
  sm: "h-4 w-8",
  md: "h-5 w-10",
  lg: "h-6 w-12",
};

const thumbSizes: Record<SwitchSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const thumbTranslate: Record<SwitchSize, string> = {
  sm: "peer-checked:translate-x-4",
  md: "peer-checked:translate-x-5",
  lg: "peer-checked:translate-x-6",
};

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Visible label, programmatically associated with the switch via htmlFor/id. */
  label?: ReactNode;
  /** Which side of the switch the label renders on. */
  labelPosition?: "left" | "right";
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  size?: SwitchSize;
  /** Class names applied to the wrapping `div`, not the `<input>` itself. */
  wrapperClassName?: string;
}

/**
 * On/off boolean switch. Uses a native `<input type="checkbox">` with
 * `role="switch"` so it's keyboard-operable for free while assistive tech
 * announces it as a switch ("on"/"off") rather than a checkbox.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      labelPosition = "right",
      helperText,
      errorText,
      size = "md",
      id,
      className,
      wrapperClassName,
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper-text`;
    const errorId = `${inputId}-error-text`;
    const hasError = Boolean(errorText);

    const describedBy =
      [hasError ? errorId : helperText ? helperId : undefined, ariaDescribedBy]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        <div
          className={cn(
            "inline-flex items-center gap-2",
            labelPosition === "left" && "flex-row-reverse justify-end",
          )}
        >
          <div className={cn("relative inline-flex shrink-0", trackSizes[size])}>
            <input
              ref={ref}
              type="checkbox"
              role="switch"
              id={inputId}
              disabled={disabled}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              className={cn(
                "peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed",
                trackSizes[size],
                className,
              )}
              {...rest}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full border-2 bg-surface-sunken transition-colors",
                "peer-checked:border-masthead-500 peer-checked:bg-masthead-500",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-masthead-500",
                "peer-disabled:opacity-50",
                hasError ? "border-error-500" : "border-surface-border-strong",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-surface-canvas shadow transition-transform",
                thumbSizes[size],
                thumbTranslate[size],
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
  },
);

Switch.displayName = "Switch";
