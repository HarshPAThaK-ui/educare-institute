import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false, // Image is optional
    },
    fee: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    schedule: {
        type: String,
        required: true,
    },
    batchSize: {
        type: String,
        required: true,
    },
    subjects: [{
        type: String,
        required: true,
    }],
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
});

export const Courses = mongoose.model("Courses", schema);