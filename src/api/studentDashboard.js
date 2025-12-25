import api from "./api";

/**
 * Get all enrollments for logged-in student
 * @param {string} [status] - Filter by status (optional)
 * @param {string} [search] - Search by course name (optional)
 * @param {string} [studentId] - Filter by child ID (optional, for parents)
 */
export const getMyEnrollments = (status, search, studentId) =>
    api.get("/student/my-enrollments", { params: { status, search, studentId } });

/**
 * Get single enrollment details
 * @param {string} enrollmentId 
 */
export const getEnrollmentDetails = (enrollmentId) =>
    api.get(`/student/enrollments/${enrollmentId}`);

/**
 * Get student dashboard statistics
 * @param {string} [studentId] - Filter by child ID (optional, for parents)
 */
export const getStudentStats = (studentId) =>
    api.get("/student/stats", { params: { studentId } });

/**
 * Get logged-in user's children (if any)
 */
export const getChildren = () =>
    api.get("/student/children");

/**
 * Withdraw from a course
 * @param {string} enrollmentId 
 */
export const withdrawFromCourse = (enrollmentId) =>
    api.post(`/student/enrollments/${enrollmentId}/withdraw`);

/**
 * Get courses by mosque (for filtering)
 * @param {string} mosqueId 
 */
export const getCoursesByMosque = (mosqueId) =>
    api.get(`/student/mosques/${mosqueId}/courses`);
