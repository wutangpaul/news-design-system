import { useContext } from "react";
import { ToastContext } from "./ToastProvider";

/**
 * `const { toast } = useToast(); toast({ title: "Saved", variant: "success" });`
 *
 * Must be called beneath a `<ToastProvider>` (rendered once near the app root).
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>.");
  }
  return { toast: context.toast, dismiss: context.dismiss };
}
