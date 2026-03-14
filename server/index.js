import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { connectDB } from './database/db.js';
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  'http://localhost:5173',
].filter(Boolean);

app.set('trust proxy', 1);

// Core middleware
app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.netlify\.app$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Educare Institute API Server is running!' });
});

app.use('/uploads', express.static('uploads'));

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many attempts from this IP, please try again after 15 minutes.',
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many OTP attempts from this IP, please try again after 15 minutes.',
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many contact form submissions from this IP, please try again later.',
});

// Routes
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/user/verify', verifyLimiter);
app.use('/api/contact/submit', contactLimiter);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  winston.error(message, { status, stack: err.stack });
  res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB is not connected');
    }
    app.listen(port, () => {
      winston.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    winston.error('Server startup failed', error);
    process.exit(1);
  }
};

startServer();
