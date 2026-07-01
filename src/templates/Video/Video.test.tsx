import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Video } from "./Video";

const header = { logo: <span>The Daily Ledger</span> };
const footer = { logo: "The Daily Ledger", groups: [] };

describe("Video", () => {
  it("renders the GlobalHeader and Footer chrome", () => {
    render(
      <Video
        header={header}
        footer={footer}
        featured={<p>Featured video</p>}
        videos={<p>Video grid</p>}
      />,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("The Daily Ledger");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the featured and videos slots", () => {
    render(
      <Video
        header={header}
        footer={footer}
        featured={<p>How the trade deal came together</p>}
        videos={<p>Grid of more videos</p>}
      />,
    );
    expect(screen.getByLabelText("Featured video")).toHaveTextContent(
      "How the trade deal came together",
    );
    expect(screen.getByLabelText("More videos")).toHaveTextContent("Grid of more videos");
  });

  it("omits the collections section when not provided", () => {
    render(
      <Video
        header={header}
        footer={footer}
        featured={<p>Featured</p>}
        videos={<p>Videos</p>}
      />,
    );
    expect(screen.queryByLabelText("Video series")).not.toBeInTheDocument();
  });

  it("renders the collections slot when provided", () => {
    render(
      <Video
        header={header}
        footer={footer}
        featured={<p>Featured</p>}
        videos={<p>Videos</p>}
        collections={<p>Explained series</p>}
      />,
    );
    expect(screen.getByLabelText("Video series")).toHaveTextContent("Explained series");
  });

  it("renders a skip link pointing at the main landmark", () => {
    render(
      <Video header={header} footer={footer} featured={<p>Featured</p>} videos={<p>Videos</p>} />,
    );
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Video
        ref={ref}
        header={header}
        footer={footer}
        featured={<p>Featured</p>}
        videos={<p>Videos</p>}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Video
        header={header}
        footer={footer}
        featured={<p>Featured video</p>}
        videos={<p>Video grid</p>}
        collections={<p>Explained series</p>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
