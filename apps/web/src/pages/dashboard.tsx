import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/services/analytics.service";
import { formatCurrency, formatNumber } from "@repo/utils";
import { Users, TrendingUp, DollarSign, Building2 } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
} from "recharts";

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
];

export function DashboardPage() {
	const { data: dashboard, isLoading } = useQuery({
		queryKey: ["analytics", "dashboard"],
		queryFn: () => analyticsService.getDashboard(),
	});

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							</CardHeader>
							<CardContent>
								<div className="h-8 w-32 animate-pulse rounded bg-muted" />
							</CardContent>
						</Card>
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
		},
		{
			title: "Avg Salary",
			value: formatCurrency(dashboard.avgCompanyWideSalary, "USD"),
			icon: DollarSign,
			description: "Company-wide average",
		},
		{
			title: "Median Salary",
			value: formatCurrency(dashboard.medianCompanyWideSalary, "USD"),
			icon: TrendingUp,
			description: "Company-wide median",
		},
		{
			title: "Departments",
			value: dashboard.departmentStats.length,
			icon: Building2,
			description: "Active departments",
		},
	];

	return (
		<div className="space-y-6 animate-fade-in">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of salary analytics and insights
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title} className="hover:shadow-md transition-shadow">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground">
								{stat.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Country Salary Stats */}
				<Card>
					<CardHeader>
						<CardTitle>Salary by Country</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={dashboard.countrySalaryStats.slice(0, 8)}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="country" className="text-xs" />
								<YAxis className="text-xs" />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
								/>
								<Bar
									dataKey="avgSalary"
									fill="hsl(var(--primary))"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Department Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Employee Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={dashboard.departmentStats.slice(0, 6)}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={(entry) => entry.department}
									outerRadius={80}
									fill="#8884d8"
									dataKey="employeeCount"
								>
									{dashboard.departmentStats.slice(0, 6).map((_, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Hiring Trends */}
				<Card>
					<CardHeader>
						<CardTitle>Hiring Trends</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={dashboard.hiringTrends.slice(-12)}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="month" className="text-xs" />
								<YAxis className="text-xs" />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "8px",
									}}
								/>
								<Line
									type="monotone"
									dataKey="hireCount"
									stroke="hsl(var(--primary))"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Top Paying Departments */}
				<Card>
					<CardHeader>
						<CardTitle>Top Paying Departments</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{dashboard.topPayingDepartments.map((dept, index) => (
								<div
									key={dept.department}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
											{index + 1}
										</div>
										<div>
											<p className="font-medium">{dept.department}</p>
											<p className="text-xs text-muted-foreground">
												{dept.employeeCount} employees
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold">
											{formatCurrency(dept.avgSalary, "USD")}
										</p>
										<p className="text-xs text-muted-foreground">avg salary</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
