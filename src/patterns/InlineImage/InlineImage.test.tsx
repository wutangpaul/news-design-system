import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { InlineImage } from "./InlineImage";

describe("InlineImage", () => {
  it("renders a figure containing the image and caption", () => {
    const { container } = render(
      <InlineImage
        src="/uploads/fire.jpg"
        alt="Firefighters battling a blaze on Main Street"
        caption="Firefighters respond early Tuesday morning."
        credit="Jane Doe/Wire Service"
      />,
    );
    expect(container.querySelector("figure")).toBeInTheDocument();
    expect(container.querySelector("figcaption")).toBeInTheDocument();
    const img = screen.getByAltText("Firefighters battling a blaze on Main Street");
    expect(img.tagName).toBe("IMG");
  });

  it("renders the caption description and credit", () => {
    render(
      <InlineImage
        src="/uploads/fire.jpg"
        alt="Firefighters"
        caption="Description text"
        credit="Jane Doe/Wire Service"
      />,
    );
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe/Wire Service")).toBeInTheDocument();
  });

  it("renders no figcaption when neither caption nor credit is given", () => {
    const { container } = render(<InlineImage src="/uploads/fire.jpg" alt="Firefighters" />);
    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });

  it("applies the full-bleed alignment class by default", () => {
    const { container } = render(<InlineImage src="/uploads/fire.jpg" alt="Firefighters" />);
    expect(container.querySelector("figure")?.className).toContain("w-full");
  });

  it("applies the inset-left alignment class", () => {
    const { container } = render(
      <InlineImage src="/uploads/fire.jpg" alt="Firefighters" align="inset-left" />,
    );
    expect(container.querySelector("figure")?.className).toContain("float-left");
  });

  it("applies the inset-right alignment class", () => {
    const { container } = render(
      <InlineImage src="/uploads/fire.jpg" alt="Firefighters" align="inset-right" />,
    );
    expect(container.querySelector("figure")?.className).toContain("float-right");
  });

  it("applies the centered alignment class", () => {
    const { container } = render(
      <InlineImage src="/uploads/fire.jpg" alt="Firefighters" align="center" />,
    );
    expect(container.querySelector("figure")?.className).toContain("mx-auto");
  });

  it("forwards a ref to the figure element", () => {
    let node: HTMLElement | null = null;
    render(
      <InlineImage
        src="/uploads/fire.jpg"
        alt="Firefighters"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLElement);
    expect((node as unknown as HTMLElement)?.tagName).toBe("FIGURE");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <InlineImage
        src="/uploads/fire.jpg"
        alt="Firefighters battling a blaze on Main Street"
        caption="Description text"
        credit="Jane Doe/Wire Service"
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
