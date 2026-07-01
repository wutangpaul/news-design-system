import { forwardRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Link } from "@/components/Link";
import { Drawer } from "@/components/Drawer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion";
import { Menu as MenuIcon } from "@/components/Icon";
import { MegaMenu, type MegaMenuColumn, type MegaMenuFeatured } from "@/patterns/MegaMenu";

export interface PrimaryNavLink {
  /** Visible label for the section. */
  label: string;
  /** Destination URL. */
  href: string;
}

export interface PrimaryNavItem extends PrimaryNavLink {
  /** Marks this item as the section for the currently viewed page (`aria-current="page"`). */
  current?: boolean;
  /** Sub-link columns revealed by a `MegaMenu` on hover/focus of this item, if any. */
  megaMenuColumns?: MegaMenuColumn[];
  /** Optional featured/promo link shown alongside the mega menu's columns. */
  megaMenuFeatured?: MegaMenuFeatured;
}

export interface PrimaryNavigationProps {
  /** Ordered list of top-level site sections. */
  items: PrimaryNavItem[];
  /** Accessible label for the `<nav>` landmark. @default "Primary" */
  ariaLabel?: string;
  /** Accessible label for the mobile menu toggle button. @default "Open menu" */
  mobileMenuLabel?: string;
  className?: string;
}

/**
 * The main site-sections navigation. Desktop renders a horizontal list of links (some of
 * which may open a `MegaMenu` on hover/focus); below the `lg` breakpoint it collapses into a
 * toggle button that opens the existing `Drawer` component for a vertical mobile menu, rather
 * than reimplementing a slide-out panel.
 *
 * Renders a real `<nav aria-label="Primary">` with the active section marked
 * `aria-current="page"`.
 */
export const PrimaryNavigation = forwardRef<HTMLElement, PrimaryNavigationProps>(
  ({ items, ariaLabel = "Primary", mobileMenuLabel = "Open menu", className }, ref) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
      <nav ref={ref} aria-label={ariaLabel} className={cn("flex items-center", className)}>
        {/* Desktop: horizontal list, hidden below `lg`. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            item.megaMenuColumns ? (
              <li key={item.href}>
                <MegaMenu
                  label={item.label}
                  columns={item.megaMenuColumns}
                  featured={item.megaMenuFeatured}
                />
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tone="standalone"
                  aria-current={item.current ? "page" : undefined}
                  className={cn(
                    "inline-block rounded-md px-3 py-2 text-body font-medium",
                    item.current && "text-masthead-600",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        {/* Mobile: toggle button, hidden at `lg` and up. */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={mobileMenuLabel}
          className="inline-flex items-center justify-center rounded-md p-2 text-text-primary hover:bg-surface-sunken lg:hidden"
        >
          <MenuIcon size="md" />
        </button>

        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          title="Menu"
          side="left"
        >
          <div className="flex flex-col">
            {items.map((item) =>
              item.megaMenuColumns ? (
                <Accordion key={item.href} type="multiple">
                  <AccordionItem value={item.href}>
                    <AccordionTrigger>{item.label}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-3 pl-2">
                        {item.megaMenuColumns.flatMap((column) => column.links).map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} tone="standalone">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  tone="standalone"
                  aria-current={item.current ? "page" : undefined}
                  className="border-b border-surface-border px-1 py-4 text-body font-medium"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </Drawer>
      </nav>
    );
  },
);
PrimaryNavigation.displayName = "PrimaryNavigation";
