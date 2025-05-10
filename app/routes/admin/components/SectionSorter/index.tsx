import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { Active, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";
import clsx from "clsx";
import { Switch, Label as SwitchLabel } from "~/routes/admin/components/ui/switch";
import { Button } from "~/routes/admin/components/ui/button";
import type { SerializeFrom } from "react-router";
import SwitchField from "~/routes/common/components/ui/SwitchField.tsx"; 
import type { Route as AdminIndexRoute } from "../../views/+types";

export type SectionTheme = "light" | "dark";
export interface Section { 
	id: string;
	label: string;
	theme: SectionTheme;
	themeKey: string; 
}

interface SectionDetail { 
    id: string; 
    label: string;
	currentTheme?: SectionTheme | null; 
    themeKey: string;
}

interface SectionSorterProps {
	initialSectionsFromDb: Section[]; 
    sectionDetailsOrdered: SectionDetail[]; 
	orderFetcher: FetcherWithComponents<AdminIndexRoute.ActionData>;
	themeUpdateFetcher: FetcherWithComponents<AdminIndexRoute.ActionData>;
}

interface SortableItemProps {
	details: SectionDetail; 
	onThemeChange: (sectionKey: string, themeKey: string, newTheme: SectionTheme) => void;
    fetcherData: AdminIndexRoute.ActionData | undefined;
}

export default function SectionSorter({
	initialSectionsFromDb,
    sectionDetailsOrdered,
	orderFetcher,
	themeUpdateFetcher,
}: SectionSorterProps): React.ReactElement {
	// Internal state for dnd-kit, derived from sectionDetailsOrdered and initialSectionsFromDb
    const [orderedItems, setOrderedItems] = React.useState<SectionDetail[]>(() => {
        const dbOrder = initialSectionsFromDb.map(s => s.id);
        return sectionDetailsOrdered.sort((a, b) => dbOrder.indexOf(a.id) - dbOrder.indexOf(b.id));
    });

	React.useEffect(() => {
        const dbOrder = initialSectionsFromDb.map(s => s.id);
        const currentSortedDetails = [...sectionDetailsOrdered].sort((a,b) => dbOrder.indexOf(a.id) - dbOrder.indexOf(b.id));
        setOrderedItems(currentSortedDetails);
	}, [initialSectionsFromDb, sectionDetailsOrdered]);
    
	const [statusMessage, setStatusMessage] = React.useState<string>("");

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	React.useEffect(() => {
		const initialOrderString = initialSectionsFromDb.map((s) => s.id).join(",");
		const currentOrder = orderedItems.map((s) => s.id).join(",");
		if (
			initialOrderString !== currentOrder &&
			orderFetcher.state === "idle"
		) {
			const data = new FormData();
			data.append("intent", "reorderSections");
			data.append("home_sections_order", currentOrder);
			orderFetcher.submit(data, { method: "post", action: "/admin" });
		}
	}, [orderedItems, orderFetcher, initialSectionsFromDb]);

	const handleThemeChange = React.useCallback(
		(sectionKey: string, themeKey: string, newTheme: SectionTheme) => {
            // Optimistic UI update for theme
            setOrderedItems(prevItems => prevItems.map(item => 
                item.id === sectionKey ? { ...item, currentTheme: newTheme } : item
            ));

			const formData = new FormData();
			formData.append("intent", "updateTextContent");
			formData.append("page", "home"); 
			formData.append("section", sectionKey); 
			formData.append(themeKey, newTheme);
			themeUpdateFetcher.submit(formData, { method: "post", action: "/admin" });
		},
		[themeUpdateFetcher],
	);

	const handleDragEnd = React.useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setOrderedItems((prev) => {
				const oldIndex = prev.findIndex(item => item.id === active.id);
				const newIndex = prev.findIndex(item => item.id === over.id);
				return arrayMove(prev, oldIndex, newIndex);
			});
		}
		setStatusMessage(""); 
	}, []);

	if (!orderedItems || orderedItems.length === 0) {
		return <p className="text-slate-400">No sections available to sort.</p>;
	}

	return (
		<section aria-labelledby="section-sorter-heading" className="p-4 bg-slate-800 rounded-lg shadow">
			<h2 id="section-sorter-heading" className="text-xl font-semibold text-slate-100 mb-4">
				Reorder & Theme Sections
			</h2>
			{statusMessage && (
				<div className="sr-only" aria-live="assertive" aria-atomic="true">
					{statusMessage}
				</div>
			)}
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
			>
				<SortableContext items={orderedItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
					<ul className="space-y-2">
						{orderedItems.map((itemDetails) => (
							<SortableItem
								key={itemDetails.id}
								details={itemDetails}
                                onThemeChange={handleThemeChange}
                                fetcherData={themeUpdateFetcher.data as AdminIndexRoute.ActionData | undefined}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
			{/* Commented out generic message as errors are per item now
			{themeUpdateFetcher.data && themeUpdateFetcher.data.message && (
				<p
					className={`mt-4 text-sm ${themeUpdateFetcher.data.success ? "text-green-400" : "text-red-400"}`}
				>
					{themeUpdateFetcher.data.message}
				</p>
			)} 
            */}
		</section>
	);
}

function SortableItem({ details, onThemeChange, fetcherData }: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: details.id,
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : undefined,
	};

    const themeErrorForThisItem = fetcherData?.errors?.[details.themeKey ?? ""];
    const isLight = details.currentTheme === "light";

	return (
		<li
			ref={setNodeRef}
			style={style}
            className={clsx(
                "p-3 bg-slate-700 rounded-md shadow flex items-center justify-between",
                { "opacity-50": isDragging }
            )}
		>
			<div className="flex items-center">
				<Button
					variant="outline"
					className="cursor-grab p-2 text-slate-300 hover:bg-slate-600 focus-visible:ring-primary-500 mr-3"
					aria-label={`Drag ${details.label} section`}
					{...attributes}
					{...listeners}
				>
					<svg
						className="h-5 w-5"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</Button>
				<span className="text-sm font-medium text-slate-100 select-none">{details.label}</span>
			</div>
			<div className="flex items-center">
                <SwitchField className="flex flex-col items-center !gap-0 mr-2">
                    <Switch
                        id={`${details.id}-theme-toggle`}
                       	name={details.themeKey} 
                        checked={!isLight} 
                        onChange={(isChecked: boolean) => onThemeChange(details.id, details.themeKey, isChecked ? "dark" : "light")}
                        aria-label={`Theme for ${details.label} section. Current theme: ${isLight ? "Light" : "Dark"}.`}
                    />
                    <SwitchLabel
                        htmlFor={`${details.id}-theme-toggle`}
                        className="text-xs text-slate-300 font-normal select-none whitespace-nowrap mt-1"
                    >
                        Current: {isLight ? "Light" : "Dark"}
                    </SwitchLabel>
                </SwitchField>
					{themeErrorForThisItem && (
						<p className="text-xs text-red-400 mt-1 w-full text-right">
							Error: {themeErrorForThisItem}
						</p>
					)}
			</div>
		</li>
	);
}
