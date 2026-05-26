import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import {
	ChevronLeft,
	ChevronRight,
	HelpCircle,
	LayoutDashboard,
	LogOut,
	Menu,
	Users,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

// ── Design tokens ─────────────────────────────────────────────────────────────
const TOKENS = {
	sidebar: {
		widthExpanded: 220,
		widthCollapsed: 72,
		bg: "#fafbfc",
		border: "#e8edf3",
	},
	color: {
		brand: "#1a7fd4",
		brandLight: "#3b9eff",
		textPrimary: "#0f172a",
		textSecondary: "#64748b",
		textMuted: "#94a3b8",
		danger: "#ef4444",
		dangerBg: "#fef2f2",
		hoverBg: "#f1f5f9",
		activeBg: "#1a7fd4",
		activeText: "#fff",
	},
	radius: { sm: 8, md: 12, lg: 16 },
	breakpoint: { desktop: 1024 },
} as const;

// ── Navigation structure ──────────────────────────────────────────────────────
const NAV_ITEMS = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Employees", href: "/employees", icon: Users },
] as const;

const BOTTOM_NAV_ITEMS = [
	// { name: "Notifications", icon: Bell },
	// { name: "Help", icon: HelpCircle },
] as const;

// ── Hooks ────────────────────────────────────────────────────────────────────
function useWindowWidth() {
	const [width, setWidth] = useState(() =>
		typeof window !== "undefined"
			? window.innerWidth
			: TOKENS.breakpoint.desktop,
	);
	useEffect(() => {
		const handler = () => setWidth(window.innerWidth);
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, []);
	return width;
}

// ── NavItem ──────────────────────────────────────────────────────────────────
interface NavItemProps {
	item: { name: string; href: string; icon: React.ElementType };
	collapsed: boolean;
	pathname: string;
	onNavigate: () => void;
}

function NavItem({ item, collapsed, pathname, onNavigate }: NavItemProps) {
	const isActive =
		pathname === item.href || pathname.startsWith(`${item.href}/`);
	const Icon = item.icon;

	const baseStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		textDecoration: "none",
		transition: "all 0.18s ease",
		borderRadius: TOKENS.radius.md,
		color: isActive ? TOKENS.color.activeText : TOKENS.color.textMuted,
		background: isActive ? TOKENS.color.activeBg : "transparent",
		fontWeight: isActive ? 600 : 500,
	};

	if (collapsed) {
		return (
			<Link
				to={item.href}
				onClick={onNavigate}
				title={item.name}
				aria-label={item.name}
				aria-current={isActive ? "page" : undefined}
				style={{
					...baseStyle,
					width: 44,
					height: 44,
					justifyContent: "center",
					margin: "0 auto",
				}}
			>
				<Icon size={20} aria-hidden="true" />
			</Link>
		);
	}

	return (
		<Link
			to={item.href}
			onClick={onNavigate}
			aria-current={isActive ? "page" : undefined}
			style={{
				...baseStyle,
				gap: 12,
				padding: "11px 18px",
				fontSize: "0.95rem",
			}}
			onMouseEnter={(e) => {
				if (!isActive) {
					(e.currentTarget as HTMLElement).style.background =
						TOKENS.color.hoverBg;
					(e.currentTarget as HTMLElement).style.color =
						TOKENS.color.textSecondary;
				}
			}}
			onMouseLeave={(e) => {
				if (!isActive) {
					(e.currentTarget as HTMLElement).style.background = "transparent";
					(e.currentTarget as HTMLElement).style.color = TOKENS.color.textMuted;
				}
			}}
		>
			<Icon size={20} aria-hidden="true" />
			{item.name}
		</Link>
	);
}

// ── BottomNavButton ──────────────────────────────────────────────────────────
interface BottomNavButtonProps {
	name: string;
	icon: React.ElementType;
	collapsed: boolean;
}

function BottomNavButton({
	name,
	icon: Icon,
	collapsed,
}: BottomNavButtonProps) {
	const baseStyle: React.CSSProperties = {
		background: "transparent",
		border: "none",
		color: TOKENS.color.textMuted,
		fontWeight: 500,
		fontSize: "0.95rem",
		cursor: "pointer",
		transition: "all 0.18s ease",
		borderRadius: TOKENS.radius.md,
		display: "flex",
		alignItems: "center",
		fontFamily: "inherit",
	};

	return (
		<button
			type="button"
			title={name}
			aria-label={name}
			style={
				collapsed
					? {
							...baseStyle,
							width: 44,
							height: 44,
							justifyContent: "center",
							margin: "0 auto",
						}
					: {
							...baseStyle,
							width: "100%",
							gap: 12,
							padding: "11px 18px",
							textAlign: "left",
						}
			}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLElement).style.background =
					TOKENS.color.hoverBg;
				(e.currentTarget as HTMLElement).style.color =
					TOKENS.color.textSecondary;
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLElement).style.background = "transparent";
				(e.currentTarget as HTMLElement).style.color = TOKENS.color.textMuted;
			}}
		>
			<Icon size={20} aria-hidden="true" />
			{!collapsed && name}
		</button>
	);
}

// ── SidebarLogo ───────────────────────────────────────────────────────────────
function SidebarLogo({ collapsed }: { collapsed: boolean }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: 12,
					background: "linear-gradient(135deg,#3b9eff,#1a7fd4)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
					boxShadow: "0 4px 14px rgba(26,127,212,0.25)",
				}}
			>
				<svg
					width="22"
					height="22"
					viewBox="0 0 38 38"
					fill="none"
					role="img"
					aria-label="SMS Logo"
				>
					<title>SMS Logo</title>
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
							fontSize: "1rem",
							color: TOKENS.color.textPrimary,
							whiteSpace: "nowrap",
						}}
					>
						SMS
					</div>
					<div
						style={{
							fontSize: "0.72rem",
							color: TOKENS.color.textMuted,
							whiteSpace: "nowrap",
						}}
					>
						Admin Panel
					</div>
				</div>
			)}
		</div>
	);
}

// ── SidebarContent ───────────────────────────────────────────────────────────
interface SidebarContentProps {
	collapsed: boolean;
	setCollapsed: (v: boolean) => void;
	pathname: string;
	onLogout: () => void;
	onNavigate: () => void;
	mobileOpen?: boolean;
}

function SidebarContent({
	collapsed,
	setCollapsed,
	pathname,
	onLogout,
	onNavigate,
	mobileOpen = false,
}: SidebarContentProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				background: TOKENS.sidebar.bg,
			}}
		>
			{/* Header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: collapsed ? "center" : "space-between",
					padding: collapsed ? "18px 14px" : "18px 16px",
					minHeight: 72,
					borderBottom: `1px solid ${TOKENS.sidebar.border}`,
				}}
			>
				<SidebarLogo collapsed={collapsed} />
				{!collapsed && !pathname.includes("/sidebar-open") && !mobileOpen && (
					<button
						type="button"
						onClick={() => setCollapsed(true)}
						aria-label="Collapse sidebar"
						style={{
							background: "transparent",
							border: "none",
							width: 28,
							height: 28,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							color: TOKENS.color.textMuted,
							borderRadius: TOKENS.radius.sm,
							flexShrink: 0,
							transition: "all 0.15s",
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.background =
								TOKENS.color.hoverBg;
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.background = "transparent";
						}}
					>
						<ChevronLeft size={18} aria-hidden="true" />
					</button>
				)}
			</div>

			{/* Nav */}
			<nav
				aria-label="Main navigation"
				style={{
					flex: 1,
					padding: collapsed ? "12px 14px" : "12px 12px",
					display: "flex",
					flexDirection: "column",
					gap: 4,
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{NAV_ITEMS.map((item) => (
					<NavItem
						key={item.name}
						item={item}
						collapsed={collapsed}
						pathname={pathname}
						onNavigate={onNavigate}
					/>
				))}
			</nav>

			{/* Bottom */}
			<div
				style={{
					padding: collapsed ? "12px 14px" : "12px 12px",
					borderTop: `1px solid ${TOKENS.sidebar.border}`,
					display: "flex",
					flexDirection: "column",
					gap: 4,
				}}
			>
				{BOTTOM_NAV_ITEMS.map((item) => (
					<BottomNavButton
						key={item.name}
						name={item.name}
						icon={item.icon}
						collapsed={collapsed}
					/>
				))}

				{/* Logout */}
				<button
					type="button"
					onClick={onLogout}
					title={collapsed ? "Logout" : undefined}
					aria-label="Logout"
					style={{
						width: collapsed ? 44 : "100%",
						height: collapsed ? 44 : "auto",
						display: "flex",
						alignItems: "center",
						gap: 12,
						padding: collapsed ? "0" : "11px 18px",
						justifyContent: collapsed ? "center" : "flex-start",
						margin: collapsed ? "0 auto" : "0",
						borderRadius: TOKENS.radius.md,
						border: "none",
						background: "transparent",
						color: TOKENS.color.textMuted,
						fontWeight: 500,
						fontSize: "0.95rem",
						cursor: "pointer",
						transition: "all 0.18s ease",
						fontFamily: "inherit",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.background =
							TOKENS.color.dangerBg;
						(e.currentTarget as HTMLElement).style.color = TOKENS.color.danger;
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.background = "transparent";
						(e.currentTarget as HTMLElement).style.color =
							TOKENS.color.textMuted;
					}}
				>
					<LogOut size={20} aria-hidden="true" />
					{!collapsed && "Logout"}
				</button>
			</div>
		</div>
	);
}

// ── Mobile Top Bar ────────────────────────────────────────────────────────────
interface MobileTopBarProps {
	onMenuOpen: () => void;
}

function MobileTopBar({ onMenuOpen }: MobileTopBarProps) {
	return (
		<header
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				height: 56,
				background: TOKENS.sidebar.bg,
				borderBottom: `1px solid ${TOKENS.sidebar.border}`,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 16px",
				zIndex: 48,
				boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
			}}
		>
			<SidebarLogo collapsed={false} />
			<button
				type="button"
				onClick={onMenuOpen}
				aria-label="Open navigation menu"
				style={{
					background: "transparent",
					border: "none",
					width: 36,
					height: 36,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					color: TOKENS.color.textSecondary,
					borderRadius: TOKENS.radius.sm,
				}}
			>
				<Menu size={20} aria-hidden="true" />
			</button>
		</header>
	);
}

// ── DashboardLayout ──────────────────────────────────────────────────────────
export function DashboardLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuthStore();
	const windowWidth = useWindowWidth();
	const isDesktop = windowWidth >= TOKENS.breakpoint.desktop;

	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);

	const { pathname } = location;

	// biome-ignore lint/correctness/useExhaustiveDependencies: close drawer on route change
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	const sidebarWidth = collapsed
		? TOKENS.sidebar.widthCollapsed
		: TOKENS.sidebar.widthExpanded;

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
							background: TOKENS.sidebar.bg,
							borderRight: `1px solid ${TOKENS.sidebar.border}`,
							boxShadow: "1px 0 8px rgba(0,0,0,0.02)",
							transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
							zIndex: 50,
							overflow: "hidden",
						}}
						aria-label="Sidebar navigation"
					>
						<SidebarContent
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							pathname={pathname}
							onLogout={handleLogout}
							onNavigate={() => {}}
							mobileOpen={mobileOpen}
						/>
					</aside>

					{/* Expand toggle when collapsed */}
					{collapsed && (
						<button
							type="button"
							onClick={() => setCollapsed(false)}
							aria-label="Expand sidebar"
							style={{
								position: "fixed",
								left: sidebarWidth - 12,
								top: 32,
								width: 24,
								height: 24,
								borderRadius: "50%",
								background: "#fff",
								border: `1px solid ${TOKENS.sidebar.border}`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								color: TOKENS.color.textSecondary,
								boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
								zIndex: 51,
								transition: "all 0.18s ease",
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.color =
									TOKENS.color.brand;
								(e.currentTarget as HTMLElement).style.borderColor = "#bfdbfe";
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.color =
									TOKENS.color.textSecondary;
								(e.currentTarget as HTMLElement).style.borderColor =
									TOKENS.sidebar.border;
							}}
						>
							<ChevronRight size={14} aria-hidden="true" />
						</button>
					)}
				</>
			)}

			{/* ── Mobile top bar + drawer ── */}
			{!isDesktop && (
				<>
					<MobileTopBar onMenuOpen={() => setMobileOpen(true)} />

					{/* Backdrop */}
					{mobileOpen && (
						<div
							ref={overlayRef}
							onClick={() => setMobileOpen(false)}
							onKeyDown={(e) => {
								if (e.key === "Escape") setMobileOpen(false);
							}}
							role="button"
							tabIndex={0}
							aria-label="Close menu"
							style={{
								position: "fixed",
								inset: 0,
								background: "rgba(0,0,0,0.4)",
								zIndex: 49,
								backdropFilter: "blur(2px)",
							}}
						/>
					)}

					{/* Drawer */}
					<aside
						aria-label="Mobile navigation"
						aria-hidden={!mobileOpen}
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							bottom: 0,
							width: TOKENS.sidebar.widthExpanded,
							background: TOKENS.sidebar.bg,
							borderRight: `1px solid ${TOKENS.sidebar.border}`,
							boxShadow: "2px 0 16px rgba(0,0,0,0.08)",
							zIndex: 50,
							transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
							transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
						}}
					>
						{/* Close button in mobile drawer */}
						<div
							style={{ position: "absolute", top: 16, right: 12, zIndex: 1 }}
						>
							<button
								type="button"
								onClick={() => setMobileOpen(false)}
								aria-label="Close navigation"
								style={{
									background: "transparent",
									border: "none",
									width: 32,
									height: 32,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									color: TOKENS.color.textMuted,
									borderRadius: TOKENS.radius.sm,
								}}
							>
								<X size={18} aria-hidden="true" />
							</button>
						</div>

						<SidebarContent
							collapsed={false}
							setCollapsed={() => {}}
							pathname={pathname}
							onLogout={handleLogout}
							onNavigate={() => setMobileOpen(false)}
							mobileOpen={mobileOpen}
						/>
					</aside>
				</>
			)}

			{/* ── Main content ── */}
			<main
				style={{
					marginLeft: isDesktop ? sidebarWidth : 0,
					paddingTop: isDesktop ? 0 : 56, // offset for mobile top bar
					transition: "margin-left 0.22s cubic-bezier(.4,0,.2,1)",
					minHeight: "100vh",
				}}
			>
				<div
					style={{
						maxWidth: 1280,
						margin: "0 auto",
						padding: isDesktop ? "26px 28px" : "20px 16px",
					}}
				>
					<Outlet />
				</div>
			</main>
		</div>
	);
}
