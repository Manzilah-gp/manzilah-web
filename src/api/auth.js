import api from "./api";

export const loginUser = (email, password) => api.post("/users/login", { email, password });
export const registerUser = (data) => api.post("/users/register", data);
export const getProfile = (token) =>
    api.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } });
