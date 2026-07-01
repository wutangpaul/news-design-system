import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials when no src is given", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("derives a single-letter pair from a one-word name", () => {
    render(<Avatar name="Madonna" />);
    expect(screen.getByText("MA")).toBeInTheDocument();
  });

  it("renders an image when src is provided", () => {
    render(<Avatar name="Jane Doe" src="/jane.jpg" />);
    const img = document.querySelector("img");
    expect(img).toHaveAttribute("src", "/jane.jpg");
  });

  it("falls back to initials if the image fails to load", () => {
    render(<Avatar name="Jane Doe" src="/broken.jpg" />);
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("exposes the name as the accessible label", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText("Jane Doe")).toHaveClass("sr-only");
  });

  it("renders a status dot with an accessible status label", () => {
    render(<Avatar name="Jane Doe" status="online" />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("omits the status dot when no status is given", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.queryByText("Online")).not.toBeInTheDocument();
    expect(screen.queryByText("Offline")).not.toBeInTheDocument();
  });

  it("applies the requested size class", () => {
    render(<Avatar name="Jane Doe" size="xl" data-testid="avatar" />);
    expect(screen.getByTestId("avatar").className).toContain("h-20");
  });

  it("forwards a ref to the root span", () => {
    let node: HTMLSpanElement | null = null;
    render(
      <Avatar
        name="Jane Doe"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });
});
