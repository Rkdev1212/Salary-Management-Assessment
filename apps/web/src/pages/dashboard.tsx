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

const COLORS = [
	"#1a7fd4",
	"#0f5fa8",
	"#38bdf8",
	"#7dd3fc",
	"#0ea5e9",
	"#0284c7",
];

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
	title,
	value,
	description,
	icon: Icon,
	accent,
}: {
	title: string;
	value: string | number;
	description: string;
	icon: React.ElementType;
	accent: string;
}) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 16,
				border: "1px solid #e8edf3",
				padding: "20px 22px",
				display: "flex",
				flexDirection: "column",
				gap: 10,
				boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
				transition: "box-shadow 0.2s",
			}}
			onMouseEnter={(e) =>
				((e.currentTarget as HTMLElement).style.boxShadow =
					"0 4px 16px rgba(26,127,212,0.1)")
			}
			onMouseLeave={(e) =>
				((e.currentTarget as HTMLElement).style.boxShadow =
					"0 1px 4px rgba(0,0,0,0.04)")
			}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<span
					style={{
						fontSize: "0.82rem",
						fontWeight: 600,
						color: "#64748b",
						textTransform: "uppercase",
						letterSpacing: "0.05em",
					}}
				>
					{title}
				</span>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: 10,
						background: accent,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon size={17} color="#1a7fd4" />
				</div>
			</div>
			<div
				style={{
					fontSize: "1.7rem",
					fontWeight: 700,
					color: "#0f172a",
					lineHeight: 1,
				}}
			>
				{value}
			</div>
			<p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>
				{description}
			</p>
		</div>
	);
}

// ── Chart card shell ─────────────────────────────────────────────────────────
function ChartCard({
	title,
	children,
}: { title: string; children: React.ReactNode }) {
	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 16,
				border: "1px solid #e8edf3",
				overflow: "hidden",
				boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
			}}
		>
			<div
				style={{ padding: "18px 22px 0", borderBottom: "1px solid #f8fafc" }}
			>
				<h3
					style={{
						margin: "0 0 14px",
						fontSize: "0.95rem",
						fontWeight: 700,
						color: "#0f172a",
					}}
				>
					{title}
				</h3>
			</div>
			<div style={{ padding: "18px 22px 22px" }}>{children}</div>
		</div>
	);
}

// ── Tooltip styles shared ────────────────────────────────────────────────────
const tooltipStyle = {
	backgroundColor: "#fff",
	border: "1px solid #e2e8f0",
	borderRadius: 10,
	boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
	fontSize: "0.82rem",
	color: "#1e293b",
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
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
					"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
				backgroundSize: "200% 100%",
				animation: "shimmer 1.4s infinite",
			}}
		/>
	);
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function DashboardPage() {
	const { data: dashboard, isLoading } = useQuery({
		queryKey: ["analytics", "dashboard"],
		queryFn: () => analyticsService.getDashboard(),
	});

	const statAccents = ["#eff6ff", "#f0fdf4", "#fef9c3", "#fdf4ff"];

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
						"@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }"
					}
				</style>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
						gap: 16,
					}}
				>
					{[...Array(4)].map((_, i) => (
						<div
							key={`stat-skeleton-${i}`}
							style={{
								background: "#fff",
								borderRadius: 16,
								border: "1px solid #e8edf3",
								padding: "20px 22px",
								display: "flex",
								flexDirection: "column",
								gap: 12,
							}}
						>
							<Skeleton w="60%" h={14} />
							<Skeleton w="80%" h={28} />
							<Skeleton w="50%" h={12} />
						</div>
					))}
				</div>
				<div
					style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
				>
					{[...Array(4)].map((_, i) => (
						<div
							key={`chart-skeleton-${i}`}
							style={{
								background: "#fff",
								borderRadius: 16,
								border: "1px solid #e8edf3",
								padding: 22,
							}}
						>
							<Skeleton w="40%" h={16} r={6} />
							<div style={{ marginTop: 20 }}>
								<Skeleton w="100%" h={280} r={10} />
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
			icon: Users,
			description: `${dashboard.activeEmployees} active`,
			accent: statAccents[0] ?? "#eff6ff",
		},
		{
			title: "Avg Salary",
			value: formatCurrency(dashboard.avgCompanyWideSalary, "USD"),
			icon: DollarSign,
			description: "Company-wide average",
			accent: statAccents[1] ?? "#f0fdf4",
		},
		{
			title: "Median Salary",
			value: formatCurrency(dashboard.medianCompanyWideSalary, "USD"),
			icon: TrendingUp,
			description: "Company-wide median",
			accent: statAccents[2] ?? "#fef9c3",
		},
		{
			title: "Departments",
			value: dashboard.departmentStats.length,
			icon: Building2,
			description: "Active departments",
			accent: statAccents[3] ?? "#fdf4ff",
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
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media (max-width: 640px) {
          .charts-grid { grid-template-columns: 1fr !important; }
          .stats-grid  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .stats-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

			{/* ── Page header ── */}
			<div>
				<h1
					style={{
						margin: "0 0 4px",
						fontSize: "1.6rem",
						fontWeight: 700,
						color: "#0f172a",
					}}
				>
					Dashboard
				</h1>
				<p style={{ margin: 0, fontSize: "0.88rem", color: "#94a3b8" }}>
					Overview of salary analytics and insights
				</p>
			</div>

			{/* ── Stats grid ── */}
			<div
				className="stats-grid"
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

			{/* ── Charts grid ── */}
			<div
				className="charts-grid"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
			>
				{/* Salary by Country */}
				<ChartCard title="Salary by Country">
					<ResponsiveContainer width="100%" height={280}>
						<BarChart
							data={dashboard.countrySalaryStats.slice(0, 8)}
							barSize={28}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f1f5f9"
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
							/>
							<Tooltip
								contentStyle={tooltipStyle}
								cursor={{ fill: "#f0f9ff" }}
							/>
							<Bar
								dataKey="avgSalary"
								fill="url(#blueGrad)"
								radius={[6, 6, 0, 0]}
							/>
							<defs>
								<linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#1a7fd4" />
									<stop offset="100%" stopColor="#0f5fa8" />
								</linearGradient>
							</defs>
						</BarChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Employee Distribution pie */}
				<ChartCard title="Employee Distribution">
					<ResponsiveContainer width="100%" height={280}>
						<PieChart>
							<Pie
								data={dashboard.departmentStats.slice(0, 6)}
								cx="50%"
								cy="50%"
								innerRadius={55}
								outerRadius={100}
								paddingAngle={3}
								dataKey="employeeCount"
							>
								{dashboard.departmentStats.slice(0, 6).map((dept, i) => (
									<Cell
										key={`pie-${dept.department}`}
										fill={COLORS[i % COLORS.length]}
										strokeWidth={0}
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
							gap: "6px 16px",
							marginTop: 4,
						}}
					>
						{dashboard.departmentStats.slice(0, 6).map((d, i) => (
							<div
								key={d.department}
								style={{ display: "flex", alignItems: "center", gap: 6 }}
							>
								<div
									style={{
										width: 8,
										height: 8,
										borderRadius: "50%",
										background: COLORS[i % COLORS.length],
										flexShrink: 0,
									}}
								/>
								<span style={{ fontSize: "0.75rem", color: "#64748b" }}>
									{d.department}
								</span>
							</div>
						))}
					</div>
				</ChartCard>

				{/* Hiring Trends line */}
				<ChartCard title="Hiring Trends">
					<ResponsiveContainer width="100%" height={280}>
						<LineChart data={dashboard.hiringTrends.slice(-12)}>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#f1f5f9"
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
							/>
							<Tooltip contentStyle={tooltipStyle} />
							<defs>
								<linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
									<stop offset="0%" stopColor="#38bdf8" />
									<stop offset="100%" stopColor="#1a7fd4" />
								</linearGradient>
							</defs>
							<Line
								type="monotone"
								dataKey="hireCount"
								stroke="url(#lineGrad)"
								strokeWidth={2.5}
								dot={{ fill: "#1a7fd4", r: 3, strokeWidth: 0 }}
								activeDot={{ r: 5, fill: "#1a7fd4" }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartCard>

				{/* Top Paying Departments */}
				<ChartCard title="Top Paying Departments">
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
											marginBottom: 6,
										}}
									>
										<div
											style={{ display: "flex", alignItems: "center", gap: 10 }}
										>
											<div
												style={{
													width: 28,
													height: 28,
													borderRadius: 8,
													background: "#eff6ff",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "0.75rem",
													fontWeight: 700,
													color: "#1a7fd4",
													flexShrink: 0,
												}}
											>
												{i + 1}
											</div>
											<div>
												<p
													style={{
														margin: 0,
														fontSize: "0.88rem",
														fontWeight: 600,
														color: "#1e293b",
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
										<div style={{ textAlign: "right" }}>
											<p
												style={{
													margin: 0,
													fontSize: "0.9rem",
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
												avg salary
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
												background: "linear-gradient(90deg,#38bdf8,#1a7fd4)",
												borderRadius: 99,
												transition: "width 0.6s ease",
											}}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</ChartCard>
			</div>
		</div>
	);
}
