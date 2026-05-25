import { analyticsService } from "@/services/analytics.service";
import { formatCurrency, formatNumber } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const CHART_COLORS = [
	"#3b9eff",
	"#1a7fd4",
	"#0f5fa8",
	"#38bdf8",
	"#7dd3fc",
	"#0ea5e9",
];

// ── Tooltip style ─────────────────────────────────────────────────────────────
const tooltipStyle: React.CSSProperties = {
	backgroundColor: "#fff",
	border: "1px solid #e8edf3",
	borderRadius: 10,
	boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
	fontSize: "0.82rem",
	color: "#1e293b",
	padding: "8px 12px",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({
	w,
	h,
	r = 8,
}: { w: string | number; h: number; r?: number }) {
	return (
		<div
			style={{
				width: w,
				height: h,
				borderRadius: r,
				background:
					"linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%)",
				backgroundSize: "200% 100%",
				animation: "shimmer 1.4s infinite",
			}}
		/>
	);
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({
	title,
	value,
	description,
	icon: Icon,
	iconBg,
	iconColor,
	trend,
}: {
	title: string;
	value: string | number;
	description: string;
	icon: React.ElementType;
	iconBg: string;
	iconColor: string;
	trend?: { value: string; up: boolean };
}) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 12,
				border: "1px solid #e8edf3",
				padding: "20px 22px",
				display: "flex",
				flexDirection: "column",
				gap: 14,
			}}
		>
			{/* Top row: label + icon */}
			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
				}}
			>
				<span
					style={{
						fontSize: "0.78rem",
						fontWeight: 600,
						color: "#64748b",
						textTransform: "uppercase",
						letterSpacing: "0.06em",
					}}
				>
					{title}
				</span>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 10,
						background: iconBg,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
					}}
				>
					<Icon size={17} color={iconColor} strokeWidth={2.2} />
				</div>
			</div>

			{/* Value */}
			<div
				style={{
					fontSize: "1.75rem",
					fontWeight: 700,
					color: "#0f172a",
					lineHeight: 1,
					letterSpacing: "-0.02em",
				}}
			>
				{value}
			</div>

			{/* Description + optional trend */}
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				{trend && (
					<span
						style={{
							fontSize: "0.75rem",
							fontWeight: 600,
							color: trend.up ? "#16a34a" : "#dc2626",
							background: trend.up ? "#f0fdf4" : "#fef2f2",
							padding: "2px 8px",
							borderRadius: 999,
							whiteSpace: "nowrap",
						}}
					>
						{trend.up ? "↑" : "↓"} {trend.value}
					</span>
				)}
				<p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>
					{description}
				</p>
			</div>
		</div>
	);
}

// ── SectionCard (chart wrapper) ───────────────────────────────────────────────
function SectionCard({
	title,
	subtitle,
	children,
	action,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	action?: React.ReactNode;
}) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 12,
				border: "1px solid #e8edf3",
				overflow: "hidden",
			}}
		>
			{/* Header */}
			<div
				style={{
					padding: "18px 22px 14px",
					borderBottom: "1px solid #f0f4f8",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 12,
				}}
			>
				<div>
					<h3
						style={{
							margin: 0,
							fontSize: "0.95rem",
							fontWeight: 700,
							color: "#0f172a",
							lineHeight: 1.3,
						}}
					>
						{title}
					</h3>
					{subtitle && (
						<p
							style={{
								margin: "3px 0 0",
								fontSize: "0.78rem",
								color: "#94a3b8",
							}}
						>
							{subtitle}
						</p>
					)}
				</div>
				{action}
			</div>
			{/* Body */}
			<div style={{ padding: "18px 22px 22px" }}>{children}</div>
		</div>
	);
}

// ── Custom bar shape with top-only rounded corners ────────────────────────────
function RoundedBar(props: {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	fill?: string;
}) {
	const { x = 0, y = 0, width = 0, height = 0, fill } = props;
	const r = 5;
	if (height <= 0) return null;
	return (
		<path
			d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
			fill={fill}
		/>
	);
}

// ── Pill badge for chart legend ───────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
			<div
				style={{
					width: 8,
					height: 8,
					borderRadius: "50%",
					background: color,
					flexShrink: 0,
				}}
			/>
			<span style={{ fontSize: "0.75rem", color: "#64748b" }}>{label}</span>
		</div>
	);
}

// ── DashboardPage ─────────────────────────────────────────────────────────────
export function DashboardPage() {
	const { data: dashboard, isLoading } = useQuery({
		queryKey: ["analytics", "dashboard"],
		queryFn: () => analyticsService.getDashboard(),
	});

	// ── Loading skeleton ──
	const statSkeletonKeys = [
		"stat-total",
		"stat-average",
		"stat-median",
		"stat-departments",
	];
	const chartSkeletonKeys = [
		"chart-country",
		"chart-status",
		"chart-department",
		"chart-trend",
	];

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 24,
					fontFamily: "'Segoe UI', system-ui, sans-serif",
				}}
			>
				<style>
					{
						"@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}"
					}
				</style>
				<div>
					<Skeleton w={140} h={28} r={6} />
					<div style={{ marginTop: 8 }}>
						<Skeleton w={220} h={14} r={5} />
					</div>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(4,1fr)",
						gap: 16,
					}}
				>
					{statSkeletonKeys.map((key) => (
						<div
							key={key}
							style={{
								background: "#fff",
								borderRadius: 12,
								border: "1px solid #e8edf3",
								padding: "20px 22px",
								display: "flex",
								flexDirection: "column",
								gap: 12,
							}}
						>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<Skeleton w="55%" h={12} r={4} />
								<Skeleton w={36} h={36} r={10} />
							</div>
							<Skeleton w="70%" h={28} r={6} />
							<Skeleton w="45%" h={12} r={4} />
						</div>
					))}
				</div>
				<div
					style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
				>
					{chartSkeletonKeys.map((key) => (
						<div
							key={key}
							style={{
								background: "#fff",
								borderRadius: 12,
								border: "1px solid #e8edf3",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									padding: "18px 22px 14px",
									borderBottom: "1px solid #f0f4f8",
								}}
							>
								<Skeleton w="40%" h={16} r={5} />
							</div>
							<div style={{ padding: "18px 22px 22px" }}>
								<Skeleton w="100%" h={240} r={8} />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!dashboard) return null;

	const stats = [
		{
			title: "Total Employees",
			value: formatNumber(dashboard.totalEmployees),
			description: `${dashboard.activeEmployees} currently active`,
			icon: Users,
			iconBg: "#eff6ff",
			iconColor: "#1a7fd4",
			trend: { value: "4.2%", up: true },
		},
		{
			title: "Avg Salary",
			value: formatCurrency(dashboard.avgCompanyWideSalary, "USD"),
			description: "Company-wide average",
			icon: DollarSign,
			iconBg: "#f0fdf4",
			iconColor: "#16a34a",
			trend: { value: "2.1%", up: true },
		},
		{
			title: "Median Salary",
			value: formatCurrency(dashboard.medianCompanyWideSalary, "USD"),
			description: "Company-wide median",
			icon: TrendingUp,
			iconBg: "#fef9c3",
			iconColor: "#b45309",
		},
		{
			title: "Departments",
			value: dashboard.departmentStats.length,
			description: "Active departments",
			icon: Building2,
			iconBg: "#fdf4ff",
			iconColor: "#9333ea",
		},
	];

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 24,
				fontFamily: "'Segoe UI', system-ui, sans-serif",
			}}
		>
			<style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media(max-width:900px){
          .dash-stats{grid-template-columns:1fr 1fr!important}
          .dash-charts{grid-template-columns:1fr!important}
        }
        @media(max-width:520px){
          .dash-stats{grid-template-columns:1fr!important}
        }
      `}</style>

			{/* ── Page header ── */}
			<div>
				<h1
					style={{
						margin: "0 0 4px",
						fontSize: "1.5rem",
						fontWeight: 700,
						color: "#0f172a",
					}}
				>
					Dashboard
				</h1>
				{/* <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8" }}>
					<span style={{ color: "#64748b" }}>Home</span>
					<span style={{ margin: "0 6px" }}>/</span>
					<span style={{ color: "#1a7fd4", fontWeight: 500 }}>Dashboard</span>
				</p> */}
			</div>

			{/* ── Stat cards ── */}
			<div
				className="dash-stats"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4,1fr)",
					gap: 16,
				}}
			>
				{stats.map((s) => (
					<StatCard key={s.title} {...s} />
				))}
			</div>

			{/* ── Charts row 1: Bar + Pie ── */}
			<div
				className="dash-charts"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
			>
				{/* Salary by Country — Bar */}
				<SectionCard
					title="Avg Salary by Country"
					subtitle="Top countries by compensation"
				>
					<ResponsiveContainer width="100%" height={260}>
						<BarChart
							data={dashboard.countrySalaryStats.slice(0, 8)}
							barSize={26}
							margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
						>
							<defs>
								<linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#3b9eff" />
									<stop offset="100%" stopColor="#1a7fd4" />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f0f4f8"
								vertical={false}
							/>
							<XAxis
								dataKey="country"
								tick={{ fontSize: 11, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 11, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
								width={56}
							/>
							<Tooltip
								contentStyle={tooltipStyle}
								cursor={{ fill: "#f0f9ff", radius: 4 }}
							/>
							<Bar
								dataKey="avgSalary"
								fill="url(#barGrad)"
								shape={<RoundedBar />}
							/>
						</BarChart>
					</ResponsiveContainer>
				</SectionCard>

				{/* Employee Distribution — Donut */}
				<SectionCard title="Employee Distribution" subtitle="By department">
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={dashboard.departmentStats.slice(0, 6)}
								cx="50%"
								cy="50%"
								innerRadius={58}
								outerRadius={90}
								paddingAngle={3}
								dataKey="employeeCount"
								strokeWidth={0}
							>
								{dashboard.departmentStats.slice(0, 6).map((dept, i) => (
									<Cell
										key={`cell-${dept.department}`}
										fill={CHART_COLORS[i % CHART_COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={tooltipStyle}
								formatter={(val: number) => [formatNumber(val), "Employees"]}
							/>
						</PieChart>
					</ResponsiveContainer>
					{/* Legend */}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "6px 18px",
							marginTop: 8,
						}}
					>
						{dashboard.departmentStats.slice(0, 6).map((d, i) => (
							<LegendDot
								key={d.department}
								color={CHART_COLORS[i % CHART_COLORS.length]}
								label={d.department}
							/>
						))}
					</div>
				</SectionCard>
			</div>

			{/* ── Charts row 2: Line + Top Departments ── */}
			<div
				className="dash-charts"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
			>
				{/* Hiring Trends — Line */}
				<SectionCard
					title="Hiring Trends"
					subtitle="Monthly hires over the last 12 months"
				>
					<ResponsiveContainer width="100%" height={260}>
						<LineChart
							data={dashboard.hiringTrends.slice(-12)}
							margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
						>
							<defs>
								<linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#38bdf8" />
									<stop offset="100%" stopColor="#1a7fd4" />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f0f4f8"
								vertical={false}
							/>
							<XAxis
								dataKey="month"
								tick={{ fontSize: 11, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 11, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
								width={36}
							/>
							<Tooltip contentStyle={tooltipStyle} />
							<Line
								type="monotone"
								dataKey="hireCount"
								stroke="url(#lineGrad)"
								strokeWidth={2.5}
								dot={{ fill: "#1a7fd4", r: 3, strokeWidth: 0 }}
								activeDot={{ r: 5, fill: "#1a7fd4", strokeWidth: 0 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</SectionCard>

				{/* Top Paying Departments — custom list */}
				<SectionCard
					title="Top Paying Departments"
					subtitle="Ranked by average salary"
				>
					<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
						{dashboard.topPayingDepartments.map((dept, i) => {
							const max = dashboard.topPayingDepartments[0]?.avgSalary ?? 1;
							const pct = Math.round((dept.avgSalary / max) * 100);
							return (
								<div key={dept.department}>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											marginBottom: 8,
										}}
									>
										{/* Rank + name */}
										<div
											style={{ display: "flex", alignItems: "center", gap: 10 }}
										>
											<div
												style={{
													width: 26,
													height: 26,
													borderRadius: 8,
													background: i === 0 ? "#eff6ff" : "#f8fafc",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "0.72rem",
													fontWeight: 700,
													color: i === 0 ? "#1a7fd4" : "#94a3b8",
													flexShrink: 0,
												}}
											>
												{i + 1}
											</div>
											<div>
												<p
													style={{
														margin: 0,
														fontSize: "0.875rem",
														fontWeight: 600,
														color: "#0f172a",
														lineHeight: 1.2,
													}}
												>
													{dept.department}
												</p>
												<p
													style={{
														margin: 0,
														fontSize: "0.72rem",
														color: "#94a3b8",
													}}
												>
													{dept.employeeCount} employees
												</p>
											</div>
										</div>

										{/* Salary */}
										<div style={{ textAlign: "right" }}>
											<p
												style={{
													margin: 0,
													fontSize: "0.88rem",
													fontWeight: 700,
													color: "#0f172a",
												}}
											>
												{formatCurrency(dept.avgSalary, "USD")}
											</p>
											<p
												style={{
													margin: 0,
													fontSize: "0.7rem",
													color: "#94a3b8",
												}}
											>
												avg / yr
											</p>
										</div>
									</div>

									{/* Progress bar */}
									<div
										style={{
											height: 4,
											background: "#f1f5f9",
											borderRadius: 99,
											overflow: "hidden",
										}}
									>
										<div
											style={{
												height: "100%",
												width: `${pct}%`,
												background:
													i === 0
														? "linear-gradient(90deg,#3b9eff,#1a7fd4)"
														: "linear-gradient(90deg,#93c5fd,#3b9eff)",
												borderRadius: 99,
												transition: "width 0.6s ease",
											}}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</SectionCard>
			</div>
		</div>
	);
}
