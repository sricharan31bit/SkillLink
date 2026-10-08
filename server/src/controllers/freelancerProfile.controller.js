import FreelancerProfile from "../models/FreelancerProfile.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route POST /api/profiles
// @access Private (freelancer only) — creates if not exists
export const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const { skills, bio, experience, hourlyRate, availability } = req.body;

  let profile = await FreelancerProfile.findOne({ user: req.user._id });

  if (profile) {
    if (skills !== undefined) profile.skills = skills;
    if (bio !== undefined) profile.bio = bio;
    if (experience !== undefined) profile.experience = experience;
    if (hourlyRate !== undefined) profile.hourlyRate = hourlyRate;
    if (availability !== undefined) profile.availability = availability;
    await profile.save();
  } else {
    profile = await FreelancerProfile.create({
      user: req.user._id,
      skills,
      bio,
      experience,
      hourlyRate,
      availability,
    });
  }

  res.status(200).json({ success: true, profile });
});

// @route GET /api/profiles/me
// @access Private (freelancer only)
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOne({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found. Create one first.");
  }

  res.status(200).json({ success: true, profile });
});

// @route GET /api/profiles/:userId
// @access Public
export const getProfileByUserId = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOne({ user: req.params.userId }).populate(
    "user",
    "name email"
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  res.status(200).json({ success: true, profile });
});

// @route GET /api/profiles
// @access Public
export const getAllProfiles = asyncHandler(async (req, res) => {
  const profiles = await FreelancerProfile.find()
    .populate("user", "name email")
    .sort({ rating: -1, experience: -1 });

  res.status(200).json({ success: true, count: profiles.length, profiles });
});