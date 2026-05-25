import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider duration={3000}>
			{toasts.map(({ id, title, description, action, variant, ...props }) => {
				const isSuccess =
					variant === "success" ||
					title === "Success" ||
					(typeof title === "string" &&
						title.toLowerCase().includes("success"));
				const isDestructive =
					variant === "destructive" ||
					title === "Error" ||
					(typeof title === "string" && title.toLowerCase().includes("error"));

				const resolvedVariant = isDestructive
					? "destructive"
					: isSuccess
						? "success"
						: "default";

				return (
					<Toast key={id} variant={resolvedVariant} {...props}>
						<div className="flex items-start gap-3">
							<div className="mt-0.5 flex-shrink-0">
								{isDestructive && (
									<AlertCircle className="h-5 w-5 text-rose-500" />
								)}
								{isSuccess && (
									<CheckCircle2 className="h-5 w-5 text-emerald-500" />
								)}
								{!isDestructive && !isSuccess && (
									<Info className="h-5 w-5 text-blue-500" />
								)}
							</div>
							<div className="grid gap-1">
								{title && (
									<ToastTitle className="text-sm font-semibold text-slate-900">
										{title}
									</ToastTitle>
								)}
								{description && (
									<ToastDescription className="text-xs font-medium text-slate-500">
										{description}
									</ToastDescription>
								)}
							</div>
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
