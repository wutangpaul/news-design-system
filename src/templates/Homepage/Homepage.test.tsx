import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Homepage } from "./Homepage";
import type { HomepageProps } from "./Homepage";

const baseProps: HomepageProps = {
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
  hero: <div>Hero content</div>,
  featured: <div>Featured content</div>,
};

describe("Homepage", () => {
  it("renders the GlobalHeader chrome with the given logo", () => {
    render(<Homepage {...baseProps} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Daily Ledger" })).toBeInTheDocument();
  });

  it("renders the Footer chrome with the given link groups", () => {
    render(<Homepage {...baseProps} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders the hero slot content", () => {
    render(<Homepage {...baseProps} />);
    expect(screen.getByText("Hero content")).toBeInTheDocument();
  });

  it("renders the featured slot content", () => {
    render(<Homepage {...baseProps} />);
    expect(screen.getByText("Featured content")).toBeInTheDocument();
  });

  it("renders the sidebar slot content when provided", () => {
    render(<Homepage {...baseProps} sidebar={<div>Sidebar content</div>} />);
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
  });

  it("omits the sidebar region entirely when no sidebar is passed", () => {
    render(<Homepage {...baseProps} />);
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("renders a single main landmark wrapping hero and featured content", () => {
    render(<Homepage {...baseProps} />);
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByText("Hero content"));
    expect(main).toContainElement(screen.getByText("Featured content"));
  });

  it("gives the main landmark a default id matching the skip link's target", () => {
    render(<Homepage {...baseProps} />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#main-content");
  });

  it("supports a custom main id", () => {
    render(<Homepage {...baseProps} mainId="homepage-main" />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "homepage-main");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#homepage-main");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Homepage
        {...baseProps}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Homepage {...baseProps} sidebar={<div>Sidebar</div>} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
