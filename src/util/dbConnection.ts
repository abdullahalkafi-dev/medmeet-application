import mongoose from 'mongoose';
import colors from 'colors';
import { logger, errorLogger } from '../shared/logger';
import config from '../config';

export const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  try {
    // Disable mongoose buffering to prevent timeout issues
    mongoose.set('bufferCommands', false);
    
    // MongoDB connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info(colors.green('🟢 MongoDB connected successfully'));
    });
    
    mongoose.connection.on('error', (err) => {
      errorLogger.error('🔴 MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.info(colors.yellow('🟡 MongoDB disconnected'));
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info(colors.green('🟢 MongoDB reconnected'));
    });

    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain minimum 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      connectTimeoutMS: 30000, // 30 seconds
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
      retryWrites: true,
    });

    logger.info(colors.green('🚀 Database connected successfully'));
  } catch (error) {
    errorLogger.error('🔴 Database connection failed:', error);
    
    if (retries > 0) {
      logger.info(colors.yellow(`🔄 Retrying database connection in ${delay/1000} seconds... (${retries} attempts left)`));
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1, delay);
    } else {
      errorLogger.error('🔴 All database connection attempts failed');
      throw error;
    }
  }
};

export const gracefulShutdown = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info(colors.blue('🔵 Database connection closed gracefully'));
  } catch (error) {
    errorLogger.error('🔴 Error closing database connection:', error);
  }
};
