import { type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

export interface ToggleOption {
  /** Visible label for the option. */
  label: ReactNode;
  /** Unique value identifying the option. */
  value: string;
  /** Disables this option only. */
  disabled?: boolean;
}

const groupSizes = {
  sm: "p-0.5",
  md: "p-1",
  lg: "p-1",
} as const;

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-1.5 rounded whitespace-nowrap",
    "transition-colors duration-fast",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-small",
        md: "h-9 px-3.5 text-body",
        lg: "h-11 px-5 text-lead",
      },
      selected: {
        true: "bg-masthead-500 font-semibold text-text-on-brand",
        false:
          "bg-transparent font-medium text-text-secondary hover:bg-surface-sunken",
      },
    },
    defaultVariants: { size: "md", selected: false },
  },
);

interface ToggleSharedProps {
  /** The options rendered as segments/buttons. */
  options: ToggleOption[];
  /** Accessible name for the group. Required — there is no visible `<label>` element. */
  "aria-label": string;
  /** Disables every option. */
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ToggleSingleProps extends ToggleSharedProps {
  /** Exactly one option is selected at a time, like a view switcher. */
  type?: "single";
  value: string;
  onChange: (value: string) => void;
}

export interface ToggleMultipleProps extends ToggleSharedProps {
  /** Any number of options may be selected at once, like filter chips. */
  type: "multiple";
  value: string[];
  onChange: (value: string[]) => void;
}

export type ToggleProps = ToggleSingleProps | ToggleMultipleProps;

/**
 * A segmented, button-style toggle group — e.g. switching between "Article" and
 * "Photos" views, or toggling a set of independent filter chips.
 *
 * Implemented as a `role="group"` of native `<button>`s using `aria-pressed`
 * (the APG "toggle button" pattern), not `role="tablist"`/`role="tab"`. Tabs imply
 * managing separate content panels (`aria-controls`, roving tabindex, panel
 * `role="tabpanel"`s) which is more machinery than a simple view switch needs here.
 * `type="single"` keeps exactly one option pressed (like a view switcher);
 * `type="multiple"` allows any number of options pressed at once (like filter chips).
 */
export function Toggle(props: ToggleSingleProps): JSX.Element;
export function Toggle(props: ToggleMultipleProps): JSX.Element;
export function Toggle(props: ToggleProps) {
  const { options, disabled, size = "md", className, type = "single" } = props;
  const ariaLabel = props["aria-label"];
  const value = props.value;
  const onChange = props.onChange as (value: string | string[]) => void;

  const isSelected = (optionValue: string) =>
    type === "multiple"
      ? Array.isArray(value) && value.includes(optionValue)
      : value === optionValue;

  const handleSelect = (optionValue: string) => {
    if (type === "multiple") {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onChange(next);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md bg-surface-sunken",
        groupSizes[size],
        className,
      )}
    >
      {options.map((option) => {
        const selected = isSelected(option.value);
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled || option.disabled}
            aria-pressed={selected}
            onClick={() => handleSelect(option.value)}
            className={cn(buttonVariants({ size, selected }))}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
