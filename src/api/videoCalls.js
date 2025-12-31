// src/api/videoCalls.js
import api from './api';

/**
 * Enable online meetings for a course
 */
export const enableCourseMeeting = (courseId) => {
    return api.post(`/video-calls/enable/${courseId}`);
};

/**
 * Disable online meetings for a course
 */
export const disableCourseMeeting = (courseId) => {
    return api.post(`/video-calls/disable/${courseId}`);
};

/**
 * Get meeting access token
 */
export const getMeetingToken = (courseId) => {
    return api.get(`/video-calls/token/${courseId}`);
};

/**
 * Get meeting details
 */
export const getMeetingDetails = (courseId) => {
    return api.get(`/video-calls/meeting/${courseId}`);
};