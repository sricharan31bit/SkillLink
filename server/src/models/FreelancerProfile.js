import mongoose from "mongoose";

const freelancerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: Number, // years
      default: 0,
      min: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    completedProjects: {
      type: Number,
      default: 0,
      min: 0,
    },
    portfolio: [
      {
        title: { type: String, required: true },
        link: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const FreelancerProfile = mongoose.model("FreelancerProfile", freelancerProfileSchema);
export default FreelancerProfile;