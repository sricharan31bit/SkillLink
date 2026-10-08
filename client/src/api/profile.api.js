import api from "./axios";

export const getMyProfile = () => api.get("/profiles/me");
export const updateMyProfile = (data) => api.post("/profiles", data);
export const getAllProfiles = () => api.get("/profiles");