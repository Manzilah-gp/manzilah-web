// src/api/teacherCourses.js
import api from "./api";

/**
 * Get all courses taught by the teacher
 */
export const getMyCourses = () =>
    api.get('/teacher/my-courses');

/**
 * Get all students for a specific course
 */
export const getCourseStudents = (courseId) =>
    api.get(`/teacher/courses/${courseId}/students`);

/**
 * Get all students across all courses (with filters)
 */
export const getAllMyStudents = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.courseId) params.append('courseId', filters.courseId);
    if (filters.search) params.append('search', filters.search);
    if (filters.minProgress) params.append('minProgress', filters.minProgress);
    if (filters.maxProgress) params.append('maxProgress', filters.maxProgress);

    return api.get(`/teacher/students?${params.toString()}`);
};

/**
 * Get students for a specific session date
 */
export const getSessionStudents = (courseId, date) =>
    api.get(`/teacher/courses/${courseId}/session-students?date=${date}`);

/**
 * Bulk mark attendance
 */
export const bulkMarkAttendance = (attendanceRecords) =>
    api.post('/teacher/attendance/bulk', { attendanceRecords });