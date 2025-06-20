import express from 'express';
import { getAllCourses, getSingleCourse, getMyEnrollments, enrollInCourse, getClassesByBatch } from '../controllers/course.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/my-enrollments", isAuth, getMyEnrollments);
router.post("/enroll", isAuth, enrollInCourse);
router.get("/classes", getClassesByBatch);

export default router; 