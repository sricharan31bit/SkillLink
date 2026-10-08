import Project from "../models/Project.js";
import Milestone from "../models/Milestone.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getProjectHealth } from "../services/health.service.js";

// @route GET /api/dashboard/:projectId
// @access Private (owning client or assigned freelancer)
export const getProjectDashboard = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate("client", "name email")
    .populate("assignedFreelancer", "name email");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isClient = project.client._id.toString() === req.user._id.toString();
  const isAssignedFreelancer =
    project.assignedFreelancer &&
    project.assignedFreelancer._id.toString() === req.user._id.toString();

  if (!isClient && !isAssignedFreelancer) {
    throw new ApiError(403, "You do not have access to this project's dashboard");
  }

  const milestones = await Milestone.find({ project: projectId }).sort({ dueDate: 1 });

  const health = getProjectHealth(milestones, project.deadline);

  res.status(200).json({
    success: true,
    project: {
      id: project._id,
      title: project.title,
      status: project.status,
      deadline: project.deadline,
      client: project.client,
      assignedFreelancer: project.assignedFreelancer,
    },
    health,
    milestones,
  });
});