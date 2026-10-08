import api from "./axios";

export const createProposal = (projectId, data) => api.post(`/proposals/${projectId}`, data);
export const getMyProposals = () => api.get("/proposals/my");
export const getProposalsForProject = (projectId) => api.get(`/proposals/project/${projectId}`);
export const acceptProposal = (proposalId) => api.put(`/proposals/${proposalId}/accept`);