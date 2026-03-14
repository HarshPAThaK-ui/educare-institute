import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError, asyncHandler } from '../middlewares/errorHandler.js';

const mailTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

const sanitizeUser = (user) => {
  const userObject = typeof user.toObject === 'function' ? user.toObject() : user;
  const {
    password,
    activationToken,
    activationTokenExpires,
    __v,
    role,
    ...safeUser
  } = userObject;

  return {
    ...safeUser,
    role: role === 'user' ? 'student' : role,
  };
};

const createActivationToken = (userId) =>
  jwt.sign({ sub: userId }, env.activationSecret, { expiresIn: '1d' });

const createAccessToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: '7d',
  });

const sendActivationEmail = async (user, activationToken) => {
  const activationLink = `${env.clientUrl}/activate/${activationToken}`;

  await mailTransport.sendMail({
    from: env.smtpUser,
    to: user.email,
    subject: 'Activate your Educare Institute account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Activate your account</h2>
        <p>Hello ${user.name},</p>
        <p>Thanks for registering. Please activate your account by clicking the link below:</p>
        <p>
          <a href="${activationLink}" target="_blank" rel="noopener noreferrer">
            Activate Account
          </a>
        </p>
        <p>If the button does not work, use this link:</p>
        <p>${activationLink}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });
};

export const register = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required.', 400);
  }

  if (name.length < 2) {
    throw new AppError('Name must be at least 2 characters long.', 400);
  }

  if (!validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new AppError(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.',
      400
    );
  }

  const existingUser = await User.findOne({ email }).select('+activationToken');

  if (existingUser?.isVerified) {
    throw new AppError('User already exists. Please log in instead.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  let user = existingUser;
  if (user) {
    user.name = name;
    user.password = hashedPassword;
    user.isVerified = false;
    user.status = 'pending';
  } else {
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      status: 'pending',
    });
  }

  const activationToken = createActivationToken(user._id);
  user.activationToken = activationToken;
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  await sendActivationEmail(user, activationToken);

  res.status(201).json({
    message: 'Registration successful. Please check your email to activate your account.',
    user: sanitizeUser(user),
  });
});

export const activateAccount = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new AppError('Activation token is required.', 400);
  }

  let payload;
  try {
    payload = jwt.verify(token, env.activationSecret);
  } catch (error) {
    throw new AppError('Activation token is invalid or has expired.', 400);
  }

  const user = await User.findById(payload.sub).select('+activationToken');

  if (!user) {
    throw new AppError('User not found for this activation token.', 404);
  }

  if (user.isVerified) {
    return res.status(200).json({
      message: 'Account is already activated. You can log in now.',
    });
  }

  if (
    user.activationToken !== token ||
    !user.activationTokenExpires ||
    user.activationTokenExpires.getTime() < Date.now()
  ) {
    throw new AppError('Activation token is invalid or has expired.', 400);
  }

  user.isVerified = true;
  user.activationToken = undefined;
  user.activationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    message: 'Account activated successfully. You can now log in.',
  });
});

export const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  if (!validator.isEmail(email)) {
    throw new AppError('Please provide a valid email address.', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isVerified) {
    throw new AppError('Please activate your account before logging in.', 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = createAccessToken(user);

  res.status(200).json({
    message: `Welcome back ${user.name}`,
    token,
    user: sanitizeUser(user),
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'enrollment.course',
    'title'
  );

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  res.status(200).json({ user: sanitizeUser(user) });
});
