import express from 'express';
import { loginUser, myProfile, register, verifyUser, logoutUser, updateProfile, changePassword } from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser); 
router.post("/user/login", loginUser);
router.post("/user/logout", isAuth, logoutUser);
router.get("/user/me", isAuth, myProfile);
router.put("/user/profile", isAuth, updateProfile);
router.put("/user/change-password", isAuth, changePassword);

export default router; 
