import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Image } from "./Image";

describe("Image", () => {
  it("renders an img with the given alt text", () => {
    render(<Image src="/photo.jpg" alt="A reporter at a press conference" />);
    expect(
      screen.getByAltText("A reporter at a press conference"),
    ).toBeInTheDocument();
  });

  it("allows an explicit empty alt for decorative images", () => {
    render(<Image src="/photo.jpg" alt="" data-testid="decorative" />);
    const img = screen.getByTestId("decorative");
    expect(img).toHaveAttribute("alt", "");
  });

  it("defaults loading to lazy", () => {
    render(<Image src="/photo.jpg" alt="Lazy by default" />);
    expect(screen.getByAltText("Lazy by default")).toHaveAttribute(
      "loading",
      "lazy",
    );
  });

  it("allows overriding loading to eager", () => {
    render(<Image src="/photo.jpg" alt="Eager image" loading="eager" />);
    expect(screen.getByAltText("Eager image")).toHaveAttribute(
      "loading",
      "eager",
    );
  });

  it("hides the image (opacity-0) until it loads, then reveals it", () => {
    render(<Image src="/photo.jpg" alt="Fades in" />);
    const img = screen.getByAltText("Fades in");
    expect(img.className).toContain("opacity-0");
    fireEvent.load(img);
    expect(img.className).toContain("opacity-100");
  });

  it("shows a fallback with the alt text when the image errors", () => {
    render(<Image src="/broken.jpg" alt="Could not load this photo" />);
    const img = screen.getByAltText("Could not load this photo");
    fireEvent.error(img);
    expect(screen.getByText("Could not load this photo")).toBeInTheDocument();
  });

  it("applies the requested aspect ratio class", () => {
    render(
      <Image
        src="/photo.jpg"
        alt="Widescreen"
        aspectRatio="16/9"
        data-testid="widescreen"
      />,
    );
    const container = screen.getByTestId("widescreen").parentElement;
    expect(container?.className).toContain("aspect-[16/9]");
  });

  it("forwards a ref to the underlying img element", () => {
    let node: HTMLImageElement | null = null;
    render(
      <Image
        src="/photo.jpg"
        alt="Ref target"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLImageElement);
  });
});
