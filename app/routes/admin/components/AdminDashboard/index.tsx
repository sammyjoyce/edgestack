import React from "react"; // Ensure React is imported for JSX
import { Link, useFetcher, useLoaderData } from "react-router";
import type { Tab } from "~/routes/common/components/ui/Tabs"; // Import Tab type

// Types
// Import the specific loader type
import type { loader as adminIndexLoader } from "~/routes/admin/routes/index";

// Validation
// import { validateErrorResponse } from "~/database/valibot-validation"; // Not used directly here

import { Button } from "~/routes/common/components/ui/Button";
// UI primitives
import { Container } from "~/routes/common/components/ui/Container";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { Tabs } from "~/routes/common/components/ui/Tabs"; // Import Tabs component
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

import { AboutSectionEditor } from "~/routes/admin/components/AboutSectionEditor";
import { ContactSectionEditor } from "~/routes/admin/components/ContactSectionEditor";
import { HeroSectionEditor } from "~/routes/admin/components/HeroSectionEditor";
// Admin components
import SectionSorter from "~/routes/admin/components/SectionSorter";
import { ServicesSectionEditor } from "~/routes/admin/components/ServicesSectionEditor";
import { ImageUploadSection } from "~/routes/admin/components/ImageUploadSection"; // Import ImageUploadSection

// Helper functionality moved to util function if needed

export default function AdminDashboard(): React.JSX.Element {
	// Use type inference with the imported loader type
	const loaderData = useLoaderData<typeof adminIndexLoader>();
	// Access content safely with proper typing
	const content = loaderData?.content as Record<string, string> | undefined;

	// Define the shape that we know is returned by the actions
	type ActionData = {
		success?: boolean;
		error?: string;
		url?: string;
		message?: string;
	};

	// Type-safe fetchers
	const heroFetcher = useFetcher<ActionData>();
	const introFetcher = useFetcher<ActionData>();
	const servicesFetcher = useFetcher<ActionData>();
	const aboutFetcher = useFetcher<ActionData>();
	const contactFetcher = useFetcher<ActionData>();
	const sorterFetcher = useFetcher<ActionData>();
	const projectsFetcher = useFetcher<ActionData>();

	// Access content safely, handle null/error case
	const safeContent =
		(content as Record<string, string>) ||
		!content ||
		typeof content !== "object" ||
		"error" in content
			? ({} as Record<string, string>)
			: content;

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
			const uploadData = fetcherInstance.data as ActionData | undefined;
			if (
				uploadData &&
				"success" in uploadData &&
				uploadData.success &&
				"url" in uploadData &&
				uploadData.url
			) {
				setUrl(uploadData.url);
			}
			setUploading(false);
		},
		[], // No dependency on fetcher needed here anymore
	);

	const handleHeroImageUpload = (file: File) =>
		uploadImage(
			heroFetcher,
			"hero_image_url",
			file,
			setHeroUploading,
			setHeroImageUrl,
		);

	const handleAboutImageUpload = (file: File) =>
		uploadImage(
			aboutFetcher,
			"about_image_url",
			file,
			setAboutUploading,
			setAboutImageUrl,
		);

	const handleServiceImageUpload = (idx: number, file: File) =>
		uploadImage(
			servicesFetcher, // Use servicesFetcher for service images
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
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
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
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
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
								enable the{" "}
								<span className="font-semibold text-gray-700">"Featured"</span>{" "}
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
							className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
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
			{" "}
			{/* Adjusted container */}
			<SectionIntro title="Home Page Editor" className="mb-8" />{" "}
			{/* Adjusted margin */}
			{/* Render the Tabs component */}
			<Tabs
				tabs={tabs}
				containerClassName="mb-8" // Add margin below tabs
				// Apply consistent styling to content area if needed, or let individual components handle it
				// contentClassName="bg-white p-6 rounded-lg shadow-xs border border-gray-200"
			/>
		</Container>
	);
}
