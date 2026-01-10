// ============================================
// Student Progress API - Frontend
// NEW FILE: studentProgressApi.js
// Location: frontend/src/api/
// API calls for students viewing their own progress
// ============================================

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/student-progress';

/**
 * Get authentication token from localStorage
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

/**
 * Get student's own progress for a specific enrollment
 * @param {number} enrollmentId - Enrollment ID
 * @returns {Promise} API response
 */
export const getMyProgress = (enrollmentId) => {
    return axios.get(`${API_BASE}/my-progress/${enrollmentId}`, getAuthHeader());
};

/**
 * Get student's own progress history (exam timeline)
 * @param {number} enrollmentId - Enrollment ID
 * @returns {Promise} API response with exam history
 */
export const getMyProgressHistory = (enrollmentId) => {
    return axios.get(`${API_BASE}/my-progress-history/${enrollmentId}`, getAuthHeader());
};