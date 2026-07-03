import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver at all. Chart components (LineChart, BarChart) use
// visx's useTooltipInPortal/ParentSize, both of which construct one unconditionally on mount
// regardless of props — without this stub, rendering any chart in a test throws immediately.
// A no-op is sufficient: tests that need real dimensions pass an explicit `width` prop rather
// than relying on ResizeObserver-driven measurement (which jsdom can't provide either way).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
