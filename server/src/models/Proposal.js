import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
    },
    bidAmount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [0, "Bid amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent the same freelancer from submitting more than one proposal per project
proposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });

const Proposal = mongoose.model("Proposal", proposalSchema);
export default Proposal;