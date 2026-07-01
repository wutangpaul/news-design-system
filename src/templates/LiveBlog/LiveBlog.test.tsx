import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { LiveBlog, type LiveBlogProps } from "./LiveBlog";

const baseProps: LiveBlogProps = {
  header: { logo: "The Daily Ledger" },
  footer: { groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }] },
  pageHeader: <h1>Election Night: Live Updates</h1>,
  entries: [
    <article key="a" aria-label="entry-a">
      First update
    </article>,
    <article key="b" aria-label="entry-b">
      Second update
    </article>,
  ],
};

describe("LiveBlog", () => {
  it("renders the global header chrome from the header slot", () => {
    render(<LiveBlog {...baseProps} />);
    expect(screen.getByText("The Daily Ledger")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the footer chrome from the footer slot", () => {
    render(<LiveBlog {...baseProps} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders the pageHeader slot content", () => {
    render(<LiveBlog {...baseProps} />);
    expect(
      screen.getByRole("heading", { name: "Election Night: Live Updates" }),
    ).toBeInTheDocument();
  });

  it("does not render a breaking news banner when omitted", () => {
    render(<LiveBlog {...baseProps} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders a passed-in breakingNewsBanner slot", () => {
    render(
      <LiveBlog
        {...baseProps}
        breakingNewsBanner={<div role="status">Breaking alert</div>}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Breaking alert");
  });

  it("renders a passed-in feedStatus slot", () => {
    render(<LiveBlog {...baseProps} feedStatus={<span>3 updates</span>} />);
    expect(screen.getByText("3 updates")).toBeInTheDocument();
  });

  it("renders every entry, in the exact order given, inside the feed region", () => {
    render(<LiveBlog {...baseProps} />);
    const feed = screen.getByRole("feed", { name: "Live updates, newest first" });
    const entries = within(feed).getAllByRole("article");
    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveAccessibleName("entry-a");
    expect(entries[1]).toHaveAccessibleName("entry-b");
  });

  it("reflects an arbitrary-length entries array on re-render (prepend simulation)", () => {
    const { rerender } = render(<LiveBlog {...baseProps} />);
    expect(within(screen.getByRole("feed")).getAllByRole("article")).toHaveLength(2);

    rerender(
      <LiveBlog
        {...baseProps}
        entries={[
          <article key="c" aria-label="entry-c">
            Newest update
          </article>,
          ...baseProps.entries,
        ]}
      />,
    );
    const entries = within(screen.getByRole("feed")).getAllByRole("article");
    expect(entries).toHaveLength(3);
    expect(entries[0]).toHaveAccessibleName("entry-c");
    expect(entries[1]).toHaveAccessibleName("entry-a");
    expect(entries[2]).toHaveAccessibleName("entry-b");
  });

  it("renders correctly with a single entry", () => {
    render(
      <LiveBlog
        {...baseProps}
        entries={[
          <article key="only" aria-label="only-entry">
            Only update
          </article>,
        ]}
      />,
    );
    expect(within(screen.getByRole("feed")).getAllByRole("article")).toHaveLength(1);
  });

  it("renders correctly with zero entries", () => {
    render(<LiveBlog {...baseProps} entries={[]} />);
    expect(within(screen.getByRole("feed")).queryAllByRole("article")).toHaveLength(0);
  });

  it("has no axe violations", async () => {
    const { container } = render(<LiveBlog {...baseProps} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
