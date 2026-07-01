import { createRef } from "react";
import { describe, expect, it, afterEach, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ReadingProgress } from "./ReadingProgress";

function mockDocumentScroll({
  scrollTop,
  scrollHeight,
  clientHeight,
}: {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}) {
  Object.defineProperty(document.documentElement, "scrollTop", {
    configurable: true,
    value: scrollTop,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    configurable: true,
    value: clientHeight,
  });
}

describe("ReadingProgress", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a progressbar starting at 0 before any scroll is reported", () => {
    mockDocumentScroll({ scrollTop: 0, scrollHeight: 2000, clientHeight: 1000 });
    render(<ReadingProgress />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("updates the progressbar value when the window is scrolled", async () => {
    mockDocumentScroll({ scrollTop: 0, scrollHeight: 2000, clientHeight: 1000 });
    render(<ReadingProgress />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

    mockDocumentScroll({ scrollTop: 500, scrollHeight: 2000, clientHeight: 1000 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    });
  });

  it("clamps at 100 when scrolled to the bottom", async () => {
    mockDocumentScroll({ scrollTop: 1000, scrollHeight: 2000, clientHeight: 1000 });
    render(<ReadingProgress />);
    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    });
  });

  it("reports 0 when the document isn't scrollable at all", () => {
    mockDocumentScroll({ scrollTop: 0, scrollHeight: 800, clientHeight: 800 });
    render(<ReadingProgress />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("tracks a target element's bounds instead of the document when targetRef is given", () => {
    const ref = createRef<HTMLElement>();
    const article = document.createElement("article");
    // jsdom never lays anything out, so getBoundingClientRect is stubbed directly.
    article.getBoundingClientRect = vi.fn(() => ({
      top: -300,
      bottom: 500,
      height: 800,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: -300,
      toJSON: () => ({}),
    }));
    document.body.appendChild(article);
    // @ts-expect-error -- test wiring a plain DOM node into the ref
    ref.current = article;
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(600);

    render(<ReadingProgress targetRef={ref} />);
    // total = height(800) - viewportHeight(600) = 200; scrolled = -top = 300 -> clamps to 100
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

    document.body.removeChild(article);
  });

  it("uses the provided label as the accessible name", () => {
    render(<ReadingProgress label="Article reading progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Article reading progress",
    );
  });

  it("applies the requested size to the underlying Progress track", () => {
    render(<ReadingProgress size="lg" data-testid="wrapper" />);
    const track = screen.getByRole("progressbar");
    expect(track.className).toContain("h-3");
  });

  it("forwards a ref to the wrapping element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <ReadingProgress
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<ReadingProgress label="Reading progress" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
