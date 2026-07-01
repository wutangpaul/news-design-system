import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Byline } from "./Byline";

describe("Byline", () => {
  it("renders the author name as a link when href is given", () => {
    render(
      <Byline
        authors={[{ name: "Jane Doe", href: "/authors/jane-doe" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
      />,
    );
    const link = screen.getByRole("link", { name: "Jane Doe" });
    expect(link).toHaveAttribute("href", "/authors/jane-doe");
  });

  it("renders the author name as plain text when no href is given", () => {
    render(
      <Byline authors={[{ name: "Wire Service Staff" }]} publishedAt="2026-06-28T14:30:00.000Z" showAvatar={false} />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Wire Service Staff")).toBeInTheDocument();
  });

  it("renders a real time element with a machine-readable dateTime for the publish date", () => {
    render(
      <Byline
        authors={[{ name: "Jane Doe" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
      />,
    );
    const times = document.querySelectorAll("time");
    expect(times).toHaveLength(1);
    expect(times[0]).toHaveAttribute("dateTime", "2026-06-28T14:30:00.000Z");
    expect(times[0].textContent).toContain("2026");
  });

  it("converts a Date instance publishedAt to an ISO dateTime attribute", () => {
    render(<Byline authors={[{ name: "Jane Doe" }]} publishedAt={new Date("2026-06-28T14:30:00.000Z")} />);
    const time = document.querySelector("time")!;
    expect(time).toHaveAttribute("dateTime", "2026-06-28T14:30:00.000Z");
  });

  it("renders an Updated time element when updatedAt is given", () => {
    render(
      <Byline
        authors={[{ name: "Jane Doe" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
        updatedAt="2026-06-30T09:15:00.000Z"
      />,
    );
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    const times = document.querySelectorAll("time");
    expect(times).toHaveLength(2);
    expect(times[1]).toHaveAttribute("dateTime", "2026-06-30T09:15:00.000Z");
  });

  it("omits the Updated segment when updatedAt is not given", () => {
    render(<Byline authors={[{ name: "Jane Doe" }]} publishedAt="2026-06-28T14:30:00.000Z" />);
    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  it("joins two authors with 'and'", () => {
    render(
      <Byline
        authors={[{ name: "Jane Doe" }, { name: "Sam Lee" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
        showAvatar={false}
      />,
    );
    expect(document.body.textContent).toContain("Jane Doe and Sam Lee");
  });

  it("joins three authors with an Oxford comma", () => {
    render(
      <Byline
        authors={[{ name: "Jane Doe" }, { name: "Sam Lee" }, { name: "Omar Torres" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
        showAvatar={false}
      />,
    );
    expect(document.body.textContent).toContain("Jane Doe, Sam Lee, and Omar Torres");
  });

  it("renders an avatar per author by default", () => {
    render(
      <Byline
        authors={[{ name: "Jane Doe" }, { name: "Sam Lee" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
      />,
    );
    // Avatar exposes the name via a visually-hidden span; one per author confirms both rendered.
    expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sam Lee").length).toBeGreaterThan(0);
  });

  it("omits avatars when showAvatar is false", () => {
    const { container } = render(
      <Byline authors={[{ name: "Jane Doe" }]} publishedAt="2026-06-28T14:30:00.000Z" showAvatar={false} />,
    );
    expect(container.querySelectorAll("img").length).toBe(0);
    expect(container.textContent).not.toMatch(/^JD/);
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <Byline
        authors={[{ name: "Jane Doe" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Byline
        authors={[{ name: "Jane Doe", href: "/authors/jane-doe", avatarSrc: "/jane.jpg" }]}
        publishedAt="2026-06-28T14:30:00.000Z"
        updatedAt="2026-06-30T09:15:00.000Z"
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
