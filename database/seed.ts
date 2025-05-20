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
                       value: "Big Impact for Modern Brands",
			page: "home",
			section: "hero",
			type: "text",
			sortOrder: 1,
		},
		{
			key: "hero_subtitle",
                       value:
                               "Delivering high-quality solutions since 2010.",
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
                               "We offer a variety of services to help your business grow.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 2,
		},
		{
			key: "service_1_title",
                       value: "Design",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 3,
		},
		{
			key: "service_1_text",
                       value:
                               "Creative designs tailored to your brand.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 4,
		},
		{
			key: "service_1_image",
                       value: "/assets/service-design.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 5,
		},
		{
			key: "service_2_title",
                       value: "Development",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 6,
		},
		{
			key: "service_2_text",
                       value:
                               "Robust solutions built with the latest technologies.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 7,
		},
		{
			key: "service_2_image",
                       value: "/assets/service-development.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 8,
		},
		{
			key: "service_3_title",
                       value: "Marketing",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 9,
		},
		{
			key: "service_3_text",
                       value:
                               "Strategies that connect you with your audience.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 10,
		},
		{
			key: "service_3_image",
                       value: "/assets/service-marketing.jpg",
			page: "home",
			section: "services",
			type: "image",
			sortOrder: 11,
		},
		{
			key: "service_4_title",
                       value: "Support",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 12,
		},
		{
			key: "service_4_text",
                       value:
                               "Reliable support to keep things running smoothly.",
			page: "home",
			section: "services",
			type: "text",
			sortOrder: 13,
		},
		{
			key: "service_4_image",
                       value: "/assets/service-support.jpg",
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
                               "Our team delivers results with a focus on quality and clear communication.",
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
                       value: "Your Company | Digital Solutions",
			page: "global",
			section: "meta",
			type: "text",
			sortOrder: 1,
		},
               {
                        key: "meta_description",
                       value:
                               "Delivering high-quality solutions since 2010.",
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
                       title: "Responsive Website",
                       description: "A modern responsive website for a local business.",
                       details: "Features: accessible design, CMS integration",
                       imageUrl: "/assets/project-waterfront.jpg",
                       slug: "responsive-website",
                       published: true,
                       isFeatured: true,
                       sortOrder: 1,
               },
               {
                       title: "Productivity App",
                       description: "A mobile app that helps users stay organized.",
                       details: "Features: cross-platform support, offline mode, push notifications",
                       imageUrl: "/assets/project-heritage.jpg",
                       slug: "productivity-app",
                       published: true,
                       isFeatured: true,
                       sortOrder: 2,
               },
               {
                       title: "E-commerce Platform",
                       description: "A scalable online store with secure payments.",
                       details: "Features: custom integrations, flexible catalog, analytics",
                       imageUrl: "/assets/project-apartments.jpg",
                       slug: "ecommerce-platform",
                       published: true,
                       isFeatured: true,
                       sortOrder: 3,
               },
               {
                       title: "Analytics Dashboard",
                       description: "A dashboard providing real-time insights for your team.",
                       details: "Features: dynamic charts, exportable reports",
                       imageUrl: "/assets/project-kitchen.jpg",
                       slug: "analytics-dashboard",
                       published: true,
                       isFeatured: false,
                       sortOrder: 4,
               },
               {
                       title: "Portfolio Showcase",
                       description: "A clean and simple portfolio site.",
                       details: "Features: image galleries, contact form",
                       imageUrl: "/assets/project-sustainable.jpg",
                       slug: "portfolio-showcase",
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
