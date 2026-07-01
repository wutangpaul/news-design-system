import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CategoryLanding } from "./CategoryLanding";
import type { CategoryLandingProps } from "./CategoryLanding";

const baseProps: CategoryLandingProps = {
  header: {
    logo: <a href="/">The Daily Ledger</a>,
  },
  footer: {
    logo: "The Daily Ledger",
    groups: [
      {
        heading: "Sections",
        links: [{ label: "World", href: "/world" }],
      },
    ],
  },
  categoryName: "Politics",
  categoryNavigation: <nav aria-label="Section navigation">Category nav</nav>,
  featured: <div>Featured story content</div>,
  stories: <div>Story list content</div>,
};

describe("CategoryLanding", () => {
  it("renders the GlobalHeader chrome", () => {
    render(<CategoryLanding {...baseProps} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Daily Ledger" })).toBeInTheDocument();
  });

  it("renders the Footer chrome", () => {
    render(<CategoryLanding {...baseProps} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders categoryName as the page's own h1", () => {
    render(<CategoryLanding {...baseProps} />);
    const heading = screen.getByRole("heading", { level: 1, name: "Politics" });
    expect(heading).toBeInTheDocument();
  });

  it("renders an optional description under the heading", () => {
    render(<CategoryLanding {...baseProps} description="Elections and policy." />);
    expect(screen.getByText("Elections and policy.")).toBeInTheDocument();
  });

  it("renders the categoryNavigation slot", () => {
    render(<CategoryLanding {...baseProps} />);
    expect(screen.getByText("Category nav")).toBeInTheDocument();
  });

  it("renders the featured slot content", () => {
    render(<CategoryLanding {...baseProps} />);
    expect(screen.getByText("Featured story content")).toBeInTheDocument();
  });

  it("renders the stories slot content", () => {
    render(<CategoryLanding {...baseProps} />);
    expect(screen.getByText("Story list content")).toBeInTheDocument();
  });

  it("renders the optional pagination slot when provided", () => {
    render(<CategoryLanding {...baseProps} pagination={<div>Pagination control</div>} />);
    expect(screen.getByText("Pagination control")).toBeInTheDocument();
  });

  it("places categoryNavigation before the main landmark in document order", () => {
    render(<CategoryLanding {...baseProps} />);
    const nav = screen.getByText("Category nav");
    const main = screen.getByRole("main");
    expect(nav.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("gives the main landmark a default id matching the skip link's target", () => {
    render(<CategoryLanding {...baseProps} />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#main-content");
  });

  it("supports a custom main id", () => {
    render(<CategoryLanding {...baseProps} mainId="category-main" />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "category-main");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#category-main");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <CategoryLanding
        {...baseProps}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <CategoryLanding {...baseProps} pagination={<div>Pagination control</div>} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
