import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Caption } from "./Caption";

describe("Caption", () => {
  it("renders a real figcaption element", () => {
    render(
      <figure>
        <Caption>A description</Caption>
      </figure>,
    );
    const caption = screen.getByText("A description");
    expect(caption.tagName).toBe("FIGCAPTION");
  });

  it("renders the description and credit together", () => {
    render(
      <figure>
        <Caption credit="Jane Doe/Wire Service">Firefighters on Main Street.</Caption>
      </figure>,
    );
    expect(screen.getByText("Firefighters on Main Street.")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe/Wire Service")).toBeInTheDocument();
  });

  it("renders credit only when no description is given", () => {
    render(
      <figure>
        <Caption credit="Jane Doe/Wire Service" />
      </figure>,
    );
    expect(screen.getByText("Jane Doe/Wire Service")).toBeInTheDocument();
  });

  it("renders nothing when neither description nor credit is given", () => {
    const { container } = render(
      <figure>
        <Caption />
      </figure>,
    );
    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });

  it("forwards a ref to the figcaption element", () => {
    let node: HTMLElement | null = null;
    render(
      <figure>
        <Caption
          ref={(el) => {
            node = el;
          }}
        >
          A description
        </Caption>
      </figure>,
    );
    expect(node).toBeInstanceOf(HTMLElement);
    expect((node as unknown as HTMLElement)?.tagName).toBe("FIGCAPTION");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <figure>
        <Caption credit="Jane Doe/Wire Service">A description</Caption>
      </figure>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
