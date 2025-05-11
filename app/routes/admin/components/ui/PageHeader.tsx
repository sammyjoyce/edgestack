import clsx from "clsx";
import type React from "react";
import { Heading } from "./heading";

interface PageHeaderProps {
	title: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
}

export function PageHeader({ title, actions, className }: PageHeaderProps) {
	return (
		<div
			className={clsx(
				"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-8",
				className,
			)}
		>
			<Heading level={1} className="mb-0">
				{title}
			</Heading>
			{actions && <div className="shrink-0">{actions}</div>}
		</div>
	);
}
