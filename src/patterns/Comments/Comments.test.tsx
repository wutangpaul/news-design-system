import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Comment, Comments, type CommentData } from "./Comments";

const comments: CommentData[] = [
  {
    id: "c1",
    author: { name: "Jordan Reyes" },
    timestamp: "2026-06-29T14:32:00Z",
    body: "This is a really thorough breakdown.",
    replies: [
      {
        id: "c1-r1",
        author: { name: "Priya Nair" },
        timestamp: "2026-06-29T14:48:00Z",
        body: "Agreed!",
      },
    ],
  },
  {
    id: "c2",
    author: { name: "Sam Okafor" },
    timestamp: "2026-06-29T15:10:00Z",
    body: "Any update on the smaller markets?",
  },
];

describe("Comment", () => {
  it("renders author, machine-readable timestamp, and body", () => {
    render(
      <ol>
        <Comment comment={comments[0]!} />
      </ol>,
    );
    expect(screen.getByText("Jordan Reyes", { selector: "span.font-semibold" })).toBeInTheDocument();
    expect(screen.getByText("This is a really thorough breakdown.")).toBeInTheDocument();
    const byline = screen.getByText("Jordan Reyes", { selector: "span.font-semibold" });
    const time = byline.closest("li")!.querySelector("time")!;
    expect(time).toHaveAttribute("dateTime", "2026-06-29T14:32:00Z");
  });

  it("renders nested replies", () => {
    render(
      <ol>
        <Comment comment={comments[0]!} />
      </ol>,
    );
    expect(screen.getByText("Priya Nair", { selector: "span.font-semibold" })).toBeInTheDocument();
    expect(screen.getByText("Agreed!")).toBeInTheDocument();
  });

  it("does not render a Reply control when onReply is omitted", () => {
    render(
      <ol>
        <Comment comment={comments[1]!} />
      </ol>,
    );
    expect(screen.queryByRole("button", { name: /reply/i })).not.toBeInTheDocument();
  });

  it("fires onReply with the comment id", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn();
    render(
      <ol>
        <Comment comment={comments[1]!} onReply={onReply} />
      </ol>,
    );
    await user.click(screen.getByRole("button", { name: "Reply to Sam Okafor" }));
    expect(onReply).toHaveBeenCalledWith("c2");
  });
});

describe("Comments", () => {
  it("renders every top-level comment", () => {
    render(<Comments comments={comments} />);
    expect(screen.getByText("Jordan Reyes", { selector: "span.font-semibold" })).toBeInTheDocument();
    expect(screen.getByText("Sam Okafor", { selector: "span.font-semibold" })).toBeInTheDocument();
  });

  it("shows an empty state when there are no comments", () => {
    render(<Comments comments={[]} />);
    expect(screen.getByText("No comments yet.")).toBeInTheDocument();
  });

  it("supports a custom empty message", () => {
    render(<Comments comments={[]} emptyMessage="Be the first to comment." />);
    expect(screen.getByText("Be the first to comment.")).toBeInTheDocument();
  });

  it("hides the composer when onSubmit is omitted", () => {
    render(<Comments comments={comments} />);
    expect(screen.queryByLabelText("Add a comment")).not.toBeInTheDocument();
  });

  it("submits the trimmed draft body and clears the field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Comments comments={comments} onSubmit={onSubmit} />);

    const textarea = screen.getByLabelText("Add a comment");
    await user.type(textarea, "  A thoughtful reply.  ");
    await user.click(screen.getByRole("button", { name: "Post comment" }));

    expect(onSubmit).toHaveBeenCalledWith("A thoughtful reply.");
    expect(textarea).toHaveValue("");
  });

  it("does not submit an empty/whitespace-only draft", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Comments comments={comments} onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: "Post comment" });
    expect(submitButton).toBeDisabled();
    await user.type(screen.getByLabelText("Add a comment"), "   ");
    expect(submitButton).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("propagates onReply through to nested replies", async () => {
    const user = userEvent.setup();
    const onReply = vi.fn();
    render(<Comments comments={comments} onReply={onReply} />);
    await user.click(screen.getByRole("button", { name: "Reply to Priya Nair" }));
    expect(onReply).toHaveBeenCalledWith("c1-r1");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Comments comments={comments} onReply={vi.fn()} onSubmit={vi.fn()} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
