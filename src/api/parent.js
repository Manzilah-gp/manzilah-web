

import api from './api';

/**
 * Send parent-child relationship request
 * @param {string} childEmail - Child's email address
 * @param {string} relationshipType - 'father', 'mother', or 'guardian'
 * @returns {Promise} API response
 */
export const requestRelationship = async (childEmail, relationshipType) => {
    return await api.post('/parent/request-relationship', {
        childEmail,
        relationshipType
    });
};

/**
 * Get parent's sent requests
 * @returns {Promise} List of requests
 */
export const getMyRequests = async () => {
    return await api.get('/parent/my-requests');
};

/**
 * Get parent's verified children
 * @returns {Promise} List of children
 */
export const getMyChildren = async () => {
    return await api.get('/parent/my-children');
};

/**
 * Get student's verified parents
 * @returns {Promise} List of parents
 */
export const getMyParents = async () => {
    return await api.get('/parent/my-parents');
};

/**
 * Get pending relationship requests (for students)
 * @returns {Promise} List of pending requests
 */
export const getPendingRequests = async () => {
    return await api.get('/parent/pending-requests');
};

/**
 * Accept parent relationship request
 * @param {number} requestId - Request ID to accept
 * @returns {Promise} API response
 */
export const acceptRequest = async (requestId) => {
    return await api.put(`/parent/accept-request/${requestId}`);
};

/**
 * Reject parent relationship request
 * @param {number} requestId - Request ID to reject
 * @returns {Promise} API response
 */
export const rejectRequest = async (requestId) => {
    return await api.delete(`/parent/reject-request/${requestId}`);
};

/**
 * Delete/Cancel parent-child relationship
 * @param {number} relationshipId - Relationship ID to delete
 * @returns {Promise} API response
 */
export const deleteRelationship = async (relationshipId) => {
    return await api.delete(`/parent/delete-relationship/${relationshipId}`);
};
