import Proposal from "../models/Proposal.js";
import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route POST /api/proposals/:projectId
// @access Private (freelancer only)
export const createProposal = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { coverLetter, bidAmount } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "This project is no longer accepting proposals");
  }

  const alreadyApplied = await Proposal.findOne({
    project: projectId,
    freelancer: req.user._id,
  });
  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied to this project");
  }

  const proposal = await Proposal.create({
    project: projectId,
    freelancer: req.user._id,
    coverLetter,
    bidAmount,
  });

  res.status(201).json({ success: true, proposal });
});

// @route GET /api/proposals/project/:projectId
// @access Private (owning client only)
export const getProposalsForProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only view proposals for your own projects");
  }

  const proposals = await Proposal.find({ project: projectId })
    .populate("freelancer", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: proposals.length, proposals });
});

// @route GET /api/proposals/my
// @access Private (freelancer only)
export const getMyProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({ freelancer: req.user._id })
    .populate("project", "title status budget")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: proposals.length, proposals });
});

// @route PUT /api/proposals/:id/accept
// @access Private (owning client only)
export const acceptProposal = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);
  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  const project = await Project.findById(proposal.project);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only accept proposals for your own projects");
  }

  proposal.status = "accepted";
  await proposal.save();

  project.assignedFreelancer = proposal.freelancer;
  project.status = "in-progress";
  await project.save();

  // Reject all other pending proposals for this project
  await Proposal.updateMany(
    { project: project._id, _id: { $ne: proposal._id }, status: "pending" },
    { status: "rejected" }
  );

  res.status(200).json({ success: true, message: "Proposal accepted", proposal, project });
});