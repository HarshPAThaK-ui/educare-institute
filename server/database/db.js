import mongoose from 'mongoose';
import winston from 'winston';

export const connectDB = async () => {
  if (!process.env.DB) {
    const error = new Error('DB connection string is missing');
    winston.error(error.message);
    throw error;
  }

  try {
    await mongoose.connect(process.env.DB);
    winston.info('MongoDB connected');
  } catch (error) {
    winston.error('MongoDB connection error:', error);
    throw error;
  }
};
