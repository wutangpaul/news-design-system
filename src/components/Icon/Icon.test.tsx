import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Icon } from "./Icon";
import { Bookmark, Close, Search } from "./icons";

describe("Icon", () => {
  it("is aria-hidden and decorative by default", () => {
    const { container } = render(
      <Icon data-testid="icon">
        <circle cx={12} cy={12} r={10} />
      </Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });

  it("exposes role=img and aria-label when a label is given", () => {
    render(
      <Icon label="Loading">
        <circle cx={12} cy={12} r={10} />
      </Icon>,
    );
    const img = screen.getByRole("img", { name: "Loading" });
    expect(img).toBeInTheDocument();
  });

  it("renders the requested size", () => {
    const { container } = render(
      <Icon size="lg">
        <circle cx={12} cy={12} r={10} />
      </Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "1.5rem");
    expect(svg).toHaveAttribute("height", "1.5rem");
  });

  it("supports a custom numeric size", () => {
    const { container } = render(
      <Icon size={40}>
        <circle cx={12} cy={12} r={10} />
      </Icon>,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40px");
  });

  it("forwards a ref to the svg element", () => {
    let node: SVGSVGElement | null = null;
    render(
      <Icon
        ref={(el) => {
          node = el;
        }}
      >
        <circle cx={12} cy={12} r={10} />
      </Icon>,
    );
    expect(node).toBeInstanceOf(SVGSVGElement);
  });

  it("named icons forward props and stay decorative without a label", () => {
    const { container } = render(<Close size="sm" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("named icons accept a label for accessible usage", () => {
    render(<Search label="Search the site" />);
    expect(screen.getByRole("img", { name: "Search the site" })).toBeInTheDocument();
  });

  it("has no axe violations when labeled", async () => {
    const { container } = render(<Bookmark label="Save article" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
