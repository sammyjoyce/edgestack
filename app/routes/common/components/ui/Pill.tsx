import clsx from "clsx";
import React, { type ReactNode } from "react";

/**
 * Status types for Pills
 */
export enum PillStatus {
	Info = "info",
	Success = "success",
	Warning = "warning",
	Error = "error",
}

// Helper to combine class names - replaced with clsx
// function cn(...classes: (string | undefined)[]) {
// 	return classes.filter(Boolean).join(" ");
// }

/**
 * Props for Pill component
 */
export interface PillProps {
	status?: PillStatus;
	variant?: "default" | "outline" | "secondary" | "neutral";
	children: ReactNode;
	className?: string;
}

/**
 * Pill component for displaying status messages
 */
export function Pill({
	status,
	variant = "default",
	children,
	className,
}: PillProps) {
	const baseClasses =
		"inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border";
	let variantClasses = "";
	let statusClasses = "";

	// Apply variant styles
	if (variant === "outline") {
		variantClasses = "border-slate-300 text-slate-700 bg-transparent";
	} else if (variant === "secondary") {
		variantClasses = "border-slate-200 bg-slate-100 text-slate-900";
	} else {
		// Apply status-based styling if provided (default variant)
		switch (status) {
			case PillStatus.Success:
				statusClasses = "bg-green-50 text-green-700 border-green-200";
				break;
			case PillStatus.Warning:
				statusClasses = "bg-yellow-50 text-yellow-700 border-yellow-200";
				break;
			case PillStatus.Error:
				statusClasses = "bg-red-50 text-red-700 border-red-200";
				break;
			case PillStatus.Info:
				statusClasses = "bg-blue-50 text-blue-700 border-blue-200";
				break;
			default:
				statusClasses = "bg-slate-100 text-slate-700 border-slate-200";
				break;
		}
	}

	return (
		<span
			className={clsx(baseClasses, variantClasses, statusClasses, className)}
		>
			{children}
		</span>
	);
}

// Component for PillStatus to fix the error in TextContentForm
export function PillStatusComponent({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
