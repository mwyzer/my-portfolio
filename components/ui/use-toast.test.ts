import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToast } from "@/components/ui/use-toast";

describe("useToast", () => {
  it("returns toast function and dismiss", () => {
    const { result } = renderHook(() => useToast());

    expect(typeof result.current.toast).toBe("function");
    expect(typeof result.current.dismiss).toBe("function");
    expect(Array.isArray(result.current.toasts)).toBe(true);
  });

  it("adds a toast with title and description", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Success", description: "Saved successfully!" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Success");
    expect(result.current.toasts[0].description).toBe("Saved successfully!");
    expect(result.current.toasts[0].open).toBe(true);
  });

  it("adds multiple toasts up to the limit (5)", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.toast({ title: `Toast ${i}` });
      }
    });

    expect(result.current.toasts.length).toBeLessThanOrEqual(5);
  });

  it("dismisses a specific toast by id", () => {
    const { result } = renderHook(() => useToast());

    let dismissId = "";
    act(() => {
      result.current.toast({ title: "Keep me" });
      const { id } = result.current.toast({ title: "Dismiss me" });
      dismissId = id;
    });

    act(() => {
      result.current.dismiss(dismissId);
    });

    const dismissed = result.current.toasts.find((t) => t.id === dismissId);
    expect(dismissed).toBeDefined();
    expect(dismissed?.open).toBe(false);
  });

  it("dismisses all toasts when called without id", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "First" });
      result.current.toast({ title: "Second" });
    });

    act(() => {
      result.current.dismiss();
    });

    // All should be marked as open: false
    expect(result.current.toasts.every((t) => t.open === false)).toBe(true);
  });
});
