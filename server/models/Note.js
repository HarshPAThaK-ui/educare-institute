import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    enum: ["6th", "7th", "8th", "9th", "10th", "11th", "12th"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pdf: {
    type: String,
    required: true,
  },
});

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema); 