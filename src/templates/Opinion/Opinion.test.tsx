import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Opinion } from "./Opinion";

const header = { logo: <span>The Daily Ledger</span> };
const footer = {
  groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }],
};

const requiredProps = {
  header,
  footer,
  articleHeader: <h1>The headline slot content</h1>,
  authorCard: <div>The author card slot content</div>,
  body: <p>The body slot content</p>,
};

describe("Opinion", () => {
  it("renders the site chrome: a banner header and a contentinfo footer", () => {
    render(<Opinion {...requiredProps} />);
    expect(screen.getByRole("banner")).toHaveTextContent("The Daily Ledger");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a reading-progress bar", () => {
    render(<Opinion {...requiredProps} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders a default 'Opinion' eyebrow above the headline", () => {
    render(<Opinion {...requiredProps} />);
    expect(screen.getByText("Opinion")).toBeInTheDocument();
  });

  it("supports a custom eyebrow label", () => {
    render(<Opinion {...requiredProps} eyebrow="Editorial" />);
    expect(screen.getByText("Editorial")).toBeInTheDocument();
    expect(screen.queryByText("Opinion")).not.toBeInTheDocument();
  });

  it("renders the required articleHeader, authorCard, and body slots", () => {
    render(<Opinion {...requiredProps} />);
    expect(screen.getByRole("heading", { level: 1, name: "The headline slot content" })).toBeInTheDocument();
    expect(screen.getByText("The author card slot content")).toBeInTheDocument();
    expect(screen.getByText("The body slot content")).toBeInTheDocument();
  });

  it("places the authorCard slot immediately after the headline, before the body", () => {
    render(<Opinion {...requiredProps} />);
    const main = screen.getByRole("main");
    const text = main.textContent ?? "";
    const headlineIndex = text.indexOf("The headline slot content");
    const authorIndex = text.indexOf("The author card slot content");
    const bodyIndex = text.indexOf("The body slot content");
    expect(headlineIndex).toBeLessThan(authorIndex);
    expect(authorIndex).toBeLessThan(bodyIndex);
  });

  it("renders the optional socialSharing, related, and comments slots only when provided", () => {
    const { rerender } = render(<Opinion {...requiredProps} />);
    expect(screen.queryByText("Share this")).not.toBeInTheDocument();

    rerender(
      <Opinion
        {...requiredProps}
        socialSharing={<div>Share this</div>}
        related={<div>Related content</div>}
        comments={<div>Comments content</div>}
      />,
    );
    expect(screen.getByText("Share this")).toBeInTheDocument();
    expect(screen.getByText("Related content")).toBeInTheDocument();
    expect(screen.getByText("Comments content")).toBeInTheDocument();
  });

  it("constrains the reading column to the ~65ch reading measure", () => {
    render(<Opinion {...requiredProps} />);
    const main = screen.getByRole("main");
    expect(main).toHaveClass("max-w-[65ch]");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Opinion {...requiredProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Opinion {...requiredProps} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
