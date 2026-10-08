import api from "./axios";

export const getProjectDashboard = (projectId) => api.get(`/dashboard/${projectId}`);