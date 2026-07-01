import { describe, expect, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";
import { ToastProvider } from "./ToastProvider";
import { ToastViewport } from "./ToastViewport";
import { useToast } from "./useToast";

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast (presentational)", () => {
  it("uses role=status/aria-live=polite for non-error variants", () => {
    render(<Toast variant="success" title="Published" />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
  });

  it("uses role=alert/aria-live=assertive for the error variant", () => {
    render(<Toast variant="error" title="Publish failed" />);
    const region = screen.getByRole("alert");
    expect(region).toHaveAttribute("aria-live", "assertive");
  });

  it("is dismissible via the close button and via Escape", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Toast title="Saved" onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: /dismiss notification/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    screen.getByRole("status").focus();
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});

describe("useToast / ToastProvider / ToastViewport", () => {
  it("throws when used outside a ToastProvider", () => {
    const { result } = renderHook(() => {
      try {
        useToast();
        return null;
      } catch (error) {
        return error;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
  });

  it("queues a toast from anywhere via the hook and renders it in the viewport", async () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    const user = userEvent.setup();

    act(() => {
      result.current.toast({
        title: "Saved",
        description: "Draft saved successfully.",
        variant: "success",
      });
    });

    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Draft saved successfully.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /dismiss notification/i }));
    await waitFor(() => expect(screen.queryByText("Saved")).not.toBeInTheDocument());
  });

  it("auto-dismisses after the given duration", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast({ title: "Auto-dismiss me", duration: 1000 });
    });
    expect(screen.getByText("Auto-dismiss me")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(screen.queryByText("Auto-dismiss me")).not.toBeInTheDocument();
  });

  it("pauses the auto-dismiss timer on hover and resumes the remaining time on leave", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.toast({ title: "Hover me", duration: 1000 });
    });
    const toastEl = screen.getByText("Hover me").closest('[role="status"]') as HTMLElement;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
    fireEvent.mouseEnter(toastEl);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    // Still present: hovering paused the timer before it elapsed.
    expect(screen.getByText("Hover me")).toBeInTheDocument();

    fireEvent.mouseLeave(toastEl);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(199);
    });
    expect(screen.getByText("Hover me")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(screen.queryByText("Hover me")).not.toBeInTheDocument();
  });

  it("renders an assertive alert for error-variant toasts", async () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.toast({ title: "Publish failed", variant: "error" });
    });

    const region = await screen.findByRole("alert");
    expect(region).toHaveAttribute("aria-live", "assertive");
  });
});
