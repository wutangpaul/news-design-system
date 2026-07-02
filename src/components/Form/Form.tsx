import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export interface FormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /**
   * Called once `Form` has intercepted the native submit event. `Form` always calls
   * `event.preventDefault()` first — it's a presentation-layer wrapper, not a submission
   * mechanism, so it never triggers a native page navigation/POST. Read `FormData` off
   * `event.currentTarget` if you need it, run your own validation, and update `errors`
   * (and/or perform the real submission) from there.
   */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /**
   * Field-level validation errors, keyed by the invalid field's `id` and valued by the
   * human-readable message to show for it. `Form` does no validation of its own — the
   * consumer computes this map (from a schema library, hand-rolled checks, a server
   * response, etc.) and passes it in. When non-empty, an accessible error summary renders
   * above `children`, and after a submit attempt focus moves to that summary. Each summary
   * entry links to (and focuses/scrolls to) the field whose `id` matches its key, so keep
   * these keys in sync with the `id` you pass to each field — see the MDX docs for the full
   * wiring pattern.
   */
  errors?: Record<string, string>;
  /** Heading text shown above the list of errors in the summary. @default "There is a problem" */
  summaryHeading?: string;
  children: ReactNode;
}

/**
 * Wraps arbitrary field components (`Input`, `Textarea`, `Select`, `DatePicker`, `Combobox`,
 * etc.) in a real `<form>` and coordinates a submit-time error summary across all of them —
 * something no individual field can do on its own, since each manages its own inline error in
 * isolation. When a submit is attempted while `errors` is non-empty, `Form` renders an
 * accessible error summary above the fields and moves focus into it, following the standard
 * "error summary" pattern (GOV.UK Design System; WCAG technique G83: "providing a text
 * description when the user provides information that is not in the list of allowed values").
 *
 * `Form` intentionally does not validate anything itself and has no field-registration/state
 * management of its own — it is a `<form>` element plus an error-summary UI plus the focus
 * management around it. Validation logic and the `errors` map it renders both belong to the
 * consumer.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      onSubmit,
      errors,
      summaryHeading = "There is a problem",
      children,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const formId = id ?? generatedId;
    const headingId = `${formId}-error-summary-heading`;

    const summaryRef = useRef<HTMLDivElement>(null);
    // Tracks whether the *next* render's `errors` value should be treated as the result of a
    // submit attempt (and therefore worth moving focus for), as opposed to `errors` changing
    // for some unrelated reason (e.g. a parent re-render). Set on submit, consumed by the
    // effect below on the next render after `errors` updates.
    const attemptedSubmitRef = useRef(false);

    const errorEntries = Object.entries(errors ?? {});
    const hasErrors = errorEntries.length > 0;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      // Form never performs a native submission itself — the consumer's onSubmit owns that
      // (and owns deciding, from its own validation, what the next `errors` prop should be).
      event.preventDefault();
      attemptedSubmitRef.current = true;
      onSubmit?.(event);
    }

    useEffect(() => {
      if (!attemptedSubmitRef.current) return;
      attemptedSubmitRef.current = false;
      if (hasErrors) {
        summaryRef.current?.focus();
      }
      // Intentionally keyed only on `errors`: `hasErrors`/`errorEntries` are derived from it
      // every render, so re-running this effect for them too would be redundant.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    function jumpToField(fieldId: string) {
      const field = document.getElementById(fieldId);
      if (!field) return;
      field.focus();
      if (typeof field.scrollIntoView === "function") {
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return (
      <form
        ref={ref}
        id={formId}
        noValidate
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-5", className)}
        {...rest}
      >
        {hasErrors && (
          <div
            ref={summaryRef}
            role="alert"
            tabIndex={-1}
            aria-labelledby={headingId}
            className={cn(
              "flex flex-col gap-2 rounded-lg border px-4 py-3 text-error-700",
              "border-error-500/30 bg-error-50",
              "dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-50",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-error-500",
            )}
          >
            <p id={headingId} className="flex items-center gap-2 font-semibold">
              <ErrorSummaryIcon />
              {summaryHeading}
            </p>
            <ul className="flex flex-col gap-1 pl-1">
              {errorEntries.map(([fieldId, message]) => (
                <li key={fieldId}>
                  <a
                    href={`#${fieldId}`}
                    // No hover color swap: text-error-500 only reaches 4.41:1 against this
                    // container's light-mode background and 3.79:1 in dark mode, both under
                    // the 4.5:1 AA text floor. The persistent underline is affordance enough.
                    className="text-small underline underline-offset-2"
                    onClick={(event) => {
                      event.preventDefault();
                      jumpToField(fieldId);
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {children}
      </form>
    );
  },
);

Form.displayName = "Form";

function ErrorSummaryIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M8.485 3.495c.673-1.165 2.357-1.165 3.03 0l6.28 10.875c.673 1.166-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.459-1.515-2.625L8.485 3.495ZM10 7a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 7Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
