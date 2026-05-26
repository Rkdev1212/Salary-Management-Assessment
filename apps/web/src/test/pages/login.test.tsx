import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "@/pages/login";

vi.mock("@/services/auth.service", () => ({
	authService: {
		login: vi.fn(),
	},
}));

vi.mock("@/store/auth.store", () => ({
	useAuthStore: () => ({
		login: vi.fn(),
	}),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<BrowserRouter>{children}</BrowserRouter>
);

describe("LoginPage", () => {
	it("renders login form", () => {
		render(<LoginPage />, { wrapper });

		expect(screen.getByText(/welcome/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /sign in/i }),
		).toBeInTheDocument();
	});

	it("displays email and password fields", () => {
		render(<LoginPage />, { wrapper });

		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText(/password/i);

		expect(emailInput).toHaveAttribute("type", "email");
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("has a submit button", () => {
		render(<LoginPage />, { wrapper });

		const submitButton = screen.getByRole("button", { name: /sign in/i });
		expect(submitButton).toHaveAttribute("type", "submit");
	});
});
