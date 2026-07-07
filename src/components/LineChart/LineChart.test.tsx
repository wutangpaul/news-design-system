import { describe, expect, it } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LineChart } from "./LineChart";

const categories = ["Mon", "Tue", "Wed"];

describe("LineChart", () => {
  it("renders the chart region with an accessible name", () => {
    render(
      <LineChart
        title="Weekly pageviews"
        categories={categories}
        series={[{ label: "Pageviews", values: [10, 20, 15], colorIndex: 0 }]}
        width={400}
      />,
    );
    expect(screen.getByRole("group", { name: "Weekly pageviews" })).toBeInTheDocument();
  });

  it("does not render a legend for a single series", () => {
    render(
      <LineChart
        title="Weekly pageviews"
        categories={categories}
        series={[{ label: "Pageviews", values: [10, 20, 15], colorIndex: 0 }]}
        width={400}
      />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders a legend entry per series when there's more than one", () => {
    render(
      <LineChart
        title="Pageviews by platform"
        categories={categories}
        series={[
          { label: "Desktop", values: [10, 20, 15], colorIndex: 0 },
          { label: "Mobile", values: [5, 8, 12], colorIndex: 1 },
        ]}
        width={400}
      />,
    );
    const legend = within(screen.getByRole("list"));
    expect(legend.getByText("Desktop")).toBeInTheDocument();
    expect(legend.getByText("Mobile")).toBeInTheDocument();
  });

  it("includes every value in a visually hidden data table", () => {
    render(
      <LineChart
        title="Weekly pageviews"
        categories={categories}
        series={[{ label: "Pageviews", values: [10, 20, 15], colorIndex: 0 }]}
        width={400}
      />,
    );
    const table = screen.getByRole("table", { name: "Weekly pageviews" });
    // sr-only lives on the wrapping div, not the table itself — see charts.tsx for why
    // (a <table>'s <caption> isn't reliably clipped by properties set on <table> directly
    // in every browser).
    expect(table.parentElement).toHaveClass("sr-only");
    expect(screen.getByRole("row", { name: /Mon.*10/ })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Tue.*20/ })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Wed.*15/ })).toBeInTheDocument();
  });

  it("formats values in the data table with a custom formatter", () => {
    render(
      <LineChart
        title="Weekly revenue"
        categories={categories}
        series={[{ label: "Revenue", values: [1000, 2000, 1500], colorIndex: 0 }]}
        width={400}
        valueFormatter={(v) => `$${v / 1000}k`}
      />,
    );
    expect(screen.getByRole("row", { name: /Mon.*\$1k/ })).toBeInTheDocument();
  });

  it("moves the active data point with arrow keys and announces it", () => {
    render(
      <LineChart
        title="Weekly pageviews"
        categories={categories}
        series={[{ label: "Pageviews", values: [10, 20, 15], colorIndex: 0 }]}
        width={400}
      />,
    );
    const plot = screen.getByRole("img", { name: /Weekly pageviews/ });
    fireEvent.focus(plot);
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText(/Tue: Pageviews 20/)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LineChart
        title="Weekly pageviews"
        categories={categories}
        series={[
          { label: "Desktop", values: [10, 20, 15], colorIndex: 0 },
          { label: "Mobile", values: [5, 8, 12], colorIndex: 1 },
        ]}
        width={400}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
