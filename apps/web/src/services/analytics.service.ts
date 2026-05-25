import { apiClient } from "@/lib/api-client";
import type { AnalyticsDashboard } from "@repo/types";

export const analyticsService = {
	async getDashboard(): Promise<AnalyticsDashboard> {
		return apiClient.get("/analytics/dashboard");
	},
};
