import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import {
	Bell,
	ChevronLeft,
	ChevronRight,
	HelpCircle,
	LayoutDashboard,
	LogOut,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

// ── Navigation structure ──────────────────────────────────────────────────────
const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Employees", href: "/employees", icon: Users },
];

const bottomNavigation = [
	{ name: "Notifications", icon: Bell },
	{ name: "Help", icon: HelpCircle },
];

// ── Hooks ────────────────────────────────────────────────────────────────────
function useWindowWidth() {
	const [width, setWidth] = useState(window.innerWidth);
	useEffect(() => {
		const handler = () => setWidth(window.innerWidth);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	return width;
}

// ── NavItem ──────────────────────────────────────────────────────────────────
function NavItem({
	item,
	collapsed,
	pathname,
	onNavigate,
}: {
	item: { name: string; href: string; icon: React.ElementType };
	collapsed: boolean;
	pathname: string;
	onNavigate: () => void;
}) {
	const isActive = pathname === item.href || pathname.startsWith(item.href);
	const Icon = item.icon;

	// ── Collapsed: just icon ──
	if (collapsed) {
		return (
			<Link
				to={item.href}
				onClick={onNavigate}
				title={item.name}
				style={{
					width: 44,
					height: 44,
					borderRadius: 12,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "0 auto",
					textDecoration: "none",
					background: isActive ? "#1a7fd4" : "transparent",
					color: isActive ? "#fff" : "#94a3b8",
					transition: "all 0.2s",
				}}
			>
				<Icon size={20} />
			</Link>
		);
	}

	// ── Expanded: pill-style button ──
	return (
		<Link
			to={item.href}
			onClick={onNavigate}
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "11px 18px",
				borderRadius: 16,
				textDecoration: "none",
				background: isActive ? "#1a7fd4" : "transparent",
				color: isActive ? "#fff" : "#94a3b8",
				fontWeight: isActive ? 600 : 500,
				fontSize: "0.95rem",
				transition: "all 0.2s",
			}}
			onMouseEnter={(e) => {
				if (!isActive) {
					(e.currentTarget as HTMLElement).style.background = "#f1f5f9";
					(e.currentTarget as HTMLElement).style.color = "#64748b";
				}
			}}
			onMouseLeave={(e) => {
				if (!isActive) {
					(e.currentTarget as HTMLElement).style.background = "transparent";
					(e.currentTarget as HTMLElement).style.color = "#94a3b8";
				}
			}}
		>
			<Icon size={20} />
			{item.name}
		</Link>
	);
}

// ── SidebarContent ───────────────────────────────────────────────────────────
function SidebarContent({
	collapsed,
	setCollapsed,
	location,
	onLogout,
	onNavigate,
}: {
	collapsed: boolean;
	setCollapsed: (v: boolean) => void;
	location: { pathname: string };
	onLogout: () => void;
	onNavigate: () => void;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				background: "#fafbfc",
			}}
		>
			{/* ── Logo / Header ── */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: collapsed ? "center" : "space-between",
					padding: collapsed ? "20px 0" : "20px 16px",
					minHeight: 76,
					position: "relative",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						overflow: "hidden",
					}}
				>
					{/* App icon — rounded square blue */}
					<div
						style={{
							width: 48,
							height: 48,
							borderRadius: 14,
							background: "linear-gradient(135deg,#3b9eff,#1a7fd4)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
							boxShadow: "0 4px 14px rgba(26,127,212,0.25)",
						}}
					>
						<svg
							width="26"
							height="26"
							viewBox="0 0 38 38"
							fill="none"
							role="img"
							aria-label="App Logo"
						>
							<title>App Logo</title>
							<path
								d="M8 10 C8 10 14 6 19 10 C24 14 30 10 30 10"
								stroke="white"
								strokeWidth="3"
								strokeLinecap="round"
								fill="none"
							/>
							<path
								d="M8 19 C8 19 14 15 19 19 C24 23 30 19 30 19"
								stroke="white"
								strokeWidth="3"
								strokeLinecap="round"
								fill="none"
							/>
							<path
								d="M8 28 C8 28 14 24 19 28 C24 32 30 28 30 28"
								stroke="white"
								strokeWidth="3"
								strokeLinecap="round"
								fill="none"
							/>
						</svg>
					</div>

					{!collapsed && (
						<div style={{ overflow: "hidden" }}>
							<div
								style={{
									fontWeight: 700,
									fontSize: "1.1rem",
									color: "#0f172a",
									whiteSpace: "nowrap",
								}}
							>
								SMS
							</div>
							<div
								style={{
									fontSize: "0.75rem",
									color: "#94a3b8",
									whiteSpace: "nowrap",
								}}
							>
								Admin Panel
							</div>
						</div>
					)}
				</div>

				{/* Collapse / expand button */}
				{!collapsed && (
					<button
						type="button"
						onClick={() => setCollapsed(true)}
						style={{
							background: "transparent",
							border: "none",
							width: 28,
							height: 28,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							color: "#94a3b8",
							flexShrink: 0,
						}}
					>
						<ChevronLeft size={18} />
					</button>
				)}
			</div>

			{/* ── Nav items ── */}
			<nav
				style={{
					flex: 1,
					padding: collapsed ? "12px 14px" : "12px 16px",
					display: "flex",
					flexDirection: "column",
					gap: 6,
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{navigation.map((item) => (
					<NavItem
						key={item.name}
						item={item}
						collapsed={collapsed}
						pathname={location.pathname}
						onNavigate={onNavigate}
					/>
				))}
			</nav>

			{/* ── Bottom section: Notifications, Help, Logout ── */}
			<div
				style={{
					padding: collapsed ? "16px 14px" : "16px 16px",
					borderTop: "1px solid #e8edf3",
					display: "flex",
					flexDirection: "column",
					gap: 6,
				}}
			>
				{bottomNavigation.map((item) => {
					const Icon = item.icon;
					if (collapsed) {
						return (
							<button
								key={item.name}
								type="button"
								title={item.name}
								style={{
									width: 44,
									height: 44,
									borderRadius: 12,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto",
									background: "transparent",
									border: "none",
									color: "#94a3b8",
									cursor: "pointer",
									transition: "all 0.2s",
								}}
								onMouseEnter={(e) => {
									(e.currentTarget as HTMLElement).style.background = "#f1f5f9";
									(e.currentTarget as HTMLElement).style.color = "#64748b";
								}}
								onMouseLeave={(e) => {
									(e.currentTarget as HTMLElement).style.background =
										"transparent";
									(e.currentTarget as HTMLElement).style.color = "#94a3b8";
								}}
							>
								<Icon size={20} />
							</button>
						);
					}
					return (
						<button
							key={item.name}
							type="button"
							style={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								gap: 12,
								padding: "11px 18px",
								borderRadius: 16,
								border: "none",
								background: "transparent",
								color: "#94a3b8",
								fontWeight: 500,
								fontSize: "0.95rem",
								cursor: "pointer",
								textAlign: "left",
								transition: "all 0.2s",
								fontFamily: "inherit",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.background = "#f1f5f9";
								(e.currentTarget as HTMLElement).style.color = "#64748b";
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.background =
									"transparent";
								(e.currentTarget as HTMLElement).style.color = "#94a3b8";
							}}
						>
							<Icon size={20} />
							{item.name}
						</button>
					);
				})}

				{/* Logout button */}
				<button
					type="button"
					onClick={onLogout}
					title={collapsed ? "Logout" : undefined}
					style={{
						width: collapsed ? 44 : "100%",
						display: "flex",
						alignItems: "center",
						gap: 12,
						padding: collapsed ? "0" : "11px 18px",
						height: collapsed ? 44 : "auto",
						justifyContent: collapsed ? "center" : "flex-start",
						margin: collapsed ? "0 auto" : "0",
						borderRadius: 16,
						border: "none",
						background: "transparent",
						color: "#94a3b8",
						fontWeight: 500,
						fontSize: "0.95rem",
						cursor: "pointer",
						transition: "all 0.2s",
						fontFamily: "inherit",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.background = "#fef2f2";
						(e.currentTarget as HTMLElement).style.color = "#ef4444";
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.background = "transparent";
						(e.currentTarget as HTMLElement).style.color = "#94a3b8";
					}}
				>
					<LogOut size={20} />
					{!collapsed && "Logout"}
				</button>
			</div>
		</div>
	);
}

// ── DashboardLayout ──────────────────────────────────────────────────────────
export function DashboardLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuthStore();
	const windowWidth = useWindowWidth();
	const isDesktop = windowWidth >= 1024;

	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const { pathname } = location;
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the only dep needed
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	const sidebarWidth = collapsed ? 72 : 220;

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
		<div
			style={{
				minHeight: "100vh",
				background: "#f8fafc",
				fontFamily: "'Segoe UI', system-ui, sans-serif",
			}}
		>
			{/* ── Desktop Sidebar ── */}
			{isDesktop && (
				<>
					<aside
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							bottom: 0,
							width: sidebarWidth,
							background: "#fafbfc",
							borderRight: "1px solid #e8edf3",
							boxShadow: "1px 0 8px rgba(0,0,0,0.02)",
							transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
							zIndex: 50,
							overflow: "visible",
						}}
					>
						<SidebarContent
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							location={location}
							onLogout={handleLogout}
							onNavigate={() => {}}
						/>
					</aside>

					{/* Toggle button - appears when collapsed */}
					{collapsed && (
						<button
							type="button"
							onClick={() => setCollapsed(false)}
							style={{
								position: "fixed",
								left: sidebarWidth + 10,
								top: 32,
								width: 28,
								height: 28,
								borderRadius: "50%",
								background: "#fff",
								border: "1px solid #e2e8f0",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								color: "#64748b",
								boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
								zIndex: 51,
								transition: "all 0.2s",
							}}
							onMouseEnter={(e) => {
								const target = e.currentTarget as HTMLElement;
								target.style.background = "#f8fafc";
								target.style.color = "#1a7fd4";
							}}
							onMouseLeave={(e) => {
								const target = e.currentTarget as HTMLElement;
								target.style.background = "#fff";
								target.style.color = "#64748b";
							}}
						>
							<ChevronRight size={16} />
						</button>
					)}
				</>
			)}

			{/* ── Mobile overlay + drawer ── */}
			{!isDesktop && (
				<>
					{mobileOpen && (
						<div
							onClick={() => setMobileOpen(false)}
							onKeyDown={(e) => {
								if (e.key === "Escape") setMobileOpen(false);
							}}
							role="button"
							tabIndex={0}
							style={{
								position: "fixed",
								inset: 0,
								background: "rgba(0,0,0,0.35)",
								zIndex: 49,
								backdropFilter: "blur(2px)",
							}}
						/>
					)}
					<aside
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							bottom: 0,
							width: 220,
							background: "#fafbfc",
							borderRight: "1px solid #e8edf3",
							boxShadow: "2px 0 16px rgba(0,0,0,0.06)",
							zIndex: 50,
							transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
							transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
						}}
					>
						<SidebarContent
							collapsed={false}
							setCollapsed={() => {}}
							location={location}
							onLogout={handleLogout}
							onNavigate={() => setMobileOpen(false)}
						/>
					</aside>
				</>
			)}

			{/* ── Main content ── */}
			<main
				style={{
					marginLeft: isDesktop ? sidebarWidth : 0,
					transition: "margin-left 0.22s cubic-bezier(.4,0,.2,1)",
					minHeight: "100vh",
				}}
			>
				<div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px" }}>
					<Outlet />
				</div>
			</main>

			<style>{`
        @media (max-width: 1023px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 1024px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
		</div>
	);
}
