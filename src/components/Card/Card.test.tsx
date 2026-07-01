import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children inside a div by default", () => {
    render(<Card data-testid="card">Hello</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveTextContent("Hello");
  });

  it("renders as a different element via the as prop", () => {
    render(
      <Card as="section" data-testid="card">
        Section content
      </Card>,
    );
    expect(screen.getByTestId("card").tagName).toBe("SECTION");
  });

  it("applies the outlined variant border classes", () => {
    render(
      <Card variant="outlined" data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("border");
  });

  it("applies elevated shadow classes", () => {
    render(
      <Card variant="elevated" data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("shadow-md");
  });

  it("applies interactive hover affordance classes", () => {
    render(
      <Card interactive data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("hover:shadow-lg");
  });

  it("does not render its own clickable wrapper or click semantics", () => {
    render(<Card data-testid="card">content</Card>);
    const card = screen.getByTestId("card");
    expect(card).not.toHaveAttribute("role", "button");
    expect(card.tagName).not.toBe("BUTTON");
    expect(card.tagName).not.toBe("A");
  });

  it("renders Header, Body, and Footer subparts", () => {
    render(
      <Card>
        <Card.Header>Heading</Card.Header>
        <Card.Body>Body copy</Card.Body>
        <Card.Footer>Footer actions</Card.Footer>
      </Card>,
    );
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("applies the requested padding density to subparts", () => {
    render(
      <Card padding="spacious">
        <Card.Body data-testid="body">Body copy</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId("body").className).toContain("p-8");
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLElement | null = null;
    render(
      <Card
        ref={(el) => {
          node = el;
        }}
      >
        content
      </Card>,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});
