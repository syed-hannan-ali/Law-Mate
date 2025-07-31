// src/services/firmService.js
import axios from "@config/axios"; // Ensure this is the configured Axios instance

export const getAllFirms = () => axios.get("/firms");
export const deleteFirm = (id) => axios.delete(`/firms/${id}`);
export const createFirm = (data) => axios.post("/firms", data);
export const updateFirm = (id, data) => axios.put(`/firms/${id}`, data);
export const getStaffCount = (id) => axios.get(`/firms/${id}/staff-count`);
