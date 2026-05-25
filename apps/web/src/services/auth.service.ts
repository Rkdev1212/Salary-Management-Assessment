import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginDto, RegisterDto } from "@repo/types";

export const authService = {
	async login(data: LoginDto): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/login", data);
		localStorage.setItem("accessToken", response.tokens.accessToken);
		localStorage.setItem("refreshToken", response.tokens.refreshToken);
		return response;
	},

	async register(data: RegisterDto): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/register", data);
		localStorage.setItem("accessToken", response.tokens.accessToken);
		localStorage.setItem("refreshToken", response.tokens.refreshToken);
		return response;
	},

	async logout(): Promise<void> {
		await apiClient.post("/auth/logout");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	},

	async getMe(): Promise<AuthResponse["user"]> {
		return apiClient.get("/auth/me");
	},
};
