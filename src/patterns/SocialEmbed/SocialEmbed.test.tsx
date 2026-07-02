import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SocialEmbed } from "./SocialEmbed";

const baseProps = {
  platform: "x" as const,
  authorName: "Priya Nair",
  authorHandle: "priyanair",
  text: "Full analysis on the site shortly.",
  href: "https://x.com/priyanair/status/1234567890",
};

describe("SocialEmbed", () => {
  it("renders the default platform label derived from `platform`", () => {
    render(<SocialEmbed {...baseProps} />);
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("renders a custom platformLabel override", () => {
    render(<SocialEmbed {...baseProps} platform="other" platformLabel="Bluesky" />);
    expect(screen.getByText("Bluesky")).toBeInTheDocument();
    expect(screen.queryByText("Social post")).not.toBeInTheDocument();
  });

  it("renders the author's name and handle", () => {
    render(<SocialEmbed {...baseProps} />);
    // Avatar also exposes the name via a visually-hidden span (its accessible label for the
    // avatar graphic), so the name legitimately appears twice — see Byline.test.tsx for the
    // same pattern.
    expect(screen.getAllByText("Priya Nair").length).toBeGreaterThan(0);
    expect(screen.getByText("@priyanair")).toBeInTheDocument();
  });

  it("renders the post text", () => {
    render(<SocialEmbed {...baseProps} />);
    expect(screen.getByText("Full analysis on the site shortly.")).toBeInTheDocument();
  });

  it("renders a link to the original post", () => {
    render(<SocialEmbed {...baseProps} />);
    const link = screen.getByRole("link", { name: /view original post/i });
    expect(link).toHaveAttribute("href", baseProps.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders an optional timestamp when provided", () => {
    render(<SocialEmbed {...baseProps} timestamp="3h ago" />);
    expect(screen.getByText("3h ago")).toBeInTheDocument();
  });

  it("omits the timestamp when not provided", () => {
    render(<SocialEmbed {...baseProps} />);
    expect(screen.queryByText(/ago$/)).not.toBeInTheDocument();
  });

  it("gives the card an accessible name combining platform and author", () => {
    render(<SocialEmbed {...baseProps} />);
    expect(screen.getByRole("figure", { name: "X post by Priya Nair" })).toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLElement>();
    render(<SocialEmbed {...baseProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<SocialEmbed {...baseProps} timestamp="3h ago" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
