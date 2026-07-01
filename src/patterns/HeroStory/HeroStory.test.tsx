import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { HeroStory } from "./HeroStory";

describe("HeroStory", () => {
  it("renders the title as a heading with the default level", () => {
    render(
      <HeroStory title="Headline" imageSrc="/story.jpg" imageAlt="A story image" />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Headline");
  });

  it("renders the title at a custom heading level", () => {
    render(
      <HeroStory
        title="Headline"
        imageSrc="/story.jpg"
        imageAlt="A story image"
        headingLevel={1}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Headline");
  });

  it("renders the image with the given alt text", () => {
    render(
      <HeroStory title="Headline" imageSrc="/story.jpg" imageAlt="A story image" />,
    );
    expect(screen.getByAltText("A story image")).toBeInTheDocument();
  });

  it("renders the category as a Tag when provided", () => {
    render(
      <HeroStory
        title="Headline"
        category="Climate"
        imageSrc="/story.jpg"
        imageAlt="A story image"
      />,
    );
    expect(screen.getByText("Climate")).toBeInTheDocument();
  });

  it("does not render a category tag when omitted", () => {
    render(
      <HeroStory title="Headline" imageSrc="/story.jpg" imageAlt="A story image" />,
    );
    expect(screen.queryByText("Climate")).not.toBeInTheDocument();
  });

  it("renders the dek when provided", () => {
    render(
      <HeroStory
        title="Headline"
        dek="A quick summary."
        imageSrc="/story.jpg"
        imageAlt="A story image"
      />,
    );
    expect(screen.getByText("A quick summary.")).toBeInTheDocument();
  });

  it("does not render its own clickable wrapper or click semantics", () => {
    render(
      <HeroStory
        title="Headline"
        imageSrc="/story.jpg"
        imageAlt="A story image"
        data-testid="hero"
      />,
    );
    const hero = screen.getByTestId("hero");
    expect(hero).not.toHaveAttribute("role", "button");
    expect(hero.tagName).not.toBe("BUTTON");
    expect(hero.tagName).not.toBe("A");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <HeroStory ref={ref} title="Headline" imageSrc="/story.jpg" imageAlt="A story image" />,
    );
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <HeroStory
        category="Climate"
        title="Coastal cities race to finish sea walls"
        dek="A quick summary."
        imageSrc="/story.jpg"
        imageAlt="Workers reinforcing a sea wall"
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
