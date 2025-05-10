#!/usr/bin/env node

// A simple script to execute the TypeScript seed against remote D1
// This uses ESBuild to bundle the seed file and its dependencies to run on Node.js

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Define paths
const TEMP_DIR = path.resolve("./tmp");
const TEMP_JS_FILE = path.resolve(TEMP_DIR, "seed-bundle.js");

// Make sure tmp directory exists
if (!fs.existsSync(TEMP_DIR)) {
	fs.mkdirSync(TEMP_DIR, { recursive: true });
}

try {
	console.log("🌱 Starting remote database seeding...");

	// Build a temporary wrapper script that can invoke our seed function
	const TEMP_TS_FILE = path.resolve(TEMP_DIR, "seed-wrapper.ts");

	// Create the wrapper script
	fs.writeFileSync(
		TEMP_TS_FILE,
		`
import { D1Database } from '@cloudflare/workers-types';
import { seedDatabase } from '../database/seed';

// This is a stub D1 implementation that will be used by seedDatabase
const d1Stub = {
  prepare: () => {},
  dump: () => {},
  batch: async (statements) => {
    console.log(\`Would execute \${statements.length} statements\`);
    return [];
  },
  exec: async (query) => {
    console.log(\`Would execute: \${query}\`);
    return { results: [], success: true, meta: {} };
  }
} as unknown as D1Database;

// Log seed data instructions
console.log('⭐ To seed the remote database, copy and run the SQL statements from seeds/initial-data.sql manually using:');
console.log('bunx wrangler d1 execute lush-content-db --remote --file=./seeds/initial-data.sql');
console.log('\\n');

// Call the seedDatabase to display the content that would be inserted
seedDatabase(d1Stub).catch(console.error);
  `,
	);

	// Execute the script
	console.log("Running the remote seed script...");
	execSync(`bunx tsx ${TEMP_TS_FILE}`, { stdio: "inherit" });

	console.log("✅ Seed simulation completed.");
	console.log("");
	console.log("To run the actual seed on the remote database, use:");
	console.log(
		"bunx wrangler d1 execute lush-content-db --remote --file=./seeds/initial-data.sql",
	);
} catch (error) {
	console.error("Error:", error);
	process.exit(1);
} finally {
	// Cleanup
	try {
		if (fs.existsSync(TEMP_DIR)) {
			fs.rmSync(TEMP_DIR, { recursive: true, force: true });
		}
	} catch (e) {
		console.warn("Warning: Failed to clean up temporary files", e);
	}
}
