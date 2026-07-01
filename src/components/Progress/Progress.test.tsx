import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("renders a determinate progressbar with aria-value attributes", () => {
    render(<Progress value={40} max={100} label="Upload progress" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-label", "Upload progress");
  });

  it("defaults max to 100", () => {
    render(<Progress value={25} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuemax",
      "100",
    );
  });

  it("clamps value within [0, max]", () => {
    render(<Progress value={150} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("renders indeterminate mode when value is omitted", () => {
    render(<Progress label="Loading" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-valuetext", "Loading");
  });

  it("renders indeterminate mode when explicitly requested, even with a value", () => {
    render(<Progress value={40} indeterminate />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-valuetext", "Loading");
  });

  it("sets the fill width to match the percentage in determinate mode", () => {
    render(<Progress value={30} max={100} data-testid="progress" />);
    const fill = screen.getByTestId("progress").firstElementChild as HTMLElement;
    expect(fill.style.width).toBe("30%");
  });

  it("applies the requested color variant class", () => {
    render(<Progress value={30} color="success" data-testid="progress" />);
    const fill = screen.getByTestId("progress").firstElementChild as HTMLElement;
    expect(fill.className).toContain("bg-success-500");
  });

  it("applies the requested size class to the track", () => {
    render(<Progress value={30} size="lg" data-testid="progress" />);
    expect(screen.getByTestId("progress").className).toContain("h-3");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Progress
        value={10}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});
