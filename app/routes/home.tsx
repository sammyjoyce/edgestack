import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageSlider from '../components/Slider';
import OurServices from '../components/OurServices';
import AllAspectsCarpentry from '../components/AllAspectsCarpentry';
import CollaborationAndConsultations from '../components/CollaborationAndConsultations';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';
import BackToTop from '../components/BackToTop';
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Lush Constructions" },
		{ name: "description", content: "High-Quality Solutions for Home & Office Improvement" },
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
			<Welcome message={loaderData.message} />
			<OurServices />
			<AllAspectsCarpentry />
			<CollaborationAndConsultations />
			<AboutUs />
			<ContactUs />
			<BackToTop />
			<Footer />
		</>
	);
}
