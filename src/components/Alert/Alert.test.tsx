import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert, type AlertVariant } from "./Alert";

describe("Alert", () => {
  it("renders the message body and an optional title", () => {
    render(
      <Alert variant="info" title="Heads up">
        Your draft was saved.
      </Alert>,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Your draft was saved.")).toBeInTheDocument();
  });

  it.each<[AlertVariant, string, string]>([
    ["info", "status", "polite"],
    ["success", "status", "polite"],
    ["warning", "alert", "assertive"],
    ["error", "alert", "assertive"],
  ])("uses role=%s/aria-live=%s for the %s variant", (variant, role, live) => {
    render(<Alert variant={variant}>Message</Alert>);
    const region = screen.getByRole(role);
    expect(region).toHaveAttribute("aria-live", live);
  });

  it("pairs each variant with a distinguishing icon, not color alone", () => {
    render(<Alert variant="error">Something went wrong</Alert>);
    const icon = screen.getByRole("alert").querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("viewBox");
  });

  it("does not render a dismiss button by default", () => {
    render(<Alert>Message</Alert>);
    expect(screen.queryByRole("button", { name: /dismiss/i })).not.toBeInTheDocument();
  });

  it("dismisses on click, calling onDismiss and removing itself", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Message
      </Alert>,
    );

    await user.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Message")).not.toBeInTheDocument();
  });
});
