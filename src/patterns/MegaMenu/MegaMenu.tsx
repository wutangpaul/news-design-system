import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { Dropdown, DropdownTrigger, DropdownMenu } from "@/components/Dropdown";
import { ChevronDown } from "@/components/Icon";

export interface MegaMenuLink {
  /** Visible label for the sub-link. */
  label: string;
  /** Destination URL. */
  href: string;
  /** Optional one-line supporting copy shown under the label. */
  description?: string;
}

export interface MegaMenuColumn {
  /** Column heading (e.g. "Elections", "Congress"). */
  heading: string;
  links: MegaMenuLink[];
}

export interface MegaMenuFeatured {
  /** Small eyebrow label, e.g. "Featured". */
  eyebrow?: string;
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuProps {
  /** Trigger label — the primary nav section name (e.g. "Politics"). */
  label: string;
  /** Columns of sub-links shown in the flyout panel. */
  columns: MegaMenuColumn[];
  /** Optional single featured/promo link rendered alongside the columns. */
  featured?: MegaMenuFeatured;
  className?: string;
}

/**
 * Large multi-column flyout panel, typically triggered from a `PrimaryNavigation` item.
 * Composes the generic `Dropdown` menu-button primitive from `src/components/Dropdown` for
 * all open/close/keyboard/focus-management logic rather than reimplementing it — this
 * pattern only supplies the multi-column layout and content.
 *
 * The trigger opens on click/Enter/Space/ArrowDown/ArrowUp exactly like any other Dropdown
 * (WAI-ARIA APG Menu Button pattern). Deliberately **not** hover-to-open: Dropdown's trigger
 * always *toggles* on click, so layering an independent hover-open on top of it races with
 * that toggle (hovering opens it, then the click that follows immediately toggles it shut
 * again) — the same click always has to both "arrive to press the button" and "land on an
 * already-open panel", which is exactly backwards. Sticking to Dropdown's own click/keyboard
 * contract avoids that conflict entirely and also avoids the WCAG 1.4.13 pitfalls of hover-only
 * disclosure (content that appears only on hover isn't reliably dismissible/reachable for
 * users who can't hover precisely).
 */
export const MegaMenu = forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ label, columns, featured, className }, ref) => {
    // Tracked only to rotate the chevron; Dropdown remains uncontrolled (no `open` prop passed
    // to it) so its own click/keyboard toggle logic is the single source of truth.
    const [open, setOpen] = useState(false);
    const idPrefix = useId();

    return (
      <div ref={ref} className={cn("relative inline-block", className)}>
        <Dropdown onOpenChange={setOpen}>
          <DropdownTrigger
            className="gap-1 border-none bg-transparent px-3 py-2 text-body font-medium text-text-primary hover:bg-surface-sunken"
          >
            {label}
            <ChevronDown
              size="sm"
              className={cn("transition-transform duration-fast", open && "rotate-180")}
            />
          </DropdownTrigger>
          <DropdownMenu className="flex w-[min(90vw,48rem)] gap-8 p-6">
            <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3">
              {columns.map((column, columnIndex) => {
                const headingId = `${idPrefix}-heading-${columnIndex}`;
                return (
                  <div key={column.heading}>
                    <p
                      id={headingId}
                      className="mb-2 text-small font-semibold uppercase tracking-wide text-text-tertiary"
                    >
                      {column.heading}
                    </p>
                    {/*
                      `role="group"` (not a `<ul>`) so `role="menuitem"` below has an ARIA-valid
                      required parent — a `<ul>`/`<li>` pair carries implicit `list`/`listitem`
                      roles that aren't in menuitem's allowed ancestor set and would otherwise
                      trip axe's `aria-required-parent` check.
                    */}
                    <div role="group" aria-labelledby={headingId} className="flex flex-col gap-2">
                      {column.links.map((link) => (
                        // A real navigational `<a>`, not a `DropdownItem` — DropdownItem is a
                        // `role="menuitem"` action button meant for menu commands, whereas
                        // these are page links. `getMenuItems()` inside Dropdown discovers any
                        // `[role="menuitem"]` element (not specifically `DropdownItem`), so
                        // arrow-key roving focus still finds and moves between these anchors.
                        <a
                          key={link.href}
                          role="menuitem"
                          tabIndex={-1}
                          href={link.href}
                          className="block rounded-sm px-1 py-1 text-small text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                        >
                          {link.label}
                          {link.description && (
                            <span className="block text-caption text-text-tertiary">
                              {link.description}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {featured && (
              <div
                role="group"
                aria-label={featured.eyebrow ? `${featured.eyebrow}: ${featured.label}` : featured.label}
                className="w-48 shrink-0 border-l border-surface-border pl-6"
              >
                {featured.eyebrow && (
                  <p className="mb-1 text-caption font-semibold uppercase tracking-wide text-masthead-600 dark:text-masthead-400">
                    {featured.eyebrow}
                  </p>
                )}
                <a
                  role="menuitem"
                  tabIndex={-1}
                  href={featured.href}
                  className="block rounded-sm text-small font-medium text-text-primary hover:text-masthead-600 dark:hover:text-masthead-400"
                >
                  {featured.label}
                </a>
                {featured.description && (
                  <p className="mt-1 text-caption text-text-tertiary">{featured.description}</p>
                )}
              </div>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  },
);
MegaMenu.displayName = "MegaMenu";
