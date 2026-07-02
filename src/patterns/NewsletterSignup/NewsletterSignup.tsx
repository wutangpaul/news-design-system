import {
  forwardRef,
  useId,
  useState,
  type FormEvent,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

/**
 * Layout density. `"default"` is the full landing-page treatment (heading,
 * description, and a field/button row that stacks on narrow viewports).
 * `"inline"` is a compact single-row treatment (short label + input + button,
 * no description) for embedding mid-article or in a sidebar.
 */
export type NewsletterSignupVariant = "default" | "inline";

export interface NewsletterSignupProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "children"> {
  /** Layout density — see `NewsletterSignupVariant`. @default "default" */
  variant?: NewsletterSignupVariant;
  /** Heading above the form. In the `"inline"` variant this renders as a compact
   * text label beside the field instead of a full `Heading`. @default "Sign up for our newsletter" */
  heading?: string;
  /**
   * Supporting copy rendered below the heading. Ignored in the `"inline"`
   * variant — inline is meant to be a single row, and dropping this is what keeps
   * it compact.
   */
  description?: string;
  /**
   * Called with the entered email address when the form is submitted and the
   * native `type="email"` validation passes. This pattern doesn't know about
   * any real backend — it's presentational/interaction logic only; wiring
   * the actual subscription request (and setting `isLoading`/`errorText`/
   * `successMessage` from its result) is entirely up to the consumer.
   */
  onSubmit: (email: string) => void | Promise<void>;
  /** Puts the submit button in its busy state and disables the field while a request is pending. */
  isLoading?: boolean;
  /**
   * Error message for the email field (e.g. "That email is already
   * subscribed"). Passed straight through to `Input`'s `errorText` — this
   * pattern doesn't invent its own error UI.
   */
  errorText?: string;
  /**
   * When set, replaces the form with a confirmation message — set this from
   * the result of your own `onSubmit` handler once the subscription
   * request succeeds.
   */
  successMessage?: string;
  /** Label for the email field. @default "Email address" */
  label?: string;
  /** Placeholder shown in the empty email field. @default "you@example.com" */
  placeholder?: string;
  /** Submit button label. @default "Sign up" */
  submitLabel?: string;
}

/**
 * Email capture form: composes the existing `Input` (email type, with its
 * built-in label/error/helper-text contract) and `Button` (submit, with its
 * `isLoading` state). Field validation UI (error styling, `aria-invalid`,
 * `aria-describedby`) is entirely `Input`'s, not reimplemented here.
 *
 * Two layout densities share the same submission/loading/success-state logic below —
 * only the markup each returns differs: `"default"` (full heading + description) for
 * landing pages, `"inline"` (compact single row) for embedding mid-article or in a
 * sidebar. See `NewsletterSignupVariant`.
 */
export const NewsletterSignup = forwardRef<HTMLFormElement, NewsletterSignupProps>(
  (
    {
      variant = "default",
      heading = "Sign up for our newsletter",
      description,
      onSubmit,
      isLoading = false,
      errorText,
      successMessage,
      label = "Email address",
      placeholder = "you@example.com",
      submitLabel = "Sign up",
      className,
      ...rest
    },
    ref,
  ) => {
    const [email, setEmail] = useState("");
    const headingId = useId();
    const isInline = variant === "inline";

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void onSubmit(email);
    };

    if (successMessage) {
      if (isInline) {
        return (
          <div role="status" className={cn("flex items-center", className)}>
            <Text size="small" color="secondary">
              {successMessage}
            </Text>
          </div>
        );
      }
      return (
        <div
          role="status"
          className={cn("flex flex-col gap-2", className)}
        >
          <Heading level={3} visualSize={5}>
            {heading}
          </Heading>
          <Text color="secondary">{successMessage}</Text>
        </div>
      );
    }

    if (isInline) {
      return (
        <form
          ref={ref}
          aria-labelledby={headingId}
          onSubmit={handleSubmit}
          className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}
          {...rest}
        >
          <Text
            id={headingId}
            as="span"
            size="small"
            weight="medium"
            className="shrink-0 sm:pr-1"
          >
            {heading}
          </Text>
          <Input
            type="email"
            name="email"
            aria-label={label}
            placeholder={placeholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            errorText={errorText}
            disabled={isLoading}
            required
            size="sm"
            wrapperClassName="min-w-0 flex-1"
          />
          <Button
            type="submit"
            isLoading={isLoading}
            size="sm"
            className="w-full shrink-0 sm:w-auto"
          >
            {submitLabel}
          </Button>
        </form>
      );
    }

    return (
      <form
        ref={ref}
        aria-labelledby={headingId}
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-4", className)}
        {...rest}
      >
        <div className="flex flex-col gap-1">
          <Heading id={headingId} level={3} visualSize={5}>
            {heading}
          </Heading>
          {description ? <Text color="secondary">{description}</Text> : null}
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
          <Input
            type="email"
            name="email"
            label={label}
            placeholder={placeholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            errorText={errorText}
            disabled={isLoading}
            required
            wrapperClassName="w-full sm:flex-1"
          />
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            {submitLabel}
          </Button>
        </div>
      </form>
    );
  },
);
NewsletterSignup.displayName = "NewsletterSignup";
