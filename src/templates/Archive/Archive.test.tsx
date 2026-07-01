import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Archive } from "./Archive";
import type { GlobalHeaderProps } from "@/patterns/GlobalHeader";
import type { FooterProps } from "@/patterns/Footer";

const header: GlobalHeaderProps = {
  logo: <span>The Daily Ledger</span>,
};

const footer: FooterProps = {
  groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }],
};

describe("Archive", () => {
  it("renders the site chrome (header banner and footer contentinfo landmarks)", () => {
    render(<Archive header={header} footer={footer} title="Politics" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the page title as a real level-1 heading", () => {
    render(<Archive header={header} footer={footer} title="Politics" />);
    expect(screen.getByRole("heading", { level: 1, name: "Politics" })).toBeInTheDocument();
  });

  it("renders the description, filters, listing, and pagination slots when provided", () => {
    render(
      <Archive
        header={header}
        footer={footer}
        title="Politics"
        description="Coverage since 2020."
        filters={<div>date range controls</div>}
        listing={<div>story listing</div>}
        pagination={<button type="button">page 2</button>}
      />,
    );
    expect(screen.getByText("Coverage since 2020.")).toBeInTheDocument();
    expect(screen.getByText("date range controls")).toBeInTheDocument();
    expect(screen.getByText("story listing")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "page 2" })).toBeInTheDocument();
  });

  it("renders a genuine empty state instead of the listing/pagination slots when isEmpty is set", () => {
    render(
      <Archive
        header={header}
        footer={footer}
        title="Politics"
        listing={<div>story listing</div>}
        pagination={<button type="button">page 2</button>}
        isEmpty
      />,
    );
    expect(screen.queryByText("story listing")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "page 2" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No stories found" }),
    ).toBeInTheDocument();
  });

  it("supports custom empty-state copy", () => {
    render(
      <Archive
        header={header}
        footer={footer}
        title="Politics"
        isEmpty
        emptyStateTitle="No results for August"
        emptyStateDescription="Try a different month."
      />,
    );
    expect(screen.getByRole("heading", { name: "No results for August" })).toBeInTheDocument();
    expect(screen.getByText("Try a different month.")).toBeInTheDocument();
  });

  it("omits the filters block entirely when no filters slot is passed", () => {
    render(<Archive header={header} footer={footer} title="Politics" />);
    // No stray filter UI; nothing to assert positively beyond the page rendering cleanly.
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = vi.fn();
    render(<Archive ref={ref} header={header} footer={footer} title="Politics" />);
    expect(ref).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Archive
        header={header}
        footer={footer}
        title="Politics"
        description="Coverage since 2020."
        listing={<div>story listing</div>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe violations in the empty state", async () => {
    const { container } = render(
      <Archive header={header} footer={footer} title="Politics" isEmpty />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
