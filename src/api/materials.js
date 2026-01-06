import api from './api';

/**
 * Upload material (with file)
 */
export const uploadMaterial = (formData) => {
    return api.post('/materials/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Get course materials
 */
export const getCourseMaterials = (courseId) => {
    return api.get(`/materials/course/${courseId}`);
};

/**
 * Delete material
 */
export const deleteMaterial = (materialId) => {
    return api.delete(`/materials/${materialId}`);
};

/**
 * Track download
 */
export const trackDownload = (materialId) => {
    return api.post(`/materials/download/${materialId}`);
};

/**
 * Section Management
 */
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