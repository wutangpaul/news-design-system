import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PodcastCards, type PodcastCardItem } from "./PodcastCards";

const episodes: PodcastCardItem[] = [
  {
    id: "1",
    show: "The Daily Brief",
    title: "What the jobs report really tells us",
    href: "https://example.com/podcasts/jobs-report",
    duration: "28:41",
    artworkSrc: "https://example.com/daily-brief.jpg",
    artworkAlt: "The Daily Brief show artwork",
  },
  {
    id: "2",
    show: "On Background",
    title: "Inside the negotiations, off the record",
    href: "https://example.com/podcasts/off-the-record",
    duration: "35:07",
  },
];

describe("PodcastCards", () => {
  it("renders the default section title", () => {
    render(<PodcastCards episodes={episodes} />);
    expect(screen.getByRole("heading", { name: "Podcasts" })).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<PodcastCards title="Listen now" episodes={episodes} />);
    expect(screen.getByRole("heading", { name: "Listen now" })).toBeInTheDocument();
  });

  it("renders one link per episode with show name, title, and duration", () => {
    render(<PodcastCards episodes={episodes} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const link = screen.getByRole("link", { name: /What the jobs report really tells us/ });
    expect(link).toHaveAttribute("href", "https://example.com/podcasts/jobs-report");
    expect(screen.getByText("The Daily Brief")).toBeInTheDocument();
    expect(screen.getByText("28:41")).toBeInTheDocument();
  });

  it("renders artwork when provided", () => {
    render(<PodcastCards episodes={[episodes[0]]} />);
    const artwork = screen.getByAltText("The Daily Brief show artwork");
    expect(artwork.tagName).toBe("IMG");
  });

  it("renders a decorative waveform placeholder when artwork is omitted", () => {
    render(<PodcastCards episodes={[episodes[1]]} />);
    const link = screen.getByRole("link", { name: /Inside the negotiations, off the record/ });
    expect(link.querySelector("img")).not.toBeInTheDocument();
    expect(link.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("renders exactly one interactive element per card", () => {
    render(<PodcastCards episodes={[episodes[0]]} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an empty-state message when there are no episodes", () => {
    render(<PodcastCards episodes={[]} />);
    expect(screen.getByText(/no episodes available/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<PodcastCards episodes={episodes} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
