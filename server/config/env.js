import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'JWT_SECRET',
  'ACTIVATION_SECRET',
  'MONGO_URI',
  'CLIENT_URL',
  'SMTP_USER',
  'SMTP_PASS',
];

const missingEnvVars = requiredEnvVars.filter(
  (key) => !process.env[key] || !process.env[key].trim()
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  activationSecret: process.env.ACTIVATION_SECRET,
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL.replace(/\/+$/, ''),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};
