import express from "express";
import {
  createProposal,
  getProposalsForProject,
  getMyProposals,
  acceptProposal,
} from "../controllers/proposal.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:projectId", protect, restrictTo("freelancer"), createProposal);
router.get("/my", protect, restrictTo("freelancer"), getMyProposals);
router.get("/project/:projectId", protect, restrictTo("client"), getProposalsForProject);
router.put("/:id/accept", protect, restrictTo("client"), acceptProposal);

export default router;