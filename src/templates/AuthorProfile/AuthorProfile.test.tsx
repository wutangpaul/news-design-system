import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AuthorProfile } from "./AuthorProfile";
import type { GlobalHeaderProps } from "@/patterns/GlobalHeader";
import type { FooterProps } from "@/patterns/Footer";

const header: GlobalHeaderProps = {
  logo: <a href="/">The Daily Ledger</a>,
};

const footer: FooterProps = {
  groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }],
};

describe("AuthorProfile", () => {
  it("renders the GlobalHeader chrome with the given header content", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
      />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Daily Ledger" })).toBeInTheDocument();
  });

  it("renders the Footer chrome with the given footer content", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
      />,
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders the authorIntro slot content inside a labeled region", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p data-testid="intro">Everything about Jane Doe</p>}
        storyList={<p>Story list</p>}
      />,
    );
    expect(screen.getByTestId("intro")).toHaveTextContent("Everything about Jane Doe");
    expect(screen.getByRole("region", { name: "About the author" })).toContainElement(
      screen.getByTestId("intro"),
    );
  });

  it("renders the storyList slot content", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p data-testid="stories">Jane&apos;s stories</p>}
      />,
    );
    expect(screen.getByTestId("stories")).toHaveTextContent("Jane's stories");
  });

  it("labels the story list section with a heading that references it", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
      />,
    );
    const heading = screen.getByRole("heading", { name: "Latest stories", level: 2 });
    const section = heading.closest("section");
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("omits pagination when not given", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
      />,
    );
    expect(screen.queryByRole("navigation", { name: "Pagination" })).not.toBeInTheDocument();
  });

  it("renders the pagination slot content when given", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
        pagination={<nav aria-label="Pagination">Page 1 of 5</nav>}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent(
      "Page 1 of 5",
    );
  });

  it("places the main content in a <main> landmark between the header and footer chrome", () => {
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p data-testid="stories">Story list</p>}
      />,
    );
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("stories"));
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AuthorProfile
        header={header}
        footer={footer}
        authorIntro={<p>Author intro</p>}
        storyList={<p>Story list</p>}
        pagination={<nav aria-label="Pagination">Page 1 of 5</nav>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
