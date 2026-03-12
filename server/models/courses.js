import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: false, // Image is optional
    },
    fee: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Fee must be a whole number'
        }
    },
    duration: {
        type: Number, 
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: 'Duration must be a whole number'
        }
    },
    durationUnit: {
        type: String,
        enum: ['hours', 'days', 'weeks', 'months'],
        default: 'weeks',
        required: true,
    },
    schedule: {
        type: String,
        required: true,
        trim: true,
    },
    batchSize: {
        type: Number, 
        required: true,
        min: 1,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: 'Batch size must be a whole number'
        }
    },
    subjects: [{
        type: String,
        required: true,
        trim: true,
    }],
    category: {
        type: String,
        enum: ['Mathematics', 'Science', 'English', 'Computer Science', 'Arts', 'Sports', 'Other'],
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

//indexes for better query performance
schema.index({ category: 1 });
schema.index({ isActive: 1 });
schema.index({ startDate: 1 });
schema.index({ title: 'text', description: 'text' }); // Text search index

export const Courses = mongoose.model("Courses", schema);