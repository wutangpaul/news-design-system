import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SearchResults } from "./SearchResults";
import type { GlobalHeaderProps } from "@/patterns/GlobalHeader";
import type { FooterProps } from "@/patterns/Footer";

const header: GlobalHeaderProps = {
  logo: <a href="/">The Daily Ledger</a>,
};

const footer: FooterProps = {
  groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }],
};

describe("SearchResults", () => {
  it("renders the GlobalHeader and Footer chrome", () => {
    render(
      <SearchResults header={header} footer={footer} query="transit budget" resultCount={3} />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Daily Ledger" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a results summary with the query and count", () => {
    render(
      <SearchResults header={header} footer={footer} query="transit budget" resultCount={127} />,
    );
    expect(screen.getByText('127 results for "transit budget"')).toBeInTheDocument();
  });

  it("uses singular 'result' for a count of exactly 1", () => {
    render(<SearchResults header={header} footer={footer} query="ferry schedule" resultCount={1} />);
    expect(screen.getByText('1 result for "ferry schedule"')).toBeInTheDocument();
  });

  it("renders the resultsList slot content when there are results", () => {
    render(
      <SearchResults
        header={header}
        footer={footer}
        query="transit budget"
        resultCount={2}
        resultsList={<p data-testid="results">Matching stories</p>}
      />,
    );
    expect(screen.getByTestId("results")).toHaveTextContent("Matching stories");
  });

  it("renders the pagination slot content alongside a non-empty results list", () => {
    render(
      <SearchResults
        header={header}
        footer={footer}
        query="transit budget"
        resultCount={2}
        resultsList={<p>Matching stories</p>}
        pagination={<nav aria-label="Pagination">Page 1 of 5</nav>}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent(
      "Page 1 of 5",
    );
  });

  it("renders the built-in empty state (not a blank area) when resultCount is 0", () => {
    render(
      <SearchResults header={header} footer={footer} query="qxzzy nonsense" resultCount={0} />,
    );
    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(
      screen.getByText(/We couldn't find any stories matching "qxzzy nonsense"/),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("does not render resultsList or pagination when resultCount is 0, even if passed", () => {
    render(
      <SearchResults
        header={header}
        footer={footer}
        query="qxzzy nonsense"
        resultCount={0}
        resultsList={<p data-testid="results">Matching stories</p>}
        pagination={<nav aria-label="Pagination">Page 1 of 5</nav>}
      />,
    );
    expect(screen.queryByTestId("results")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Pagination" })).not.toBeInTheDocument();
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("allows overriding the empty state content", () => {
    render(
      <SearchResults
        header={header}
        footer={footer}
        query="qxzzy nonsense"
        resultCount={0}
        emptyState={<p>Custom empty state copy</p>}
      />,
    );
    expect(screen.getByText("Custom empty state copy")).toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("renders the results summary without a quoted query when query is empty", () => {
    render(<SearchResults header={header} footer={footer} query="" resultCount={0} />);
    expect(screen.getByText("0 results")).toBeInTheDocument();
  });

  it("places the main content in a <main> landmark between the header and footer chrome", () => {
    render(
      <SearchResults
        header={header}
        footer={footer}
        query="transit budget"
        resultCount={1}
        resultsList={<p data-testid="results">Matching stories</p>}
      />,
    );
    expect(screen.getByRole("main")).toContainElement(screen.getByTestId("results"));
  });

  it("forwards a ref to the root element", () => {
    let node: HTMLDivElement | null = null;
    render(
      <SearchResults
        header={header}
        footer={footer}
        query="transit budget"
        resultCount={0}
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations with results", async () => {
    const { container } = render(
      <SearchResults
        header={header}
        footer={footer}
        query="transit budget"
        resultCount={2}
        resultsList={<p>Matching stories</p>}
        pagination={<nav aria-label="Pagination">Page 1 of 5</nav>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe violations in the empty state", async () => {
    const { container } = render(
      <SearchResults header={header} footer={footer} query="qxzzy nonsense" resultCount={0} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
