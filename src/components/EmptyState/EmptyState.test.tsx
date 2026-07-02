import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the heading as a real heading element", () => {
    render(<EmptyState heading="No results found" />);
    expect(screen.getByRole("heading", { name: "No results found" })).toBeInTheDocument();
  });

  it("defaults the heading to an h2", () => {
    render(<EmptyState heading="No results found" />);
    expect(screen.getByRole("heading", { name: "No results found" }).tagName).toBe("H2");
  });

  it("renders the requested heading level", () => {
    render(<EmptyState heading="No notifications" headingLevel={3} />);
    expect(screen.getByRole("heading", { name: "No notifications" }).tagName).toBe("H3");
  });

  it("renders the description when provided", () => {
    render(<EmptyState heading="No results found" description="Try a different search term." />);
    expect(screen.getByText("Try a different search term.")).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    render(<EmptyState heading="No results found" />);
    expect(screen.queryByText(/try/i)).not.toBeInTheDocument();
  });

  it("renders a built-in preset icon via iconVariant", () => {
    const { container } = render(
      <EmptyState heading="No results found" iconVariant="search" />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("omits the icon entirely when neither icon nor iconVariant is given", () => {
    const { container } = render(<EmptyState heading="No results found" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("prefers a custom icon over iconVariant when both are given", () => {
    render(
      <EmptyState
        heading="No results found"
        iconVariant="search"
        icon={<span data-testid="custom-icon">*</span>}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("hides the icon from assistive tech", () => {
    const { container } = render(
      <EmptyState heading="No results found" iconVariant="calendar" />,
    );
    const wrapper = container.querySelector("[aria-hidden='true']");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an action slot", () => {
    render(
      <EmptyState
        heading="No results found"
        action={<button type="button">Clear filters</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("omits the action wrapper when no action is given", () => {
    render(<EmptyState heading="No results found" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <EmptyState
        heading="No results found"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("spreads additional props (e.g. role) onto the root element", () => {
    render(<EmptyState heading="No results found" role="status" data-testid="empty" />);
    expect(screen.getByTestId("empty")).toHaveAttribute("role", "status");
  });

  it("merges a custom className", () => {
    render(<EmptyState heading="No results found" className="mt-8" data-testid="empty" />);
    expect(screen.getByTestId("empty").className).toContain("mt-8");
  });

  it("has no axe violations with icon, description, and action", async () => {
    const { container } = render(
      <EmptyState
        heading="No results found"
        description="Try different or fewer keywords."
        iconVariant="search"
        action={<button type="button">Clear filters</button>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe violations for a minimal, text-only empty state", async () => {
    const { container } = render(<EmptyState heading="No results found" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
