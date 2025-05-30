import type { DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import * as React from "react";
import type { FetcherWithComponents } from "react-router";
import { Button } from "~/routes/admin/components/ui/button";
import { Alert } from "../ui/alert";
import { SectionCard, SectionHeading } from "../ui/section";
import { Switch, SwitchField, Label as SwitchLabel } from "../ui/switch";
import { Text } from "../ui/text";

// Type definitions
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
	orderFetcher: FetcherWithComponents<unknown>;
	themeUpdateFetcher: FetcherWithComponents<unknown>;
}

interface SortableItemProps {
	details: SectionDetail;
	onThemeChange: (
		sectionId: string,
		themeKey: string,
		newTheme: SectionTheme,
	) => void;
	fetcherData: { errors?: Record<string, string> } | undefined;
}

export default function SectionSorter({
	initialSectionsFromDb,
	sectionDetailsOrdered,
	orderFetcher,
	themeUpdateFetcher,
}: SectionSorterProps): React.ReactElement {
	const [orderedItems, setOrderedItems] = React.useState<SectionDetail[]>(
		() => {
			const dbOrderMap = new Map(
				(initialSectionsFromDb ?? []).map((s, index) => [s.id, index]),
			);
			return (sectionDetailsOrdered ?? [])
				.map((detail) => ({
					...detail,
					currentTheme:
						initialSectionsFromDb?.find((s) => s.id === detail.id)?.theme ??
						detail.currentTheme,
				}))
				.sort(
					(a, b) =>
						(dbOrderMap.get(a.id) ?? Number.POSITIVE_INFINITY) -
						(dbOrderMap.get(b.id) ?? Number.POSITIVE_INFINITY),
				);
		},
	);

	React.useEffect(() => {
		const dbOrderMap = new Map(
			(initialSectionsFromDb ?? []).map((s, index) => [s.id, index]),
		);
		const currentSortedDetails = (sectionDetailsOrdered ?? [])
			.map((detail) => ({
				...detail,
				currentTheme:
					initialSectionsFromDb?.find((s) => s.id === detail.id)?.theme ??
					detail.currentTheme,
			}))
			.sort(
				(a, b) =>
					(dbOrderMap.get(a.id) ?? Number.POSITIVE_INFINITY) -
					(dbOrderMap.get(b.id) ?? Number.POSITIVE_INFINITY),
			);
		setOrderedItems(currentSortedDetails);
	}, [initialSectionsFromDb, sectionDetailsOrdered]);

	const [lastSubmittedOrder, setLastSubmittedOrder] = React.useState<string>(
		() => (initialSectionsFromDb ?? []).map((s) => s.id).join(","),
	);

	const [lastSubmittedThemes, setLastSubmittedThemes] = React.useState<
		Record<string, SectionTheme>
	>(() =>
		(initialSectionsFromDb ?? []).reduce(
			(acc, sec) => {
				acc[sec.themeKey] = sec.theme;
				return acc;
			},
			{} as Record<string, SectionTheme>,
		),
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	React.useEffect(() => {
		const currentOrder = orderedItems.map((s) => s.id).join(",");
		if (
			currentOrder !== lastSubmittedOrder &&
			orderFetcher.state === "idle" &&
			orderedItems.length > 0
		) {
			const formData = new FormData();
			formData.append("intent", "reorderSections");
			formData.append("home_sections_order", currentOrder);
			orderFetcher.submit(formData, { method: "post", action: "/admin" });
			setLastSubmittedOrder(currentOrder);
		}
	}, [orderedItems, orderFetcher, lastSubmittedOrder]);

	const handleThemeChange = React.useCallback(
		(sectionId: string, themeKey: string, newTheme: SectionTheme) => {
			if (
				lastSubmittedThemes[themeKey] === newTheme ||
				themeUpdateFetcher.state !== "idle"
			)
				return;

			setOrderedItems((prev) =>
				prev.map((item) =>
					item.id === sectionId ? { ...item, currentTheme: newTheme } : item,
				),
			);

			setLastSubmittedThemes((prev) => ({ ...prev, [themeKey]: newTheme }));

			const formData = new FormData();
			formData.append("intent", "updateTextContent");
			formData.append("page", "home");
			formData.append("section_id", sectionId);
			formData.append(themeKey, newTheme);
			themeUpdateFetcher.submit(formData, { method: "post", action: "/admin" });
		},
		[lastSubmittedThemes, themeUpdateFetcher],
	);

	const handleDragEnd = React.useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setOrderedItems((prev) => {
				const oldIndex = prev.findIndex((item) => item.id === active.id);
				const newIndex = prev.findIndex((item) => item.id === over.id);
				return oldIndex < 0 || newIndex < 0
					? prev
					: arrayMove(prev, oldIndex, newIndex);
			});
		}
	}, []);

	if (!orderedItems.length) {
		return (
			<Text className="text-slate-400">No sections available to sort.</Text>
		);
	}

	return (
		<SectionCard>
			<SectionHeading className="mb-4">Reorder & Theme Sections</SectionHeading>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
			>
				<SortableContext
					items={orderedItems.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<ul className="space-y-3">
						{orderedItems.map((itemDetails) => (
							<SortableItem
								key={itemDetails.id}
								details={itemDetails}
								onThemeChange={handleThemeChange}
								fetcherData={themeUpdateFetcher.data}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</SectionCard>
	);
}

function SortableItem({
	details,
	onThemeChange,
	fetcherData,
}: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: details.id });
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition: transition ?? "transform 250ms ease",
		zIndex: isDragging ? 100 : undefined,
		opacity: isDragging ? 0.5 : 1,
	};

	const switchId = `${details.id}-theme-toggle`;
	const themeError = fetcherData?.errors?.[details.themeKey];
	const isLight = details.currentTheme === "light";

	return (
		<li
			ref={setNodeRef}
			style={style}
			className={clsx(
				"p-4 bg-admin-white border border-admin-border rounded-lg shadow-sm flex items-center justify-between transition-all duration-200",
				{ "shadow-xl bg-blue-50": isDragging },
			)}
		>
			<div className="flex items-center min-w-0">
				<Button
					{...attributes}
					{...listeners}
					aria-label={`Reorder ${details.label}`}
					variant="outline"
					size="sm"
					className="mr-4 cursor-grab touch-none"
				>
					<svg
						className="h-5 w-5 text-admin-text-muted"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				</Button>
				<span className="text-sm font-semibold text-admin-foreground truncate">
					{details.label}
				</span>
			</div>
			<div className="flex items-center space-x-3">
				<SwitchField>
					<Switch
						id={switchId}
						name={details.themeKey}
						checked={!isLight}
						onChange={(checked) =>
							onThemeChange(
								details.id,
								details.themeKey,
								checked ? "dark" : "light",
							)
						}
						aria-describedby={themeError ? `${switchId}-error` : undefined}
						aria-label={`Toggle theme for ${details.label}`}
					/>
					<SwitchLabel
						htmlFor={switchId}
						className="text-xs text-admin-text-muted"
					>
						{isLight ? "Light" : "Dark"}
					</SwitchLabel>
				</SwitchField>
				{themeError && (
					<Alert
						id={`${switchId}-error`}
						variant="error"
						showIcon={false}
						className="text-xs text-red-600 py-0.5 px-1.5"
						aria-live="polite"
					>
						{themeError}
					</Alert>
				)}
			</div>
		</li>
	);
}
