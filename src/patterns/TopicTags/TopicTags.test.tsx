import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TopicTags, type TopicTagItem } from "./TopicTags";

const linkedTopics: TopicTagItem[] = [
  { id: "climate", label: "Climate", href: "/topics/climate" },
  { id: "politics", label: "Politics", href: "/topics/politics" },
];

describe("TopicTags", () => {
  it("renders a link for topics with an href", () => {
    render(<TopicTags topics={linkedTopics} />);
    const link = screen.getByRole("link", { name: "Climate" });
    expect(link).toHaveAttribute("href", "/topics/climate");
  });

  it("renders an interactive chip button for topics with onClick and no href", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TopicTags topics={[{ id: "economy", label: "Economy", onClick }]} />);
    const button = screen.getByRole("button", { name: "Economy" });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reflects selected state via aria-pressed on interactive chips", () => {
    render(
      <TopicTags topics={[{ id: "economy", label: "Economy", onClick: vi.fn(), selected: true }]} />,
    );
    expect(screen.getByRole("button", { name: "Economy" })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not show a toggle when under maxVisible", () => {
    render(<TopicTags topics={linkedTopics} maxVisible={5} />);
    expect(screen.queryByRole("button", { name: /show/i })).not.toBeInTheDocument();
  });

  it("shows a Show more toggle when over maxVisible, and expands on click", async () => {
    const user = userEvent.setup();
    const topics: TopicTagItem[] = ["A", "B", "C", "D"].map((label) => ({
      id: label,
      label,
      href: `/topics/${label}`,
    }));
    render(<TopicTags topics={topics} maxVisible={2} />);

    expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "D" })).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "Show 2 more" });
    await user.click(toggle);

    expect(screen.getByRole("link", { name: "D" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
  });

  it("supports a custom showMoreLabel", () => {
    const topics: TopicTagItem[] = ["A", "B", "C"].map((label) => ({
      id: label,
      label,
      href: `/topics/${label}`,
    }));
    render(<TopicTags topics={topics} maxVisible={1} showMoreLabel="See all topics" />);
    expect(screen.getByRole("button", { name: "See all topics" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<TopicTags topics={linkedTopics} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
