import React from "react";
import AboutUs from "../components/About";
import ContactUs from "../components/ContactUs";
import { CtaSection } from "../components/CtaSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import OurServices from "../components/OurServices";
import RecentProjects from "../components/RecentProjects";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "Lush Constructions" },
		{
			name: "description",
			content: "High-Quality Solutions for Home & Office Improvement",
		},
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<div className="bg-linear-180/oklch from-0% from-gray-600/0 via-20% via-80% via-gray-600/10 via-gray-600/10 to-100% to-gray-600/0">
			<Header />
			<Hero />
			<OurServices />
			<RecentProjects />
			<AboutUs />
			<ContactUs />
			<Footer />
		</div>
	);
}
