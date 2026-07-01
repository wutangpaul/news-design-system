import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("is aria-hidden and decorative without a label", () => {
    const { container } = render(<Divider />);
    const divider = container.firstChild as HTMLElement;
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).not.toHaveAttribute("role");
  });

  it("exposes role=separator with an accessible label when labelled", () => {
    render(<Divider label="OR" />);
    const separator = screen.getByRole("separator", { name: "OR" });
    expect(separator).toBeInTheDocument();
  });

  it("renders the label content", () => {
    render(<Divider label="MORE FROM THIS SECTION" />);
    expect(screen.getByText("MORE FROM THIS SECTION")).toBeInTheDocument();
  });

  it("sets aria-orientation=vertical for vertical labelled dividers", () => {
    render(<Divider orientation="vertical" label="OR" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("applies horizontal vs vertical classes", () => {
    const { container, rerender } = render(<Divider />);
    expect((container.firstChild as HTMLElement).className).toContain("border-t");

    rerender(<Divider orientation="vertical" />);
    expect((container.firstChild as HTMLElement).className).toContain("border-l");
  });

  it("has no axe violations when labelled", async () => {
    const { container } = render(<Divider label="OR" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
