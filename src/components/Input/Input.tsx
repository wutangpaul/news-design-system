import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const inputVariants = cva(
  [
    "w-full rounded-md border bg-surface-canvas text-text-primary",
    "placeholder:text-text-tertiary",
    "transition-colors duration-fast",
    "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-tertiary disabled:opacity-70",
    "read-only:bg-surface-sunken",
  ],
  {
    variants: {
      size: {
        sm: "h-8 text-small px-2.5",
        md: "h-10 text-body px-3",
        lg: "h-12 text-lead px-4",
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

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Visible label, programmatically associated with the input via htmlFor/id. */
  label?: string;
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, applies error styling,
   * and shows a warning icon alongside the text (never color alone).
   */
  errorText?: string;
  /** Icon rendered at the start of the field. Decorative; pass your own ReactNode (e.g. an inline SVG). */
  leadingIcon?: ReactNode;
  /** Icon rendered at the end of the field. Decorative; pass your own ReactNode (e.g. an inline SVG). */
  trailingIcon?: ReactNode;
  /** Class names applied to the wrapping `div`, not the `<input>` itself. */
  wrapperClassName?: string;
}

/**
 * Single-line text input with label, helper text, and error messaging.
 * Forwards its ref to the native `<input>` element.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leadingIcon,
      trailingIcon,
      size,
      id,
      className,
      wrapperClassName,
      disabled,
      required,
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
        {label && (
          <label
            htmlFor={inputId}
            className="text-small font-medium text-text-primary"
          >
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
          {leadingIcon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 flex h-4 w-4 items-center justify-center text-text-tertiary"
            >
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              inputVariants({ size, invalid: hasError }),
              leadingIcon && "pl-9",
              trailingIcon && "pr-9",
              className,
            )}
            {...rest}
          />
          {trailingIcon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 flex h-4 w-4 items-center justify-center text-text-tertiary"
            >
              {trailingIcon}
            </span>
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

Input.displayName = "Input";
