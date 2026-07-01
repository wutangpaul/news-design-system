import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { NewsletterLanding } from "./NewsletterLanding";

const header = { logo: <span>The Daily Ledger</span> };
const footer = { logo: "The Daily Ledger", groups: [] };

describe("NewsletterLanding", () => {
  it("renders the GlobalHeader and Footer chrome", () => {
    render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>Intro copy</p>}
        signup={<p>Signup form</p>}
      />,
    );
    expect(screen.getByRole("banner")).toHaveTextContent("The Daily Ledger");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the intro and signup slots", () => {
    render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>The Weekly Ledger, every Friday morning.</p>}
        signup={<p>Sign up form goes here</p>}
      />,
    );
    expect(screen.getByText("The Weekly Ledger, every Friday morning.")).toBeInTheDocument();
    expect(screen.getByText("Sign up form goes here")).toBeInTheDocument();
  });

  it("omits the sample-issues section when not provided", () => {
    render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>Intro</p>}
        signup={<p>Signup</p>}
      />,
    );
    expect(screen.queryByLabelText("What you'll get")).not.toBeInTheDocument();
  });

  it("renders the sample-issues slot when provided", () => {
    render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>Intro</p>}
        signup={<p>Signup</p>}
        sampleIssues={<p>Sample issue preview</p>}
      />,
    );
    expect(screen.getByLabelText("What you'll get")).toHaveTextContent("Sample issue preview");
  });

  it("renders a skip link pointing at the main landmark", () => {
    render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>Intro</p>}
        signup={<p>Signup</p>}
      />,
    );
    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("supports a custom mainId", () => {
    render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>Intro</p>}
        signup={<p>Signup</p>}
        mainId="newsletter-content"
      />,
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "newsletter-content");
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#newsletter-content",
    );
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <NewsletterLanding
        ref={ref}
        header={header}
        footer={footer}
        intro={<p>Intro</p>}
        signup={<p>Signup</p>}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <NewsletterLanding
        header={header}
        footer={footer}
        intro={<p>The Weekly Ledger, every Friday morning.</p>}
        signup={<p>Signup form</p>}
        sampleIssues={<p>Sample issue preview</p>}
      />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
