import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Paywall } from "./Paywall";

describe("Paywall", () => {
  it("renders children normally when not locked, with no upsell card", () => {
    render(
      <Paywall locked={false}>
        <p>Full article body.</p>
      </Paywall>,
    );
    expect(screen.getByText("Full article body.")).toBeInTheDocument();
    expect(screen.queryByText("Subscribe to keep reading")).not.toBeInTheDocument();
  });

  it("defaults to unlocked when `locked` is omitted", () => {
    render(
      <Paywall>
        <p>Full article body.</p>
      </Paywall>,
    );
    expect(screen.queryByText("Subscribe to keep reading")).not.toBeInTheDocument();
  });

  it("keeps the gated content in the DOM when locked (for SEO)", () => {
    render(
      <Paywall locked>
        <p>Gated article body.</p>
      </Paywall>,
    );
    expect(screen.getByText("Gated article body.")).toBeInTheDocument();
  });

  it("aria-hides the clamped content region when locked", () => {
    render(
      <Paywall locked>
        <p data-testid="body">Gated article body.</p>
      </Paywall>,
    );
    const content = screen.getByText("Gated article body.");
    expect(content.closest("[aria-hidden]")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not aria-hide the content region when unlocked", () => {
    render(
      <Paywall locked={false}>
        <p>Full article body.</p>
      </Paywall>,
    );
    expect(screen.getByText("Full article body.").closest("[aria-hidden]")).toBeNull();
  });

  it("renders the default upsell heading, description, and CTA when locked", () => {
    render(
      <Paywall locked>
        <p>Gated body.</p>
      </Paywall>,
    );
    expect(screen.getByRole("heading", { name: "Subscribe to keep reading" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe now" })).toBeInTheDocument();
  });

  it("calls onCtaClick when the primary CTA is clicked", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    render(
      <Paywall locked onCtaClick={onCtaClick}>
        <p>Gated body.</p>
      </Paywall>,
    );
    await user.click(screen.getByRole("button", { name: "Subscribe now" }));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it("renders the sign-in link only when signInHref is given", () => {
    const { rerender } = render(
      <Paywall locked>
        <p>Gated body.</p>
      </Paywall>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <Paywall locked signInHref="/sign-in">
        <p>Gated body.</p>
      </Paywall>,
    );
    const link = screen.getByRole("link", { name: "Already a subscriber? Sign in" });
    expect(link).toHaveAttribute("href", "/sign-in");
  });

  it("supports custom heading, description, ctaLabel, and signInLabel", () => {
    render(
      <Paywall
        locked
        heading="You've hit your free article limit"
        description="Subscribe for unlimited access."
        ctaLabel="See plans"
        signInHref="/sign-in"
        signInLabel="Sign in"
      >
        <p>Gated body.</p>
      </Paywall>,
    );
    expect(
      screen.getByRole("heading", { name: "You've hit your free article limit" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subscribe for unlimited access.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "See plans" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders the upsell heading at the given semantic level", () => {
    render(
      <Paywall locked headingLevel={3}>
        <p>Gated body.</p>
      </Paywall>,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Subscribe to keep reading" }),
    ).toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Paywall ref={ref}>
        <p>Body.</p>
      </Paywall>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations when unlocked", async () => {
    const { container } = render(
      <Paywall locked={false}>
        <p>Full article body.</p>
      </Paywall>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("has no axe violations when locked", async () => {
    const { container } = render(
      <Paywall locked signInHref="/sign-in">
        <p>Gated article body.</p>
      </Paywall>,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
