import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { EmployeesPage } from "@/pages/employees";
import { ProtectedRoute } from "@/components/auth/protected-route";

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
