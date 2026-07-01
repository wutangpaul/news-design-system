import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination, getPaginationItems } from "./Pagination";

describe("getPaginationItems", () => {
  it("shows every page when the total fits without truncation", () => {
    expect(getPaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("truncates with a single ellipsis near the start", () => {
    expect(getPaginationItems(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
  });

  it("truncates with a single ellipsis near the end", () => {
    expect(getPaginationItems(20, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
  });

  it("truncates with ellipses on both sides in the middle", () => {
    expect(getPaginationItems(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
  });
});

describe("Pagination", () => {
  it("renders a nav labelled Pagination", () => {
    render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("marks the current page with aria-current=page", () => {
    render(<Pagination page={3} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Page 2" })).not.toHaveAttribute("aria-current");
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();

    rerender(<Pagination page={5} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onPageChange with the target page when a page button is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with page +/- 1 when Next/Previous are clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders an ellipsis as decorative for large page counts", () => {
    render(<Pagination page={10} pageCount={50} onPageChange={vi.fn()} />);
    const ellipses = screen.getAllByText("…");
    expect(ellipses.length).toBeGreaterThan(0);
    ellipses.forEach((el) => expect(el).toHaveAttribute("aria-hidden", "true"));
  });

  it("can hide the Previous/Next controls", () => {
    render(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} hidePrevNext />);
    expect(screen.queryByRole("button", { name: "Previous page" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next page" })).not.toBeInTheDocument();
  });
});
