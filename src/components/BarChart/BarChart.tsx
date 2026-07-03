import { forwardRef, useState, type HTMLAttributes } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { useTooltip, useTooltipInPortal, defaultStyles as defaultTooltipStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { cn } from "@/lib/cn";
import { categoricalColor, chrome } from "@/tokens";
import { ChartLegend, ChartDataTable, type ChartSeries } from "@/lib/charts";

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Accessible name for the chart region and the hidden data table's caption. */
  title: string;
  /** X-axis category labels, shared by every series. */
  categories: string[];
  /** One or more named, colored series — see `ChartSeries`. Multiple series group per category. */
  series: ChartSeries[];
  /** Chart height in pixels. @default 280 */
  height?: number;
  /**
   * Fixed chart width in pixels. Omit to fill the parent container responsively
   * (measured via `ParentSize`, which needs real layout — pass this explicitly in
   * environments without one, e.g. jsdom tests).
   */
  width?: number;
  /** Formats a raw value for axis ticks, the tooltip, and the hidden data table. */
  valueFormatter?: (value: number) => string;
}

// left: 64, not 48 - see LineChart's identical constant for why (SVG clips content past its
// own bounds, and text-anchor="end" tick labels extend leftward from the axis).
const MARGIN = { top: 16, right: 16, bottom: 32, left: 64 };
const MAX_BAR_THICKNESS = 24;
const BAR_GAP = 2;

/**
 * A rectangle with only its top two corners rounded, square at the bottom — the mark spec
 * calls for the data-end to be rounded and the baseline to stay square, which SVG's `rect`
 * `rx` can't express (it rounds all four corners uniformly), so this draws the outline
 * directly instead of faking it with a CSS clip-path.
 */
function roundedTopRectPath(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.min(radius, width / 2, Math.max(height, 0));
  if (height <= 0 || width <= 0) return "";
  return [
    `M ${x} ${y + height}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `L ${x + width} ${y + height}`,
    "Z",
  ].join(" ");
}

interface TooltipDatum {
  category: string;
  index: number;
}

/**
 * Bar chart for comparing magnitude across categories, with grouped bars for multiple
 * series. Each bar is its own hover/focus hit target (per-bar tooltip, no crosshair — bars
 * aren't a continuous sequence the way a line is). Legend when there's more than one series,
 * plus a visually hidden data table so every value is reachable without the plot at all.
 * Colors are assigned by fixed categorical slot (`series[].colorIndex`), never by array
 * position — see `src/tokens/chartColors.ts`.
 */
export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  ({ title, categories, series, height = 280, width, valueFormatter = (v) => v.toLocaleString(), className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={title}
        className={cn("flex flex-col gap-3", className)}
        {...rest}
      >
        {series.length > 1 && <ChartLegend series={series} />}

        {width !== undefined ? (
          <BarChartPlot
            categories={categories}
            series={series}
            width={width}
            height={height}
            valueFormatter={valueFormatter}
          />
        ) : (
          // See LineChart's identical wrapper for why: ParentSize needs a definite ancestor
          // height to measure against, and `height` is already fixed and known here.
          <div style={{ height }}>
            <ParentSize>
              {({ width: measuredWidth }) =>
                measuredWidth === 0 ? null : (
                  <BarChartPlot
                    categories={categories}
                    series={series}
                    width={measuredWidth}
                    height={height}
                    valueFormatter={valueFormatter}
                  />
                )
              }
            </ParentSize>
          </div>
        )}

        <ChartDataTable
          caption={title}
          categories={categories}
          series={series}
          formatValue={valueFormatter}
        />
      </div>
    );
  },
);
BarChart.displayName = "BarChart";

interface BarChartPlotProps {
  categories: string[];
  series: ChartSeries[];
  width: number;
  height: number;
  valueFormatter: (value: number) => string;
}

function BarChartPlot({ categories, series, width, height, valueFormatter }: BarChartPlotProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<TooltipDatum>();

  const maxValue = Math.max(1, ...series.flatMap((s) => s.values));
  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const categoryScale = scaleBand({ domain: categories, range: [0, innerWidth], padding: 0.3 });
  const groupScale = scaleBand({
    domain: series.map((_, i) => i.toString()),
    range: [0, categoryScale.bandwidth()],
    padding: 0.08,
  });
  const yScale = scaleLinear({ domain: [0, maxValue], range: [innerHeight, 0], nice: true });

  const barThickness = Math.min(MAX_BAR_THICKNESS, groupScale.bandwidth());
  const barOffset = (groupScale.bandwidth() - barThickness) / 2;

  function reveal(categoryIndex: number, x: number, y: number) {
    showTooltip({
      tooltipData: { category: categories[categoryIndex]!, index: categoryIndex },
      tooltipLeft: x,
      tooltipTop: y,
    });
  }

  return (
    <div ref={tooltipContainerRef} className="relative">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          <GridRows scale={yScale} width={innerWidth} stroke={chrome.grid} strokeWidth={1} />
          {categories.map((category, categoryIndex) => {
            const groupX = categoryScale(category) ?? 0;
            return (
              <g key={category}>
                {series.map((s, seriesIndex) => {
                  const value = s.values[categoryIndex] ?? 0;
                  const barHeight = innerHeight - yScale(value);
                  const barX = groupX + (groupScale(seriesIndex.toString()) ?? 0) + barOffset;
                  const barY = yScale(value);
                  const barWidth = Math.max(0, barThickness - BAR_GAP);
                  const key = `${category}-${s.label}`;
                  const isHovered = hoveredKey === key;
                  return (
                    <path
                      key={key}
                      d={roundedTopRectPath(barX - BAR_GAP / 2, barY, barWidth, barHeight, 4)}
                      fill={categoricalColor(s.colorIndex)}
                      style={{
                        filter: isHovered ? "brightness(1.15)" : undefined,
                        transition: "filter 150ms",
                        outline: "none",
                      }}
                      tabIndex={0}
                      role="img"
                      aria-label={`${category}, ${s.label}: ${valueFormatter(value)}`}
                      onMouseEnter={(event) => {
                        setHoveredKey(key);
                        const coords = localPoint(event);
                        reveal(categoryIndex, coords?.x ?? barX, coords?.y ?? barY);
                      }}
                      onMouseMove={(event) => {
                        const coords = localPoint(event);
                        if (!coords) return;
                        reveal(categoryIndex, coords.x, coords.y);
                      }}
                      onMouseLeave={() => {
                        setHoveredKey(null);
                        hideTooltip();
                      }}
                      onFocus={() => {
                        setHoveredKey(key);
                        reveal(categoryIndex, MARGIN.left + barX + barThickness / 2, MARGIN.top + barY);
                      }}
                      onBlur={() => {
                        setHoveredKey(null);
                        hideTooltip();
                      }}
                    />
                  );
                })}
              </g>
            );
          })}
          <AxisBottom
            top={innerHeight}
            scale={categoryScale}
            stroke={chrome.axis}
            tickStroke={chrome.axis}
            tickLabelProps={() => ({
              fill: chrome.mutedText,
              fontSize: 12,
              textAnchor: "middle",
              dy: "0.25em",
            })}
          />
          <AxisLeft
            scale={yScale}
            stroke={chrome.axis}
            tickStroke={chrome.axis}
            tickFormat={(v) => valueFormatter(Number(v))}
            tickLabelProps={() => ({
              fill: chrome.mutedText,
              fontSize: 12,
              textAnchor: "end",
              dx: "-0.5em",
              dy: "0.32em",
            })}
          />
        </g>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            ...defaultTooltipStyles,
            background: "var(--surface-raised)",
            border: "1px solid var(--surface-border)",
            borderRadius: "0.375rem",
            padding: "0.5rem 0.75rem",
            boxShadow: "none",
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-caption text-text-tertiary">{tooltipData.category}</span>
            {series.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-small">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: categoricalColor(s.colorIndex) }}
                />
                <span className="font-semibold text-text-primary">
                  {valueFormatter(s.values[tooltipData.index] ?? 0)}
                </span>
                <span className="text-text-secondary">{s.label}</span>
              </div>
            ))}
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
