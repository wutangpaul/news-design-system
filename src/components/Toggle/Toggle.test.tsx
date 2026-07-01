import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Toggle } from "./Toggle";

const viewOptions = [
  { label: "Article", value: "article" },
  { label: "Photos", value: "photos" },
];

function SingleToggle() {
  const [value, setValue] = useState("article");
  return (
    <Toggle
      aria-label="View"
      options={viewOptions}
      value={value}
      onChange={setValue}
    />
  );
}

const filterOptions = [
  { label: "Sports", value: "sports" },
  { label: "Politics", value: "politics" },
  { label: "Culture", value: "culture" },
];

function MultipleToggle() {
  const [value, setValue] = useState<string[]>(["sports"]);
  return (
    <Toggle
      aria-label="Filters"
      type="multiple"
      options={filterOptions}
      value={value}
      onChange={setValue}
    />
  );
}

describe("Toggle", () => {
  it("renders a labeled group of buttons", () => {
    render(<SingleToggle />);
    const group = screen.getByRole("group", { name: "View" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Article" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Photos" })).toBeInTheDocument();
  });

  it("reflects single selection via aria-pressed and keeps exactly one option pressed", async () => {
    const user = userEvent.setup();
    render(<SingleToggle />);
    expect(screen.getByRole("button", { name: "Article" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Photos" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await user.click(screen.getByRole("button", { name: "Photos" }));
    expect(screen.getByRole("button", { name: "Photos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Article" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("supports multiple independent selections with aria-pressed per option", async () => {
    const user = userEvent.setup();
    render(<MultipleToggle />);
    expect(screen.getByRole("button", { name: "Sports" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Culture" }));
    expect(screen.getByRole("button", { name: "Sports" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Culture" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Toggling off works independently.
    await user.click(screen.getByRole("button", { name: "Sports" }));
    expect(screen.getByRole("button", { name: "Sports" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("disables every option when the group is disabled", () => {
    render(
      <Toggle
        aria-label="View"
        options={viewOptions}
        value="article"
        onChange={() => {}}
        disabled
      />,
    );
    expect(screen.getByRole("button", { name: "Article" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Photos" })).toBeDisabled();
  });

  it("disables a single option via per-option disabled", () => {
    render(
      <Toggle
        aria-label="View"
        options={[
          { label: "Article", value: "article" },
          { label: "Photos", value: "photos", disabled: true },
        ]}
        value="article"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Article" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Photos" })).toBeDisabled();
  });

  it("is keyboard operable via native button semantics", async () => {
    const user = userEvent.setup();
    render(<SingleToggle />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Article" })).toHaveFocus();
    await user.keyboard("{Enter}");
    // still article (already selected); tab to photos and activate with space
    await user.tab();
    expect(screen.getByRole("button", { name: "Photos" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "Photos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
