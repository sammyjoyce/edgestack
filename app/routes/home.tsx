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
		<div className="bg-[linear-gradient(180deg,rgba(97,106,115,0),rgba(97,106,115,0.1)_20%,rgba(97,106,115,0.1)_80%,rgba(97,106,115,0))]">
			<Header />
			<ImageSlider />
			<OurServices />
			<AboutUs />
			<ContactUs />
			<Footer />
		</div>
	);
}
