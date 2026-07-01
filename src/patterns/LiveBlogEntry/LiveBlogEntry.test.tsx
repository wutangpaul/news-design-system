import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LiveBlogEntry } from "./LiveBlogEntry";

describe("LiveBlogEntry", () => {
  it("renders a machine-readable time element", () => {
    render(
      <LiveBlogEntry timestamp="2026-06-30T09:15:00Z" title="Rates held steady">
        Body copy.
      </LiveBlogEntry>,
    );
    const time = screen.getByText("Body copy.").closest("article")!.querySelector("time")!;
    expect(time).toHaveAttribute("dateTime", "2026-06-30T09:15:00Z");
  });

  it("renders the title as a heading at the given semantic level", () => {
    render(
      <LiveBlogEntry timestamp="2026-06-30T09:15:00Z" title="Rates held steady" headingLevel={4}>
        Body copy.
      </LiveBlogEntry>,
    );
    expect(screen.getByRole("heading", { level: 4, name: "Rates held steady" })).toBeInTheDocument();
  });

  it("defaults to an h3 heading", () => {
    render(
      <LiveBlogEntry timestamp="2026-06-30T09:15:00Z" title="Rates held steady">
        Body copy.
      </LiveBlogEntry>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("renders no badge by default", () => {
    render(
      <LiveBlogEntry timestamp="2026-06-30T09:15:00Z" title="Rates held steady">
        Body copy.
      </LiveBlogEntry>,
    );
    expect(screen.queryByText("Breaking")).not.toBeInTheDocument();
    expect(screen.queryByText("Update")).not.toBeInTheDocument();
  });

  it("renders a Breaking badge when label is 'breaking'", () => {
    render(
      <LiveBlogEntry timestamp="2026-06-30T09:15:00Z" title="Snap election called" label="breaking">
        Body copy.
      </LiveBlogEntry>,
    );
    expect(screen.getByText("Breaking")).toBeInTheDocument();
  });

  it("supports a custom label text", () => {
    render(
      <LiveBlogEntry
        timestamp="2026-06-30T09:15:00Z"
        title="Turnout figures revised"
        label="update"
        labelText="Correction"
      >
        Body copy.
      </LiveBlogEntry>,
    );
    expect(screen.getByText("Correction")).toBeInTheDocument();
    expect(screen.queryByText("Update")).not.toBeInTheDocument();
  });

  it("reflects new props on re-render without leaking stale state", () => {
    const { rerender } = render(
      <LiveBlogEntry timestamp="2026-06-30T08:00:00Z" title="First update" label="breaking">
        First body.
      </LiveBlogEntry>,
    );
    expect(screen.getByRole("heading", { name: "First update" })).toBeInTheDocument();

    rerender(
      <LiveBlogEntry timestamp="2026-06-30T09:00:00Z" title="Second update" label="update">
        Second body.
      </LiveBlogEntry>,
    );
    expect(screen.queryByRole("heading", { name: "First update" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Second update" })).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.queryByText("Breaking")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LiveBlogEntry timestamp="2026-06-30T09:15:00Z" title="Rates held steady" label="breaking">
        Body copy.
      </LiveBlogEntry>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
