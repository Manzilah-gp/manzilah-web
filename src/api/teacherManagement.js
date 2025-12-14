import api from "./api";
// Get list of teachers for the admin's mosque
export const getTeachers = () =>
    api.get('/teachers');


// Get full details of a specific teacher
export const getTeacherDetails = (teacherId) =>
    api.get(`/teachers/${teacherId}`);


// Update teacher status (active/inactive)
export const updateTeacherStatus = (teacherId, isActive) =>
    api.patch(`/teachers/${teacherId}/status`, { isActive });

// Remove teacher from mosque
export const deleteTeacher = (teacherId) =>
    api.delete(`/teachers/${teacherId}`);

// get teacher's courses
export const getTeacherCourses = (teacherId) =>
    api.get(`/teachers/${teacherId}/courses`);

