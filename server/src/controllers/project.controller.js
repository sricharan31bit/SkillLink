import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route POST /api/projects
// @access Private (client only)
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, requiredSkills, budget, deadline } = req.body;

  const project = await Project.create({
    client: req.user._id,
    title,
    description,
    requiredSkills,
    budget,
    deadline,
  });

  res.status(201).json({ success: true, project });
});

// @route GET /api/projects
// @access Public
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ status: "open" })
    .populate("client", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: projects.length, projects });
});

// @route GET /api/projects/:id
// @access Public
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("client", "name email")
    .populate("assignedFreelancer", "name email");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.status(200).json({ success: true, project });
});

// @route PUT /api/projects/:id
// @access Private (owning client only)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own projects");
  }

  const allowedUpdates = ["title", "description", "requiredSkills", "budget", "deadline", "status"];
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      project[field] = req.body[field];
    }
  });

  await project.save();

  res.status(200).json({ success: true, project });
});

// @route DELETE /api/projects/:id
// @access Private (owning client only)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own projects");
  }

  await project.deleteOne();

  res.status(200).json({ success: true, message: "Project deleted" });
});