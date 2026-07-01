import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ArticleBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Long-form reading container: constrains prose to a readable measure (~65ch, per the
 * Grid & Layout foundations) and applies sensible vertical rhythm between whatever
 * children are composed inside it — paragraphs, headings, inline images, pull quotes.
 * `ArticleBody` is a typographic/layout wrapper, not a rich-text renderer: it renders
 * arbitrary children as-is rather than expecting a fixed content shape.
 */
export const ArticleBody = forwardRef<HTMLDivElement, ArticleBodyProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto flex max-w-[65ch] flex-col gap-6 font-sans text-body text-text-primary",
          // Extra breathing room above headings/figures beyond the base rhythm gap, so
          // section breaks and images read as distinct beats rather than just another
          // paragraph in the flow.
          "[&>h2]:mt-6 [&>h3]:mt-4 [&>h4]:mt-2 [&>figure]:mt-2 [&>img]:mt-2",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
ArticleBody.displayName = "ArticleBody";
