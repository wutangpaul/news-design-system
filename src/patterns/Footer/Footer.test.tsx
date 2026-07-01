import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Footer } from "./Footer";

const groups = [
  {
    heading: "Sections",
    links: [
      { label: "World", href: "/world" },
      { label: "Politics", href: "/politics" },
    ],
  },
  {
    heading: "Company",
    links: [{ label: "About", href: "/about" }],
  },
];

describe("Footer", () => {
  it("renders a contentinfo landmark", () => {
    render(<Footer groups={groups} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a labelled nav grouping every link column and link", () => {
    render(<Footer groups={groups} />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(nav).toHaveTextContent("Sections");
    expect(nav).toHaveTextContent("Company");
    for (const group of groups) {
      for (const link of group.links) {
        expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
      }
    }
  });

  it("marks external links with target=_blank and rel=noopener noreferrer", () => {
    render(
      <Footer
        groups={[{ heading: "More", links: [{ label: "RSS", href: "/rss", external: true }] }]}
      />,
    );
    const link = screen.getByRole("link", { name: "RSS" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders social links with accessible names", () => {
    render(
      <Footer
        groups={groups}
        socialLinks={[
          { label: "Follow us on X", href: "https://x.com/example", icon: <span aria-hidden="true">X</span> },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Follow us on X" })).toHaveAttribute(
      "href",
      "https://x.com/example",
    );
  });

  it("renders the newsletterSlot content when provided", () => {
    render(<Footer groups={groups} newsletterSlot={<div>Sign up for our newsletter</div>} />);
    expect(screen.getByText("Sign up for our newsletter")).toBeInTheDocument();
  });

  it("renders copyright text and legal links", () => {
    render(
      <Footer
        groups={groups}
        copyrightText="© 2026 The Daily Ledger."
        legalLinks={[{ label: "Privacy Policy", href: "/privacy" }]}
      />,
    );
    expect(screen.getByText("© 2026 The Daily Ledger.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Footer
        groups={groups}
        copyrightText="© 2026 The Daily Ledger."
        legalLinks={[{ label: "Privacy Policy", href: "/privacy" }]}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
