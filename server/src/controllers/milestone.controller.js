import Milestone from "../models/Milestone.js";
import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route POST /api/milestones/:projectId
// @access Private (owning client only)
export const createMilestone = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, weight, dueDate } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only add milestones to your own projects");
  }

  const existingMilestones = await Milestone.find({ project: projectId });
  const totalWeight = existingMilestones.reduce((sum, m) => sum + m.weight, 0);

  if (totalWeight + weight > 100) {
    throw new ApiError(
      400,
      `Total milestone weight cannot exceed 100. Currently at ${totalWeight}, this would add ${weight}.`
    );
  }

  const milestone = await Milestone.create({
    project: projectId,
    title,
    weight,
    dueDate,
  });

  res.status(201).json({ success: true, milestone });
});

// @route GET /api/milestones/:projectId
// @access Public
export const getMilestonesForProject = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ project: req.params.projectId }).sort({
    dueDate: 1,
  });

  res.status(200).json({ success: true, count: milestones.length, milestones });
});

// @route PUT /api/milestones/:id
// @access Private (assigned freelancer or owning client)
export const updateMilestoneStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const milestone = await Milestone.findById(req.params.id);
  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  const project = await Project.findById(milestone.project);
  if (!project) {
    throw new ApiError(404, "Associated project not found");
  }

  const isClient = project.client.toString() === req.user._id.toString();
  const isAssignedFreelancer =
    project.assignedFreelancer &&
    project.assignedFreelancer.toString() === req.user._id.toString();

  if (!isClient && !isAssignedFreelancer) {
    throw new ApiError(403, "You do not have permission to update this milestone");
  }

  milestone.status = status;
  milestone.completedAt = status === "completed" ? new Date() : null;
  await milestone.save();

  res.status(200).json({ success: true, milestone });
});