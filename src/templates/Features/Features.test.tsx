import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Features, type FeaturesProps } from "./Features";

const baseProps: FeaturesProps = {
  header: { logo: "The Daily Ledger" },
  footer: { groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }] },
  hero: <h1>The Vanishing Wetlands</h1>,
  body: <p>Body copy about the investigation.</p>,
};

describe("Features", () => {
  it("renders the global header chrome from the header slot", () => {
    render(<Features {...baseProps} />);
    expect(screen.getByText("The Daily Ledger")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the footer chrome from the footer slot", () => {
    render(<Features {...baseProps} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders the hero slot content", () => {
    render(<Features {...baseProps} />);
    expect(screen.getByRole("heading", { name: "The Vanishing Wetlands" })).toBeInTheDocument();
  });

  it("renders the body slot content", () => {
    render(<Features {...baseProps} />);
    expect(screen.getByText("Body copy about the investigation.")).toBeInTheDocument();
  });

  it("does not render social sharing when omitted", () => {
    render(<Features {...baseProps} />);
    expect(screen.queryByRole("group", { name: "Share this article" })).not.toBeInTheDocument();
  });

  it("renders a passed-in socialSharing slot", () => {
    render(
      <Features
        {...baseProps}
        socialSharing={<div role="group" aria-label="Share this article" />}
      />,
    );
    expect(screen.getByRole("group", { name: "Share this article" })).toBeInTheDocument();
  });

  it("renders hero content before body content in document order", () => {
    render(<Features {...baseProps} />);
    const hero = screen.getByRole("heading", { name: "The Vanishing Wetlands" });
    const body = screen.getByText("Body copy about the investigation.");
    expect(
      hero.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Features {...baseProps} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
