import mongoose from "mongoose";

const schema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    classroom: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    topics: [{
        type: String,
        required: true,
    }],
    materials: [{
        type: String,
        required: false,
    }],
    homework: {
        type: String,
        required: false,
    },
    attendance: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        present: {
            type: Boolean,
            default: false,
        },
        remarks: {
            type: String,
            required: false,
        }
    }],
    status: {
        type: String,
        enum: ["scheduled", "ongoing", "completed", "cancelled"],
        default: "scheduled",
    },
    studentClass: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Class = mongoose.model("Class", schema); 