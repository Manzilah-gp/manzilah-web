import api from "./api";

/**
 * Course API - All methods use the interceptor for token handling
 */

// ✅ GET Course Types
export const getCourseTypes = () =>
    api.get("/courses/types");

// ✅ GET Memorization Levels
export const getMemorizationLevels = () =>
    api.get("/courses/memorization-levels");

// ✅ CREATE Course
export const createCourse = (courseData) =>
    api.post("/courses", courseData);

// ✅ READ Courses by Mosque
export const getCoursesByMosque = (mosqueId) =>
    api.get(`/courses/mosque/${mosqueId}`);

// ✅ READ Course by ID
export const getCourseById = (courseId) =>
    api.get(`/courses/${courseId}`);

// ✅ UPDATE Course
export const updateCourse = (courseId, updateData) =>
    api.put(`/courses/${courseId}`, updateData);

// ✅ DELETE Course
export const deleteCourse = (courseId) =>
    api.delete(`/courses/${courseId}`);

// ✅ GET Suggested Teachers
export const getSuggestedTeachers = (courseRequirements) =>
    api.post("/courses/suggest-teachers", courseRequirements);

// ✅ ASSIGN Teacher to Course
export const assignTeacherToCourse = (courseId, teacherId) =>
    api.post("/courses/assign-teacher", { courseId, teacherId });

//
export const getMyMosqueId = (adminId) =>
    api.get(`/courses/mosque-admin/${adminId}`);
