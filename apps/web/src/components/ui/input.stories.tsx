import type { Meta, StoryObj } from "@storybook/react";
import { Lock, Mail, Search } from "lucide-react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
	title: "UI/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "Enter text...",
	},
};

export const WithLabel: Story = {
	render: () => (
		<div className="w-[350px] space-y-2">
			<Label htmlFor="email">Email</Label>
			<Input id="email" type="email" placeholder="name@company.com" />
		</div>
	),
};

export const WithIcon: Story = {
	render: () => (
		<div className="w-[350px] space-y-4">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Search employees..." className="pl-9" />
			</div>
			<div className="relative">
				<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input type="email" placeholder="Email" className="pl-9" />
			</div>
			<div className="relative">
				<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input type="password" placeholder="Password" className="pl-9" />
			</div>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		placeholder: "Disabled input",
		disabled: true,
	},
};

export const WithError: Story = {
	render: () => (
		<div className="w-[350px] space-y-2">
			<Label htmlFor="email-error">Email</Label>
			<Input
				id="email-error"
				type="email"
				placeholder="name@company.com"
				className="border-destructive"
			/>
			<p className="text-sm text-destructive">
				Please enter a valid email address
			</p>
		</div>
	),
};

export const FormExample: Story = {
	render: () => (
		<div className="w-[350px] space-y-4">
			<div className="space-y-2">
				<Label htmlFor="first-name">First Name</Label>
				<Input id="first-name" placeholder="John" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="last-name">Last Name</Label>
				<Input id="last-name" placeholder="Doe" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="email-form">Email</Label>
				<Input id="email-form" type="email" placeholder="john@company.com" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="salary">Salary</Label>
				<Input id="salary" type="number" placeholder="75000" />
			</div>
		</div>
	),
};

export const AllTypes: Story = {
	render: () => (
		<div className="w-[350px] space-y-4">
			<Input type="text" placeholder="Text input" />
			<Input type="email" placeholder="Email input" />
			<Input type="password" placeholder="Password input" />
			<Input type="number" placeholder="Number input" />
			<Input type="date" />
			<Input type="tel" placeholder="Phone input" />
			<Input type="url" placeholder="URL input" />
		</div>
	),
};
