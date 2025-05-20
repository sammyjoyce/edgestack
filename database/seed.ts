import type { D1Database } from "@cloudflare/workers-types";
import { eq } from "drizzle-orm";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { NewContent, NewProject } from "./schema";

/**
 * Seed the database with initial content and sample projects
 *
 * Run with:
 * ```bash
 * npx wrangler d1 execute starter-content-db --local --file=./database/seed.ts
 * ```
 */

// Main seed function that populates the database
export async function seedDatabase(d1: D1Database) {
	const drizzleDb = drizzle(d1, { schema });
	console.log("🌱 Starting database seed...");
	console.log("Wiping existing data...");
	await drizzleDb.delete(schema.content).run();
	await drizzleDb.delete(schema.projects).run();
	await drizzleDb.delete(schema.media).run();
	console.log("Data wiped.");
	console.log("Seeding content...");
	await seedContent(drizzleDb);
	console.log("Seeding projects...");
	await seedProjects(drizzleDb);
	console.log("✅ Database seed completed successfully!");
}
async function seedContent(db: DrizzleD1Database<typeof schema>) {
	const contentItems: NewContent[] = [
		{
			key: "hero_title",
			value: "Building Excellence in Every Project",
			page: "home",
			section: "hero",
			type: "text",
			sortOrder: 1,
		},
		{
			key: "hero_subtitle",
			value:
				"Sydney's premier construction and renovation specialists, creating exceptional spaces since 2010.",
			page: "home",
			section: "hero",
			type: "text",
			sortOrder: 2,
		},
		{
			key: "hero_image",
			value: "/assets/hero-image.jpg",
			page: "home",
			section: "hero",
			type: "image",
			sortOrder: 3,
		},
		{
			key: "services_intro_title",
			value: "Our Services",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 1,
		},
		{
			key: "services_intro_text",
			value:
				"We offer a comprehensive range of construction and renovation services tailored to your specific needs.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 2,
		},
		{
			key: "service_1_title",
			value: "Renovations",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 3,
		},
		{
			key: "service_1_text",
			value:
				"Transform your existing space with our expert renovation services, focusing on quality craftsmanship and attention to detail.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 4,
		},
		{
			key: "service_1_image",
			value: "/assets/renovations.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 5,
		},
		{
			key: "service_2_title",
			value: "Extensions",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 6,
		},
		{
			key: "service_2_text",
			value:
				"Expand your living space with our seamless home extensions, perfectly integrated with your existing structure.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 7,
		},
		{
			key: "service_2_image",
			value: "/assets/extensions.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 8,
		},
		{
			key: "service_3_title",
			value: "New Builds",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 9,
		},
		{
			key: "service_3_text",
			value:
				"Create your dream home from the ground up with our comprehensive new build services.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 10,
		},
		{
			key: "service_3_image",
			value: "/assets/new-builds.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 11,
		},
		{
			key: "service_4_title",
			value: "Commercial",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 12,
		},
		{
			key: "service_4_text",
			value:
				"Professional commercial construction and fit-out services for businesses of all sizes.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 13,
		},
		{
			key: "service_4_image",
			value: "/assets/commercial.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 14,
		},
               {
                        key: "about_title",
                        value: "About Us",
			page: "home",
			section: "about",
			type: "text",
			sortOrder: 1,
		},
               {
                        key: "about_text",
                        value:
                                "We have been creating exceptional spaces for our clients with a commitment to quality workmanship and clear communication.",
			page: "home",
			section: "about",
			type: "text",
			sortOrder: 2,
		},
		{
			key: "about_image",
			value: "/assets/about-image.jpg",
			page: "home",
			section: "about",
			type: "image",
			sortOrder: 3,
		},
               {
                        key: "contact_phone",
                        value: "000-000-0000",
			page: "home",
			section: "contact",
			type: "text",
			sortOrder: 1,
		},
               {
                        key: "contact_email",
                        value: "info@example.com",
			page: "home",
			section: "contact",
			type: "text",
			sortOrder: 2,
		},
               {
                        key: "contact_address",
                        value: "City, ST",
			page: "home",
			section: "contact",
			type: "text",
			sortOrder: 3,
		},
		{
			key: "projects_intro_title",
			value: "Featured Projects",
			page: "projects",
			section: "intro",
			type: "text",
			sortOrder: 1,
		},
		{
			key: "projects_intro_text",
			value:
				"Take a look at some of our recent work that demonstrates our expertise and dedication to excellence.",
			page: "projects",
			section: "intro",
			type: "text",
			sortOrder: 2,
		},
               {
                        key: "meta_title",
                        value: "Your Company",
			page: "global",
			section: "meta",
			type: "text",
			sortOrder: 1,
		},
               {
                        key: "meta_description",
                        value:
                                "Professional construction and renovation services delivered with quality craftsmanship.",
			page: "global",
			section: "meta",
			type: "text",
			sortOrder: 2,
		},
		{
			key: "home_sections_order",
			value: "hero,services,projects,about,contact",
			page: "global",
			section: "settings",
			type: "text",
			sortOrder: 1,
		},
	];
	for (const item of contentItems) {
		try {
			await db.insert(schema.content).values(item).run();
			console.log(`Added content: ${item.key}`);
		} catch (error) {
			console.error(`Error adding content ${item.key}:`, error);
		}
	}
}
async function seedProjects(db: DrizzleD1Database<typeof schema>) {
	const projects: NewProject[] = [
		{
			title: "Modern Waterfront Home",
			description:
				"A stunning waterfront property featuring open plan living, floor-to-ceiling windows, and premium finishes throughout.",
			details:
				"Location: Northern Beaches\nCompletion: 2023\nScope: New Build\nFeatures: 4 bedrooms, 3 bathrooms, infinity pool, smart home technology",
			imageUrl: "/assets/project-waterfront.jpg",
			slug: "modern-waterfront-home",
			published: true,
			isFeatured: true,
			sortOrder: 1,
		},
		{
			title: "Heritage Cottage Renovation",
			description:
				"Careful restoration of a 1920s cottage, preserving character features while adding modern amenities.",
			details:
				"Location: Inner West\nCompletion: 2024\nScope: Heritage Renovation\nFeatures: Original fireplaces restored, modern kitchen extension, landscaped gardens",
			imageUrl: "/assets/project-heritage.jpg",
			slug: "heritage-cottage-renovation",
			published: true,
			isFeatured: true,
			sortOrder: 2,
		},
		{
			title: "Boutique Apartment Complex",
			description:
				"Design and construction of a boutique apartment building with six luxury apartments.",
			details:
				"Location: Eastern Suburbs\nCompletion: 2023\nScope: Commercial New Build\nFeatures: 6 apartments, underground parking, rooftop terrace, sustainable design elements",
			imageUrl: "/assets/project-apartments.jpg",
			slug: "boutique-apartment-complex",
			published: true,
			isFeatured: true,
			sortOrder: 3,
		},
		{
			title: "Contemporary Kitchen Renovation",
			description:
				"Complete transformation of an outdated kitchen into a modern cooking and entertaining space.",
			details:
				"Location: North Shore\nCompletion: 2024\nScope: Interior Renovation\nFeatures: Custom cabinetry, island bench, premium appliances, butler's pantry",
			imageUrl: "/assets/project-kitchen.jpg",
			slug: "contemporary-kitchen-renovation",
			published: true,
			isFeatured: false,
			sortOrder: 4,
		},
		{
			title: "Sustainable Family Home",
			description:
				"An eco-friendly new build utilizing sustainable materials and energy-efficient design principles.",
			details:
				"Location: Hills District\nCompletion: 2023\nScope: New Build\nFeatures: Solar power, rainwater harvesting, passive design, recycled materials",
			imageUrl: "/assets/project-sustainable.jpg",
			slug: "sustainable-family-home",
			published: true,
			isFeatured: false,
			sortOrder: 5,
		},
	];
	for (const project of projects) {
		try {
			await db.insert(schema.projects).values(project).run();
			console.log(`Added project: ${project.title}`);
		} catch (error) {
			console.error(`Error adding project ${project.title}:`, error);
		}
	}
}
export default async function (db: D1Database) {
	try {
		await seedDatabase(db);
		return new Response("Database seeded successfully", { status: 200 });
	} catch (error) {
		console.error("Error seeding database:", error);
		return new Response(`Error seeding database: ${error}`, { status: 500 });
	}
}
