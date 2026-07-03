import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { useTooltip, useTooltipInPortal, defaultStyles as defaultTooltipStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { cn } from "@/lib/cn";
import { categoricalColor, chrome } from "@/tokens";
import { ChartLegend, ChartDataTable, type ChartSeries } from "@/lib/charts";

export type { ChartSeries };

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Accessible name for the chart region and the hidden data table's caption. */
  title: string;
  /** X-axis category labels (e.g. dates), shared by every series. */
  categories: string[];
  /** One or more named, colored series — see `ChartSeries`. */
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

// left: 64, not 48 - SVG clips content past its own bounds by default, and a 48px margin
// isn't wide enough for the y-axis's largest comma-formatted tick labels (e.g. "45,000");
// text-anchor="end" positions them extending *leftward*, so a too-narrow margin cuts off
// their leading digits rather than just crowding them.
const MARGIN = { top: 16, right: 16, bottom: 32, left: 64 };

interface TooltipDatum {
  category: string;
  index: number;
}

/**
 * Multi-series line chart with a keyboard- and pointer-operable crosshair tooltip, a legend
 * (only when there's more than one series), and a visually hidden data table so every value
 * is reachable without the plot at all. Colors are assigned by fixed categorical slot
 * (`series[].colorIndex`), never by array position — see `src/tokens/chartColors.ts`.
 */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
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
          <LineChartPlot
            title={title}
            categories={categories}
            series={series}
            width={width}
            height={height}
            valueFormatter={valueFormatter}
          />
        ) : (
          // ParentSize measures its own container, which needs a definite height to measure
          // against — an ancestor with only `className="relative"` and no set height leaves
          // it nothing to resolve, so the wrapper (and the chart inside it) silently collapses
          // to zero-size. `height` is already fixed and known here, so give it directly.
          <div style={{ height }}>
            <ParentSize>
              {({ width: measuredWidth }) =>
                measuredWidth === 0 ? null : (
                  <LineChartPlot
                    title={title}
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
LineChart.displayName = "LineChart";

interface LineChartPlotProps {
  title: string;
  categories: string[];
  series: ChartSeries[];
  width: number;
  height: number;
  valueFormatter: (value: number) => string;
}

function LineChartPlot({ title, categories, series, width, height, valueFormatter }: LineChartPlotProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { containerRef: tooltipContainerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<TooltipDatum>();

  const maxValue = useMemo(() => Math.max(1, ...series.flatMap((s) => s.values)), [series]);

  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const xScale = scalePoint({ domain: categories, range: [0, innerWidth], padding: 0.5 });
  const yScale = scaleLinear({ domain: [0, maxValue], range: [innerHeight, 0], nice: true });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<SVGGElement>) => {
      if (categories.length === 0) return;
      let next = activeIndex ?? 0;
      if (event.key === "ArrowRight") next = Math.min((activeIndex ?? -1) + 1, categories.length - 1);
      else if (event.key === "ArrowLeft") next = Math.max((activeIndex ?? categories.length) - 1, 0);
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = categories.length - 1;
      else return;
      event.preventDefault();
      setActiveIndex(next);
    },
    [activeIndex, categories.length],
  );

  function nearestIndex(pointerX: number): number {
    let best = 0;
    let bestDistance = Infinity;
    categories.forEach((c, i) => {
      const x = xScale(c) ?? 0;
      const distance = Math.abs(x - pointerX);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  }

  function reveal(index: number, pointerY?: number) {
    setActiveIndex(index);
    showTooltip({
      tooltipData: { category: categories[index]!, index },
      tooltipLeft: (xScale(categories[index]!) ?? 0) + MARGIN.left,
      tooltipTop: pointerY ?? MARGIN.top + innerHeight / 2,
    });
  }

  return (
    <div ref={tooltipContainerRef} className="relative">
      <svg
        width={width}
        height={height}
        onMouseLeave={() => {
          setActiveIndex(null);
          hideTooltip();
        }}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          <GridRows scale={yScale} width={innerWidth} stroke={chrome.grid} strokeWidth={1} />
          {series.map((s) => (
            <LinePath
              key={s.label}
              data={categories.map((c, i) => ({ x: c, y: s.values[i] ?? 0 }))}
              x={(d) => xScale(d.x) ?? 0}
              y={(d) => yScale(d.y)}
              stroke={categoricalColor(s.colorIndex)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* End markers: >=8px diameter, filled with the series color, with a 2px
              surface-color ring so they stay legible crossing other lines. */}
          {series.map((s) => {
            const lastIndex = categories.length - 1;
            if (lastIndex < 0) return null;
            return (
              <circle
                key={s.label}
                cx={xScale(categories[lastIndex]!) ?? 0}
                cy={yScale(s.values[lastIndex] ?? 0)}
                r={5}
                fill={categoricalColor(s.colorIndex)}
                stroke="var(--surface-canvas)"
                strokeWidth={2}
              />
            );
          })}
          {activeIndex !== null && (
            <line
              x1={xScale(categories[activeIndex]!) ?? 0}
              x2={xScale(categories[activeIndex]!) ?? 0}
              y1={0}
              y2={innerHeight}
              stroke={chrome.axis}
              strokeWidth={1}
              pointerEvents="none"
            />
          )}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
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
          {/* Single keyboard-focusable group: arrow keys move the active data point
              instead of one tab stop per point, per the interaction spec's "same details
              on keyboard focus as on hover" without a huge tab-stop count for long series. */}
          <g
            tabIndex={0}
            role="img"
            aria-label={`${title}. Use arrow keys to move through ${categories.length} data points.`}
            onKeyDown={handleKeyDown}
            onFocus={() => reveal(activeIndex ?? 0)}
            onBlur={() => {
              setActiveIndex(null);
              hideTooltip();
            }}
            onMouseMove={(event) => {
              const coords = localPoint(event);
              if (!coords) return;
              reveal(nearestIndex(coords.x - MARGIN.left), coords.y);
            }}
            style={{ outline: "none" }}
          >
            <rect x={0} y={0} width={innerWidth} height={innerHeight} fill="transparent" />
          </g>
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
                  className="h-0.5 w-3 shrink-0 rounded-full"
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

      <div aria-live="polite" className="sr-only">
        {activeIndex !== null &&
          `${categories[activeIndex]}: ${series
            .map((s) => `${s.label} ${valueFormatter(s.values[activeIndex] ?? 0)}`)
            .join(", ")}`}
      </div>
    </div>
  );
}
