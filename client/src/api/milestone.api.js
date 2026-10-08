import api from "./axios";

export const getMilestonesForProject = (projectId) =>
  api.get(`/milestones/${projectId}`);

export const createMilestone = (projectId, data) =>
  api.post(`/milestones/${projectId}`, data);

export const updateMilestoneStatus = (milestoneId, status) =>
  api.put(`/milestones/${milestoneId}`, { status });
