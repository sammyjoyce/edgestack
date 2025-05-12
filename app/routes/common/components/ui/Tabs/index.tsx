import clsx from "clsx";
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence,
	LayoutGroup,
} from "framer-motion";
import type React from "react";
import { useState, useRef, useEffect } from "react";

function cn(...inputs: (string | undefined | null | boolean)[]) {
	return clsx(inputs);
}

// Scroll button icons
const ChevronLeftIcon = () => (
	<svg
		className="w-4 h-4 stroke-current"
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M10.25 12.75L5.75 8L10.25 3.25"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
const ChevronRightIcon = () => (
	<svg
		className="w-4 h-4 stroke-current"
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M5.75 3.25L10.25 8L5.75 12.75"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

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

	// Fade logic
	const tabListRef = useRef<HTMLDivElement>(null);
	// Framer Motion: derive fade opacity from scroll position
	const { scrollXProgress } = useScroll({ container: tabListRef });
	const leftOpacity = useTransform(scrollXProgress, [0, 0.03], [0, 1]);
	const rightOpacity = useTransform(scrollXProgress, [0.97, 1], [1, 0]);

	// Detect if tab list is overflowing
	const [isOverflowing, setIsOverflowing] = useState(false);
	useEffect(() => {
		const checkOverflow = () => {
			const el = tabListRef.current;
			if (el) {
				setIsOverflowing(el.scrollWidth > el.clientWidth);
			}
		};
		checkOverflow();
		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [propTabs.length]);

	const handleTabClick = (value: string) => {
		if (onTabChange) {
			onTabChange(value);
		} else {
			setInternalActiveValue(value);
		}
	};

	// Keyboard navigation
	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLButtonElement>,
		index: number,
	) => {
		const values = propTabs.map((tab) => tab.value);
		let newIndex = index;
		switch (e.key) {
			case "ArrowRight":
			case "ArrowDown":
				e.preventDefault();
				newIndex = (index + 1) % values.length;
				break;
			case "ArrowLeft":
			case "ArrowUp":
				e.preventDefault();
				newIndex = (index - 1 + values.length) % values.length;
				break;
			case "Home":
				e.preventDefault();
				newIndex = 0;
				break;
			case "End":
				e.preventDefault();
				newIndex = values.length - 1;
				break;
			default:
				return;
		}
		handleTabClick(values[newIndex]);
		// Move focus
		const tabs =
			tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		tabs?.[newIndex]?.focus();
	};

	return (
		<LayoutGroup>
			<div className="relative">
				<div
					ref={tabListRef}
					role="tablist"
					aria-orientation="horizontal"
					className={cn(
						"flex flex-row items-center justify-start overflow-auto scrollbar-hide max-w-full w-full border-b border-admin-border",
						containerClassName,
					)}
				>
					{propTabs.map((tab, index) => (
						<button
							key={tab.value}
							id={`tab-${tab.value}`}
							role="tab"
							aria-selected={activeValue === tab.value}
							aria-controls={`panel-${tab.value}`}
							className={cn(
								"relative px-3 py-2.5 text-sm font-medium focus:outline-none focus:text-admin-primary focus:border-admin-primary transition-colors duration-150 ease-in-out border-b-2 whitespace-nowrap",
								activeValue === tab.value
									? activeTabClassName ||
											"text-admin-primary border-admin-primary -mb-px"
									: tabClassName ||
											"text-admin-text-muted hover:text-admin-text border-transparent hover:border-admin-border",
							)}
							type="button"
							onClick={() => handleTabClick(tab.value)}
							onKeyDown={(e) => handleKeyDown(e, index)}
						>
							<span className="relative block">{tab.title}</span>
						</button>
					))}
				</div>
				{isOverflowing && (
					<>
						<motion.div
							style={{ opacity: leftOpacity }}
							className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/80 to-transparent"
						/>
						<motion.button
							onClick={() =>
								tabListRef.current?.scrollBy({ left: -200, behavior: "smooth" })
							}
							className="absolute left-0 inset-y-0 px-2 flex items-center justify-center bg-white/50 hover:bg-white/80 transition-colors"
							style={{ opacity: leftOpacity }}
							whileTap={{ scale: 0.95 }}
							aria-hidden="true"
						>
							<ChevronLeftIcon />
						</motion.button>
						<motion.div
							style={{ opacity: rightOpacity }}
							className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/80 to-transparent"
						/>
						<motion.button
							onClick={() =>
								tabListRef.current?.scrollBy({ left: 200, behavior: "smooth" })
							}
							className="absolute right-0 inset-y-0 px-2 flex items-center justify-center bg-white/50 hover:bg-white/80 transition-colors"
							style={{ opacity: rightOpacity }}
							whileTap={{ scale: 0.95 }}
							aria-hidden="true"
						>
							<ChevronRightIcon />
						</motion.button>
					</>
				)}
		
			<div className="relative w-full h-full">
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={activeTab.value}
						id={`panel-${activeTab.value}`}
						role="tabpanel"
						aria-labelledby={`tab-${activeTab.value}`}
						className={cn("mt-4 w-full h-full", contentClassName)}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
					>
						{activeTab.content}
					</motion.div>
				</AnimatePresence>
			</div>
			</div>
		</LayoutGroup>
	);
};
