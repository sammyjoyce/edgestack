import React from "react";
import AboutUs from "../components/About";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import OurServices from "../components/OurServices";
import ImageSlider from "../components/Hero";
import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
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
		<>
			<Header />
			<ImageSlider />
			<OurServices />
			<AboutUs />
			<ContactUs />
			<Footer />
		</>
	);
}
