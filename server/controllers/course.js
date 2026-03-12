import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.js";
import { User } from "../models/User.js";
import { Class } from "../models/class.js";

export const getAllCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ isActive: true });
    res.json({
        success: true,
        courses,
    });
});

export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found"
        });
    }
    
    if (!course.isActive) {
        return res.status(404).json({
            success: false,
            message: "Course is not available"
        });
    }
    
    res.json({
        success: true,
        course,
    });
});

export const getMyEnrollments = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).populate('enrollment.course');
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Filter out enrollments with missing courses
    const validEnrollments = user.enrollment.filter(e => e.course);
    
    res.json({
        success: true,
        enrollments: validEnrollments,
    }); 
});

export const enrollInCourse = TryCatch(async (req, res) => {
    const { courseId } = req.body;
    
    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: "Course ID is required"
        });
    }
    
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(courseId);
    
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found"
        });
    }
    
    if (!course.isActive) {
        return res.status(400).json({
            success: false,
            message: "This course is not available for enrollment"
        });
    }
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrollment.find(
        enrollment => enrollment.course.toString() === courseId
    );
    
    if (alreadyEnrolled) {
        return res.status(400).json({
            success: false,
            message: "Already enrolled in this course"
        });
    }
    
    // Check if course has reached batch size limit
    const enrolledCount = await User.countDocuments({
        'enrollment.course': courseId,
        'enrollment.status': 'active'
    });
    
    if (enrolledCount >= course.batchSize) {
        return res.status(400).json({
            success: false,
            message: "Course batch is full. Please try another batch or contact admin."
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
        success: true,
        message: "Enrolled successfully"
    });
});

export const getClassesByBatch = TryCatch(async (req, res) => {
    const { studentClass } = req.query;
    const filter = studentClass ? { studentClass } : {};
    const classes = await Class.find(filter).populate('course', 'title category');
    
    res.json({
        success: true,
        classes
    });
});