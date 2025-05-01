
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
      