import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    status: { type: String, default: "Not Started" },
    priority: { type: String, default: "Medium" },
    startDate: Date,
    completedDate: Date,
    notes: String,
    listId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export const Idea = mongoose.model("Idea", ideaSchema);
