import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useFetcher } from "react-router";
import SectionSorter from "~/routes/admin/components/SectionSorter";
import { GenericSectionEditor } from "~/routes/admin/components/sections/GenericSectionEditor";
import { type SectionId, sectionsSchema } from "~/routes/admin/sections-schema";
import type { action as adminIndexAction } from "~/routes/admin/views/index";
import { Container } from "~/routes/common/components/ui/Container";
import { Button } from "../ui/button";

import { type Tab, Tabs } from "~/routes/common/components/ui/Tabs";
import type {
	Section as SorterSection,
	SectionTheme as SorterSectionTheme,
} from "../SectionSorter";
import { PageHeader } from "../ui/PageHeader";

interface AdminDashboardProps {
	initialContent?: Record<string, string>;
}

export default function AdminDashboard({
	initialContent,
}: AdminDashboardProps): React.JSX.Element {
	const content = initialContent;
	const sorterFetcher = useFetcher<typeof adminIndexAction>();
	const sectionFetchers: Record<SectionId, ReturnType<typeof useFetcher>> = {
		hero: useFetcher<typeof adminIndexAction>(),
		services: useFetcher<typeof adminIndexAction>(),
		projects: useFetcher<typeof adminIndexAction>(),
		about: useFetcher<typeof adminIndexAction>(),
		contact: useFetcher<typeof adminIndexAction>(),
	};
	const safeContent =
		content && typeof content === "object" && !("error" in content)
			? (content as Record<string, string>)
			: ({} as Record<string, string>);

	const sectionsOrder = safeContent.home_sections_order as string | undefined;
	const orderedSectionIds: SectionId[] = sectionsOrder
		? (sectionsOrder.split(",") as SectionId[])
		: (Object.keys(sectionsSchema) as SectionId[]);

	const sorterSections: SorterSection[] = orderedSectionIds
		.map((id) => {
			const details = sectionsSchema[id];
			if (!details) return null;
			return {
				id,
				label: details.label,
				theme: (safeContent[details.themeKey] as SorterSectionTheme) || "light",
				themeKey: details.themeKey,
			};
		})
		.filter(Boolean) as SorterSection[];

	const tabs: Tab[] = [
		{
			title: "Order & Themes",
			value: "order",
			content: (
				<SectionSorter
					initialSectionsFromDb={sorterSections}
					sectionDetailsOrdered={sorterSections}
					orderFetcher={sorterFetcher}
					themeUpdateFetcher={sectionFetchers.hero}
				/>
			),
		},
	];

	for (const id of orderedSectionIds) {
		const details = sectionsSchema[id];
		if (!details) continue;
		const fetcher = sectionFetchers[id];
		tabs.push({
			title: details.label,
			value: id,
			content: (
				<GenericSectionEditor
					schema={details}
					fetcher={fetcher}
					initialContent={safeContent}
				/>
			),
		});
	}
	return (
		<Container className="mt-8">
			<div className="flex flex-row content-center justify-between space-y-4 ">
				<PageHeader title="Home Page Editor" className="mb-4" />
				<div>
					<Button
						type="button"
						onClick={() => window.open("/?bustCache=true", "_blank")}
						color="primary"
					>
						<ArrowTopRightOnSquareIcon
							className="size-4"
							aria-hidden="true"
							focusable="false"
							title="Open site in new tab"
						/>
						Open site
					</Button>
				</div>
			</div>
			<Tabs tabs={tabs} containerClassName="mb-8" />
		</Container>
	);
}
