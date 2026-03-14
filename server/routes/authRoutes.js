import express from 'express';
import {
  login,
  me,
  register,
  verifyOtp,
} from '../controllers/authController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyOtp);
router.post('/login', login);
router.get('/me', isAuth, me);

export default router;
