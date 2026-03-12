import { Contact } from '../models/Contact.js';
import TryCatch from '../middlewares/TryCatch.js';
import sendMail from '../middlewares/sendMail.js';

export const submitContact = TryCatch(async (req, res) => {
    const { name, email, phone, studentClass, message } = req.body;

    // Validate required fields
    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: "Name and phone are required"
        });
    }

    // Create contact entry
    const contact = await Contact.create({
        name,
        email: email || 'Not provided',
        phone,
        studentClass: studentClass || 'Not specified',
        message: message || 'No message provided'
    });

    let mailSent = false;

    // Send email notification, but do not fail the enquiry if SMTP is misconfigured in production
    try {
        await sendMail(
            process.env.ADMIN_EMAIL,
            `New Enquiry from ${name}`,
            {
                name,
                email: email || 'Not provided',
                phone,
                studentClass: studentClass || 'Not specified',
                message: message || 'No message provided'
            }
        );
        mailSent = true;
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
        success: true,
        message: mailSent
            ? "Enquiry submitted successfully"
            : "Enquiry submitted successfully, but email notification could not be sent",
        mailSent,
        contact
    });
});

export const getAllContacts = TryCatch(async (req, res) => {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    
    res.status(200).json({
        success: true,
        contacts
    });
}); 
