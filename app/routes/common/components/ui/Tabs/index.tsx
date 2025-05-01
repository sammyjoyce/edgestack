import clsx from "clsx"; // For combining class names
import { motion } from "framer-motion"; // Use framer-motion
import type React from "react";
import { useState } from "react";

// Basic cn utility function (replace with your preferred library if available)
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

	const [hovering, setHovering] = useState(false);

	return (
		<>
			<div
				className={cn(
					"flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full border-b border-gray-200 pb-2", // Added border and padding
					containerClassName,
				)}
			>
				{propTabs.map((tab, idx) => (
					<button
						key={tab.title}
						onClick={() => {
							moveSelectedTabToTop(idx);
						}}
						onMouseEnter={() => setHovering(true)}
						onMouseLeave={() => setHovering(false)}
						className={cn(
							"relative px-4 py-2 rounded-full text-sm font-medium", // Adjusted size
							tabClassName,
						)}
						style={{
							transformStyle: "preserve-3d",
						}}
					>
						{active.value === tab.value && (
							<motion.div
								layoutId="clickedbutton"
								transition={{ type: "spring", bounce: 0.12, duration: 0.5 }}
								className={cn(
									"absolute inset-0 bg-gray-100 border border-gray-300 rounded-full", // Adjusted active style
									activeTabClassName,
								)}
							/>
						)}

						<span className="relative block text-gray-700 hover:text-black">
							{" "}
							{/* Adjusted text color */}
							{tab.title}
						</span>
					</button>
				))}
			</div>
			{/* Ensure FadeInDiv receives the active prop */}
			<FadeInDiv
				tabs={tabs}
				active={active} // Pass active state
				key={active.value}
				hovering={hovering}
				className={cn("mt-8", contentClassName)} // Reduced margin-top
			/>
		</>
	);
};

export const FadeInDiv = ({
	className,
	tabs,
	active, // Receive active state
	hovering,
}: {
	className?: string;
	key?: string;
	tabs: Tab[];
	active: Tab; // Add active prop type
	hovering?: boolean;
}) => {
	// Use the passed 'active' state to determine the active tab
	const isActive = (tab: Tab) => {
		return tab.value === active.value;
	};
	return (
		<div className="relative w-full h-full">
			{tabs.map((tab, idx) => (
				<motion.div
					key={tab.value}
					layoutId={tab.value}
					style={{
						scale: 1 - idx * 0.1,
						top: hovering ? idx * -50 : 0,
						zIndex: -idx,
						opacity: idx < 3 ? 1 - idx * 0.1 : 0,
					}}
					animate={{
						y: isActive(tab) ? [0, 15, 0] : 0,
					}}
					className={cn("w-full h-full absolute top-0 left-0", className)}
				>
					{/* Render content only for the active tab for simplicity, or adjust logic if needed */}
					{isActive(tab) ? tab.content : null}
				</motion.div>
			))}
		</div>
	);
};
