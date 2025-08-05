import axios from "@config/axios";

// Get all subscription plans
export const getAllPlans = () => axios.get("/subscriptions");

// Create new plan
export const createPlan = (data) => axios.post("/subscriptions/create-plan", data);

// Update existing plan
export const updatePlan = (id, data) => axios.put(`/subscriptions/${id}`, data);

// Delete plan
export const deletePlan = (id) => axios.delete(`/subscriptions/${id}`);
