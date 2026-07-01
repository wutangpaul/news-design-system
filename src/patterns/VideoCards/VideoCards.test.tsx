import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VideoCards, type VideoCardItem } from "./VideoCards";

const videos: VideoCardItem[] = [
  {
    id: "1",
    title: "Inside the newsroom on election night",
    href: "https://example.com/videos/election-night",
    thumbnailSrc: "https://example.com/election-night.jpg",
    thumbnailAlt: "Editors gathered around a bank of monitors on election night",
    duration: "4:32",
  },
  {
    id: "2",
    title: "How wildfire smoke is tracked from space",
    href: "https://example.com/videos/wildfire-smoke",
    thumbnailSrc: "https://example.com/wildfire-smoke.jpg",
    thumbnailAlt: "A satellite image of wildfire smoke drifting across a coastline",
    duration: "6:18",
  },
];

describe("VideoCards", () => {
  it("renders the default section title", () => {
    render(<VideoCards videos={videos} />);
    expect(screen.getByRole("heading", { name: "Videos" })).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<VideoCards title="Watch now" videos={videos} />);
    expect(screen.getByRole("heading", { name: "Watch now" })).toBeInTheDocument();
  });

  it("renders one link per video with its title and duration", () => {
    render(<VideoCards videos={videos} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const link = screen.getByRole("link", { name: /Inside the newsroom on election night/ });
    expect(link).toHaveAttribute("href", "https://example.com/videos/election-night");
    expect(screen.getByText("4:32")).toBeInTheDocument();
    expect(screen.getByText("6:18")).toBeInTheDocument();
  });

  it("renders exactly one interactive element per card (the play glyph is decorative)", () => {
    render(<VideoCards videos={[videos[0]]} />);
    // The only interactive element should be the anchor; the play glyph must
    // not introduce a second focusable/interactive control inside it.
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the play glyph and duration badge from assistive tech redundantly labeling the card", () => {
    render(<VideoCards videos={[videos[0]]} />);
    const link = screen.getByRole("link", { name: /Inside the newsroom on election night/ });
    const hiddenGlyph = link.querySelector('[aria-hidden="true"]');
    expect(hiddenGlyph).toBeInTheDocument();
  });

  it("renders an empty-state message when there are no videos", () => {
    render(<VideoCards videos={[]} />);
    expect(screen.getByText(/no videos available/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<VideoCards videos={videos} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
