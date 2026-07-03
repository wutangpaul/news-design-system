export { BarChart } from "./BarChart";
export type { BarChartProps } from "./BarChart";
// `ChartSeries` is re-exported from LineChart's index.ts, not here — it's one shared type
// (defined once in src/lib/charts.tsx) and re-exporting it from both chart barrels would
// collide when both are star-exported together from src/components/index.ts.
