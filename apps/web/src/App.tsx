import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Toaster } from "@repo/ui";
import { DashboardPage } from "@/pages/dashboard";
import { EmployeesPage } from "@/pages/employees";
import { LoginPage } from "@/pages/login";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
	return (
		<>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<DashboardLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="/dashboard" replace />} />
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="employees" element={<EmployeesPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
