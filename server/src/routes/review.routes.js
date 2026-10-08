import express from "express";
import { createReview, getReviewsForUser } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user/:userId", getReviewsForUser);
router.post("/:projectId", protect, createReview);

export default router;