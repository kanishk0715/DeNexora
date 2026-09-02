import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * In-Memory MongoDB Server for Development
 * Uses mongodb-memory-server (no MongoDB installation required)
 */

let mongoServer: MongoMemoryServer | null = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    // Check if we should use real MongoDB or in-memory
    const useRealMongo = process.env.MONGODB_URI && process.env.USE_REAL_MONGO === 'true';
    
    if (useRealMongo) {
      // Connect to real MongoDB
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log('✓ Connected to MongoDB');
    } else {
      // Start in-memory MongoDB server
      console.log('🚀 Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log('✓ In-memory MongoDB server started');
      console.log('✓ No MongoDB installation required - running in mock mode');
    }
    
    console.log('✓ Database connection established successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    
    if (mongoServer) {
      await mongoServer.stop();
      console.log('✓ In-memory MongoDB server stopped');
    }
    
    console.log('✓ Database disconnected');
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};
