import express from 'express';
import {
  activateAccount,
  login,
  me,
  register,
} from '../controllers/authController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/register', register);
router.get('/activate/:token', activateAccount);
router.post('/login', login);
router.get('/me', isAuth, me);

export default router;
