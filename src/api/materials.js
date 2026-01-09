import api from './api';

/**
 * Upload material (with file) - NO CHANGES NEEDED
 */
export const uploadMaterial = (formData) => {
    return api.post('/materials/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Download material (UPDATED)
 */
export const downloadMaterial = async (materialId) => {
    try {
        const response = await api.get(`/materials/download/${materialId}`, {
            responseType: 'blob' // Important for file download
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// All other functions remain THE SAME
export const getCourseMaterials = (courseId) => {
    return api.get(`/materials/course/${courseId}`);
};

export const deleteMaterial = (materialId) => {
    return api.delete(`/materials/${materialId}`);
};

export const trackDownload = (materialId) => {
    return api.post(`/materials/download/${materialId}`);
};

export const createSection = (sectionData) => {
    return api.post('/materials/sections', sectionData);
};

export const getSections = (courseId) => {
    return api.get(`/materials/sections/${courseId}`);
};

export const updateSection = (sectionId, updateData) => {
    return api.put(`/materials/sections/${sectionId}`, updateData);
};

export const deleteSection = (sectionId) => {
    return api.delete(`/materials/sections/${sectionId}`);
};