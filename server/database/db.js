import mongoose from 'mongoose';
import winston from 'winston';
import { env } from '../config/env.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    winston.info('MongoDB connected');
  } catch (error) {
    winston.error('MongoDB connection error:', error);
    throw error;
  }
};
