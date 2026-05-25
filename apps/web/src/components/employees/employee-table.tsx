import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@repo/utils";
import type { Employee, PaginatedResponse } from "@repo/types";

interface EmployeeTableProps {
	data: Employee[];
	isLoading: boolean;
	pagination?: PaginatedResponse<Employee>["meta"];
	onPageChange: (page: number) => void;
	onEdit: (employee: Employee) => void;
	onDelete: (id: string) => void;
}

export function EmployeeTable({
	data,
	isLoading,
	pagination,
	onPageChange,
	onEdit,
	onDelete,
}: EmployeeTableProps) {
	if (isLoading) {
		return (
			<Card className="overflow-hidden">
				<div className="p-8 text-center">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
					<p className="mt-2 text-sm text-muted-foreground">
						Loading employees...
					</p>
				</div>
			</Card>
		);
	}

	if (data.length === 0) {
		return (
			<Card className="p-8 text-center">
				<p className="text-muted-foreground">No employees found</p>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b bg-muted/50">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Name
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Email
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Department
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Job Title
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Country
								</th>
								<th className="px-4 py-3 text-right text-sm font-medium">
									Salary
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium">
									Status
								</th>
								<th className="px-4 py-3 text-right text-sm font-medium">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{data.map((employee) => (
								<tr
									key={employee.id}
									className="hover:bg-muted/50 transition-colors"
								>
									<td className="px-4 py-3">
										<div>
											<p className="font-medium">{employee.fullName}</p>
											<p className="text-xs text-muted-foreground">
												Joined {formatDate(employee.joiningDate)}
											</p>
										</div>
									</td>
									<td className="px-4 py-3 text-sm">{employee.email}</td>
									<td className="px-4 py-3 text-sm">{employee.department}</td>
									<td className="px-4 py-3 text-sm">{employee.jobTitle}</td>
									<td className="px-4 py-3 text-sm">{employee.country}</td>
									<td className="px-4 py-3 text-right text-sm font-medium">
										{formatCurrency(employee.salary, employee.currency)}
									</td>
									<td className="px-4 py-3">
										<span
											className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
												employee.status === "ACTIVE"
													? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
													: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
											}`}
										>
											{employee.status}
										</span>
									</td>
									<td className="px-4 py-3 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => onEdit(employee)}>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => onDelete(employee.id)}
													className="text-destructive"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>

			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
						{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
						{pagination.total} employees
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(pagination.page - 1)}
							disabled={!pagination.hasPreviousPage}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(pagination.page + 1)}
							disabled={!pagination.hasNextPage}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
