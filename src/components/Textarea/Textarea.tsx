import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const textareaVariants = cva(
  [
    "w-full rounded-md border bg-surface-canvas text-text-primary",
    "placeholder:text-text-tertiary",
    "transition-colors duration-fast",
    "resize-y",
    "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-tertiary disabled:opacity-70",
    "read-only:bg-surface-sunken",
  ],
  {
    variants: {
      size: {
        sm: "text-small px-2.5 py-2",
        md: "text-body px-3 py-2.5",
        lg: "text-lead px-4 py-3",
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

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Visible label, programmatically associated with the textarea via htmlFor/id. */
  label?: string;
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  /**
   * Show a "current/max" character counter. Requires `maxLength` to be set;
   * the counter is included in `aria-describedby` so it's announced alongside
   * helper/error text.
   */
  showCount?: boolean;
  /** Class names applied to the wrapping `div`, not the `<textarea>` itself. */
  wrapperClassName?: string;
}

/**
 * Multi-line text field with label, helper text, error messaging, and an
 * optional character counter. Resizable vertically by default.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorText,
      showCount = false,
      size,
      id,
      className,
      wrapperClassName,
      disabled,
      required,
      maxLength,
      value,
      defaultValue,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helperId = `${textareaId}-helper-text`;
    const errorId = `${textareaId}-error-text`;
    const countId = `${textareaId}-char-count`;
    const hasError = Boolean(errorText);

    // Character count works for both controlled and uncontrolled usage.
    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
          ? defaultValue.length
          : undefined;

    const describedBy =
      [
        hasError ? errorId : helperText ? helperId : undefined,
        showCount && maxLength ? countId : undefined,
        ariaDescribedBy,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(textareaVariants({ size, invalid: hasError }), className)}
          rows={rest.rows ?? 4}
          {...rest}
        />
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
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
          {showCount && maxLength && (
            <p
              id={countId}
              className="shrink-0 text-small text-text-tertiary tabular-nums"
            >
              {currentLength ?? 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
