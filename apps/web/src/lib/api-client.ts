import type { ApiError, ApiResponse } from "@repo/types";
import axios, { type AxiosInstance, type AxiosError } from "axios";

// Global declaration for import.meta.env
declare global {
	interface ImportMeta {
		env: {
			readonly VITE_API_URL?: string;
		};
	}
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3010/api";

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		// Request interceptor
		this.client.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("accessToken");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// Response interceptor
		this.client.interceptors.response.use(
			(response) => response,
			async (error: AxiosError<ApiError>) => {
				const originalRequest = error.config;

				// Handle 401 errors
				if (error.response?.status === 401 && originalRequest) {
					const refreshToken = localStorage.getItem("refreshToken");

					if (refreshToken) {
						try {
							const response = await axios.post<ApiResponse>(
								`${API_URL}/auth/refresh`,
								{
									refreshToken,
								},
							);

							const { accessToken, refreshToken: newRefreshToken } = response
								.data.data as {
								accessToken: string;
								refreshToken: string;
							};

							localStorage.setItem("accessToken", accessToken);
							localStorage.setItem("refreshToken", newRefreshToken);

							originalRequest.headers.Authorization = `Bearer ${accessToken}`;
							return this.client(originalRequest);
						} catch {
							// Refresh failed, logout
							localStorage.removeItem("accessToken");
							localStorage.removeItem("refreshToken");
							window.location.href = "/login";
						}
					} else {
						window.location.href = "/login";
					}
				}

				return Promise.reject(error);
			},
		);
	}

	async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
		const response = await this.client.get<ApiResponse<T>>(url, { params });
		return response.data.data as T;
	}

	async post<T>(url: string, data?: unknown): Promise<T> {
		const response = await this.client.post<ApiResponse<T>>(url, data);
		return response.data.data as T;
	}

	async put<T>(url: string, data?: unknown): Promise<T> {
		const response = await this.client.put<ApiResponse<T>>(url, data);
		return response.data.data as T;
	}

	async delete<T>(url: string): Promise<T> {
		const response = await this.client.delete<ApiResponse<T>>(url);
		return response.data.data as T;
	}
}

export const apiClient = new ApiClient();
