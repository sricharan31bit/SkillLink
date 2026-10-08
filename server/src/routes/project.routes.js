import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { getMatchesForProject } from "../controllers/match.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/:id/matches", protect, restrictTo("client"), getMatchesForProject);

router.post("/", protect, restrictTo("client"), createProject);
router.put("/:id", protect, restrictTo("client"), updateProject);
router.delete("/:id", protect, restrictTo("client"), deleteProject);

export default router;