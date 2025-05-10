import React from "react";
import {
	Outlet,
	type ShouldRevalidateFunction,
	useLoaderData,
} from "react-router";
import { data } from "react-router";
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
	try {
		const content = await getAllContent(context.db);
		const featuredProjects = await getFeaturedProjects(context.db);
		const projects = await getAllProjects(context.db);
		const timestamp = new Date().toISOString();
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
		throw new Response("Failed to load layout data", { status: 500 });
	}
}
export function HomeLayout({ loaderData }: Route.ComponentProps) {
	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 to-100% to-gray-600/0 dark:bg-linear-to-b dark:from-gray-950/0 dark:via-gray-800/10 dark:to-gray-950/0">
			<Header />
			<Outlet context={loaderData} />
			<Footer />
		</div>
	);
}
export function ErrorBoundary() {
	return <HomeErrorBoundary />;
}
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
	if (nextUrl.searchParams.has("t")) {
		return true;
	}
	const comingFromAdmin = currentUrl.pathname.includes("/admin");
	if (comingFromAdmin) {
		return true;
	}
	return defaultShouldRevalidate;
};
export default HomeLayout;
