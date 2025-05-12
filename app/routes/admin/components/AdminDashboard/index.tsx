import React from "react";
import { Link, useFetcher } from "react-router";
import SectionSorter from "~/routes/admin/components/SectionSorter";
import { AboutSectionEditor } from "~/routes/admin/components/sections/AboutSectionEditor";
import { ContactSectionEditor } from "~/routes/admin/components/sections/ContactSectionEditor";
import { HeroSectionEditor } from "~/routes/admin/components/sections/HeroSectionEditor";
import { ServicesSectionEditor } from "~/routes/admin/components/sections/ServicesSectionEditor";
import type { action as adminIndexAction } from "~/routes/admin/views/index";
import type { action as adminUploadAction } from "~/routes/admin/views/upload";
import { Container } from "~/routes/common/components/ui/Container";
import { Strong, Text } from "../ui/text";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import type {
	Section as SorterSection,
	SectionTheme as SorterSectionTheme,
} from "../SectionSorter";
import { type Tab, Tabs } from "~/routes/common/components/ui/Tabs";
import { Heading } from "../ui/heading";
import { PageHeader } from "../ui/PageHeader";
import { SectionCard, SectionHeading } from "../ui/section";

interface AdminDashboardProps {
	initialContent?: Record<string, string>;
}

export default function AdminDashboard({
	initialContent,
}: AdminDashboardProps): React.JSX.Element {
	const content = initialContent;
	const heroFetcher = useFetcher<typeof adminIndexAction>();
	const introFetcher = useFetcher<typeof adminIndexAction>();
	const servicesFetcher = useFetcher<typeof adminIndexAction>();
	const aboutFetcher = useFetcher<typeof adminIndexAction>();
	const contactFetcher = useFetcher<typeof adminIndexAction>();
	const sorterFetcher = useFetcher<typeof adminIndexAction>();
	const projectsFetcher = useFetcher<typeof adminIndexAction>();
	const uploadFetcher = useFetcher<typeof adminUploadAction>();
	const safeContent =
		content && typeof content === "object" && !("error" in content)
			? (content as Record<string, string>)
			: ({} as Record<string, string>);
	const [heroUploading, setHeroUploading] = React.useState(false);
	const [heroImageUrl, setHeroImageUrl] = React.useState(
		safeContent.hero_image_url || "",
	);
	const [aboutUploading, setAboutUploading] = React.useState(false);
	const [aboutImageUrl, setAboutImageUrl] = React.useState(
		safeContent.about_image_url || "",
	);
	const [serviceUploading, setServiceUploading] = React.useState<boolean[]>(
		Array(4).fill(false),
	);
	const [serviceImageUrls, setServiceImageUrls] = React.useState([
		safeContent.service_1_image || "",
		safeContent.service_2_image || "",
		safeContent.service_3_image || "",
		safeContent.service_4_image || "",
	]);
	const uploadImage = React.useCallback(
		async (
			fetcherInstance: ReturnType<
				typeof useFetcher<typeof adminUploadAction | typeof adminIndexAction>
			>,
			key: string,
			file: File,
			setUploading: (v: boolean) => void, // eslint-disable-line @typescript-eslint/no-unused-vars
			setUrl: (url: string) => void, // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			// eslint-disable-line @typescript-eslint/no-unused-vars
			setUploading(true);
			const fd = new FormData();
			fd.append("image", file);
			fd.append("key", key);
			await fetcherInstance.submit(fd, {
				method: "post",
				action: "/admin/upload",
				encType: "multipart/form-data",
			});
			const actionData = fetcherInstance.data;
			if (actionData?.success && "url" in actionData) {
				setUrl(actionData.url);
			} else if (actionData?.success) {
				console.log("Update successful for key (via IndexAction):", key);
			}
			setUploading(false);
		},
		[],
	);
	const handleHeroImageUpload = (file: File) =>
		uploadImage(
			uploadFetcher,
			"hero_image_url",
			file,
			setHeroUploading,
			setHeroImageUrl,
		);
	const handleAboutImageUpload = (file: File) =>
		uploadImage(
			uploadFetcher,
			"about_image_url",
			file,
			setAboutUploading,
			setAboutImageUrl,
		);
	const handleServiceImageUpload = (idx: number, file: File) =>
		uploadImage(
			uploadFetcher,
			`service_${idx + 1}_image`,
			file,
			(v) =>
				setServiceUploading((prev) =>
					prev.map((val, i) => (i === idx ? v : val)),
				),
			(url) =>
				setServiceImageUrls((prev) =>
					prev.map((val, i) => (i === idx ? url : val)),
				),
		);
	const sectionsOrder = safeContent.home_sections_order as string | undefined;
	const sectionDetailsMap: Record<string, { label: string; themeKey: string }> =
		{
			hero: { label: "Hero", themeKey: "hero_title_theme" },
			services: {
				label: "Services",
				themeKey: "services_intro_title_theme",
			},
			projects: {
				label: "Projects",
				themeKey: "projects_intro_title_theme",
			},
			about: { label: "About", themeKey: "about_title_theme" },
			contact: { label: "Contact", themeKey: "contact_title_theme" },
		};
	const orderedSectionIds = sectionsOrder
		? sectionsOrder.split(",")
		: Object.keys(sectionDetailsMap);
	const sorterSections: SorterSection[] = orderedSectionIds
		.map((id) => {
			const details = sectionDetailsMap[id];
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
					themeUpdateFetcher={heroFetcher}
				/>
			),
		},
		{
			title: "Hero",
			value: "hero",
			content: (
				<HeroSectionEditor
					fetcher={heroFetcher}
					initialContent={safeContent}
					onImageUpload={handleHeroImageUpload}
					imageUploading={heroUploading}
					heroImageUrl={heroImageUrl}
				/>
			),
		},
		{
			title: "Services",
			value: "services",
			content: (
				<ServicesSectionEditor
					fetcher={servicesFetcher}
					initialContent={safeContent}
					onImageUpload={handleServiceImageUpload}
					imageUploading={serviceUploading}
					serviceImageUrls={serviceImageUrls}
				/>
			),
		},
		{
			title: "Projects Intro",
			value: "projects",
			content: (
				<SectionCard>
					<SectionHeading>Projects Section Intro</SectionHeading>
					<div className="grid grid-cols-1 gap-6 mt-4">
						<div>
							<label
								htmlFor="projects_intro_title"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Projects Intro Title
							</label>
							<Input
								type="text"
								name="projects_intro_title"
								id="projects_intro_title"
								className="block w-full"
								defaultValue={
									safeContent.projects_intro_title || "Recent Projects"
								}
								onBlur={(e) => {
									const formData = new FormData();
									formData.append("intent", "updateTextContent");
									formData.append("projects_intro_title", e.target.value);
									projectsFetcher.submit(formData, {
										method: "post",
										action: "/admin",
									});
								}}
							/>
							{projectsFetcher.data && projectsFetcher.state === "idle" && (
								<>
									{projectsFetcher.data.message && (
										<Text
											className={`mt-2 text-sm ${projectsFetcher.data.success ? "text-green-600" : "text-red-600"}`}
										>
											{projectsFetcher.data.message}
										</Text>
									)}
									{projectsFetcher.data.error && (
										<Text className="mt-2 text-sm text-red-600">
											{projectsFetcher.data.error}
										</Text>
									)}
								</>
							)}
						</div>
						<div>
							<label
								htmlFor="projects_intro_text"
								className="block text-sm font-medium text-gray-700"
							>
								Text
							</label>
							<Textarea
								name="projects_intro_text"
								id="projects_intro_text"
								rows={3}
								defaultValue={safeContent.projects_intro_text || ""}
								onBlur={(e) => {
									const formData = new FormData();
									formData.append("intent", "updateTextContent");
									formData.append("projects_intro_text", e.target.value);
									projectsFetcher.submit(formData, {
										method: "post",
										action: "/admin",
									});
								}}
							/>
							{projectsFetcher.data && projectsFetcher.state === "idle" && (
								<>
									{projectsFetcher.data.message && (
										<Text
											className={`mt-2 text-sm ${projectsFetcher.data.success ? "text-green-600" : "text-red-600"}`}
										>
											{projectsFetcher.data.message}
										</Text>
									)}
									{projectsFetcher.data.error && (
										<Text className="mt-2 text-sm text-red-600">
											{projectsFetcher.data.error}
										</Text>
									)}
								</>
							)}
						</div>
					</div>
					<div className="mt-4 text-sm text-gray-600 space-y-1">
						<Text>
							<Strong>Note:</Strong>
						</Text>
						<ul className="list-disc list-inside space-y-1">
							<li>
								To add, edit, or reorder projects, visit the Projects admin
								page.
							</li>
							<li>
								To feature a project on the home page, edit the project and
								enable the
								<span className="font-semibold text-gray-700">"Featured"</span>
								option.
							</li>
							<li>
								Project display order and details are managed in the Projects
								admin page.
							</li>
						</ul>
					</div>
					<div className="mt-6">
						<Button
							as={Link}
							to="/admin/projects"
							color="primary"
							aria-label="Go to Projects Admin"
						>
							Go to Projects Admin
						</Button>
					</div>
				</SectionCard>
			),
		},
		{
			title: "About",
			value: "about",
			content: (
				<AboutSectionEditor
					fetcher={aboutFetcher}
					initialContent={safeContent}
					onImageUpload={handleAboutImageUpload}
					imageUploading={aboutUploading}
					aboutImageUrl={aboutImageUrl}
				/>
			),
		},
		{
			title: "Contact",
			value: "contact",
			content: (
				<ContactSectionEditor
					fetcher={contactFetcher}
					initialContent={safeContent}
				/>
			),
		},
	];
	return (
		<Container className="mt-8">
			<PageHeader title="Admin Dashboard" className="mb-4" />
			<div className="flex flex-col space-y-4">
				<div className="flex justify-between items-center">
					<Heading level={2}>{"Home Page Editor"}</Heading>
					<Button
						type="button"
						onClick={() => window.open("/?bustCache=true", "_blank")}
						color="primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							aria-hidden="true"
							focusable="false"
							className="size-4"
						>
							<title>Open site in new tab</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.25 6.75v-2.25a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 003.75 4.5v15a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-2.25m-10.5-6.75h14.25m0 0l-3-3m3 3l-3 3"
							/>
						</svg>
						Open site
					</Button>
				</div>
				<Tabs tabs={tabs} containerClassName="mb-8" />
			</div>
		</Container>
	);
}
