import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: 'Not provided',
    },
    studentClass: {
        type: String,
        default: 'Not specified',
    },
    message: {
        type: String,
        default: 'No message provided',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Contact = mongoose.model("Contact", contactSchema); 