import Review from "../models/Review.js";
import Project from "../models/Project.js";
import FreelancerProfile from "../models/FreelancerProfile.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route POST /api/reviews/:projectId
// @access Private (client or assigned freelancer, project must be completed)
export const createReview = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { rating, comment, revieweeId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.status !== "completed") {
    throw new ApiError(400, "You can only review a completed project");
  }

  const isClient = project.client.toString() === req.user._id.toString();
  const isAssignedFreelancer =
    project.assignedFreelancer &&
    project.assignedFreelancer.toString() === req.user._id.toString();

  if (!isClient && !isAssignedFreelancer) {
    throw new ApiError(403, "You were not part of this project");
  }

  const existingReview = await Review.findOne({ project: projectId, reviewer: req.user._id });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this project");
  }

  const review = await Review.create({
    project: projectId,
    reviewer: req.user._id,
    reviewee: revieweeId,
    rating,
    comment,
  });

  // If a freelancer was reviewed, recalculate their average rating
  const revieweeProfile = await FreelancerProfile.findOne({ user: revieweeId });
  if (revieweeProfile) {
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    revieweeProfile.rating = Math.round(avgRating * 10) / 10;
    await revieweeProfile.save();
  }

  res.status(201).json({ success: true, review });
});

// @route GET /api/reviews/user/:userId
// @access Public
export const getReviewsForUser = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .populate("reviewer", "name")
    .populate("project", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, reviews });
});