
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
      