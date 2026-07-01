import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and forwards a ref to the DOM node", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("defaults to type=button so it never accidentally submits a form", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("fires onClick when activated via mouse", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard operable via Enter and Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "Click me" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is disabled and non-interactive when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click me
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a spinner and marks aria-busy while loading, hiding the icons", () => {
    const { container } = render(
      <Button isLoading leadingIcon={<span data-testid="leading" />}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(container.querySelector("svg.animate-spin")).toBeInTheDocument();
    expect(screen.queryByTestId("leading")).not.toBeInTheDocument();
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button.className).toContain("bg-error-500");
    expect(button.className).toContain("h-12");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Button>Accessible button</Button>);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
