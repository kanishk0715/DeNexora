import User, { UserRole } from '../models/User';

/**
 * Test user credentials for local development
 * All passwords: 1234
 */
const testUsers = [
  {
    name: 'Test Student',
    email: 'student@gmail.com',
    password: '1234',
    role: UserRole.STUDENT,
    isEmailVerified: true,
    isOrganizationVerified: true,
  },
  {
    name: 'Test Faculty',
    email: 'faculty@gmail.com',
    password: '1234',
    role: UserRole.ACADEMICIAN,
    isEmailVerified: true,
    isOrganizationVerified: true,
  },
  {
    name: 'Test Industry Partner',
    email: 'industry@gmail.com',
    password: '1234',
    role: UserRole.INDUSTRY,
    isEmailVerified: true,
    isOrganizationVerified: true,
  },
  {
    name: 'Test Institution',
    email: 'institution@gmail.com',
    password: '1234',
    role: UserRole.INSTITUTION,
    isEmailVerified: true,
    isOrganizationVerified: true,
  },
  {
    name: 'Test Admin',
    email: 'admin@gmail.com',
    password: '1234',
    role: UserRole.ADMIN,
    isEmailVerified: true,
    isOrganizationVerified: true,
  },
];

/**
 * Seed test users for local development
 * Only runs in development mode
 */
export const seedTestUsers = async (): Promise<void> => {
  try {
    // Only seed in development
    if (process.env.NODE_ENV === 'production') {
      console.log('⊗ Skipping test user seeding in production');
      return;
    }

    console.log('🌱 Checking test users...');

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        // Create new user
        const user = new User({
          name: userData.name,
          email: userData.email,
          passwordHash: userData.password, // Will be hashed by pre-save hook
          role: userData.role,
          isEmailVerified: userData.isEmailVerified,
          isOrganizationVerified: userData.isOrganizationVerified,
        });

        await user.save();
        console.log(`✓ Created test user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`⊗ Test user already exists: ${userData.email}`);
      }
    }

    console.log('✓ Test user seeding completed');
    console.log('\n📋 Test Credentials:');
    console.log('   Student:     student@gmail.com / 1234');
    console.log('   Faculty:     faculty@gmail.com / 1234');
    console.log('   Industry:    industry@gmail.com / 1234');
    console.log('   Institution: institution@gmail.com / 1234');
    console.log('   Admin:       admin@gmail.com / 1234\n');
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    throw error;
  }
};
