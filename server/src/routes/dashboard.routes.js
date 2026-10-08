import express from "express";
import { getProjectDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:projectId", protect, getProjectDashboard);

export default router;