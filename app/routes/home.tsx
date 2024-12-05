import React from "react";
import AboutUs from "../components/About";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ImageSlider from "../components/Hero";
import OurServices from "../components/OurServices";
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
		<div className="bg-linear-180/oklch from-gray-600/0 from-0% via-gray-600/10 via-20% via-gray-600/10 via-80% to-gray-600/0 to-100%">
			<Header />
			<ImageSlider />
			<OurServices />
			<AboutUs />
			<ContactUs />
			<Footer />
		</div>
	);
}
