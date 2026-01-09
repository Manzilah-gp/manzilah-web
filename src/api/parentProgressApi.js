
// ============================================

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/parent-progress';

// Get authentication token from localStorage
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
 * Get all children for logged-in parent
 * NEW ENDPOINT: GET /api/parent-progress/children
 */
export const getMyChildren = () => {
    return axios.get(`${API_BASE}/children`, getAuthHeader());
};

/**
 * Get detailed progress for a child's enrollment
 * NEW ENDPOINT: GET /api/parent-progress/progress/:enrollmentId
 * @param {number} enrollmentId - Enrollment ID
 */
export const getChildProgress = (enrollmentId) => {
    return axios.get(`${API_BASE}/progress/${enrollmentId}`, getAuthHeader());
};

/**
 * Get progress history/timeline for a child's enrollment
 * NEW ENDPOINT: GET /api/parent-progress/history/:enrollmentId
 * @param {number} enrollmentId - Enrollment ID
 */
export const getChildProgressHistory = (enrollmentId) => {
    return axios.get(`${API_BASE}/history/${enrollmentId}`, getAuthHeader());
};

/**
 * Get all enrollments across all children
 * NEW ENDPOINT: GET /api/parent-progress/enrollments
 */
export const getAllChildrenEnrollments = () => {
    return axios.get(`${API_BASE}/enrollments`, getAuthHeader());
};

/**
 * Get progress summary dashboard for all children
 * NEW ENDPOINT: GET /api/parent-progress/summary
 */
export const getChildrenProgressSummary = () => {
    return axios.get(`${API_BASE}/summary`, getAuthHeader());
};

/**
 * Get complete overview for a specific child
 * NEW ENDPOINT: GET /api/parent-progress/children/:childId
 * @param {number} childId - Child's user ID
 */
export const getChildOverview = (childId) => {
    return axios.get(`${API_BASE}/children/${childId}`, getAuthHeader());
};