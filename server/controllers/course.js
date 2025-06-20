import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.js";
import { User } from "../models/User.js";
import { Class } from "../models/class.js";

export const getAllCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ isActive: true });
    res.json({
        courses,
    })
});

export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    
    res.json({
        course,
    });
});

export const getMyEnrollments = TryCatch(async (req, res) => {
    console.log('getMyEnrollments called');
    console.log('req.user:', req.user);
    let user;
    try {
        user = await User.findById(req.user._id).populate('enrollment.course');
        console.log('User found:', user);
    } catch (err) {
        console.error('Error during User.findById or population:', err);
        return res.status(500).json({ message: 'Error fetching user enrollments', error: err.message });
    }
    if (!user) {
        console.log('User not found for id:', req.user._id);
        return res.status(404).json({ message: 'User not found' });
    }
    // Filter out enrollments with missing courses
    const validEnrollments = user.enrollment.filter(e => e.course);
    res.json({
        enrollments: validEnrollments,
    }); 
});

export const enrollInCourse = TryCatch(async (req, res) => {
    const { courseId } = req.body;
    
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(courseId);
    
    if (!course) {
        return res.status(404).json({
            message: "Course not found"
        });
    }
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrollment.find(
        enrollment => enrollment.course.toString() === courseId
    );
    
    if (alreadyEnrolled) {
        return res.status(400).json({
            message: "Already enrolled in this course"
        });
    }
    
    user.enrollment.push({
        course: courseId,
        enrolledDate: new Date(),
        status: "active",
        feePaid: false
    });
    
    await user.save();
    
    res.json({
        message: "Enrolled successfully"
    });
});

export const getClassesByBatch = TryCatch(async (req, res) => {
  const { studentClass } = req.query;
  const filter = studentClass ? { studentClass } : {};
  const classes = await Class.find(filter);
  res.json({ classes });
});