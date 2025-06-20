import mongoose from "mongoose";        

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },
    phone: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    enrollment: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
        },
        enrolledDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "completed", "dropped"],
            default: "active",
        },
        feePaid: {
            type: Boolean,
            default: false,
        }
    }],
    address: {
        type: String,
        required: false,
    },
    studentClass: {
        type: String,
        required: false,
    },
    parentName: {
        type: String,
        required: false,
    },
    parentPhone: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
},
    {
        timestamps: true,
    }
    
);

export const User = mongoose.models.User || mongoose.model("User", schema);
