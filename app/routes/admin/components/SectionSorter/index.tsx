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
// Import the specific action type
import type { action as adminIndexAction } from "~/routes/admin/views/index";

type Section = { id: string; label: string };

interface SectionSorterProps {
	/** Persisted comma-separated order string, e.g. `"hero,services,about,contact"` */
	orderValue: string | undefined;
	/** Fetcher from AdminDashboard – we reuse it to save after each drag */
	fetcher: FetcherWithComponents<typeof adminIndexAction>; // Use inferred type
}

/** Default order if no value persisted */
const DEFAULT_SECTIONS: Section[] = [
	{ id: "hero", label: "Hero" },
	{ id: "services", label: "Services" },
	{ id: "projects", label: "Projects" },
	{ id: "about", label: "About" },
	{ id: "contact", label: "Contact" },
];

export default function SectionSorter({
	orderValue,
	fetcher,
}: SectionSorterProps): React.ReactElement {
	// Use React.ReactElement
	/* --- Local state ------------------------------------------------------- */
	const [sections, setSections] = useState<Section[]>(() => {
		if (!orderValue) return DEFAULT_SECTIONS;
		const ids = orderValue.split(",");
		return ids
			.map((id) => DEFAULT_SECTIONS.find((s) => s.id === id))
			.filter(Boolean) as Section[];
	});

	// Live‑region status for screen readers
	const [statusMessage, setStatusMessage] = useState<string>("");

	/* --- Sensors ----------------------------------------------------------- */
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor),
	);

	/* --- Persist order after every change ---------------------------------- */
	useEffect(() => {
		// Prevent initial submission on mount if order hasn't changed
		const initialOrder =
			orderValue || DEFAULT_SECTIONS.map((s) => s.id).join(",");
		const currentOrder = sections.map((s) => s.id).join(",");

		if (
			initialOrder === currentOrder &&
			fetcher.state === "idle" &&
			!fetcher.data
		) {
			return;
		}

		const data = new FormData();
		data.append("intent", "reorderSections");
		data.append("home_sections_order", currentOrder);
		fetcher.submit(data, { method: "post", action: "/admin" });
	}, [sections, fetcher, orderValue]);

	/* --- Drag end handler -------------------------------------------------- */
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
						{sections.map((s, idx) => (
							<SortableItem
								key={s.id}
								id={s.id}
								label={s.label}
								index={idx}
								total={sections.length}
								updateStatus={setStatusMessage}
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
	label,
	index,
	total,
	updateStatus,
}: {
	id: string;
	label: string;
	index: number;
	total: number;
	updateStatus: (msg: string) => void;
}): React.ReactElement {
	// Use React.ReactElement
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

	// Announce order changes for screen readers
	React.useEffect(() => {
		if (isDragging) {
			updateStatus(`Moving ${label}, position ${index + 1} of ${total}.`);
		} else {
			updateStatus("");
		}
	}, [isDragging, label, index, total, updateStatus]);

	return (
		<li
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={style}
			className={`flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 shadow-xs cursor-grab focus:outline-none focus:ring-2 focus:ring-primary ${
				isDragging ? "opacity-50 ring-2 ring-primary" : ""
			}`}
			aria-label={`Section ${label}, position ${
				index + 1
			} of ${total}. Use arrow keys to move.`}
			aria-grabbed={isDragging}
			aria-roledescription="draggable section"
		>
			<span>{label}</span>
			<span
				className="text-sm text-gray-400"
				title="Drag to reorder"
				aria-label="Drag to reorder"
				tabIndex={-1}
			>
				↕
			</span>
		</li>
	);
}
