import express from 'express';
import { myProfile, logoutUser, updateProfile, changePassword } from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/user/logout", isAuth, logoutUser);
router.get("/user/me", isAuth, myProfile);
router.put("/user/profile", isAuth, updateProfile);
router.put("/user/change-password", isAuth, changePassword);

export default router; 
