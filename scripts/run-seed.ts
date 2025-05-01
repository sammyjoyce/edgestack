// TypeScript script to run database seed against remote D1
import { unstable_dev } from 'wrangler';
import * as path from 'path';
import * as fs from 'fs';

// This is a workaround for the inability to directly execute TypeScript files with D1
async function main() {
  console.log('🌱 Starting D1 database seed using TypeScript...');
  
  try {
    // Create a temporary worker that imports and runs the seed file
    const tempWorkerPath = path.resolve('./temp-seed-worker.ts');
    
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
      return new Response('Error seeding database: ' + error.message, { status: 500 });
    }
  }
};
      `
    );
    
    // Start the worker with the D1 binding
    const worker = await unstable_dev(tempWorkerPath, {
      config: './wrangler.jsonc', // Use your existing wrangler config
      remote: true, // Use the remote database
    });
    
    // Send a request to trigger the seeding
    const resp = await worker.fetch('http://localhost/');
    const text = await resp.text();
    
    console.log(`Response: ${resp.status} ${text}`);
    
    // Cleanup
    await worker.stop();
    fs.unlinkSync(tempWorkerPath);
    
    if (resp.status === 200) {
      console.log('✅ Database seed completed successfully!');
    } else {
      console.error('❌ Database seed failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
