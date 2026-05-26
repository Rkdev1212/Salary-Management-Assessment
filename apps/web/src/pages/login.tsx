import { Button, Input, Label, useToast } from "@repo/ui";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowRight,
	BarChart2,
	Eye,
	EyeOff,
	Lock,
	Mail,
	Shield,
	Users,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
	const navigate = useNavigate();
	const { setUser } = useAuthStore();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		setIsLoading(true);
		setApiError(null);
		try {
			const response = await authService.login(data);
			setUser(response.user);
			toast({ title: "Success", description: "Logged in successfully" });
			navigate("/dashboard");
		} catch {
			setApiError("Invalid credentials. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-[linear-gradient(135deg,#e8f4fd_0%,#ddeeff_100%)] font-sans">
			{/* ── Left / Top Branding Panel ── */}
			<div className="flex-none lg:flex-1 flex flex-col items-center justify-center p-9 px-6 pb-7 lg:p-12 lg:px-10 gap-[18px] lg:gap-[28px]">
				{/* Logo */}
				<div className="w-[58px] h-[58px] lg:w-[72px] lg:h-[72px] rounded-[18px] bg-[linear-gradient(135deg,#1a7fd4,#0f5fa8)] flex items-center justify-center shadow-[0_8px_24px_rgba(26,127,212,0.35)] shrink-0">
					<svg
						width="32"
						height="32"
						viewBox="0 0 38 38"
						fill="none"
						role="img"
						aria-labelledby="login-logo-title"
					>
						<title id="login-logo-title">Salary Management logo</title>
						<circle cx="12" cy="12" r="4" fill="white" opacity="0.9" />
						<circle cx="26" cy="12" r="4" fill="white" opacity="0.9" />
						<circle cx="12" cy="26" r="4" fill="white" opacity="0.9" />
						<circle cx="26" cy="26" r="4" fill="white" opacity="0.9" />
						<path
							d="M12 12 L26 26 M26 12 L12 26"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
							opacity="0.6"
						/>
					</svg>
				</div>

				{/* Title */}
				<div className="text-center">
					<h1 className="text-[1.75rem] lg:text-[2.4rem] font-extrabold text-[#1a1a2e] m-0 leading-[1.2]">
						Welcome to <span className="text-[#1a7fd4]">Salary</span>
						<span className="inline lg:hidden"> </span>
						<br className="hidden lg:inline" />
						<span className="text-[#1a7fd4]">Management</span>
					</h1>
					<p className="mt-2 text-[0.88rem] lg:text-[1rem] font-semibold text-[#555] tracking-[0.02em]">
						Administrator Management Portal
					</p>
				</div>

				{/* Description — hidden on very small screens to save space */}
				<p className="hidden sm:block text-[0.95rem] text-[#666] text-center max-w-[340px] leading-[1.7] m-0">
					Streamline your payroll process. Review submissions, manage approvals,
					and collaborate with your team efficiently.
				</p>

				{/* Feature icons */}
				<div className="flex gap-6 lg:gap-10 mt-0 lg:mt-2">
					{[
						{ Icon: BarChart2, label: "Analytics" },
						{ Icon: Shield, label: "Security" },
						{ Icon: Users, label: "Collaboration" },
					].map(({ Icon, label }) => (
						<div key={label} className="flex flex-col items-center gap-1.5">
							<div className="w-[38px] h-[38px] lg:w-[44px] lg:h-[44px] rounded-xl bg-[rgba(26,127,212,0.1)] flex items-center justify-center">
								<Icon
									className="w-[18px] h-[18px] lg:w-[22px] lg:h-[22px]"
									color="#1a7fd4"
								/>
							</div>
							<span className="text-[0.78rem] text-[#555] font-medium">
								{label}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* ── Right / Bottom Form Panel ── */}
			<div className="flex items-start lg:items-center justify-center p-0 px-4 pb-10 lg:p-10 lg:px-12 flex-1 lg:flex-none">
				<div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.10)] p-8 px-6 lg:p-11 lg:px-10 w-full max-w-[420px]">
					<h2 className="text-[1.4rem] lg:text-[1.7rem] font-bold text-[#1a1a2e] m-0 mb-1.5">
						Sign In
					</h2>
					<p className="text-[0.9rem] text-[#888] mb-6">
						Enter your credentials to access your account
					</p>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-[18px]"
					>
						{/* Email */}
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="email"
								className="text-[0.88rem] font-semibold text-[#333]"
							>
								Email Address
							</Label>
							<div className="relative">
								<Mail
									size={16}
									color="#aaa"
									className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
								/>
								<Input
									id="email"
									type="email"
									placeholder="admin@example.com"
									{...register("email")}
									className={`pl-10 h-[46px] rounded-[10px] text-[0.93rem] bg-[#fafafa] w-full border-[1.5px] border-solid box-border ${errors.email ? "border-[#e74c3c]" : "border-[#e0e0e0]"} focus:border-[#1a7fd4] focus:outline-none`}
								/>
							</div>
							{errors.email && (
								<p className="text-[0.8rem] text-[#e74c3c] m-0">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="password"
								className="text-[0.88rem] font-semibold text-[#333]"
							>
								Password
							</Label>
							<div className="relative">
								<Lock
									size={16}
									color="#aaa"
									className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
								/>
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									{...register("password")}
									className={`pl-10 pr-11 h-[46px] rounded-[10px] text-[0.93rem] bg-[#fafafa] w-full border-[1.5px] border-solid box-border ${errors.password ? "border-[#e74c3c]" : "border-[#e0e0e0]"} focus:border-[#1a7fd4] focus:outline-none`}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex"
								>
									{showPassword ? (
										<EyeOff size={17} color="#aaa" />
									) : (
										<Eye size={17} color="#aaa" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-[0.8rem] text-[#e74c3c] m-0">
									{errors.password.message}
								</p>
							)}
						</div>

						{/* API error */}
						{apiError && (
							<div className="bg-[#fff0f0] border-[1.5px] border-[#f5c6c6] rounded-lg p-2.5 px-3.5 text-[0.88rem] text-[#c0392b]">
								{apiError}
							</div>
						)}

						{/* Submit */}
						<Button
							type="submit"
							disabled={isLoading}
							className={`h-12 rounded-[10px] text-white text-base font-semibold border-none flex items-center justify-center gap-2 transition-all duration-200 w-full ${isLoading ? "bg-[#7fb8e8] cursor-not-allowed shadow-none" : "bg-[linear-gradient(135deg,#1a7fd4,#0f5fa8)] cursor-pointer shadow-[0_4px_14px_rgba(26,127,212,0.4)] hover:opacity-95"}`}
						>
							{isLoading ? "Signing in..." : "Sign In"}
							{!isLoading && <ArrowRight size={18} />}
						</Button>
					</form>

					{/* Footer */}
					<p className="text-center text-[0.85rem] text-[#888] mt-[22px] mb-0">
						Don't have an account?{" "}
						<a
							href="mailto:admin@yourcompany.com"
							className="text-[#1a7fd4] font-semibold no-underline hover:underline"
						>
							Contact your administrator
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
