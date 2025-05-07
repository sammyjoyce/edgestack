// TypeScript script to run database seed against remote D1
import { unstable_dev } from 'wrangler';
import * as path from 'path';
import * as fs from 'fs';

// This is a workaround for the inability to directly execute TypeScript files with D1
async function main() {
  console.log('🌱 Starting D1 database seed using TypeScript...');
  let tempWorkerPath = ''; // Define here for access in finally
  // Define type for worker more accurately if possible, or use any for now
  let worker: { stop: () => Promise<void>, fetch: (url: string, init?: RequestInit) => Promise<Response> } | undefined;

  try {
    // Create a temporary worker that imports and runs the seed file
    tempWorkerPath = path.resolve('./temp-seed-worker.ts');
    
    // Write a temporary worker file that will execute our seed
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
      // More robust error message handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      return new Response('Error seeding database: ' + errorMessage, { status: 500 });
    }
  }
};
      `
    );
    
    console.log('Starting temporary worker...');
    // Start the worker with the D1 binding
    worker = await unstable_dev(tempWorkerPath, {
      config: './wrangler.jsonc', // Use your existing wrangler config
      remote: true, // Use the remote database
      experimental: { disableExperimentalWarning: true } // Suppress experimental warning
    });
    console.log('Temporary worker started. Sending request...');
    
    // Send a request to trigger the seeding
    const resp = await worker.fetch('http://localhost/'); // URL path doesn't strictly matter for this worker
    console.log('Request sent. Waiting for response...');
    const text = await resp.text();
    
    console.log(`Response: ${resp.status} ${text}`);
        
    if (resp.status === 200) {
      console.log('✅ Database seed completed successfully!');
      // process.exitCode will be 0 by default if not set
    } else {
      console.error('❌ Database seed failed!');
      process.exitCode = 1; // Set exit code for failure
    }
  } catch (error) {
    console.error('Error in main function:', error);
    process.exitCode = 1; // Set exit code for failure
  } finally {
    if (worker) {
      console.log('Stopping temporary worker...');
      try {
        await worker.stop();
        console.log('Temporary worker stopped.');
      } catch (stopError) {
        console.error('Error stopping worker:', stopError);
        if (process.exitCode === undefined || process.exitCode === 0) {
          process.exitCode = 1;
        }
      }
    }
    if (tempWorkerPath && fs.existsSync(tempWorkerPath)) {
      console.log('Deleting temporary worker file...');
      try {
        fs.unlinkSync(tempWorkerPath);
        console.log('Temporary worker file deleted.');
      } catch (unlinkError) {
        console.error('Error deleting temporary worker file:', unlinkError);
        if (process.exitCode === undefined || process.exitCode === 0) {
          process.exitCode = 1;
        }
      }
    }
    // Exit with the appropriate code
    process.exit(process.exitCode || 0);
  }
}

main();
