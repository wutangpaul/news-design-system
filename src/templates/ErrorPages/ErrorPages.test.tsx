import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ErrorPages } from "./ErrorPages";
import type { GlobalHeaderProps } from "@/patterns/GlobalHeader";
import type { FooterProps } from "@/patterns/Footer";

const header: GlobalHeaderProps = {
  logo: <span>The Daily Ledger</span>,
};

const footer: FooterProps = {
  groups: [{ heading: "Sections", links: [{ label: "World", href: "/world" }] }],
};

describe("ErrorPages", () => {
  it("renders the site chrome (header banner and footer contentinfo landmarks)", () => {
    render(<ErrorPages header={header} footer={footer} variant="not-found" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the not-found variant with a real h1 heading and a working recovery link", () => {
    render(<ErrorPages header={header} footer={footer} variant="not-found" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "This page couldn't be found" }),
    ).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Back to homepage" });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the server-error variant with its own heading/copy and a Try again + homepage recovery action", () => {
    render(
      <ErrorPages header={header} footer={footer} variant="server-error" />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Something went wrong on our end" }),
    ).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to homepage" })).toBeInTheDocument();
  });

  it("renders the offline variant with its own heading/copy and a Try again + homepage recovery action", () => {
    render(<ErrorPages header={header} footer={footer} variant="offline" />);
    expect(screen.getByRole("heading", { level: 1, name: "You're offline" })).toBeInTheDocument();
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to homepage" })).toBeInTheDocument();
  });

  it("the default Try again action reloads the page", async () => {
    const user = userEvent.setup();
    const reload = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    render(
      <ErrorPages header={header} footer={footer} variant="server-error" />,
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(reload).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("respects homeHref for the default recovery link", () => {
    render(
      <ErrorPages
        header={header}
        footer={footer}
        variant="not-found"
        homeHref="/en"
      />,
    );
    expect(screen.getByRole("link", { name: "Back to homepage" })).toHaveAttribute("href", "/en");
  });

  it("allows overriding heading, description, code, and action", () => {
    render(
      <ErrorPages
        header={header}
        footer={footer}
        variant="not-found"
        code="Custom"
        heading="That story has moved"
        description="Try searching instead."
        action={<button type="button">Go search</button>}
      />,
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "That story has moved" })).toBeInTheDocument();
    expect(screen.getByText("Try searching instead.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go search" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Back to homepage" })).not.toBeInTheDocument();
  });

  it("forwards a ref to the root element", () => {
    const ref = vi.fn();
    render(
      <ErrorPages ref={ref} header={header} footer={footer} variant="not-found" />,
    );
    expect(ref).toHaveBeenCalled();
  });

  it("has no axe violations for each variant", async () => {
    for (const variant of ["not-found", "server-error", "offline"] as const) {
      const { container, unmount } = render(
        <ErrorPages header={header} footer={footer} variant={variant} />,
      );
      const results = await axe(container);
      expect(results.violations).toEqual([]);
      unmount();
    }
  });
});
