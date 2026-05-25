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

// ── Design tokens ─────────────────────────────────────────────────────────────
const CHART_COLORS = [
	"#3b9eff",
	"#1a7fd4",
	"#0f5fa8",
	"#38bdf8",
	"#7dd3fc",
	"#0ea5e9",
] as const;

const TOOLTIP_STYLE: React.CSSProperties = {
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
			aria-hidden="true"
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
interface StatCardProps {
	title: string;
	value: string | number;
	description: string;
	icon: React.ElementType;
	iconBg: string;
	iconColor: string;
	trend?: { value: string; up: boolean };
}

function StatCard({
	title,
	value,
	description,
	icon: Icon,
	iconBg,
	iconColor,
	trend,
}: StatCardProps) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 12,
				border: "1px solid #e8edf3",
				padding: "18px 20px",
				display: "flex",
				flexDirection: "column",
				gap: 12,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "space-between",
				}}
			>
				<span
					style={{
						fontSize: "0.72rem",
						fontWeight: 600,
						color: "#64748b",
						textTransform: "uppercase",
						letterSpacing: "0.06em",
					}}
				>
					{title}
				</span>
				<div
					aria-hidden="true"
					style={{
						width: 34,
						height: 34,
						borderRadius: 9,
						background: iconBg,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
					}}
				>
					<Icon size={16} color={iconColor} strokeWidth={2.2} />
				</div>
			</div>

			<div
				style={{
					fontSize: "1.6rem",
					fontWeight: 700,
					color: "#0f172a",
					lineHeight: 1,
					letterSpacing: "-0.02em",
				}}
			>
				{value}
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					flexWrap: "wrap",
				}}
			>
				{trend && (
					<span
						style={{
							fontSize: "0.72rem",
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
				<p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
					{description}
				</p>
			</div>
		</div>
	);
}

// ── SectionCard ───────────────────────────────────────────────────────────────
interface SectionCardProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

function SectionCard({ title, subtitle, children }: SectionCardProps) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 12,
				border: "1px solid #e8edf3",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					padding: "16px 20px 12px",
					borderBottom: "1px solid #f0f4f8",
				}}
			>
				<h3
					style={{
						margin: 0,
						fontSize: "0.9rem",
						fontWeight: 700,
						color: "#0f172a",
						lineHeight: 1.3,
					}}
				>
					{title}
				</h3>
				{subtitle && (
					<p
						style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}
					>
						{subtitle}
					</p>
				)}
			</div>
			<div style={{ padding: "16px 20px 20px" }}>{children}</div>
		</div>
	);
}

// ── Custom rounded bar ────────────────────────────────────────────────────────
function RoundedBar(props: {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	fill?: string;
}) {
	const { x = 0, y = 0, width = 0, height = 0, fill } = props;
	const r = 4;
	if (height <= 0) return null;
	return (
		<path
			d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
			fill={fill}
		/>
	);
}

function LegendDot({ color, label }: { color: string; label: string }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 5 }}>
			<div
				aria-hidden="true"
				style={{
					width: 7,
					height: 7,
					borderRadius: "50%",
					background: color,
					flexShrink: 0,
				}}
			/>
			<span style={{ fontSize: "0.72rem", color: "#64748b" }}>{label}</span>
		</div>
	);
}

// ── Loading skeleton layout ───────────────────────────────────────────────────
const STAT_SKELETON_KEYS = [
	"stat-total",
	"stat-average",
	"stat-median",
	"stat-departments",
] as const;
const CHART_SKELETON_KEYS = [
	"chart-country",
	"chart-status",
	"chart-department",
	"chart-trend",
] as const;

function DashboardSkeleton() {
	return (
		<div
			aria-busy="true"
			aria-label="Loading dashboard"
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
				<Skeleton w={140} h={26} r={6} />
				<div style={{ marginTop: 8 }}>
					<Skeleton w={220} h={13} r={5} />
				</div>
			</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: 14,
				}}
			>
				{STAT_SKELETON_KEYS.map((key) => (
					<div
						key={key}
						style={{
							background: "#fff",
							borderRadius: 12,
							border: "1px solid #e8edf3",
							padding: "18px 20px",
							display: "flex",
							flexDirection: "column",
							gap: 12,
						}}
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<Skeleton w="55%" h={11} r={4} />
							<Skeleton w={34} h={34} r={9} />
						</div>
						<Skeleton w="65%" h={26} r={6} />
						<Skeleton w="45%" h={11} r={4} />
					</div>
				))}
			</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
					gap: 14,
				}}
			>
				{CHART_SKELETON_KEYS.map((key) => (
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
								padding: "16px 20px 12px",
								borderBottom: "1px solid #f0f4f8",
							}}
						>
							<Skeleton w="40%" h={15} r={5} />
						</div>
						<div style={{ padding: "16px 20px 20px" }}>
							<Skeleton w="100%" h={220} r={8} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── DashboardPage ─────────────────────────────────────────────────────────────
export function DashboardPage() {
	const { data: dashboard, isLoading } = useQuery({
		queryKey: ["analytics", "dashboard"],
		queryFn: () => analyticsService.getDashboard(),
	});

	if (isLoading) return <DashboardSkeleton />;
	if (!dashboard) return null;

	const stats: StatCardProps[] = [
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
				.dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
				.dash-charts-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
				@media (max-width: 1024px) {
					.dash-stats { grid-template-columns: repeat(2, 1fr) !important; }
					.dash-charts-2 { grid-template-columns: 1fr !important; }
				}
				@media (max-width: 560px) {
					.dash-stats { grid-template-columns: 1fr !important; }
				}
			`}</style>

			<div>
				<h1
					style={{
						margin: "0 0 2px",
						fontSize: "1.4rem",
						fontWeight: 700,
						color: "#0f172a",
					}}
				>
					Dashboard
				</h1>
			</div>

			{/* Stat cards */}
			<div className="dash-stats">
				{stats.map((s) => (
					<StatCard key={s.title} {...s} />
				))}
			</div>

			{/* Charts row 1 */}
			<div className="dash-charts-2">
				<SectionCard
					title="Avg Salary by Country"
					subtitle="Top countries by compensation"
				>
					<ResponsiveContainer width="100%" height={240}>
						<BarChart
							data={dashboard.countrySalaryStats.slice(0, 8)}
							barSize={22}
							margin={{ top: 4, right: 4, left: -14, bottom: 0 }}
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
								tick={{ fontSize: 10, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
								width={52}
							/>
							<Tooltip
								contentStyle={TOOLTIP_STYLE}
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

				<SectionCard title="Employee Distribution" subtitle="By department">
					<ResponsiveContainer width="100%" height={188}>
						<PieChart>
							<Pie
								data={dashboard.departmentStats.slice(0, 6)}
								cx="50%"
								cy="50%"
								innerRadius={52}
								outerRadius={84}
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
								contentStyle={TOOLTIP_STYLE}
								formatter={(val: number) => [formatNumber(val), "Employees"]}
							/>
						</PieChart>
					</ResponsiveContainer>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "5px 16px",
							marginTop: 6,
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

			{/* Charts row 2 */}
			<div className="dash-charts-2">
				<SectionCard
					title="Hiring Trends"
					subtitle="Monthly hires over the last 12 months"
				>
					<ResponsiveContainer width="100%" height={240}>
						<LineChart
							data={dashboard.hiringTrends.slice(-12)}
							margin={{ top: 4, right: 4, left: -14, bottom: 0 }}
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
								tick={{ fontSize: 10, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 10, fill: "#94a3b8" }}
								axisLine={false}
								tickLine={false}
								width={34}
							/>
							<Tooltip contentStyle={TOOLTIP_STYLE} />
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

				<SectionCard
					title="Top Paying Departments"
					subtitle="Ranked by average salary"
				>
					<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
											marginBottom: 7,
										}}
									>
										<div
											style={{ display: "flex", alignItems: "center", gap: 10 }}
										>
											<div
												aria-hidden="true"
												style={{
													width: 24,
													height: 24,
													borderRadius: 7,
													background: i === 0 ? "#eff6ff" : "#f8fafc",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "0.7rem",
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
														fontSize: "0.85rem",
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
														fontSize: "0.7rem",
														color: "#94a3b8",
													}}
												>
													{dept.employeeCount} employees
												</p>
											</div>
										</div>
										<div style={{ textAlign: "right" }}>
											<p
												style={{
													margin: 0,
													fontSize: "0.85rem",
													fontWeight: 700,
													color: "#0f172a",
												}}
											>
												{formatCurrency(dept.avgSalary, "USD")}
											</p>
											<p
												style={{
													margin: 0,
													fontSize: "0.68rem",
													color: "#94a3b8",
												}}
											>
												avg / yr
											</p>
										</div>
									</div>
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
											tabIndex={0}
											role="progressbar"
											aria-valuenow={pct}
											aria-valuemin={0}
											aria-valuemax={100}
											aria-label={`${dept.department} salary rank`}
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
