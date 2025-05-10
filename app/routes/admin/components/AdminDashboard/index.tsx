import React, { type JSX } from "react"; // Ensure React is imported for JSX
import { Link, useFetcher } from "react-router";

import { Container } from "~/routes/common/components/ui/Container";
import { Button } from "../ui/button";

import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

import { ImageUploadSection } from "~/routes/admin/components/ImageUploadSection";
// Admin components
import SectionSorter from "~/routes/admin/components/SectionSorter";
import { AboutSectionEditor } from "~/routes/admin/components/sections/AboutSectionEditor";
import { ContactSectionEditor } from "~/routes/admin/components/sections/ContactSectionEditor";
import { HeroSectionEditor } from "~/routes/admin/components/sections/HeroSectionEditor";
import { ServicesSectionEditor } from "~/routes/admin/components/sections/ServicesSectionEditor";
// Import action types for fetchers
import type { action as adminIndexAction } from "~/routes/admin/views/index";
import type { action as adminUploadAction } from "~/routes/admin/views/upload";
import { type Tab, Tabs } from "~/routes/common/components/ui/Tabs";
import { Heading } from "../ui/heading";

interface AdminDashboardProps {
	initialContent: Record<string, string> | undefined;
}

export default function AdminDashboard({
	initialContent,
}: AdminDashboardProps): React.JSX.Element {
	// Use initialContent prop as the only source of content
	const content = initialContent;

	// ... rest of the component remains unchanged ...

	// Define the shape that we know is returned by the actions
	type ActionData = {
		success?: boolean;
		error?: string;
		url?: string;
		message?: string;
		action?: "upload" | "select" | "delete"; // For uploadFetcher
	};

	// Use React Router 7's built-in type inference - no explicit type parameters
	// This lets React Router handle the complex type relationships correctly
	const heroFetcher = useFetcher<typeof adminIndexAction>(); // For text content related to hero
	const introFetcher = useFetcher<typeof adminIndexAction>(); // For text content related to intro
	const servicesFetcher = useFetcher<typeof adminIndexAction>(); // For text content related to services
	const aboutFetcher = useFetcher<typeof adminIndexAction>(); // For text content related to about
	const contactFetcher = useFetcher<typeof adminIndexAction>(); // For text content related to contact
	const sorterFetcher = useFetcher<typeof adminIndexAction>(); // For section sorting
	const projectsFetcher = useFetcher<typeof adminIndexAction>(); // For projects intro text
	const uploadFetcher = useFetcher<typeof adminUploadAction>(); // Dedicated for all image uploads

	// Access content safely, handle null/error case
	const safeContent =
		content && typeof content === "object" && !("error" in content)
			? (content as Record<string, string>)
			: ({} as Record<string, string>);

	// Handler for Hero image upload
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
			fetcherInstance: ReturnType<typeof useFetcher>,
			key: string,
			file: File,
			setUploading: (v: boolean) => void,
			setUrl: (url: string) => void,
		) => {
			// Type guard for action data
			const getActionData = (data: unknown): ActionData | undefined => {
				if (
					data &&
					typeof data === "object" &&
					("success" in data || "url" in data)
				) {
					return data as ActionData;
				}
				return undefined;
			};
			setUploading(true);
			const fd = new FormData();
			fd.append("image", file);
			fd.append("key", key);
			// Use typed action path
			await fetcherInstance.submit(fd, {
				method: "post",
				action: "/admin/upload",
				encType: "multipart/form-data",
			});
			// Use the fetcher instance's data with safer access
			const actionData = getActionData(fetcherInstance.data);
			if (actionData?.success && actionData.url) {
				setUrl(actionData.url);
			}
			setUploading(false);
		},
		[],
	);

	const handleHeroImageUpload = (file: File) =>
		uploadImage(
			uploadFetcher, // Use dedicated uploadFetcher
			"hero_image_url",
			file,
			setHeroUploading,
			setHeroImageUrl,
		);

	const handleAboutImageUpload = (file: File) =>
		uploadImage(
			uploadFetcher, // Use dedicated uploadFetcher
			"about_image_url",
			file,
			setAboutUploading,
			setAboutImageUrl,
		);

	const handleServiceImageUpload = (idx: number, file: File) =>
		uploadImage(
			uploadFetcher, // Use dedicated uploadFetcher
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

	/* ------------------------------------------------- *
	 * Section order comes from key "home_sections_order"
	 * Persist handled inside SectionSorter via fetcher
	 * ------------------------------------------------- */
	const sectionsOrder = safeContent.home_sections_order as string | undefined;

	// Define tabs configuration
	const tabs: Tab[] = [
		{
			title: "Order",
			value: "order",
			content: (
				<SectionSorter orderValue={sectionsOrder} fetcher={sorterFetcher} />
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
				<div className="p-6 bg-white rounded-lg shadow-xs border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Projects Section Intro
					</h2>
					<div className="grid grid-cols-1 gap-6 mt-4">
						<div>
							<label
								htmlFor="projects_intro_title"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Projects Intro Title
							</label>
							<input
								type="text"
								name="projects_intro_title"
								id="projects_intro_title"
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
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
								<p className={`mt-2 text-sm ${projectsFetcher.data.success ? 'text-green-600' : 'text-red-600'}`}>
									{projectsFetcher.data.success ? projectsFetcher.data.message : projectsFetcher.data.error}
								</p>
							)}
						</div>
						<div>
							<label
								htmlFor="projects_intro_text"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Projects Intro Text
							</label>
							<textarea
								name="projects_intro_text"
								id="projects_intro_text"
								rows={3}
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
								defaultValue={
									safeContent.projects_intro_text ||
									"Take a look at some of our recent work."
								}
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
								<p className={`mt-2 text-sm ${projectsFetcher.data.success ? 'text-green-600' : 'text-red-600'}`}>
									{projectsFetcher.data.success ? projectsFetcher.data.message : projectsFetcher.data.error}
								</p>
							)}
						</div>
					</div>
					<div className="mt-4 text-sm text-gray-600 space-y-1">
						<p>
							<strong>Note:</strong>
						</p>
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
							className="bg-primary text-white hover:bg-primary/90 text-sm"
							aria-label="Go to Projects Admin"
						>
							Go to Projects Admin
						</Button>
					</div>
				</div>
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
			{/* Adjusted container */}
			<div className="flex flex-col space-y-4">
				<div className="flex justify-between items-center">
					<Heading level={2}>{"Home Page Editor"}</Heading>
					<Button
						type="button"
						onClick={() => window.open("/?bustCache=true", "_blank")}
						className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							aria-hidden="true"
							focusable="false"
						>
							<title>Open site in new tab</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.25 6.75v-2.25a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 003.75 4.5v15a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-2.25m-10.5-6.75h14.25m0 0l-3-3m3 3l-3 3"
							/>
						</svg>
						<span>Open site</span>
					</Button>
				</div>

				<Tabs
					tabs={tabs}
					containerClassName="mb-8" // Add margin below tabs
				/>
			</div>
		</Container>
	);
}
