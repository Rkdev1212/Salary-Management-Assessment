import type { AuthUser } from "@repo/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
	user: AuthUser | null;
	isAuthenticated: boolean;
	setUser: (user: AuthUser | null) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			setUser: (user) => set({ user, isAuthenticated: !!user }),
			logout: () => {
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				set({ user: null, isAuthenticated: false });
			},
		}),
		{
			name: "auth-storage",
		},
	),
);
