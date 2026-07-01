import { forwardRef, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Drawer } from "@/components/Drawer";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search as SearchIcon } from "@/components/Icon";

export interface SearchExperienceProps {
  /** Called with the trimmed query string when the user submits a search. */
  onSearch?: (query: string) => void;
  /** Placeholder text shown in the search field. @default "Search articles" */
  placeholder?: string;
  /** Accessible label for the icon-only trigger button. @default "Search" */
  triggerLabel?: string;
  /** Initial value of the search field. */
  defaultValue?: string;
  className?: string;
}

/**
 * A search trigger (icon button) that reveals a search field. Composes the existing `Input`
 * component for the text field, and reveals it inside the existing `Drawer` component
 * (`side="top"`) rather than reimplementing focus-trap/Escape/backdrop behavior — search is
 * treated as a header-anchored overlay (sliding down from the top edge, near the trigger
 * itself) rather than a centered `Modal`, since it's a lightweight, contextual action tied to
 * the page chrome rather than an interruptive task.
 */
export const SearchExperience = forwardRef<HTMLDivElement, SearchExperienceProps>(
  (
    {
      onSearch,
      placeholder = "Search articles",
      triggerLabel = "Search",
      defaultValue = "",
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(defaultValue);
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    // Drawer's own focus trap moves focus to the first focusable element in the panel, which
    // is its built-in close button (rendered in the header, ahead of this content). For a
    // search overlay the field itself is the far more useful initial focus target, so — since
    // this effect is on a component that's an ancestor of Drawer's `children`, it commits after
    // Drawer's own focus-trap effect — refocus the input once the panel opens.
    useEffect(() => {
      if (open) inputRef.current?.focus();
    }, [open]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      onSearch?.(trimmed);
      setOpen(false);
    }

    return (
      <div ref={ref} className={cn("inline-block", className)}>
        <Button
          type="button"
          variant="ghost"
          size="md"
          aria-label={triggerLabel}
          onClick={() => setOpen(true)}
        >
          <SearchIcon size="md" />
        </Button>

        <Drawer open={open} onClose={() => setOpen(false)} title="Search the site" side="top">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-2xl items-end gap-3"
            role="search"
          >
            <Input
              ref={inputRef}
              id={inputId}
              aria-label="Search query"
              wrapperClassName="flex-1"
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              leadingIcon={<SearchIcon size="sm" />}
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>
        </Drawer>
      </div>
    );
  },
);
SearchExperience.displayName = "SearchExperience";
