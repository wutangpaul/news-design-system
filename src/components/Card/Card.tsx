import {
  createContext,
  forwardRef,
  useContext,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const cardVariants = cva("rounded-lg text-text-primary", {
  variants: {
    variant: {
      flat: "bg-surface-raised",
      outlined: "bg-surface-canvas border border-surface-border",
      elevated: "bg-surface-raised shadow-md",
    },
    interactive: {
      true: "transition-shadow duration-base hover:shadow-lg focus-visible:shadow-lg",
      false: "",
    },
  },
  defaultVariants: {
    variant: "flat",
    interactive: false,
  },
});

/** Padding density shared by Card and its subparts via context. */
export type CardPadding = "compact" | "comfortable" | "spacious";

const paddingClasses: Record<CardPadding, string> = {
  compact: "p-3",
  comfortable: "p-5",
  spacious: "p-8",
};

const paddingGapClasses: Record<CardPadding, string> = {
  compact: "gap-2",
  comfortable: "gap-3",
  spacious: "gap-4",
};

const CardPaddingContext = createContext<CardPadding>("comfortable");

export interface CardProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Element/component to render as the root node. Defaults to `div`. Card
   * never renders its own interactive wrapper (e.g. a click handler on the
   * root) — wrap it in your own `<a>`/`<Link>` and use `interactive` purely
   * for the hover/focus visual treatment.
   */
  as?: ElementType;
  /** Visual treatment. @default "flat" */
  variant?: "flat" | "outlined" | "elevated";
  /** Adds hover/focus-visible affordance styling for clickable cards. */
  interactive?: boolean;
  /** Padding density applied to Card.Body (and inherited by Header/Footer). @default "comfortable" */
  padding?: CardPadding;
  children?: ReactNode;
}

/**
 * Generic content container with flat/outlined/elevated variants, padding
 * density, and an optional interactive hover treatment. Composes with
 * `Card.Header`, `Card.Body`, and `Card.Footer` for structured content;
 * Card itself stays a plain, non-interactive element — wrap it in your own
 * link/button if you need a clickable card.
 */
const CardRoot = forwardRef<HTMLElement, CardProps>(
  (
    {
      as: Component = "div",
      variant,
      interactive,
      padding = "comfortable",
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, interactive }), className)}
        {...rest}
      >
        <CardPaddingContext.Provider value={padding}>
          {children}
        </CardPaddingContext.Provider>
      </Component>
    );
  },
);
CardRoot.displayName = "Card";

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, children, ...rest }, ref) => {
    const padding = useContext(CardPaddingContext);
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col border-b border-surface-border",
          paddingGapClasses[padding],
          paddingClasses[padding],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CardHeader.displayName = "Card.Header";

const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, children, ...rest }, ref) => {
    const padding = useContext(CardPaddingContext);
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col",
          paddingGapClasses[padding],
          paddingClasses[padding],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CardBody.displayName = "Card.Body";

const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, children, ...rest }, ref) => {
    const padding = useContext(CardPaddingContext);
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center border-t border-surface-border",
          paddingGapClasses[padding],
          paddingClasses[padding],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CardFooter.displayName = "Card.Footer";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
