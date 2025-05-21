import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Strong, Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

import { type Tab, Tabs } from "~/routes/common/components/ui/Tabs";
import type {
	Section as SorterSection,
	SectionTheme as SorterSectionTheme,
} from "../SectionSorter";
import { PageHeader } from "../ui/PageHeader";
import { Heading } from "../ui/heading";
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

	React.useEffect(() => {
		if (
			uploadFetcher.state === "idle" &&
			uploadFetcher.data &&
			typeof uploadFetcher.data === "object" &&
			"key" in uploadFetcher.data
		) {
			const data = uploadFetcher.data as {
				success?: boolean;
				url?: string;
				key?: string;
			};
			const key = data.key || "";
			const url = data.url || "";
			const match = key.match(/^service_(\d+)_image$/);

			if (key === "hero_image_url") {
				if (data.success && url) setHeroImageUrl(url);
				setHeroUploading(false);
			} else if (key === "about_image_url") {
				if (data.success && url) setAboutImageUrl(url);
				setAboutUploading(false);
			} else if (match) {
				const idx = Number(match[1]) - 1;
				if (idx >= 0) {
					if (data.success && url) {
						setServiceImageUrls((prev) =>
							prev.map((val, i) => (i === idx ? url : val)),
						);
					}
					setServiceUploading((prev) =>
						prev.map((val, i) => (i === idx ? false : val)),
					);
				}
			}
		}
	}, [uploadFetcher.state, uploadFetcher.data]);
	const uploadImage = React.useCallback(
		(
			fetcherInstance: ReturnType<
				typeof useFetcher<typeof adminUploadAction | typeof adminIndexAction>
			>,
			key: string,
			file: File,
			setUploading: (v: boolean) => void,
		) => {
			setUploading(true);
			const fd = new FormData();
			fd.append("image", file);
			fd.append("key", key);
			fetcherInstance.submit(fd, {
				method: "post",
				action: "/admin/upload",
				encType: "multipart/form-data",
			});
		},
		[],
	);
	const handleHeroImageUpload = (file: File) =>
		uploadImage(uploadFetcher, "hero_image_url", file, setHeroUploading);
	const handleAboutImageUpload = (file: File) =>
		uploadImage(uploadFetcher, "about_image_url", file, setAboutUploading);
	const handleServiceImageUpload = (idx: number, file: File) =>
		uploadImage(uploadFetcher, `service_${idx + 1}_image`, file, (v) =>
			setServiceUploading((prev) =>
				prev.map((val, i) => (i === idx ? v : val)),
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
							{projectsFetcher.data?.success === false &&
								projectsFetcher.data.error && (
									<Text className="ml-2 text-sm text-red-600">
										{projectsFetcher.data.error}
									</Text>
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
							{projectsFetcher.data?.success === false &&
								projectsFetcher.data.error && (
									<Text className="ml-2 text-sm text-red-600">
										{projectsFetcher.data.error}
									</Text>
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
					<div className="mt-6 w-fit">
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
