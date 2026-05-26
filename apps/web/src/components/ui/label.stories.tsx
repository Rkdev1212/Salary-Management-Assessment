import type { Meta, StoryObj } from "@storybook/react";
import { Input, Label } from "@repo/ui";

const meta = {
	title: "Primitives/Label",
	component: Label,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Label",
	},
};

export const WithInput: Story = {
	render: () => (
		<div className="w-[350px] space-y-2">
			<Label htmlFor="username">Username</Label>
			<Input id="username" placeholder="Enter username" />
		</div>
	),
};

export const Required: Story = {
	render: () => (
		<div className="w-[350px] space-y-2">
			<Label htmlFor="email">
				Email <span className="text-destructive">*</span>
			</Label>
			<Input id="email" type="email" placeholder="name@company.com" required />
		</div>
	),
};

// export const WithDescription: Story = {
// 	render: () => (
// 		<div className="w-[350px] space-y-2">
// 			<Label htmlFor="bio">Bio</Label>
// 			<textarea
// 				id="bio"
// 				className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
// 				placeholder="Tell us about yourself"
// 			/>
// 			<p className="text-sm text-muted-foreground">
// 				Brief description for your profile
// 			</p>
// 		</div>
// 	),
// };
