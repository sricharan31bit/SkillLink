import express from "express";
import {
  createMilestone,
  getMilestonesForProject,
  updateMilestoneStatus,
} from "../controllers/milestone.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:projectId", getMilestonesForProject);
router.post("/:projectId", protect, createMilestone);
router.put("/:id", protect, updateMilestoneStatus);

export default router;