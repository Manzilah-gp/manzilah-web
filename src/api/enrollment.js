import api from "./api";

/**
 * Check if current user can enroll in a course
 * @param {number} courseId - Course ID
 * @returns {Promise} Eligibility object with reasons
 */
export const checkEnrollmentEligibility = (courseId) => {
    return api.post('/enrollment/check-eligibility', { courseId });
};

/**
 * Enroll in a FREE course
 * @param {number} courseId - Course ID
 * @returns {Promise} Enrollment result
 */
export const enrollInFreeCourse = (courseId) => {
    return api.post('/enrollment/enroll-free', { courseId });
};

/**
 * Enroll in a PAID course (with payment)
 * @param {number} courseId - Course ID
 * @param {Object} paymentData - Payment gateway info
 * @returns {Promise} Enrollment and payment result
 */
export const enrollInPaidCourse = (courseId, paymentData = {}) => {
    return api.post('/enrollment/enroll-paid', {
        courseId,
        paymentGateway: paymentData.gateway || 'local',
        paymentReference: paymentData.reference || null
    });
};

/**
 * Get all enrollments for current user
 * @returns {Promise} Array of enrollments
 */
export const getMyEnrollments = () => {
    return api.get('/enrollment/my-enrollments');
};

/**
 * Get specific enrollment details
 * @param {number} enrollmentId - Enrollment ID
 * @returns {Promise} Enrollment object
 */
export const getEnrollmentDetails = (enrollmentId) => {
    return api.get(`/enrollment/${enrollmentId}`);
};