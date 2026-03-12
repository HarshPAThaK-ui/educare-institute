import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.js";
import { Class } from "../models/class.js";
import { rm } from "fs";
import { extname } from "path";
import { User } from "../models/User.js";
import { Contact } from "../models/Contact.js";
import bcrypt from 'bcrypt';
import { Note } from "../models/Note.js";

// Course Management
export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category, duration, fee, schedule, batchSize, subjects, location } = req.body;

    await Courses.create({
        title,
        description,
        category,
        duration,
        fee,
        schedule,
        batchSize,
        subjects: Array.isArray(subjects) ? subjects : subjects.split(',').map(subject => subject.trim()),
        location
    });
    res.status(201).json({
        message: "Course created successfully"
    });
});

export const getAllCourses = TryCatch(async (req, res) => {
    console.log('Fetching all courses...');
    try {
        const courses = await Courses.find().sort({ createdAt: -1 });
        console.log('Courses found:', courses.length);
        res.json({
            courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message
        });
    }
});

export const updateCourse = TryCatch(async (req, res) => {
    const { title, description, category, duration, fee, schedule, batchSize, subjects, location } = req.body;

    const course = await Courses.findById(req.params.id);
    if (!course) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.duration = duration || course.duration;
    course.fee = fee || course.fee;
    course.schedule = schedule || course.schedule;
    course.batchSize = batchSize || course.batchSize;
    course.subjects = subjects ? (Array.isArray(subjects) ? subjects : subjects.split(',').map(subject => subject.trim())) : course.subjects;
    course.location = location || course.location;

    await course.save();

    res.json({
        message: "Course updated successfully",
        course
    });
});

export const deleteCourse = TryCatch(async (req, res) => {
    console.log('Delete course request:', req.params.id);
    const course = await Courses.findById(req.params.id);

    if (!course) {
        console.log('Course not found for deletion:', req.params.id);
        return res.status(404).json({
            message: "Course not found"
        });
    }

    console.log('Deleting course:', course.title);

    await Class.find({course: req.params.id}).deleteMany(); //delete all the classes from the course
    await course.deleteOne(); //delete course from db
    
    // Remove course from all user enrollments
    await User.updateMany({}, {
        $pull: { 
            enrollment: { course: req.params.id }
        }
    });

    console.log('Course deleted successfully');

    res.json({
        message: "Course deleted successfully",
    });
});

// Class Management
export const createClass = TryCatch(async (req, res) => {
  try {
    const { courseId, title, description, date, startTime, endTime, classroom, teacher, topics, homework, studentClass } = req.body;

    const course = await Courses.findById(courseId);
    if (!course)
      return res.status(404).json({
        message: "Course not found"
      });

    await Class.create({
      course: courseId,
      title,
      description,
      date,
      startTime,
      endTime,
      classroom,
      teacher,
      topics,
      homework,
      studentClass
    });

    res.status(201).json({
      message: "Class scheduled successfully"
    });
  } catch (err) {
    console.error('Error in createClass:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

export const getAllClasses = TryCatch(async (req, res) => {
    console.log('Fetching all classes...');
    try {
        const classes = await Class.find().populate('course', 'title').sort({ date: 1 });
        console.log('Classes found:', classes.length);
        res.json({
            classes
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            message: "Failed to fetch classes",
            error: error.message
        });
    }
});

export const updateClass = TryCatch(async (req, res) => {
    const { courseId, title, description, date, startTime, endTime, classroom, teacher, topics, homework } = req.body;

    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
        return res.status(404).json({
            message: "Class not found"
        });
    }

    if (courseId) {
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        classItem.course = courseId;
    }

    classItem.title = title || classItem.title;
    classItem.description = description || classItem.description;
    classItem.date = date || classItem.date;
    classItem.startTime = startTime || classItem.startTime;
    classItem.endTime = endTime || classItem.endTime;
    classItem.classroom = classroom || classItem.classroom;
    classItem.teacher = teacher || classItem.teacher;
    classItem.topics = topics ? topics.split(',').map(topic => topic.trim()) : classItem.topics;
    classItem.homework = homework || classItem.homework;

    await classItem.save();

    res.json({
        message: "Class updated successfully",
        class: classItem
    });
});

export const deleteClass = TryCatch(async (req, res) => {
    console.log('Delete class request:', req.params.id);
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
        console.log('Class not found for deletion:', req.params.id);
        return res.status(404).json({
            message: "Class not found"
        });
    }

    console.log('Deleting class:', classItem.title);
    await classItem.deleteOne();
    console.log('Class deleted successfully');

    res.json({
        message: "Class deleted successfully"
    });
});

// User Management
export const createUser = TryCatch(async (req, res) => {
    const { name, email, password, role, phone, address, studentClass, parentName, parentPhone } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            message: "User with this email already exists"
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        password: hashPassword,
        role: role || 'user',
        phone,
        address,
        studentClass,
        parentName,
        parentPhone,
    });

    res.status(201).json({
        message: "User created successfully",
        user
    });
});

export const getAllUsers = TryCatch(async (req, res) => {
    console.log('Fetching all users...');
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        console.log('Users found:', users.length);
        res.json({
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});

export const updateUser = TryCatch(async (req, res) => {
    const { name, email, phone, studentClass, parentName, parentPhone, address, status, courses } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.studentClass = studentClass || user.studentClass;
    user.parentName = parentName || user.parentName;
    user.parentPhone = parentPhone || user.parentPhone;
    user.address = address || user.address;
    user.status = status || user.status;

    // Update enrollment if courses are provided
    if (courses && Array.isArray(courses)) {
        console.log('Assigning courses:', courses);
        user.enrollment = courses.map(courseId => ({
            course: courseId,
            enrolledDate: new Date(),
            status: "active",
            feePaid: false
        }));
    }

    await user.save();

    res.json({
        message: "User updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            studentClass: user.studentClass,
            parentName: user.parentName,
            parentPhone: user.parentPhone,
            address: user.address,
            status: user.status,
            role: user.role,
            enrollment: user.enrollment
        }
    });
});

export const deleteUser = TryCatch(async (req, res) => {
    console.log('Delete user request:', req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
        console.log('User not found for deletion:', req.params.id);
        return res.status(404).json({
            message: "User not found"
        });
    }

    console.log('Deleting user:', user.name, user.email);
    await user.deleteOne();
    console.log('User deleted successfully');

    res.json({
        message: "User deleted successfully"
    });
});

export const getPendingUsers = TryCatch(async (req, res) => {
    const users = await User.find({ status: 'pending', role: 'user' });
    res.json({ users });
});

export const approveUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'approved';
    await user.save();
    res.json({ message: 'User approved successfully' });
});

export const rejectUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.status = 'rejected';
    await user.save();
    res.json({ message: 'User rejected successfully' });
});

// Statistics
export const getAllStats = TryCatch(async (req, res) => {
    const [totalCourses, totalClasses, totalUsers, enrollmentsAgg] = await Promise.all([
        Courses.countDocuments(),
        Class.countDocuments(),
        User.countDocuments({ role: { $in: ['user', 'student'] } }),
        User.aggregate([
            { $unwind: "$enrollment" },
            { $count: "total" }
        ])
    ]);

    const totalEnrollments = enrollmentsAgg[0]?.total || 0;

    const stats = {
        totalCourses,
        totalClasses,
        totalUsers,
        totalEnrollments
    };

    res.json({
        stats,
    });
});

export const getAllContacts = TryCatch(async (req, res) => {
    const contacts = await Contact.find({}).sort({ submittedAt: -1 });
    res.status(200).json({
        contacts,
    });
});

export const createNote = TryCatch(async (req, res) => {
  const { title, content, class: className, subject } = req.body;

  if (!title || !content || !className) {
    return res.status(400).json({ message: "Title, content and class are required" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "PDF file is required" });
  }

  const isPdfMime = req.file.mimetype === "application/pdf";
  const isPdfExt = extname(req.file.originalname || "").toLowerCase() === ".pdf";
  if (!isPdfMime || !isPdfExt) {
    return res.status(400).json({ message: "Only PDF files are allowed" });
  }

  const maxPdfSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxPdfSize) {
    return res.status(400).json({ message: "PDF file size must be 10MB or less" });
  }

  const note = await Note.create({
    title,
    content,
    class: className,
    subject: subject || "",
    pdf: req.file.path,
    uploadedBy: req.user?._id,
  });

  res.status(201).json({ message: "Note created successfully", note });
});

export const getNotes = TryCatch(async (req, res) => {
  const { class: className } = req.query;
  const filter = className ? { class: className } : {};
  const notes = await Note.find(filter).sort({ createdAt: -1 });
  res.json({ notes });
});

export const updateNote = TryCatch(async (req, res) => {
  const { id } = req.params;
  const { title, content, class: className, subject } = req.body;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (req.file) {
    const isPdfMime = req.file.mimetype === "application/pdf";
    const isPdfExt = extname(req.file.originalname || "").toLowerCase() === ".pdf";
    if (!isPdfMime || !isPdfExt) {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    const maxPdfSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxPdfSize) {
      return res.status(400).json({ message: "PDF file size must be 10MB or less" });
    }
  }

  if (req.file) {
    if (note.pdf) {
      rm(note.pdf, () => {});
    }
    note.pdf = req.file.path;
  }

  note.title = title || note.title;
  note.content = content || note.content;
  note.class = className || note.class;
  note.subject = typeof subject === "string" ? subject : note.subject;
  await note.save();
  res.json({ message: "Note updated successfully", note });
});

export const deleteNote = TryCatch(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  if (note.pdf) {
    rm(note.pdf, () => {});
  }
  await note.deleteOne();
  res.json({ message: "Note deleted successfully" });
});
