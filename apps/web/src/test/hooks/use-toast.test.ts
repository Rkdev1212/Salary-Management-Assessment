import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toast, useToast } from "@repo/ui";

describe("useToast", () => {
	it("adds a toast", () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.toast({
				title: "Test Toast",
				description: "This is a test",
			});
		});

		expect(result.current.toasts).toHaveLength(1);
		expect(result.current.toasts[0]?.title).toBe("Test Toast");
	});

	it("dismisses a toast", () => {
		const { result } = renderHook(() => useToast());

		let toastId: string;

		act(() => {
			const { id } = result.current.toast({
				title: "Test Toast",
			});
			toastId = id;
		});

		expect(result.current.toasts).toHaveLength(1);

		act(() => {
			result.current.dismiss(toastId);
		});

		// Toast should be marked as not open
		expect(result.current.toasts[0]?.open).toBe(false);
	});

	it("limits toast count", () => {
		const { result } = renderHook(() => useToast());

		act(() => {
			result.current.toast({ title: "Toast 1" });
			result.current.toast({ title: "Toast 2" });
		});

		// Should only keep the most recent toast (TOAST_LIMIT = 1)
		expect(result.current.toasts).toHaveLength(1);
		expect(result.current.toasts[0]?.title).toBe("Toast 2");
	});

	it("toast function works independently", () => {
		act(() => {
			const result = toast({ title: "Independent Toast" });
			expect(result.id).toBeDefined();
			expect(result.dismiss).toBeDefined();
			expect(result.update).toBeDefined();
		});
	});
});
