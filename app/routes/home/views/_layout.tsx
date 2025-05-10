import React from "react"; // Import React
import {
	Outlet,
	type ShouldRevalidateFunction,
	useLoaderData,
} from "react-router";
import { data } from "react-router";
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

export async function loader({ request, context }: any) {
	// Adjusted type for LoaderArgs
	try {
		// Load all content
		const content = await getAllContent(context.db);

		// Load featured projects
		const featuredProjects = await getFeaturedProjects(context.db);

		// Load all projects (for Hero Projects carousel)
		const projects = await getAllProjects(context.db);

		// Create a cacheBuster value for debugging
		const timestamp = new Date().toISOString();
		const cacheBuster = `cache-${timestamp}`;

		return {
			content,
			featuredProjects,
			projects,
			_debug: {
				// Consider removing debug info for production builds
				cacheBuster,
				timestamp,
			},
		};
	} catch (error) {
		console.error("Error fetching data from D1:", error);
		// Throw an error to be caught by the ErrorBoundary
		throw new Error({ message: "Failed to load layout data" }, { status: 500 });
	}
}

export function HomeLayout() {
	// Use type inference with the generated types
	// Error case is now handled by ErrorBoundary
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
	// Always revalidate after actions (form submissions)
	if (formMethod && formMethod !== "GET") {
		return true;
	}

	// Check for our custom cache-busting flag with timestamp value
	if (nextUrl.searchParams.has("t")) {
		return true;
	}

	// Force revalidation if coming from admin path to ensure fresh content
	const comingFromAdmin = currentUrl.pathname.includes("/admin");
	if (comingFromAdmin) {
		return true;
	}

	// Ensure full page loads always revalidate
	// const isFullPageLoad = !currentUrl.href || currentUrl.href === "";
	// if (isFullPageLoad) {
	// 	return true;
	// }
	// Note: Initial loads (full page loads) inherently run loaders.
	// shouldRevalidate is primarily for client-side transitions and explicit revalidations.
	// The defaultShouldRevalidate behavior generally handles this correctly.

	// Default to internal React Router behavior
	return defaultShouldRevalidate;
};

// Default export for backwards compatibility, but we encourage using named exports
export default HomeLayout;
