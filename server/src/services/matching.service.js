import { normalizeSkillList } from "./skillNormalizer.js";

const WEIGHTS = {
  skillMatch: 0.5,
  rating: 0.2,
  experience: 0.15,
  completedProjects: 0.1,
  availability: 0.05,
};

const calculateSkillMatchScore = (requiredSkills, freelancerSkills) => {
  const normalizedRequired = normalizeSkillList(requiredSkills);
  const normalizedFreelancer = new Set(normalizeSkillList(freelancerSkills));

  const matchedCount = normalizedRequired.filter((skill) =>
    normalizedFreelancer.has(skill)
  ).length;

  if (normalizedRequired.length === 0) return 0;
  return (matchedCount / normalizedRequired.length) * 100;
};

const calculateRatingScore = (rating) => {
  return (rating / 5) * 100;
};

const calculateExperienceScore = (years) => {
  // Caps at 10 years = 100 score, so experience helps but doesn't dominate
  return Math.min(years / 10, 1) * 100;
};

const calculateCompletedProjectsScore = (count) => {
  // Caps at 20 completed projects = 100 score
  return Math.min(count / 20, 1) * 100;
};

const calculateAvailabilityScore = (availability) => {
  if (availability === "available") return 100;
  if (availability === "busy") return 50;
  return 0; // unavailable
};

export const calculateMatchScore = (project, freelancerProfile) => {
  const skillScore = calculateSkillMatchScore(
    project.requiredSkills,
    freelancerProfile.skills
  );
  const ratingScore = calculateRatingScore(freelancerProfile.rating);
  const experienceScore = calculateExperienceScore(freelancerProfile.experience);
  const completedScore = calculateCompletedProjectsScore(
    freelancerProfile.completedProjects
  );
  const availabilityScore = calculateAvailabilityScore(freelancerProfile.availability);

  const overallScore =
    skillScore * WEIGHTS.skillMatch +
    ratingScore * WEIGHTS.rating +
    experienceScore * WEIGHTS.experience +
    completedScore * WEIGHTS.completedProjects +
    availabilityScore * WEIGHTS.availability;

  return {
    overallScore: Math.round(overallScore),
    breakdown: {
      skillScore: Math.round(skillScore),
      ratingScore: Math.round(ratingScore),
      experienceScore: Math.round(experienceScore),
      completedScore: Math.round(completedScore),
      availabilityScore: Math.round(availabilityScore),
    },
  };
};