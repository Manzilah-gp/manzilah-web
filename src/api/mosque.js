import api from "./api";

/**
 * Mosque API - All methods use the interceptor for token handling
 */

// ✅ CREATE
export const addMosque = (mosqueData) =>
    api.post("/mosques", mosqueData);

// ✅ READ
export const getAllMosques = () =>
    api.get("/mosques");

export const getMosqueById = (mosqueId) =>
    api.get(`/mosques/${mosqueId}`);

export const getMosquesByGovernorate = (governorate) =>
    api.get(`/mosques/governorate/${encodeURIComponent(governorate)}`);

export const searchMosquesByName = (name) =>
    api.get(`/mosques/search`, { params: { name } });

// ✅ UPDATE
export const updateMosque = (mosqueId, updateData) =>
    api.put(`/mosques/${mosqueId}`, updateData);

// ✅ DELETE
export const deleteMosque = (mosqueId) =>
    api.delete(`/mosques/${mosqueId}`);