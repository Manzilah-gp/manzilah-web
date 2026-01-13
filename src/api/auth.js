// src/api/auth.js
import api from "./api";

export const loginUser = (email, password) =>
    api.post("/users/login", { email, password });

export const registerUser = (data) =>
    api.post("/users/register", data);

export const registerTeacher = (data) =>
    api.post("/users/register-teacher", data);

export const getProfile = () =>
    api.get("/users/profile");

export const changePassword = (data) =>
    api.post("/users/change-password", data);

export const sendVerificationCode = (email) =>
    api.post("/users/send-code", { email });