import { useState, type FormEvent, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Form } from "./Form";

function Fields(): ReactNode {
  return (
    <>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" />
    </>
  );
}

function ControlledForm({
  onSubmit,
}: {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    onSubmit?.(event);
    setErrors({
      name: "Enter your name.",
      email: "Enter a valid email address.",
    });
  }

  return (
    <Form onSubmit={handleSubmit} errors={errors}>
      <Fields />
      <button type="submit">Submit</button>
    </Form>
  );
}

describe("Form", () => {
  it("renders children inside a real <form> element", () => {
    render(
      <Form>
        <Fields />
      </Form>,
    );
    const nameField = screen.getByLabelText("Name");
    expect(nameField).toBeInTheDocument();
    expect(nameField.closest("form")).toBeInstanceOf(HTMLFormElement);
  });

  it("does not render an error summary when errors is empty or omitted", () => {
    const { rerender } = render(
      <Form>
        <Fields />
      </Form>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    rerender(
      <Form errors={{}}>
        <Fields />
      </Form>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders an error summary listing each field's error when errors is non-empty", () => {
    render(
      <Form
        errors={{
          name: "Enter your name.",
          email: "Enter a valid email address.",
        }}
      >
        <Fields />
      </Form>,
    );
    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent("There is a problem");
    expect(screen.getByRole("link", { name: "Enter your name." })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Enter a valid email address." }),
    ).toBeInTheDocument();
  });

  it("supports a custom summary heading", () => {
    render(
      <Form errors={{ name: "Enter your name." }} summaryHeading="Fix these errors">
        <Fields />
      </Form>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Fix these errors");
  });

  it("focuses the matching field when an error summary link is activated", async () => {
    const user = userEvent.setup();
    render(
      <Form errors={{ email: "Enter a valid email address." }}>
        <Fields />
      </Form>,
    );
    await user.click(screen.getByRole("link", { name: "Enter a valid email address." }));
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("calls the consumer's onSubmit and prevents the native form submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      expect(event.defaultPrevented).toBe(true);
    });
    render(
      <Form onSubmit={handleSubmit}>
        <Fields />
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("moves focus to the error summary after a failed submit", async () => {
    const user = userEvent.setup();
    render(<ControlledForm />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Submit" }));

    const summary = await screen.findByRole("alert");
    await waitFor(() => expect(summary).toHaveFocus());
  });

  it("does not steal focus when errors are already present on initial mount", () => {
    render(
      <Form errors={{ name: "Enter your name." }}>
        <Fields />
      </Form>,
    );
    expect(screen.getByRole("alert")).not.toHaveFocus();
  });

  it("has no axe violations with no errors", async () => {
    const { container } = render(
      <Form>
        <Fields />
      </Form>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("has no axe violations with the error summary present", async () => {
    const { container } = render(
      <Form
        errors={{ name: "Enter your name.", email: "Enter a valid email address." }}
      >
        <Fields />
      </Form>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
