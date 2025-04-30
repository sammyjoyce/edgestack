import React from "react"; // Ensure React is imported for JSX
import { Link, useFetcher, useLoaderData } from "react-router";


// Types
// Import the specific loader type
import type { loader as adminIndexLoader } from "~/routes/admin/routes/index";

// Validation
// import { validateErrorResponse } from "~/database/valibot-validation"; // Not used directly here

import { Button } from "~/routes/common/components/ui/Button";
// UI primitives
import { Container } from "~/routes/common/components/ui/Container";
import { FadeIn } from "~/routes/common/components/ui/FadeIn";
import { SectionIntro } from "~/routes/common/components/ui/SectionIntro";

import { AboutSectionEditor } from "~/routes/admin/components/AboutSectionEditor";
import { ContactSectionEditor } from "~/routes/admin/components/ContactSectionEditor";
import { HeroSectionEditor } from "~/routes/admin/components/HeroSectionEditor";
// Admin components
import SectionSorter from "~/routes/admin/components/SectionSorter";
import { ServicesSectionEditor } from "~/routes/admin/components/ServicesSectionEditor";

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

	return (
		<Container className="space-y-10">
			{" "}
			{/* Add vertical spacing between sections */}
			<SectionIntro title="Home Page Editor" className="mb-8" />{" "}
			{/* Adjusted margin */}
			{/* 🔀 Drag-to-reorder CMS sections */}
			<SectionSorter // <<< HERE
				orderValue={sectionsOrder}
				fetcher={sorterFetcher} // Pass typed fetcher
			/>
			{/* Removed the global status block */}
			<section aria-label="Hero Section Editor">
				<HeroSectionEditor
					fetcher={heroFetcher} // Pass typed fetcher
					initialContent={safeContent}
					onImageUpload={handleHeroImageUpload}
					imageUploading={heroUploading}
					heroImageUrl={heroImageUrl}
				/>
			</section>
			<section aria-label="Services Section Editor">
				<ServicesSectionEditor
					fetcher={servicesFetcher} // Pass typed fetcher
					initialContent={safeContent}
					onImageUpload={handleServiceImageUpload}
					imageUploading={serviceUploading}
					serviceImageUrls={serviceImageUrls}
				/>
			</section>
			<section aria-label="Recent Projects Editor">
				<div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
					{" "}
					{/* Adjusted shadow/border */}
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Projects Section
					</h2>{" "}
					{/* Adjusted size/color/margin */}
					<div className="grid grid-cols-1 gap-6 mt-4">
						{" "}
						{/* Increased gap */}
						<div>
							<label
								htmlFor="projects_intro_title"
								className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
							>
								Projects Intro Title
							</label>
							<input
								type="text"
								name="projects_intro_title"
								id="projects_intro_title"
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
								defaultValue={
									safeContent.projects_intro_title || "Recent Projects"
								}
								onBlur={(e) => {
									const formData = new FormData();
									formData.append("intent", "updateTextContent"); // Add intent
									formData.append("projects_intro_title", e.target.value);
									// Use projectsFetcher for project intro fields with typed action
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
								className="block text-sm font-medium text-gray-700 mb-1" /* Added margin */
							>
								Projects Intro Text
							</label>
							<textarea
								name="projects_intro_text"
								id="projects_intro_text"
								rows={3} /* Increased rows */
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm" /* Use text-sm */
								defaultValue={
									safeContent.projects_intro_text ||
									"Take a look at some of our recent work."
								}
								onBlur={(e) => {
									const formData = new FormData();
									formData.append("intent", "updateTextContent"); // Add intent
									formData.append("projects_intro_text", e.target.value);
									// Use projectsFetcher for project intro fields with typed action
									projectsFetcher.submit(formData, {
										method: "post",
										action: "/admin",
									});
								}}
							/>
						</div>
					</div>
					<div className="mt-4 text-sm text-gray-600 space-y-1">
						{" "}
						{/* Adjusted margin/size/spacing */}
						<p>
							<strong>Note:</strong>
						</p>
						<ul className="list-disc list-inside space-y-1">
							{" "}
							{/* Added spacing */}
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
						{" "}
						{/* Increased margin */}
						<Button
							as={Link}
							to="/admin/projects"
							className="bg-blue-600 text-white hover:bg-blue-700 text-sm"
							aria-label="Go to Projects Admin"
						>
							Go to Projects Admin
						</Button>
					</div>
				</div>
			</section>
			<section aria-label="About Section Editor">
				<AboutSectionEditor
					fetcher={aboutFetcher} // Pass typed fetcher
					initialContent={safeContent}
					onImageUpload={handleAboutImageUpload}
					imageUploading={aboutUploading}
					aboutImageUrl={aboutImageUrl}
				/>
			</section>
			<section aria-label="Contact Section Editor">
				<ContactSectionEditor
					fetcher={contactFetcher}
					initialContent={safeContent}
				/>
			</section>
		</Container>
	);
}