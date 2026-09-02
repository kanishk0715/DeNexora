import { seedTestUsers } from './users';
import { connectDatabase, disconnectDatabase } from '../config/database';

/**
 * Main seed runner
 * Seeds all test data for development
 */
export const runSeeds = async (): Promise<void> => {
  try {
    console.log('🌱 Starting seed process...\n');

    // Seed test users
    await seedTestUsers();

    // Add more seed functions here as needed
    // await seedTestAssessments();
    // await seedTestOpportunities();

    console.log('\n✓ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    throw error;
  }
};

/**
 * Run seeds if this file is executed directly
 * Usage: npm run seed
 */
if (require.main === module) {
  (async () => {
    try {
      await connectDatabase();
      await runSeeds();
      await disconnectDatabase();
      process.exit(0);
    } catch (error) {
      console.error('Seed failed:', error);
      process.exit(1);
    }
  })();
}
