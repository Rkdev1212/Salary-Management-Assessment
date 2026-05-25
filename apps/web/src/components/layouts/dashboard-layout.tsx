import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Employees", href: "/employees", icon: Users },
];

export function DashboardLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await authService.logout();
			logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0",
					sidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="flex h-full flex-col">
					{/* Logo */}
					<div className="flex h-16 items-center border-b px-6">
						<h1 className="text-xl font-bold">Salary Manager</h1>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navigation.map((item) => {
							const isActive = location.pathname === item.href;
							return (
								<Link
									key={item.name}
									to={item.href}
									onClick={() => setSidebarOpen(false)}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
										isActive
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
									)}
								>
									<item.icon className="h-5 w-5" />
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* User section */}
					<div className="border-t p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
									{user?.firstName?.[0]}
									{user?.lastName?.[0]}
								</div>
								<div className="flex flex-col">
									<span className="text-sm font-medium">
										{user?.firstName} {user?.lastName}
									</span>
									<span className="text-xs text-muted-foreground">
										{user?.email}
									</span>
								</div>
							</div>
							<Button variant="ghost" size="icon" onClick={handleLogout}>
								<LogOut className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</aside>

			{/* Mobile sidebar toggle */}
			<div className="lg:hidden">
				<Button
					variant="ghost"
					size="icon"
					className="fixed left-4 top-4 z-40"
					onClick={() => setSidebarOpen(!sidebarOpen)}
				>
					<Menu className="h-6 w-6" />
				</Button>
			</div>

			{/* Main content */}
			<main className="lg:pl-64">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<Outlet />
				</div>
			</main>

			{/* Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
}
