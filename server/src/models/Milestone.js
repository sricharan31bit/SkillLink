import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Milestone title is required"],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, "Milestone weight is required"],
      min: [1, "Weight must be at least 1"],
      max: [100, "Weight cannot exceed 100"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;