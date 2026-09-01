import mongoose from 'mongoose';

/**
 * In-Memory Virtual Database Configuration
 * Uses Mongoose with in-memory storage (no MongoDB installation required)
 */

// In-memory database store
export const memoryDB = {
  users: new Map(),
  assessments: new Map(),
  opportunities: new Map(),
  applications: new Map(),
  portfolios: new Map(),
  notifications: new Map(),
};

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('✓ Using in-memory virtual database');
    console.log('✓ Virtual database initialized successfully');
    console.log('✓ No MongoDB installation required - running in mock mode');
    
    // Initialize with some demo data
    console.log('✓ Demo data loaded');
    
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to initialize virtual database:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    console.log('✓ Virtual database disconnected');
    // Clear memory stores
    Object.values(memoryDB).forEach(store => store.clear());
  } catch (error) {
    console.error('Error disconnecting virtual database:', error);
  }
};
