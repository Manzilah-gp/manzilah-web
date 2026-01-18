import api from "./api";

/**
 * Get all public mosques with filters
 * @param {Object} filters - { governorate, search }
 * @returns {Promise} Array of mosques
 */
export const getPublicMosques = (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.governorate) params.append('governorate', filters.governorate);
    if (filters.search) params.append('search', filters.search);

    return api.get(`/public/mosques?${params.toString()}`);
};

/**
 * Get mosque details with all courses
 * @param {number} mosqueId - Mosque ID
 * @returns {Promise} Mosque object with courses array
 */
export const getMosqueDetails = (mosqueId) => {
    return api.get(`/public/mosques/${mosqueId}`);
};

/**
 * Get all public courses with filters
 * @param {Object} filters - Filtering options
 * @returns {Promise} Array of courses
 */
export const getPublicCourses = (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.governorate) params.append('governorate', filters.governorate);
    if (filters.course_type) params.append('course_type', filters.course_type);
    if (filters.target_age_group) params.append('target_age_group', filters.target_age_group);
    if (filters.target_gender) params.append('target_gender', filters.target_gender);
    if (filters.price_filter) params.append('price_filter', filters.price_filter);
    if (filters.schedule_type) params.append('schedule_type', filters.schedule_type);
    if (filters.search) params.append('search', filters.search);

    return api.get(`/public/courses?${params.toString()}`);
};

/**
 * Get course details
 * @param {number} courseId - Course ID
 * @returns {Promise} Course object with full details
 */
export const getCourseDetails = (courseId) => {
    return api.get(`/public/courses/${courseId}`);
};

/**
 * Get filter options for dropdowns
 * @returns {Promise} Object with available filter options
 */
export const getFilterOptions = () => {
    return api.get('/public/filter-options');
};

/**
 * Get closest 3 mosques to user's location
 * Requires authentication
 * @returns {Promise} Array of closest mosques with distance
 */
export const getClosestMosques = () => {
    return api.get('/public/mosques/closest');
};
