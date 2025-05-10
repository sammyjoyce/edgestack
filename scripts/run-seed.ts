import * as fs from "node:fs";
import * as path from "node:path";
import { unstable_dev } from "wrangler";
async function main() {
	console.log("🌱 Starting D1 database seed using TypeScript...");
	let tempWorkerPath = ""; 
	let worker:
		| {
				stop: () => Promise<void>;
				fetch: (url: string, init?: RequestInit) => Promise<Response>;
		  }
		| undefined;
	try {
		tempWorkerPath = path.resolve("./temp-seed-worker.ts");
		fs.writeFileSync(
			tempWorkerPath,
			`
import { seedDatabase } from './database/seed';
export default {
  async fetch(request, env) {
    try {
      await seedDatabase(env.DB);
      return new Response('Database seeded successfully!', { status: 200 });
    } catch (error) {
      console.error('Error seeding database:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return new Response('Error seeding database: ' + errorMessage, { status: 500 });
    }
  }
};
      `,
		);
		console.log("Starting temporary worker...");
		worker = await unstable_dev(tempWorkerPath, {
			config: "./wrangler.jsonc", 
			remote: true, 
			experimental: { disableExperimentalWarning: true }, 
		});
		console.log("Temporary worker started. Sending request...");
		const resp = await worker.fetch("http:
		console.log("Request sent. Waiting for response...");
		const text = await resp.text();
		console.log(`Response: ${resp.status} ${text}`);
		if (resp.status === 200) {
			console.log("✅ Database seed completed successfully!");
		} else {
			console.error("❌ Database seed failed!");
			process.exitCode = 1; 
		}
	} catch (error) {
		console.error("Error in main function:", error);
		process.exitCode = 1; 
	} finally {
		if (worker) {
			console.log("Stopping temporary worker...");
			try {
				await worker.stop();
				console.log("Temporary worker stopped.");
			} catch (stopError) {
				console.error("Error stopping worker:", stopError);
				if (process.exitCode === undefined || process.exitCode === 0) {
					process.exitCode = 1;
				}
			}
		}
		if (tempWorkerPath && fs.existsSync(tempWorkerPath)) {
			console.log("Deleting temporary worker file...");
			try {
				fs.unlinkSync(tempWorkerPath);
				console.log("Temporary worker file deleted.");
			} catch (unlinkError) {
				console.error("Error deleting temporary worker file:", unlinkError);
				if (process.exitCode === undefined || process.exitCode === 0) {
					process.exitCode = 1;
				}
			}
		}
		process.exit(process.exitCode || 0);
	}
}
main();
