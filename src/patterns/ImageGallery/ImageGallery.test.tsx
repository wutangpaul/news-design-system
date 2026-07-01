import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ImageGallery, type GalleryImage } from "./ImageGallery";

const images: GalleryImage[] = [
  { src: "/gallery/1.jpg", alt: "First photo", caption: "First caption", credit: "Jane Doe" },
  { src: "/gallery/2.jpg", alt: "Second photo", caption: "Second caption" },
  { src: "/gallery/3.jpg", alt: "Third photo" },
];

describe("ImageGallery", () => {
  it("renders the first image by default", () => {
    render(<ImageGallery images={images} label="Test gallery" />);
    expect(screen.getByAltText("First photo")).toBeInTheDocument();
  });

  it("requires alt text per image, forwarded through to the underlying Image", () => {
    render(<ImageGallery images={images} label="Test gallery" defaultIndex={2} />);
    expect(screen.getByAltText("Third photo")).toBeInTheDocument();
  });

  it("advances to the next image with a real button click", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} label="Test gallery" />);
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByAltText("Second photo")).toBeInTheDocument();
  });

  it("wraps to the last image when pressing previous on the first image", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} label="Test gallery" />);
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(screen.getByAltText("Third photo")).toBeInTheDocument();
  });

  it("advances with the ArrowRight key", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} label="Test gallery" />);
    await user.click(screen.getByRole("button", { name: "Next image" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByAltText("Third photo")).toBeInTheDocument();
  });

  it("goes back with the ArrowLeft key", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} label="Test gallery" />);
    await user.click(screen.getByRole("button", { name: "Next image" }));
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByAltText("First photo")).toBeInTheDocument();
  });

  it("navigates directly via a dot button", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} label="Test gallery" />);
    await user.click(screen.getByRole("button", { name: "Go to image 3 of 3" }));
    expect(screen.getByAltText("Third photo")).toBeInTheDocument();
  });

  it("marks the active dot with aria-current", () => {
    render(<ImageGallery images={images} label="Test gallery" />);
    expect(screen.getByRole("button", { name: "Go to image 1 of 3" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Go to image 2 of 3" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renders no prev/next/dot controls for a single image", () => {
    render(<ImageGallery images={[images[0]]} label="Test gallery" />);
    expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Go to image/ })).not.toBeInTheDocument();
  });

  it("announces the current position in an aria-live region", () => {
    render(<ImageGallery images={images} label="Test gallery" />);
    expect(screen.getByText("Image 1 of 3")).toHaveClass("sr-only");
  });

  it("opens a Modal enlarge view when the image is activated", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} label="Test gallery" />);
    await user.click(screen.getByRole("button", { name: "Enlarge image 1 of 3" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByAltText("First photo")).toBeInTheDocument();
  });

  it("does not render an enlarge control when enlargeable is false", () => {
    render(<ImageGallery images={images} label="Test gallery" enlargeable={false} />);
    expect(screen.queryByRole("button", { name: /Enlarge image/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders nothing for an empty images array", () => {
    const { container } = render(<ImageGallery images={[]} label="Test gallery" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("labels the carousel region", () => {
    render(<ImageGallery images={images} label="Test gallery" />);
    expect(screen.getByRole("group", { name: "Test gallery" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ImageGallery images={images} label="Test gallery" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
