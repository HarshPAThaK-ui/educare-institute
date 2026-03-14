import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError, asyncHandler } from '../middlewares/errorHandler.js';
import sendMail from '../middlewares/sendMail.js';

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

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const createOtpToken = (userId, otp) =>
  jwt.sign({ sub: userId, otp: String(otp) }, env.activationSecret, {
    expiresIn: '10m',
  });

const createAccessToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: '7d',
  });

const sendOtpEmail = async (user, otp) => {
  await sendMail(user.email, 'Educare Institute OTP Verification', {
    name: user.name,
    otp: String(otp),
  });
};

const sendAdminRegistrationAlert = async (user) => {
  const adminEmail = process.env.ADMIN_EMAIL || env.smtpUser;

  if (!adminEmail) {
    return;
  }

  await sendMail(adminEmail, 'New Student Registration - Approval Needed', {
    name: user.name,
    email: user.email,
    message: `A new student has registered and completed OTP verification.\n\nName: ${user.name}\nEmail: ${user.email}\nPlease log in to the admin portal to approve or reject this student.`,
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

  const existingUser = await User.findOne({ email }).select(
    '+activationToken +password'
  );

  if (existingUser?.isVerified) {
    throw new AppError('User already exists. Please log in instead.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = crypto.randomInt(100000, 1000000);

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

  const activationToken = createOtpToken(user._id, otp);
  user.activationToken = activationToken;
  user.activationTokenExpires = new Date(Date.now() + OTP_EXPIRY_MS);
  await user.save();

  await sendOtpEmail(user, otp);

  res.status(200).json({
    message: 'OTP sent to your email. Please verify your account.',
    activationToken,
    user: sanitizeUser(user),
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const token = req.body.activationToken?.trim();
  const otp = req.body.otp?.toString().trim();

  if (!token || !otp) {
    throw new AppError('OTP and activation token are required.', 400);
  }

  let payload;
  try {
    payload = jwt.verify(token, env.activationSecret);
  } catch (error) {
    throw new AppError('Activation token is invalid or has expired.', 400);
  }

  const user = await User.findById(payload.sub).select('+activationToken');

  if (!user) {
    throw new AppError('User not found for this OTP request.', 404);
  }

  if (user.isVerified) {
    return res.status(200).json({
      message: 'Account already verified. Please wait for admin approval.',
    });
  }

  if (
    user.activationToken !== token ||
    !user.activationTokenExpires ||
    user.activationTokenExpires.getTime() < Date.now()
  ) {
    throw new AppError('Activation token is invalid or has expired.', 400);
  }

  if (String(payload.otp) !== otp) {
    throw new AppError('Invalid OTP.', 400);
  }

  user.isVerified = true;
  user.activationToken = undefined;
  user.activationTokenExpires = undefined;
  await user.save();

  await sendAdminRegistrationAlert(user);

  res.status(200).json({
    message: 'Account verified successfully. Awaiting admin approval.',
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
    throw new AppError('Please verify the OTP sent to your email before logging in.', 403);
  }

  if (user.role !== 'admin' && user.status !== 'approved') {
    throw new AppError(
      'Your registration is pending approval by the admin. Please wait for confirmation.',
      403
    );
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
