import { Outlet, useLoaderData } from "react-router";
import type {
	LoaderFunctionArgs,
	ShouldRevalidateFunction,
} from "react-router";
// Still need the Project type for internal typing
import type { Project } from "~/database/schema";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import {
	getAllContent,
	getAllProjects,
	getFeaturedProjects,
} from "~/routes/common/db";
import { HomeErrorBoundary } from "../components/HomeErrorBoundary";
// Import generated Route type for type safety
import type { Route } from "./+types/_layout";

type HomeLayoutLoaderData = {
	content: Record<string, string>;
	featuredProjects: Project[];
	projects: Project[];
	error?: string;
	_debug: {
		cacheBuster: string;
		timestamp: string;
	};
};

export async function loader({ request, context }: LoaderFunctionArgs) {
	try {
		// DEBUG: Log loader execution with timestamp and request URL
		const timestamp = new Date().toISOString();
		console.log("[Home Layout Loader] Executing at:", timestamp);
		console.log("[Home Layout Loader] Request URL:", request.url);

		// Load all content
		console.log("[Home Layout Loader] Loading content from database...");
		const content = await getAllContent(context.db);
		console.log("[Home Layout Loader] Content loaded successfully");

		// Load featured projects
		const featuredProjects = await getFeaturedProjects(context.db);

		// Load all projects (for Hero Projects carousel)
		const projects = await getAllProjects(context.db);

		// Create a cacheBuster value for debugging
		const cacheBuster = `cache-${timestamp}`;

		return {
			content,
			featuredProjects,
			projects,
			_debug: {
				cacheBuster,
				timestamp,
			},
		};
	} catch (error) {
		console.error("Error fetching data from D1:", error);
		return {
			content: {},
			projects: [],
			error: "Failed to load layout data",
		};
	}
}

export function HomeLayout() {
	// Use type inference with the generated types
	const loaderData = useLoaderData<typeof loader>();

	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0">
			<Header />
			<Outlet context={loaderData} />
			<Footer />
		</div>
	);
}

export function ErrorBoundary() {
	return <HomeErrorBoundary />;
}

// Always revalidate when a timestamp query parameter is present
// This forces React Router to ignore its cache and refetch data
export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentUrl,
	nextUrl,
	formMethod,
	formAction,
	formData,
	formEncType,
	actionResult,
	defaultShouldRevalidate,
}) => {
	// DEBUG: Log detailed information about revalidation request
	const timestamp = new Date().toISOString();
	console.log("===== SHOULD REVALIDATE =====");
	console.log(`[shouldRevalidate] Called at ${timestamp}`);
	console.log(
		`[shouldRevalidate] Current URL: ${currentUrl.pathname}${currentUrl.search}`,
	);
	console.log(
		`[shouldRevalidate] Next URL: ${nextUrl.pathname}${nextUrl.search}`,
	);
	console.log(`[shouldRevalidate] Form Method: ${formMethod || "none"}`);
	console.log(`[shouldRevalidate] Form Action: ${formAction || "none"}`);
	console.log(
		`[shouldRevalidate] Default would revalidate: ${defaultShouldRevalidate}`,
	);

	// Always revalidate after actions (form submissions)
	if (formMethod && formMethod !== "GET") {
		console.log("[shouldRevalidate] Revalidating due to form submission");
		return true;
	}

	// Check for our custom cache-busting flag with timestamp value
	if (nextUrl.searchParams.has("t")) {
		console.log(
			"[shouldRevalidate] Cache invalidation triggered via ?t parameter:",
			nextUrl.searchParams.get("t"),
		);
		return true;
	}

	// Force revalidation if coming from admin path to ensure fresh content
	const comingFromAdmin = currentUrl.pathname.includes("/admin");
	if (comingFromAdmin) {
		console.log(
			"[shouldRevalidate] Forcing revalidation because navigation is from admin section",
		);
		return true;
	}

	// Ensure full page loads always revalidate
	const isFullPageLoad = !currentUrl.href || currentUrl.href === "";
	if (isFullPageLoad) {
		console.log("[shouldRevalidate] Forcing revalidation for full page load");
		return true;
	}

	console.log(
		`[shouldRevalidate] Using default behavior: ${defaultShouldRevalidate}`,
	);
	// Default to internal React Router behavior
	return defaultShouldRevalidate;
};

// Default export for backwards compatibility, but we encourage using named exports
export default HomeLayout;
