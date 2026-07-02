import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Account } from "./Account";
import type { AccountProps } from "./Account";

const baseProps: AccountProps = {
  header: {
    logo: <a href="/">The Daily Ledger</a>,
  },
  footer: {
    logo: "The Daily Ledger",
    groups: [
      {
        heading: "Sections",
        links: [{ label: "World", href: "/world" }],
      },
    ],
  },
  name: "Renata Cole",
  email: "renata.cole@example.com",
  plan: {
    planName: "Premium",
    detail: "Renews July 15, 2026",
  },
  onSignOut: () => {},
};

describe("Account", () => {
  it("renders the GlobalHeader chrome", () => {
    render(<Account {...baseProps} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Daily Ledger" })).toBeInTheDocument();
  });

  it("renders the Footer chrome", () => {
    render(<Account {...baseProps} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders the page's own h1", () => {
    render(<Account {...baseProps} />);
    expect(screen.getByRole("heading", { level: 1, name: "Account" })).toBeInTheDocument();
  });

  it("renders the subscriber's name and email in the account summary", () => {
    render(<Account {...baseProps} />);
    // Avatar also exposes the name via a visually-hidden span (its accessible label for the
    // avatar graphic), so the name legitimately appears twice — see Byline.test.tsx for the
    // same pattern.
    expect(screen.getAllByText("Renata Cole").length).toBeGreaterThan(0);
    expect(screen.getByText("renata.cole@example.com")).toBeInTheDocument();
  });

  it("renders the plan name and detail", () => {
    render(<Account {...baseProps} />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("Renews July 15, 2026")).toBeInTheDocument();
  });

  it("omits the plan detail when not provided", () => {
    render(<Account {...baseProps} plan={{ planName: "Premium" }} />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.queryByText("Renews July 15, 2026")).not.toBeInTheDocument();
  });

  it("renders the optional billing slot when provided", () => {
    render(<Account {...baseProps} billing={<div>Visa ending in 4242</div>} />);
    expect(screen.getByText("Visa ending in 4242")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Payment method" })).toBeInTheDocument();
  });

  it("omits the payment method section entirely when billing is not provided", () => {
    render(<Account {...baseProps} />);
    expect(screen.queryByRole("heading", { name: "Payment method" })).not.toBeInTheDocument();
  });

  it("renders a sign-out button and calls onSignOut when activated", async () => {
    const onSignOut = vi.fn();
    const user = userEvent.setup();
    render(<Account {...baseProps} onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("supports a custom sign-out label", () => {
    render(<Account {...baseProps} signOutLabel="Log out" />);
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("gives the main landmark a default id matching the skip link's target", () => {
    render(<Account {...baseProps} />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#main-content");
  });

  it("supports a custom main id", () => {
    render(<Account {...baseProps} mainId="account-main" />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "account-main");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#account-main");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Account {...baseProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Account {...baseProps} billing={<div>Visa ending in 4242</div>} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
