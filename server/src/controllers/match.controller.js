import Project from "../models/Project.js";
import FreelancerProfile from "../models/FreelancerProfile.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateMatchScore } from "../services/matching.service.js";

// @route GET /api/projects/:id/matches
// @access Private (owning client only)
export const getMatchesForProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only view matches for your own projects");
  }

  const profiles = await FreelancerProfile.find({
    availability: { $ne: "unavailable" },
  }).populate("user", "name email");

  const matches = profiles
    .map((profile) => {
      const { overallScore, breakdown } = calculateMatchScore(project, profile);
      return {
        freelancer: {
          id: profile.user._id,
          name: profile.user.name,
          email: profile.user.email,
        },
        matchScore: overallScore,
        breakdown,
        skills: profile.skills,
        rating: profile.rating,
        experience: profile.experience,
        hourlyRate: profile.hourlyRate,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({
    success: true,
    project: { id: project._id, title: project.title, requiredSkills: project.requiredSkills },
    count: matches.length,
    matches,
  });
});