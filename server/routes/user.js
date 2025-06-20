import express from 'express';
import { loginUser, myProfile, register, verifyUser, logoutUser, listUsers, submitContactForm, updateProfile, changePassword } from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser); 
router.post("/user/login", loginUser);
router.post("/user/logout", isAuth, logoutUser);
router.get("/user/me", isAuth, myProfile);
router.get("/user/list", listUsers); // Debug endpoint - remove in production
router.put("/user/profile", isAuth, updateProfile);
router.put("/user/change-password", isAuth, changePassword);

// Contact form submission (no authentication required)
router.post("/contact/submit", submitContactForm);

export default router;
