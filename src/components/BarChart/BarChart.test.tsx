import { describe, expect, it } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BarChart } from "./BarChart";

const categories = ["Politics", "Business"];

describe("BarChart", () => {
  it("renders the chart region with an accessible name", () => {
    render(
      <BarChart
        title="Pageviews by section"
        categories={categories}
        series={[{ label: "Pageviews", values: [100, 200], colorIndex: 0 }]}
        width={400}
      />,
    );
    expect(screen.getByRole("group", { name: "Pageviews by section" })).toBeInTheDocument();
  });

  it("does not render a legend for a single series", () => {
    render(
      <BarChart
        title="Pageviews by section"
        categories={categories}
        series={[{ label: "Pageviews", values: [100, 200], colorIndex: 0 }]}
        width={400}
      />,
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders a legend entry per series when there's more than one", () => {
    render(
      <BarChart
        title="Pageviews by section, this week vs. last"
        categories={categories}
        series={[
          { label: "This week", values: [100, 200], colorIndex: 0 },
          { label: "Last week", values: [90, 180], colorIndex: 1 },
        ]}
        width={400}
      />,
    );
    const legend = within(screen.getByRole("list"));
    expect(legend.getByText("This week")).toBeInTheDocument();
    expect(legend.getByText("Last week")).toBeInTheDocument();
  });

  it("labels each bar with its category and value", () => {
    render(
      <BarChart
        title="Pageviews by section"
        categories={categories}
        series={[{ label: "Pageviews", values: [100, 200], colorIndex: 0 }]}
        width={400}
      />,
    );
    expect(screen.getByRole("img", { name: "Politics, Pageviews: 100" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Business, Pageviews: 200" })).toBeInTheDocument();
  });

  it("shows a tooltip with the value on bar focus", () => {
    render(
      <BarChart
        title="Pageviews by section"
        categories={categories}
        series={[{ label: "Pageviews", values: [100, 200], colorIndex: 0 }]}
        width={400}
      />,
    );
    const bar = screen.getByRole("img", { name: "Politics, Pageviews: 100" });
    fireEvent.focus(bar);
    const tooltipLabel = screen
      .getAllByText("Pageviews")
      .find((el) => !el.closest("table"));
    expect(tooltipLabel).toBeDefined();
    const tooltipRow = tooltipLabel!.closest("div");
    expect(within(tooltipRow!).getByText("100")).toBeInTheDocument();
  });

  it("includes every value in a visually hidden data table", () => {
    render(
      <BarChart
        title="Pageviews by section"
        categories={categories}
        series={[{ label: "Pageviews", values: [100, 200], colorIndex: 0 }]}
        width={400}
      />,
    );
    const table = screen.getByRole("table", { name: "Pageviews by section" });
    expect(table).toHaveClass("sr-only");
    expect(screen.getByRole("row", { name: /Politics.*100/ })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Business.*200/ })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <BarChart
        title="Pageviews by section, this week vs. last"
        categories={categories}
        series={[
          { label: "This week", values: [100, 200], colorIndex: 0 },
          { label: "Last week", values: [90, 180], colorIndex: 1 },
        ]}
        width={400}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
