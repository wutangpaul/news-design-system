import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { NewsletterSignup } from "./NewsletterSignup";

describe("NewsletterSignup", () => {
  it("renders a labelled email field and submit button", () => {
    render(<NewsletterSignup onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Email address/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("calls onSubmit with the entered email when submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NewsletterSignup onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Email address/), "reader@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("reader@example.com");
  });

  it("does not submit an empty required email field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NewsletterSignup onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("puts the button in a loading, disabled state while isLoading is true", () => {
    render(<NewsletterSignup onSubmit={() => {}} isLoading />);
    const button = screen.getByRole("button", { name: "Sign up" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText(/Email address/)).toBeDisabled();
  });

  it("shows the errorText via Input's error contract", () => {
    render(<NewsletterSignup onSubmit={() => {}} errorText="That email is already subscribed." />);
    expect(screen.getByRole("alert")).toHaveTextContent("That email is already subscribed.");
    expect(screen.getByLabelText(/Email address/)).toHaveAttribute("aria-invalid", "true");
  });

  it("renders a confirmation instead of the form when successMessage is set", () => {
    render(<NewsletterSignup onSubmit={() => {}} successMessage="You're subscribed." />);
    expect(screen.getByRole("status")).toHaveTextContent("You're subscribed.");
    expect(screen.queryByLabelText(/Email address/)).not.toBeInTheDocument();
  });

  it("supports custom heading, label, and submit button text", () => {
    render(
      <NewsletterSignup
        onSubmit={() => {}}
        heading="Stay in the loop"
        label="Your email"
        submitLabel="Subscribe"
      />,
    );
    expect(screen.getByText("Stay in the loop")).toBeInTheDocument();
    expect(screen.getByLabelText(/Your email/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("forwards a ref to the form element", () => {
    const ref = createRef<HTMLFormElement>();
    render(<NewsletterSignup onSubmit={() => {}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(<NewsletterSignup onSubmit={() => {}} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
