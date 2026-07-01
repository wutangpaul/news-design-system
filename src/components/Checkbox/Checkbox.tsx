import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const boxVariants = cva(
  [
    "pointer-events-none absolute inset-0 rounded border-2 bg-surface-canvas transition-colors",
    "peer-checked:border-masthead-500 peer-checked:bg-masthead-500",
    "peer-indeterminate:border-masthead-500 peer-indeterminate:bg-masthead-500",
    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-masthead-500",
    "peer-disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      invalid: {
        true: "border-error-500",
        false: "border-surface-border-strong",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  },
);

const boxSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

const iconSizes = {
  sm: "h-2.5 w-2.5",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
} as const;

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    VariantProps<typeof boxVariants> {
  /** Visible label, programmatically associated with the checkbox via htmlFor/id. */
  label?: ReactNode;
  /** Helper text rendered below the field and exposed via aria-describedby. */
  helperText?: string;
  /**
   * Error message. When present: sets `aria-invalid`, switches the
   * `aria-describedby` target to the error message, and applies error styling.
   */
  errorText?: string;
  /**
   * Visual + semantic indeterminate state ("partially checked"). Set imperatively
   * on the underlying DOM node via a ref, since there is no `indeterminate` HTML
   * attribute — only a JS property.
   */
  indeterminate?: boolean;
  /** Class names applied to the wrapping `div`, not the `<input>` itself. */
  wrapperClassName?: string;
}

/**
 * Checkbox with label, helper text, error messaging, and indeterminate support.
 * The native `<input type="checkbox">` is visually hidden (not `display: none`) so
 * it remains in the accessibility tree, focusable, and keyboard-operable; a sibling
 * `<span>` renders the custom box driven entirely by Tailwind `peer-*` states.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      errorText,
      indeterminate = false,
      size = "md",
      id,
      className,
      wrapperClassName,
      disabled,
      required,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
        }
      },
      [forwardedRef],
    );

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

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
        <div className="flex items-start gap-2">
          <div className={cn("relative inline-flex shrink-0", boxSizes[size ?? "md"])}>
            <input
              ref={setRefs}
              type="checkbox"
              id={inputId}
              disabled={disabled}
              required={required}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              className={cn(
                "peer absolute inset-0 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed",
                boxSizes[size ?? "md"],
                className,
              )}
              {...rest}
            />
            <span
              aria-hidden="true"
              className={cn(boxVariants({ size, invalid: hasError }))}
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "pointer-events-none absolute inset-0 m-auto text-text-on-brand opacity-0 peer-checked:opacity-100",
                iconSizes[size ?? "md"],
              )}
            >
              <path d="M4 10.5 8 14.5 16 5.5" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              className={cn(
                "pointer-events-none absolute inset-0 m-auto text-text-on-brand opacity-0 peer-indeterminate:opacity-100",
                iconSizes[size ?? "md"],
              )}
            >
              <path d="M5 10h10" />
            </svg>
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
              {required && (
                <span className="text-error-500" aria-hidden="true">
                  {" "}
                  *
                </span>
              )}
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

Checkbox.displayName = "Checkbox";
