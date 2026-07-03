import type { ReactNode } from "react";
import { categoricalColor } from "@/tokens";

/** A single named series of numeric points, shared by LineChart and BarChart. */
export interface ChartSeries {
  /** Series name — used for the legend, the accessible data table, and tooltips. */
  label: string;
  /** One value per category/x-point, in the same order as the chart's shared category list. */
  values: number[];
  /**
   * Fixed categorical slot index for this series' color. Required (not auto-assigned from
   * array position) so a color stays tied to *this series' identity* even if a consumer
   * re-orders or filters the `series` array — see the dataviz skill's "color follows the
   * entity, never its rank" rule.
   */
  colorIndex: number;
}

/**
 * Small color-swatch legend. Only rendered by consumers when there's more than one series —
 * a single series is named by the chart's own title/label, not a one-item legend box (per
 * the dataviz skill's accessibility pass).
 */
export function ChartLegend({ series }: { series: ChartSeries[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-caption text-text-secondary">
      {series.map((s) => (
        <li key={s.label} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: categoricalColor(s.colorIndex) }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * The WCAG-alternative "table view" every chart needs (dataviz skill, accessibility pass):
 * visually hidden (`sr-only`) but present in the DOM, so a screen reader user gets the exact
 * same data a sighted user reads off the plot, not just a chart title. Never the *only*
 * consumer-facing option — pair with a visible "View as table" disclosure where a chart is
 * complex enough that direct-labeling isn't enough on its own (left to each chart's own
 * judgment call, not enforced here).
 */
export function ChartDataTable({
  caption,
  categories,
  series,
  formatValue = (value: number) => value.toLocaleString(),
}: {
  caption: ReactNode;
  categories: string[];
  series: ChartSeries[];
  formatValue?: (value: number) => string;
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          {series.map((s) => (
            <th key={s.label} scope="col">
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((category, categoryIndex) => (
          <tr key={category}>
            <th scope="row">{category}</th>
            {series.map((s) => (
              <td key={s.label}>{formatValue(s.values[categoryIndex] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
