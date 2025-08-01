// services/case-service.js
import axios from "@config/axios";

export const getAllCases = () => axios.get("/cases");
export const deleteCase = (id) => axios.delete(`/cases/${id}`);
export const getUsers = () => axios.get("/users");
export const getCaseById = (id) => {
    return axios.get(`/cases/${id}`);
};
export const getTimelinesByCase = (caseId) => {
    return axios.get(`/case-timelines/case/${caseId}`);
};
