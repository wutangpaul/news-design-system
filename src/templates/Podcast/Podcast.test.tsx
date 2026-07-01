import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Podcast } from "./Podcast";

const header = { logo: <span>The Daily Ledger</span> };
const footer = { logo: "The Daily Ledger", groups: [] };

describe("Podcast", () => {
  it("renders the GlobalHeader and Footer chrome", () => {
    render(
      <Podcast
        header={header}
        footer={footer}
        showIntro={<p>Show intro</p>}
        episodes={<p>Episode list</p>}
      />,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("The Daily Ledger");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the showIntro and episodes slots", () => {
    render(
      <Podcast
        header={header}
        footer={footer}
        showIntro={<p>The Daily Ledger Briefing</p>}
        episodes={<p>Ep. 214: What the jobs report tells us</p>}
      />,
    );
    expect(screen.getByLabelText("About this podcast")).toHaveTextContent(
      "The Daily Ledger Briefing",
    );
    expect(screen.getByLabelText("Episodes")).toHaveTextContent(
      "Ep. 214: What the jobs report tells us",
    );
  });

  it("renders a skip link pointing at the main landmark", () => {
    render(
      <Podcast
        header={header}
        footer={footer}
        showIntro={<p>Show</p>}
        episodes={<p>Episodes</p>}
      />,
    );
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("supports a custom mainId", () => {
    render(
      <Podcast
        header={header}
        footer={footer}
        showIntro={<p>Show</p>}
        episodes={<p>Episodes</p>}
        mainId="podcast-content"
      />,
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "podcast-content");
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#podcast-content",
    );
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Podcast
        ref={ref}
        header={header}
        footer={footer}
        showIntro={<p>Show</p>}
        episodes={<p>Episodes</p>}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Podcast
        header={header}
        footer={footer}
        showIntro={<p>The Daily Ledger Briefing</p>}
        episodes={<p>Episode list</p>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
