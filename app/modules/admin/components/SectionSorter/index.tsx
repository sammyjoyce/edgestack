import {
  DndContext,
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
import React, { useState, useEffect } from "react";
import type { FetcherWithComponents } from "react-router";

type Section = { id: string; label: string };

interface SectionSorterProps {
  /** Persisted comma-separated order string, e.g. `"hero,services,about,contact"` */
  orderValue: string | undefined;
  /** Fetcher from AdminDashboard – we reuse it to save after each drag */
  fetcher: FetcherWithComponents<any>;
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
}: SectionSorterProps) {
  /* --- Local state ------------------------------------------------------- */
  const [sections, setSections] = useState<Section[]>(() => {
    if (!orderValue) return DEFAULT_SECTIONS;
    const ids = orderValue.split(",");
    return ids
      .map((id) => DEFAULT_SECTIONS.find((s) => s.id === id))
      .filter(Boolean) as Section[];
  });

  /* --- Sensors ----------------------------------------------------------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  /* --- Persist order after every change ---------------------------------- */
  useEffect(() => {
    const value = sections.map((s) => s.id).join(",");
    const data = new FormData();
    data.append("home_sections_order", value);
    fetcher.submit(data, { method: "post" });
  }, [sections, fetcher]);

  /* --- Drag end handler -------------------------------------------------- */
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      setSections(arrayMove(sections, oldIndex, newIndex)); // @dnd-kit helper  [oai_citation:0‡Overview | @dnd-kit – Documentation](https://docs.dndkit.com/presets/sortable/usesortable?utm_source=chatgpt.com)
    }
  }

  return (
    <section className="mb-8" aria-labelledby="section-order-heading">
      <h2
        id="section-order-heading"
        className="text-xl font-bold text-gray-900 mb-2"
      >
        Section Order
      </h2>
      <p
        id="section-sorter-instructions"
        className="text-sm text-gray-600 mb-2"
        aria-live="polite"
      >
        Use the arrow keys or drag and drop to reorder sections. Press Space or
        Enter to pick up and drop a section. Current order will be saved
        automatically.
      </p>
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
        id="section-sorter-status"
      >
        {/* This will be updated dynamically for screen readers */}
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
}: {
  id: string;
  label: string;
  index: number;
  total: number;
}) {
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
      const status = document.getElementById("section-sorter-status");
      if (status) {
        status.textContent = `Moving ${label}, position ${
          index + 1
        } of ${total}.`;
      }
    }
    return () => {
      const status = document.getElementById("section-sorter-status");
      if (status) status.textContent = "";
    };
  }, [isDragging, label, index, total]);

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`flex items-center justify-between rounded border bg-white px-4 py-2 shadow-sm cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isDragging ? "opacity-50" : ""
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
