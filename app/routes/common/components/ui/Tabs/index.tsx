import clsx from "clsx";
import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";

function cn(...inputs: (string | undefined | null | boolean)[]) {
	return clsx(inputs);
}

export type Tab = {
	title: string;
	value: string;
	content?: string | React.ReactNode | any;
};
export const Tabs = ({
	tabs: propTabs,
	containerClassName,
	activeTabClassName,
	tabClassName,
	contentClassName,
	activeTabValue: controlledActiveTabValue,
	onTabChange,
}: {
	tabs: Tab[];
	containerClassName?: string;
	activeTabClassName?: string;
	tabClassName?: string;
	contentClassName?: string;
	activeTabValue?: string;
	onTabChange?: (value: string) => void;
}) => {
	// If parent controls tab state, use that; otherwise, use internal state
	const [internalActiveValue, setInternalActiveValue] = useState<string>(
		propTabs[0]?.value || "",
	);
	const activeValue = controlledActiveTabValue ?? internalActiveValue;
	const activeTab =
		propTabs.find((tab) => tab.value === activeValue) || propTabs[0];

	const handleTabClick = (value: string) => {
		if (onTabChange) {
			onTabChange(value);
		} else {
			setInternalActiveValue(value);
		}
	};

	return (
		<>
			<div
				className={cn(
					"flex flex-row items-center justify-start relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full border-b border-admin-border",
					containerClassName,
				)}
			>
				{propTabs.map((tab) => (
					<button
						key={tab.value}
						onClick={() => handleTabClick(tab.value)}
						className={cn(
							"relative px-3 py-2.5 text-sm font-medium focus:outline-none transition-colors duration-150 ease-in-out border-b-2",
							activeValue === tab.value
								? activeTabClassName ||
										"text-admin-primary border-admin-primary -mb-px"
								: tabClassName ||
										"text-admin-text-muted hover:text-admin-text border-transparent hover:border-admin-border",
						)}
						type="button"
					>
						<span className="relative block">{tab.title}</span>
					</button>
				))}
			</div>
			<FadeInDiv
				tabs={propTabs}
				active={activeTab}
				key={activeTab.value}
				className={cn("mt-6", contentClassName)}
			/>
		</>
	);
};
export const FadeInDiv = ({
	className,
	tabs,
	active,
}: {
	className?: string;
	key?: string;
	tabs: Tab[];
	active: Tab;
}) => {
	const isActive = (tab: Tab) => tab.value === active.value;
	return (
		<div className="relative w-full h-full">
			{tabs.map((tab) => (
				<motion.div
					key={tab.value}
					layoutId={tab.value}
					style={{
						display: isActive(tab) ? "block" : "none",
					}}
					className={cn("w-full h-full", className)}
				>
					{tab.content}
				</motion.div>
			))}
		</div>
	);
};
