
import axios from "@config/axios";

export const getAllTasks = () => axios.get("/tasks");
export const deleteTask = (id) => axios.delete(`/tasks/${id}`);
export const createTask = (data) => axios.post("/tasks", data);
export const updateTask = (id, data) => axios.put(`/tasks/${id}`, data);
export const getTaskById = (id) => axios.get(`/tasks/${id}`);
export const getTasksByCaseId = (caseId) => axios.get(`/cases/${caseId}/tasks`);    
