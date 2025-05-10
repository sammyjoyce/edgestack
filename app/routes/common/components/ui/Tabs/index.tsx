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
}: {
	tabs: Tab[];
	containerClassName?: string;
	activeTabClassName?: string;
	tabClassName?: string;
	contentClassName?: string;
}) => {
	const [active, setActive] = useState<Tab>(propTabs[0]);
	const [tabs, setTabs] = useState<Tab[]>(propTabs);
	const moveSelectedTabToTop = (idx: number) => {
		const newTabs = [...propTabs];
		const selectedTab = newTabs.splice(idx, 1);
		newTabs.unshift(selectedTab[0]);
		setTabs(newTabs);
		setActive(newTabs[0]);
	};
	const isActive = (tab: Tab) => tab.value === active.value;
	return (
		<>
			<div
				className={cn(
					"flex flex-row items-center justify-start relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full border-b border-neutral-300 pb-px",
					containerClassName,
				)}
			>
				{propTabs.map((tab, idx) => (
					<button
						key={tab.title}
						onClick={() => {
							moveSelectedTabToTop(idx);
						}}
						className={cn(
							"relative px-3 py-2.5 text-sm font-medium focus:outline-none transition-colors duration-150 ease-in-out border-b-2",
							isActive(tab)
								? activeTabClassName || "text-primary border-primary"
								: tabClassName ||
										"text-neutral-600 hover:text-foreground border-transparent hover:border-neutral-400",
						)}
						type="button"
					>
						<span className="relative block">{tab.title}</span>
					</button>
				))}
			</div>
			<FadeInDiv
				tabs={tabs}
				active={active}
				key={active.value}
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
