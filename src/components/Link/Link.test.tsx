import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Link } from "./Link";

describe("Link", () => {
  it("renders a native anchor and forwards a ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="/story/1">
        Read more
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Read more" });
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toBe(link);
  });

  it("does not force a new tab for internal links", () => {
    render(<Link href="/story/1">Read more</Link>);
    const link = screen.getByRole("link", { name: "Read more" });
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("opens external links in a new tab with rel=noopener noreferrer", () => {
    render(
      <Link href="https://example.com" external>
        Source
      </Link>,
    );
    const link = screen.getByRole("link", { name: /Source/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows an inline icon for external links only", () => {
    const { rerender, container } = render(<Link href="/internal">Internal</Link>);
    expect(container.querySelector("svg")).not.toBeInTheDocument();

    rerender(
      <Link href="https://example.com" external>
        External
      </Link>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("is keyboard focusable and activates on Enter", async () => {
    const user = userEvent.setup();
    render(<Link href="/story/1">Read more</Link>);
    await user.tab();
    expect(screen.getByRole("link", { name: "Read more" })).toHaveFocus();
  });

  it("applies inline vs standalone styling", () => {
    const { rerender, container } = render(
      <Link href="/a" tone="inline">
        A
      </Link>,
    );
    expect(container.querySelector("a")?.className).toContain("underline");

    rerender(
      <Link href="/a" tone="standalone">
        A
      </Link>,
    );
    expect(container.querySelector("a")?.className).toContain("no-underline");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Link href="https://example.com" external>
        Accessible link
      </Link>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
