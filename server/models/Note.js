import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5000,
    },
    class: {
      type: String,
      enum: ["6th", "7th", "8th", "9th", "10th", "11th", "12th"],
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    pdf: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

noteSchema.index({ class: 1, createdAt: -1 });
noteSchema.index({ class: 1, subject: 1, createdAt: -1 });

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema); 
