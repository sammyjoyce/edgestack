import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState, useCallback } from "react";
import type { FetcherWithComponents } from "react-router";
import clsx from "clsx";
import type { Route as AdminIndexRoute } from "~/routes/admin/views/+types/index";
import {
	SwitchField,
	Switch,
	Label as SwitchLabel,
} from "~/routes/admin/components/ui/switch"; 
export type SectionTheme = "light" | "dark";
export type Section = {
	id: string;
	label: string;
	theme: SectionTheme;
	themeKey: string; 
};
interface SectionSorterProps {
	initialSections: Section[];
	orderFetcher: FetcherWithComponents<AdminIndexRoute.ActionData>;
	themeUpdateFetcher: FetcherWithComponents<AdminIndexRoute.ActionData>;
}
export default function SectionSorter({
	initialSections,
	orderFetcher,
	themeUpdateFetcher,
}: SectionSorterProps): React.ReactElement {
	const [sections, setSections] = useState<Section[]>(initialSections);
	useEffect(() => {
		setSections(initialSections);
	}, [initialSections]);
	const [statusMessage, setStatusMessage] = useState<string>("");
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor),
	);
	useEffect(() => {
		const initialOrderString = initialSections.map((s) => s.id).join(",");
		const currentOrder = sections.map((s) => s.id).join(",");
		if (
			initialOrderString === currentOrder &&
			orderFetcher.state === "idle" &&
			!orderFetcher.data 
		) {
			return;
		}
		if (initialOrderString !== currentOrder) {
			const data = new FormData();
			data.append("intent", "reorderSections");
			data.append("home_sections_order", currentOrder);
			orderFetcher.submit(data, { method: "post", action: "/admin" });
		}
	}, [sections, orderFetcher, initialSections]);
	const handleThemeChange = useCallback(
		(sectionId: string, newTheme: SectionTheme) => {
			const sectionToUpdate = sections.find((s) => s.id === sectionId);
			if (!sectionToUpdate) return;
			setSections((prevSections) =>
				prevSections.map((s) =>
					s.id === sectionId ? { ...s, theme: newTheme } : s,
				),
			);
			const data = new FormData();
			data.append("intent", "updateTextContent"); 
			data.append(sectionToUpdate.themeKey, newTheme);
			themeUpdateFetcher.submit(data, { method: "post", action: "/admin" });
		},
		[sections, themeUpdateFetcher],
	);
	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setSections((prev) => {
				const oldIndex = prev.findIndex((s) => s.id === active.id);
				const newIndex = prev.findIndex((s) => s.id === over.id);
				return arrayMove(prev, oldIndex, newIndex);
			});
		}
	}, []);
	return (
		<section
			className="bg-white p-6 rounded-lg shadow-xs border border-gray-200"
			aria-labelledby="section-order-heading"
		>
			<h2
				id="section-order-heading"
				className="text-xl font-semibold text-gray-900 mb-2"
			>
				Home Page Section Order
			</h2>
			<p
				id="section-sorter-instructions"
				className="text-sm text-gray-600 mb-4"
			>
				Drag and drop to reorder sections. Changes are saved automatically.
			</p>
			<div
				role="status"
				aria-live="polite"
				className="text-sm text-gray-600 h-5 mb-4"
			>
				{statusMessage}
			</div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={sections}
					strategy={verticalListSortingStrategy}
				>
					<ul
						className="flex flex-col gap-2"
						aria-describedby="section-sorter-instructions"
					>
						{sections.map((section, idx) => (
							<SortableItem
								key={section.id}
								id={section.id}
								section={section} 
								index={idx}
								total={sections.length}
								updateStatus={setStatusMessage}
								onThemeChange={handleThemeChange}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</section>
	);
}
function SortableItem({
	id,
	section, 
	index,
	total,
	updateStatus,
	onThemeChange,
}: {
	id: string;
	section: Section; 
	index: number;
	total: number;
	updateStatus: (msg: string) => void;
	onThemeChange: (sectionId: string, newTheme: SectionTheme) => void;
}): React.ReactElement {
	const { label, theme, themeKey } = section; 
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	React.useEffect(() => {
		if (isDragging) {
			updateStatus(
				`Moving ${label}, current theme ${theme}, position ${
					index + 1
				} of ${total}.`,
			);
		} else {
			updateStatus(""); 
		}
	}, [isDragging, label, theme, index, total, updateStatus]);
	const handleLocalThemeChange = (isChecked: boolean) => {
		onThemeChange(id, isChecked ? "dark" : "light");
	};
	return (
		<li
			ref={setNodeRef}
			style={style} 
			className={clsx(
				"flex flex-col sm:flex-row items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary",
				isDragging && "opacity-50 ring-2 ring-primary",
			)}
			role="option"
			aria-selected={isDragging}
			aria-roledescription="draggable section with theme toggle"
			tabIndex={0} 
		>
			<div
				{...attributes} 
				{...listeners} 
				className="flex-grow flex items-center cursor-grab py-1 sm:py-0"
				aria-label={`Section ${label}, position ${
					index + 1
				} of ${total}. Use arrow keys to move.`}
			>
				<span className="mr-auto">{label}</span>
				<span
					className="text-sm text-gray-400 ml-2 hidden sm:inline" 
					title="Drag to reorder"
					aria-hidden="true" 
				>
					↕
				</span>
			</div>
			<div className="flex items-center mt-2 sm:mt-0 sm:ml-4">
				<SwitchField className="flex items-center">
					<SwitchLabel
						htmlFor={themeKey}
						className="text-sm text-gray-700 mr-2"
					>
						Theme: {theme === "dark" ? "Dark" : "Light"}
					</SwitchLabel>
					<Switch
						id={themeKey} 
						checked={theme === "dark"}
						onChange={handleLocalThemeChange}
						aria-label={`Toggle theme for ${label} section. Current theme: ${theme}.`}
					/>
				</SwitchField>
			</div>
		</li>
	);
}
