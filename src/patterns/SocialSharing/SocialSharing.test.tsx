import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SocialSharing, type SocialSharePlatform } from "./SocialSharing";

const url = "https://example.com/articles/one";
const title = "Example headline";

function stubNavigatorProperty(name: "share" | "clipboard", value: unknown) {
  Object.defineProperty(navigator, name, {
    value,
    configurable: true,
    writable: true,
  });
}

describe("SocialSharing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error -- test-only cleanup of properties stubbed above
    delete navigator.share;
    // @ts-expect-error -- test-only cleanup of properties stubbed above
    delete navigator.clipboard;
  });

  it("renders a labelled group with Share and Copy link controls", () => {
    render(<SocialSharing url={url} title={title} />);
    expect(screen.getByRole("group", { name: "Share this article" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
  });

  it("uses the Web Share API when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    stubNavigatorProperty("share", share);
    const onShare = vi.fn();
    const user = userEvent.setup();

    render(<SocialSharing url={url} title={title} onShare={onShare} />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    expect(share).toHaveBeenCalledWith({ url, title });
    expect(onShare).not.toHaveBeenCalled();
  });

  it("falls back to onShare when the Web Share API is unavailable", async () => {
    const onShare = vi.fn();
    const user = userEvent.setup();

    render(<SocialSharing url={url} title={title} onShare={onShare} />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    expect(onShare).toHaveBeenCalledWith({ url, title });
  });

  it("copies the url to the clipboard and reports it via onCopyLink", async () => {
    // `userEvent.setup()` installs its own clipboard emulation on
    // `navigator.clipboard` (so `.copy()`/`.paste()` interactions work in
    // jsdom) — stub *after* setup so this test's mock isn't the one that
    // gets overwritten.
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubNavigatorProperty("clipboard", { writeText });
    const onCopyLink = vi.fn();

    render(<SocialSharing url={url} title={title} onCopyLink={onCopyLink} />);
    await user.click(screen.getByRole("button", { name: "Copy link" }));

    expect(writeText).toHaveBeenCalledWith(url);
    expect(onCopyLink).toHaveBeenCalledWith({ url, title });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Link copied" })).toBeInTheDocument(),
    );
  });

  it("renders one button per platform with a real accessible name", async () => {
    const onShareX = vi.fn();
    const platforms: SocialSharePlatform[] = [
      { id: "x", label: "Share on X", icon: <span aria-hidden="true">X</span>, onShare: onShareX },
    ];
    const user = userEvent.setup();

    render(<SocialSharing url={url} title={title} platforms={platforms} />);
    const button = screen.getByRole("button", { name: "Share on X" });
    await user.click(button);

    expect(onShareX).toHaveBeenCalledWith({ url, title });
  });

  it("forwards a ref to the wrapping element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SocialSharing url={url} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no axe violations", async () => {
    const platforms: SocialSharePlatform[] = [
      { id: "x", label: "Share on X", icon: <span aria-hidden="true">X</span>, onShare: () => {} },
    ];
    const { container } = render(
      <SocialSharing url={url} title={title} platforms={platforms} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
