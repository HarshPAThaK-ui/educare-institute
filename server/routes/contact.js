import express from 'express';
import { submitContact, getAllContacts } from '../controllers/contact.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

// Public route for submitting enquiries
router.post('/contact/submit', submitContact);

// Protected route for admin to view all contacts
router.get('/contact/all', isAuth, getAllContacts);

export default router; 