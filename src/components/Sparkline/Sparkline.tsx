import { forwardRef, type HTMLAttributes } from "react";
import { scaleLinear, scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { cn } from "@/lib/cn";
import { status, chrome } from "@/tokens";

export interface SparklineProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Narrative accessible label — the *only* way this component's meaning reaches a screen
   * reader, since it renders no axis, legend, or table (unlike LineChart/BarChart). State the
   * takeaway, not just what's plotted: e.g. `"7-day pageviews, up 12% to 21,300"`, not just
   * `"pageviews sparkline"`.
   */
  label: string;
  /** The trend's data points, in order. */
  values: number[];
  /** @default 80 */
  width?: number;
  /** @default 24 */
  height?: number;
  /**
   * Colors the line's end point by trend direction (last value vs. first, using this
   * system's status tokens: green if up, red if down) instead of a neutral tone. Matches the
   * dataviz method's stat-tile convention — "12-point sparkline in the de-emphasis hue,
   * current period in the accent" — where the accent here is the trend direction, not a
   * categorical series color (a sparkline shows one trend, not series identity).
   * @default false
   */
  showTrend?: boolean;
}

/**
 * A compact, chrome-free inline trend line — no axis, gridlines, legend, or tooltip, unlike
 * LineChart. Meant for dense contexts (a metadata row, a stat tile) where a full chart would
 * be too heavy. Precisely because it has no visible text of its own, `label` is required and
 * must narrate the trend, not just name the metric — see its own doc comment.
 *
 * The end marker here is intentionally smaller (r=3) than the ≥8px spec other charts in this
 * system follow: that floor exists so a marker stays legible crossing *other* lines and
 * survives as a *hit target* for hover/focus — neither applies here, since Sparkline has
 * exactly one line and no interaction at all.
 */
export const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(
  ({ label, values, width = 80, height = 24, showTrend = false, className, ...rest }, ref) => {
    const padding = 4;
    const innerWidth = Math.max(0, width - padding * 2);
    const innerHeight = Math.max(0, height - padding * 2);

    const xScale = scalePoint({
      domain: values.map((_, i) => i.toString()),
      range: [0, innerWidth],
    });
    const minValue = Math.min(...values, 0);
    const maxValue = Math.max(...values, 1);
    const yScale = scaleLinear({ domain: [minValue, maxValue], range: [innerHeight, 0] });

    const lastIndex = values.length - 1;
    const trendColor =
      showTrend && lastIndex > 0
        ? (values[lastIndex] ?? 0) >= (values[0] ?? 0)
          ? status.good
          : status.critical
        : chrome.mutedText;

    return (
      <span ref={ref} role="img" aria-label={label} className={cn("inline-block", className)} {...rest}>
        <svg width={width} height={height} aria-hidden="true">
          <g transform={`translate(${padding},${padding})`}>
            <LinePath
              data={values.map((v, i) => ({ x: i.toString(), y: v }))}
              x={(d) => xScale(d.x) ?? 0}
              y={(d) => yScale(d.y)}
              stroke={chrome.mutedText}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {lastIndex >= 0 && (
              <circle
                cx={xScale(lastIndex.toString()) ?? 0}
                cy={yScale(values[lastIndex] ?? 0)}
                r={3}
                fill={trendColor}
              />
            )}
          </g>
        </svg>
      </span>
    );
  },
);
Sparkline.displayName = "Sparkline";
