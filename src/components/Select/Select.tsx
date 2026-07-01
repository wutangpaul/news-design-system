import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const selectVariants = cva(
  [
    "w-full appearance-none rounded-md border bg-surface-canvas text-text-primary",
    "transition-colors duration-fast",
    "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-tertiary disabled:opacity-70",
  ],
  {
    variants: {
      size: {
        sm: "h-8 text-small pl-2.5 pr-8",
        md: "h-10 text-body pl-3 pr-9",
        lg: "h-12 text-lead pl-4 pr-10",
      },
      invalid: {
        true: "border-error-500 focus-visible:outline-error-500",
        false: "border-surface-border focus:border-surface-border-strong",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  /** Visible label, programmatically associated with the select via htmlFor/id. */
  label?: string;
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  /** Class names applied to the wrapping `div`, not the `<select>` itself. */
  wrapperClassName?: string;
}

/**
 * Native `<select>` dropdown with label, helper text, and error messaging.
 * Deliberately uses the native element (not a custom listbox) so keyboard
 * navigation, typeahead, and screen reader support come for free — the right
 * tradeoff for a content-heavy site over a custom combobox.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      errorText,
      size,
      id,
      className,
      wrapperClassName,
      disabled,
      required,
      children,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = `${selectId}-helper-text`;
    const errorId = `${selectId}-error-text`;
    const hasError = Boolean(errorText);

    const describedBy =
      [hasError ? errorId : helperText ? helperId : undefined, ariaDescribedBy]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-small font-medium text-text-primary"
          >
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
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(selectVariants({ size, invalid: hasError }), className)}
            {...rest}
          >
            {children}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={cn(
              "pointer-events-none absolute right-3 h-4 w-4 text-text-tertiary",
              disabled && "opacity-70",
            )}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
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

Select.displayName = "Select";
