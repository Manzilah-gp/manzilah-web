// FEATURE 1: API functions for events
// If this file doesn't exist, create it. If it exists, add these functions.

import api from './api';

/**
 * Get all events (public)
 */
export const getAllEvents = async () => {
    return await api.get('/events');
};

/**
 * Get event by ID
 */
export const getEventById = async (eventId) => {
    return await api.get(`/events/${eventId}`);
};

/**
 * Get events from mosques where user is enrolled in courses
 * @returns {Promise} Events from enrolled mosques
 */
export const getEventsFromEnrolledMosques = async () => {
    return await api.get('/events/my-enrolled-mosques');
};

/**
 * Get count of events from enrolled mosques (for badge)
 * @returns {Promise} Count of events
 */
export const getEnrolledMosquesEventCount = async () => {
    return await api.get('/events/my-enrolled-mosques/count');
};

/**
 * Get events from my mosque (mosque admin only)
 */
export const getMyMosqueEvents = async () => {
    return await api.get('/events/my-mosque');
};

/**
 * Create a new event (mosque admin only)
 */
export const createEvent = async (eventData) => {
    return await api.post('/events', eventData);
};

/**
 * Update an event
 */
export const updateEvent = async (eventId, eventData) => {
    return await api.put(`/events/${eventId}`, eventData);
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId) => {
    return await api.delete(`/events/${eventId}`);
};