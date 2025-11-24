import api from "./api";

const getAuthToken = () => {
    return localStorage.getItem("token");
};

// Existing methods...
export const addMosque = async (mosqueData) => {
    const token = getAuthToken();
    const response = await api.post("/mosques", mosqueData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const getMosques = async () => {
    const token = getAuthToken();
    const response = await api.get("/mosques", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// New methods for search and filtering
export const searchMosquesByName = async (name) => {
    const token = getAuthToken();
    const response = await api.get(`/mosques/search?name=${encodeURIComponent(name)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getMosquesByGovernorate = async (governorate) => {
    const token = getAuthToken();
    const response = await api.get(`/mosques/governorate/${encodeURIComponent(governorate)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getMosqueById = async (mosqueId) => {
    const token = getAuthToken();
    const response = await api.get(`/mosques/${mosqueId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};


export const updateMosque = async (mosqueId, updateData) => {
    const token = getAuthToken();
    const response = await api.put(`/mosques/${mosqueId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteMosque = async (mosqueId) => {
    const token = getAuthToken();
    const response = await api.delete(`/mosques/${mosqueId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};