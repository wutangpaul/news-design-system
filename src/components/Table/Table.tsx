import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/** Horizontal alignment for a header or body cell. */
export type TableCellAlign = "left" | "center" | "right";

const alignClasses: Record<TableCellAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /**
   * Visible table caption, rendered as a real `<caption>` so assistive tech announces it
   * with the table. Every data table should have one — election results, standings, and
   * market tables are meaningless without a stated subject and period.
   */
  caption?: ReactNode;
  /** Extra classes for the scrollable wrapper `div` (useful for sizing/margins). */
  containerClassName?: string;
  children?: ReactNode;
}

/**
 * Data table for results, standings, and market data. Renders a native `<table>` inside an
 * `overflow-x-auto` wrapper so wide tables scroll sideways instead of breaking the page
 * layout on small screens.
 *
 * Compound component: compose with `TableHead`, `TableBody`, `TableFoot`, `TableRow`,
 * `TableHeaderCell`, and `TableCell`. Mark numeric columns with `TableCell numeric` (and
 * `TableHeaderCell align="right"`) — numbers render right-aligned in the mono face, the
 * system's "data of record" treatment, so magnitudes line up digit-for-digit down a column.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ caption, containerClassName, className, children, ...rest }, ref) => {
    return (
      <div className={cn("overflow-x-auto", containerClassName)}>
        <table
          ref={ref}
          className={cn("w-full border-collapse text-small text-text-primary", className)}
          {...rest}
        >
          {caption ? (
            <caption className="mb-3 caption-top text-left font-sans text-small text-text-secondary">
              {caption}
            </caption>
          ) : null}
          {children}
        </table>
      </div>
    );
  },
);
Table.displayName = "Table";

export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...rest }, ref) => (
    /* A stronger rule under the header row than between body rows: the header/body
       boundary is structural, row separators are just reading guides. */
    <thead ref={ref} className={cn("border-b border-surface-border-strong", className)} {...rest} />
  ),
);
TableHead.displayName = "TableHead";

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...rest }, ref) => <tbody ref={ref} className={className} {...rest} />,
);
TableBody.displayName = "TableBody";

export const TableFoot = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...rest }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t border-surface-border-strong font-semibold", className)}
      {...rest}
    />
  ),
);
TableFoot.displayName = "TableFoot";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...rest }, ref) => (
    /* Hairline between rows; the hover wash aids scanning wide rows and is harmless on
       touch. [&:last-child]:border-0 keeps the table's bottom edge clean inside cards. */
    <tr
      ref={ref}
      className={cn(
        "border-b border-surface-border transition-colors duration-fast hover:bg-surface-raised [&:last-child]:border-0",
        className,
      )}
      {...rest}
    />
  ),
);
TableRow.displayName = "TableRow";

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Horizontal alignment — use `"right"` over numeric columns. @default "left" */
  align?: TableCellAlign;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ align = "left", scope = "col", className, ...rest }, ref) => (
    <th
      ref={ref}
      /* scope defaults to "col" (the common case in a thead); pass scope="row" for a row
         header in the body, e.g. the team column in league standings. */
      scope={scope}
      className={cn(
        "px-3 py-2.5 font-sans text-caption font-semibold uppercase tracking-wider text-text-secondary",
        alignClasses[align],
        className,
      )}
      {...rest}
    />
  ),
);
TableHeaderCell.displayName = "TableHeaderCell";

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Marks the cell as numeric data: right-aligned in the mono face with tabular figures,
   * so digits line up down the column — the same "data of record" treatment timestamps
   * get system-wide. Sets `align="right"` unless overridden.
   */
  numeric?: boolean;
  /** Horizontal alignment. Defaults to `"right"` when `numeric`, else `"left"`. */
  align?: TableCellAlign;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ numeric = false, align, className, ...rest }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-3 py-2.5",
        numeric && "font-mono text-caption tabular-nums",
        alignClasses[align ?? (numeric ? "right" : "left")],
        className,
      )}
      {...rest}
    />
  ),
);
TableCell.displayName = "TableCell";
