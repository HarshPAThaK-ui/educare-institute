import express from 'express';
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import { 
    createClass, 
    createCourse, 
    deleteCourse, 
    getAllStats,
    getAllUsers,
    getAllCourses,
    getAllClasses,
    deleteUser,
    deleteClass,
    updateUser,
    updateCourse,
    updateClass,
    getAllContacts,
    createUser,
    getPendingUsers,
    approveUser,
    rejectUser,
    createNote,
    getNotes,
    updateNote,
    deleteNote
 } from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';

const router = express.Router();

// Course Management
router.post("/course/new", isAuth, isAdmin, createCourse);
router.get("/courses", isAuth, isAdmin, getAllCourses);
router.put("/course/:id", isAuth, isAdmin, uploadFiles, updateCourse);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);

// Class Management
router.post("/class/new", isAuth, isAdmin, createClass);
router.get("/classes", isAuth, isAdmin, getAllClasses);
router.put("/class/:id", isAuth, isAdmin, updateClass);
router.delete("/class/:id", isAuth, isAdmin, deleteClass);

// User Management
router.get("/users", isAuth, isAdmin, getAllUsers);
router.post("/user", isAuth, isAdmin, createUser);
router.put("/user/:id", isAuth, isAdmin, updateUser);
router.delete("/user/:id", isAuth, isAdmin, deleteUser);
router.get("/users/pending", isAuth, isAdmin, getPendingUsers);
router.put("/user/:id/approve", isAuth, isAdmin, approveUser);
router.put("/user/:id/reject", isAuth, isAdmin, rejectUser);

// Statistics
router.get("/stats", isAuth, isAdmin, getAllStats);

// Contact Management
router.get("/contacts", isAuth, isAdmin, getAllContacts);

// Notes Management
router.post("/notes", isAuth, isAdmin, uploadFiles, createNote);
router.get("/notes", isAuth, getNotes);
router.put("/notes/:id", isAuth, isAdmin, uploadFiles, updateNote);
router.delete("/notes/:id", isAuth, isAdmin, deleteNote);

export default router; 
