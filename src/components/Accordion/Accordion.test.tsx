import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";

describe("Accordion", () => {
  it("renders triggers as buttons inside heading elements", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="a">
          <AccordionTrigger>Heading A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole("button", { name: "Heading A" });
    expect(button.tagName).toBe("BUTTON");
    expect(button.closest("h3")).not.toBeNull();
  });

  it("toggles aria-expanded and content visibility on click", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="a">
          <AccordionTrigger>Heading A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole("button", { name: "Heading A" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Content A")).not.toBeVisible();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Content A")).toBeVisible();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Content A")).not.toBeVisible();
  });

  it("relates trigger and content via aria-controls/id and aria-labelledby", () => {
    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Heading A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole("button", { name: "Heading A" });
    const content = screen.getByText("Content A");
    expect(button.getAttribute("aria-controls")).toBe(content.id);
    expect(content.getAttribute("aria-labelledby")).toBe(button.id);
  });

  it("type=single allows only one item open at a time", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Content A")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByText("Content B")).toBeVisible();
    expect(screen.getByText("Content A")).not.toBeVisible();
  });

  it("type=multiple allows several items open at once", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple" defaultValue={["a"]}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>Content B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByText("Content A")).toBeVisible();
    expect(screen.getByText("Content B")).toBeVisible();
  });

  it("single + collapsible=false keeps the open item open when re-activated", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" defaultValue="a" collapsible={false}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole("button", { name: "A" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("does not toggle a disabled item", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single">
        <AccordionItem value="a" disabled>
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole("button", { name: "A" });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onValueChange with the new value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" onValueChange={onValueChange}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "A" }));
    expect(onValueChange).toHaveBeenCalledWith("a");
  });
});
