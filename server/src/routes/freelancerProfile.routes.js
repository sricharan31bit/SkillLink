import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getProfileByUserId,
  getAllProfiles,
} from "../controllers/freelancerProfile.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/me", protect, restrictTo("freelancer"), getMyProfile);
router.post("/", protect, restrictTo("freelancer"), createOrUpdateProfile);
router.get("/:userId", getProfileByUserId);

export default router;