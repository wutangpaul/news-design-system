import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AuthorCard } from "./AuthorCard";

describe("AuthorCard", () => {
  it("renders the author's name as a heading", () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.getByRole("heading", { name: "Jane Doe" })).toBeInTheDocument();
  });

  it("renders the name as a link to the author page when href is given", () => {
    render(<AuthorCard name="Jane Doe" href="/authors/jane-doe" />);
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link).toHaveAttribute("href", "/authors/jane-doe");
  });

  it("renders the name as plain text when no href is given", () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("uses the default heading level of 2", () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the requested heading level", () => {
    render(<AuthorCard name="Jane Doe" headingLevel={1} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders title and bio when given", () => {
    render(<AuthorCard name="Jane Doe" title="Politics Reporter" bio="Covers city hall." />);
    expect(screen.getByText("Politics Reporter")).toBeInTheDocument();
    expect(screen.getByText("Covers city hall.")).toBeInTheDocument();
  });

  it("omits title and bio when not given", () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.queryByText("Politics Reporter")).not.toBeInTheDocument();
  });

  it("renders social links with external attributes by default", () => {
    render(
      <AuthorCard
        name="Jane Doe"
        socialLinks={[{ label: "Twitter", href: "https://twitter.com/janedoe" }]}
      />,
    );
    const link = screen.getByRole("link", { name: /Twitter/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("respects external: false for a social link", () => {
    render(
      <AuthorCard
        name="Jane Doe"
        socialLinks={[{ label: "Email", href: "mailto:jane@example.com", external: false }]}
      />,
    );
    const link = screen.getByRole("link", { name: "Email" });
    expect(link).not.toHaveAttribute("target");
  });

  it("omits the social links section when none are given", () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders an avatar with the author's name", () => {
    render(<AuthorCard name="Jane Doe" avatarSrc="/jane.jpg" />);
    const img = document.querySelector("img");
    expect(img).toHaveAttribute("src", "/jane.jpg");
  });

  it("labels the card region with the author's name", () => {
    render(<AuthorCard name="Jane Doe" />);
    expect(screen.getByRole("region", { name: "About Jane Doe" })).toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLElement | null = null;
    render(
      <AuthorCard
        name="Jane Doe"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AuthorCard
        name="Jane Doe"
        avatarSrc="/jane.jpg"
        title="Politics Reporter"
        bio="Covers city hall."
        href="/authors/jane-doe"
        socialLinks={[{ label: "Twitter", href: "https://twitter.com/janedoe" }]}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
