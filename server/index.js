import express from 'express';
import cors from 'cors';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB } from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
const port = env.port;
const allowedOrigins = [
  env.clientUrl,
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

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many contact form submissions from this IP, please try again later.',
});

// Routes
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/contact/submit', contactLimiter);
app.use('/api/user', authRoutes);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contactRoutes);

app.use(notFound);
app.use(errorHandler);

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
