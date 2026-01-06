// src/api/progress.js
import api from "./api";

/**
 * Update current page for memorization course
 */
export const updateMemorizationProgress = (enrollmentId, currentPage, notes = null) => {
    return api.post('/progress/memorization/update-page', {
        enrollmentId,
        currentPage,
        notes
    });
};

/**
 * Record exam score (1-5)
 */
export const recordExamScore = (enrollmentId, examNumber, score, notes = null) => {
    return api.post('/progress/memorization/record-exam', {
        enrollmentId,
        examNumber,
        score,
        notes
    });
};

/**
 * Record final graduation exam
 */
export const recordFinalExam = (enrollmentId, score, notes = null) => {
    return api.post('/progress/memorization/final-exam', {
        enrollmentId,
        score,
        notes
    });
};

/**
 * Mark attendance for Tajweed/Fiqh courses
 */
export const markAttendance = (enrollmentId, attendanceDate, status, notes = null) => {
    return api.post('/progress/attendance/mark', {
        enrollmentId,
        attendanceDate,
        status,
        notes
    });
};

/**
 * Get student progress details
 */
export const getStudentProgress = (enrollmentId) => {
    return api.get(`/progress/student/${enrollmentId}`);
};

/**
 * Get progress history (exams only)
 */
export const getProgressHistory = (enrollmentId) => {
    return api.get(`/progress/history/${enrollmentId}`);
};