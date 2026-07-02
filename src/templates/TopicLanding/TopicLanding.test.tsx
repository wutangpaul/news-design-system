import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TopicLanding } from "./TopicLanding";
import type { TopicLandingProps } from "./TopicLanding";

const baseProps: TopicLandingProps = {
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
  topicName: "2026 Midterms: Full Coverage",
  content: <div>Topic content</div>,
};

describe("TopicLanding", () => {
  it("renders the GlobalHeader chrome", () => {
    render(<TopicLanding {...baseProps} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "The Daily Ledger" })).toBeInTheDocument();
  });

  it("renders the Footer chrome", () => {
    render(<TopicLanding {...baseProps} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "World" })).toBeInTheDocument();
  });

  it("renders topicName as the page's own h1", () => {
    render(<TopicLanding {...baseProps} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "2026 Midterms: Full Coverage" }),
    ).toBeInTheDocument();
  });

  it("renders an optional description under the heading", () => {
    render(<TopicLanding {...baseProps} description="Updated as races develop." />);
    expect(screen.getByText("Updated as races develop.")).toBeInTheDocument();
  });

  it("renders the content slot", () => {
    render(<TopicLanding {...baseProps} />);
    expect(screen.getByText("Topic content")).toBeInTheDocument();
  });

  it("wraps content in a section labelled with the topic name", () => {
    render(<TopicLanding {...baseProps} />);
    expect(
      screen.getByRole("region", { name: "Coverage of 2026 Midterms: Full Coverage" }),
    ).toBeInTheDocument();
  });

  it("does not render a follow action when onFollowTopic is omitted", () => {
    render(<TopicLanding {...baseProps} />);
    expect(screen.queryByRole("button", { name: /follow/i })).not.toBeInTheDocument();
  });

  it("renders a follow action when onFollowTopic is provided, and calls it when clicked", async () => {
    const onFollowTopic = vi.fn();
    const user = userEvent.setup();
    render(<TopicLanding {...baseProps} onFollowTopic={onFollowTopic} />);

    const button = screen.getByRole("button", { name: "Follow this topic" });
    await user.click(button);
    expect(onFollowTopic).toHaveBeenCalledTimes(1);
  });

  it("reflects isFollowing in the button's label and aria-pressed state", () => {
    render(
      <TopicLanding {...baseProps} onFollowTopic={() => {}} isFollowing />,
    );
    const button = screen.getByRole("button", { name: "Following" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("supports custom follow/following labels", () => {
    render(
      <TopicLanding
        {...baseProps}
        onFollowTopic={() => {}}
        followLabel="Get updates"
        followingLabel="Getting updates"
        isFollowing
      />,
    );
    expect(screen.getByRole("button", { name: "Getting updates" })).toBeInTheDocument();
  });

  it("gives the main landmark a default id matching the skip link's target", () => {
    render(<TopicLanding {...baseProps} />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#main-content");
  });

  it("supports a custom main id", () => {
    render(<TopicLanding {...baseProps} mainId="topic-main" />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "topic-main");
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#topic-main");
  });

  it("forwards a ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TopicLanding {...baseProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TopicLanding {...baseProps} onFollowTopic={() => {}} description="Updated as races develop." />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
