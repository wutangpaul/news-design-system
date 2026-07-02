import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { StoryCard } from "./StoryCard";
import type { StoryCardContent } from "./StoryCard";

const baseStory: StoryCardContent = {
  headline: "City council approves new transit budget",
  href: "https://example.com/story/transit-budget",
  dek: "The $2.4 billion plan funds four new light-rail lines.",
  category: "Politics",
  imageSrc: "https://example.com/image.jpg",
  imageAlt: "A light-rail train",
  byline: "By Jane Doe",
  timestamp: "3 hours ago",
  timestampDateTime: "2026-06-30T09:00:00Z",
};

describe("StoryCard", () => {
  it("renders the headline as a heading", () => {
    render(<StoryCard story={baseStory} />);
    expect(
      screen.getByRole("heading", { name: baseStory.headline }),
    ).toBeInTheDocument();
  });

  it("uses the requested semantic heading level regardless of visual size", () => {
    render(<StoryCard story={baseStory} headingLevel={3} headingVisualSize={2} />);
    const heading = screen.getByRole("heading", { name: baseStory.headline });
    expect(heading.tagName).toBe("H3");
  });

  it("defaults to an h3 heading", () => {
    render(<StoryCard story={baseStory} />);
    expect(screen.getByRole("heading", { name: baseStory.headline }).tagName).toBe(
      "H3",
    );
  });

  it("wraps the whole card in a link when href is provided", () => {
    render(<StoryCard story={baseStory} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", baseStory.href);
    expect(link).toContainElement(
      screen.getByRole("heading", { name: baseStory.headline }),
    );
  });

  it("does not render a link when href is omitted", () => {
    render(<StoryCard story={{ ...baseStory, href: undefined }} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the category tag", () => {
    render(<StoryCard story={baseStory} />);
    expect(screen.getByText("Politics")).toBeInTheDocument();
  });

  it("renders the dek when provided", () => {
    render(<StoryCard story={baseStory} />);
    expect(screen.getByText(baseStory.dek!)).toBeInTheDocument();
  });

  it("omits the dek when not provided", () => {
    render(<StoryCard story={{ ...baseStory, dek: undefined }} />);
    expect(screen.queryByText(baseStory.dek!)).not.toBeInTheDocument();
  });

  it("renders byline and timestamp with a machine-readable datetime", () => {
    render(<StoryCard story={baseStory} />);
    expect(screen.getByText("By Jane Doe")).toBeInTheDocument();
    const time = screen.getByText("3 hours ago");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", baseStory.timestampDateTime);
  });

  it("renders no image when imageSrc is omitted", () => {
    render(<StoryCard story={{ ...baseStory, imageSrc: undefined }} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the thumbnail with the given alt text", () => {
    render(<StoryCard story={baseStory} />);
    expect(screen.getByAltText(baseStory.imageAlt!)).toBeInTheDocument();
  });

  it("applies horizontal layout classes", () => {
    render(<StoryCard story={baseStory} layout="horizontal" data-testid="unused" />);
    const link = screen.getByRole("link");
    expect(link.firstElementChild?.className).toContain("flex-row");
  });

  it("has no axe violations with an image, link, and full content", async () => {
    const { container } = render(<StoryCard story={baseStory} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe violations for a static, text-only card", async () => {
    const { container } = render(
      <StoryCard
        story={{
          headline: "Text-only story",
          byline: "By Sam Lee",
        }}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  describe("loading state", () => {
    it("renders skeleton placeholders instead of real content when loading", () => {
      render(<StoryCard loading story={baseStory} data-testid="card" />);
      expect(screen.queryByRole("heading", { name: baseStory.headline })).not.toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.queryByText(baseStory.dek!)).not.toBeInTheDocument();
      expect(screen.queryByText("By Jane Doe")).not.toBeInTheDocument();
      expect(screen.queryByAltText(baseStory.imageAlt!)).not.toBeInTheDocument();
    });

    it("does not require a story while loading", () => {
      render(<StoryCard loading data-testid="card" />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("renders skeleton blocks built from the Skeleton component", () => {
      const { container } = render(<StoryCard loading data-testid="card" />);
      const skeletonBlocks = container.querySelectorAll("[aria-hidden='true'].animate-pulse");
      expect(skeletonBlocks.length).toBeGreaterThan(0);
    });

    it("hides the whole loading card from assistive tech", () => {
      render(<StoryCard loading data-testid="card" />);
      expect(screen.getByTestId("card")).toHaveAttribute("aria-hidden", "true");
    });

    it("applies horizontal layout classes to the loading placeholder", () => {
      render(<StoryCard loading layout="horizontal" data-testid="card" />);
      expect(screen.getByTestId("card").className).toContain("flex-row");
    });

    it("applies vertical layout classes to the loading placeholder by default", () => {
      render(<StoryCard loading data-testid="card" />);
      expect(screen.getByTestId("card").className).toContain("flex-col");
    });

    it("has no axe violations while loading", async () => {
      const { container } = render(<StoryCard loading />);
      const results = await axe(container);
      expect(results.violations).toEqual([]);
    });
  });
});
