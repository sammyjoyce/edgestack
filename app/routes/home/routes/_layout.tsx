import { Outlet, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
// Still need the Project type for internal typing
import type { Project } from "~/database/schema";
import Footer from "~/routes/common/components/Footer";
import Header from "~/routes/common/components/Header";
import { getAllContent, getFeaturedProjects } from "~/routes/common/db";
import { HomeErrorBoundary } from "../components/HomeErrorBoundary";
// Import generated Route type for type safety
import type { Route } from "./+types/_layout";

type HomeLayoutLoaderData = {
	content: Record<string, string>;
	projects: Project[];
	error?: string;
};

export const loader = async ({
	context,
}: LoaderFunctionArgs): Promise<HomeLayoutLoaderData> => {
	try {
		const [content, projects] = await Promise.all([
			getAllContent(context.db),
			getFeaturedProjects(context.db), // Assuming this returns Project[]
		]);
		return {
			content,
			projects,
		};
	} catch (error) {
		console.error("Error fetching data from D1:", error);
		return {
			content: {},
			projects: [],
			error: "Failed to load layout data",
		};
	}
};

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

// Default export for backwards compatibility, but we encourage using named exports
export default HomeLayout;
