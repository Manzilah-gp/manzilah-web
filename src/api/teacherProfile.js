// PURPOSE: API calls for teacher profile operations
// REASON: Handle teacher-specific profile data separately from general profile

import api from './api';

/**
 * Get complete teacher profile data
 * REASON: Fetch all teacher information for display and editing
 * @returns {Promise<Object>} - Teacher profile with stats
 */
export const getTeacherProfile = async () => {
    try {
        const response = await api.get('/teacher-profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher profile:', error);
        throw error.response?.data || error;
    }
};

/**
 * Update teacher certifications
 * REASON: Allow teachers to update their certification status
 * @param {Object} certifications - Certification data
 * @returns {Promise<Object>} - Success response
 */
export const updateTeacherCertifications = async (certifications) => {
    try {
        const response = await api.put('/teacher-profile/certifications', certifications);
        return response.data;
    } catch (error) {
        console.error('Error updating certifications:', error);
        throw error.response?.data || error;
    }
};

/**
 * Update teacher expertise
 * REASON: Allow teachers to modify their teaching capabilities
 * @param {Array} expertise - Array of expertise objects
 * @returns {Promise<Object>} - Success response
 */
export const updateTeacherExpertise = async (expertise) => {
    try {
        const response = await api.put('/teacher-profile/expertise', { expertise });
        return response.data;
    } catch (error) {
        console.error('Error updating expertise:', error);
        throw error.response?.data || error;
    }
};

/**
 * Update teacher availability schedule
 * REASON: Allow teachers to manage their teaching hours
 * @param {Array} availability - Array of availability slots
 * @returns {Promise<Object>} - Success response
 */
export const updateTeacherAvailability = async (availability) => {
    try {
        const response = await api.put('/teacher-profile/availability', { availability });
        return response.data;
    } catch (error) {
        console.error('Error updating availability:', error);
        throw error.response?.data || error;
    }
};

/**
 * Update complete teacher profile
 * REASON: Save all teacher data in one request for efficiency
 * @param {Object} profileData - Complete profile data
 * @returns {Promise<Object>} - Success response
 */
export const updateCompleteTeacherProfile = async (profileData) => {
    try {
        const response = await api.put('/teacher-profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating teacher profile:', error);
        throw error.response?.data || error;
    }
};

/**
 * Get all course types for dropdown selection
 * REASON: Provide options for teachers to select expertise
 * @returns {Promise<Array>} - List of course types
 */
export const getCourseTypes = async () => {
    try {
        const response = await api.get('/teacher-profile/course-types');
        return response.data;
    } catch (error) {
        console.error('Error fetching course types:', error);
        throw error.response?.data || error;
    }
};

/**
 * Get memorization levels for dropdown selection
 * REASON: Provide options for teachers to specify qualification level
 * @param {number} courseTypeId - Optional filter by course type
 * @returns {Promise<Array>} - List of memorization levels
 */
export const getMemorizationLevels = async (courseTypeId = null) => {
    try {
        const params = courseTypeId ? { courseTypeId } : {};
        const response = await api.get('/teacher-profile/memorization-levels', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching memorization levels:', error);
        throw error.response?.data || error;
    }
};