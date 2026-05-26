import type { Meta, StoryObj } from "@storybook/react";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@repo/ui";

const meta = {
	title: "Primitives/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card description goes here</CardDescription>
			</CardHeader>
			<CardContent>
				<p>This is the card content area where you can put any content.</p>
			</CardContent>
		</Card>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Employee Details</CardTitle>
				<CardDescription>View and manage employee information</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div>
						<span className="font-medium">Name:</span> John Doe
					</div>
					<div>
						<span className="font-medium">Email:</span> john@company.com
					</div>
					<div>
						<span className="font-medium">Department:</span> Engineering
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Save</Button>
			</CardFooter>
		</Card>
	),
};

export const StatCard: Story = {
	render: () => (
		<Card className="w-[250px]">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Total Employees</CardTitle>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					className="h-4 w-4 text-muted-foreground"
				>
					<title>Total employees icon</title>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">10,234</div>
				<p className="text-xs text-muted-foreground">+12% from last month</p>
			</CardContent>
		</Card>
	),
};

export const MultipleCards: Story = {
	render: () => (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle>Total Revenue</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">$45,231.89</div>
					<p className="text-xs text-muted-foreground">
						+20.1% from last month
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Active Users</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">2,350</div>
					<p className="text-xs text-muted-foreground">+180 since last week</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Sales</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">12,234</div>
					<p className="text-xs text-muted-foreground">+19% from last month</p>
				</CardContent>
			</Card>
		</div>
	),
};
