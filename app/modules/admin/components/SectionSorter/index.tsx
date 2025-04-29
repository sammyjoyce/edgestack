import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useState, useCallback } from "react";
import type { FetcherWithComponents } from "react-router";
import type { AdminActionResponse } from "~/modules/admin/pages"; // Import the action response type

type Section = { id: string; label: string };

interface SectionSorterProps {
  /** Persisted comma-separated order string, e.g. `"hero,services,about,contact"` */
  orderValue: string | undefined;
  /** Fetcher from AdminDashboard – we reuse it to save after each drag */
  fetcher: FetcherWithComponents<AdminActionResponse>; // Use specific type
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
  const [statusMsg, setStatusMsg] = useState<string>("");

  /* --- Sensors ----------------------------------------------------------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  /* --- Persist order after every change ---------------------------------- */
  useEffect(() => {
    // Prevent initial submission on mount if order hasn't changed
    const initialOrder = orderValue || DEFAULT_SECTIONS.map(s => s.id).join(",");
    const currentOrder = sections.map((s) => s.id).join(",");

    if(initialOrder === currentOrder && fetcher.state === 'idle' && !fetcher.data) {
       // Don't submit if order is the same as initial and fetcher is idle without prior data
       return;
    }

    const data = new FormData();
    data.append("intent", "reorderSections"); // Add intent
    data.append("home_sections_order", currentOrder);
    // Submit to the current route (which is /admin)
    fetcher.submit(data, { method: "post" });
  }, [sections, fetcher, orderValue]); // Add orderValue to dependencies

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
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      aria-labelledby="section-order-heading"
    >
      {" "}
      {/* Added container style */}
      <h2
        id="section-order-heading"
        className="text-xl font-semibold text-gray-900 mb-2" /* Use semibold */
      >
        Home Page Section Order
      </h2>
      <p
        id="section-sorter-instructions"
        className="text-sm text-gray-600 mb-4" /* Increased margin */
      >
        Drag and drop to reorder sections. Changes are saved automatically.
      </p>
      <div
        role="status"
        aria-live="polite"
        className="text-sm text-gray-600 h-5 mb-4" /* Increased margin */
      >
        {statusMsg}
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
            className="space-y-2"
            aria-describedby="section-sorter-instructions"
          >
            {sections.map((s, idx) => (
              <SortableItem
                key={s.id}
                id={s.id}
                label={s.label}
                index={idx}
                total={sections.length}
                updateStatus={setStatusMsg}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}

/* --- Sortable list item -------------------------------------------------- */
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
      className={`flex items-center justify-between rounded border border-gray-200 bg-white px-4 py-2 shadow-sm cursor-grab focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        /* Adjusted border/focus */
        isDragging
          ? "opacity-50 ring-2 ring-blue-500"
          : "" /* Style when dragging */
      }`}
      tabIndex={0}
      aria-label={`Section ${label}, position ${
        index + 1
      } of ${total}. Use arrow keys to move.`}
      aria-grabbed={isDragging}
      role="option"
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
