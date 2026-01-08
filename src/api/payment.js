// ============================================
// FILE: src/api/payment.js
// PURPOSE: API calls for payment operations
// REASON: Centralize payment-related API calls for reusability
// ============================================

import api from './api';

/**
 * Create Stripe checkout session for course payment
 * REASON: Get Stripe checkout URL to redirect user for payment
 * @param {number} courseId - ID of the course to enroll in
 * @returns {Promise<Object>} - Response with session ID and URL
 */
export const createCheckoutSession = async (courseId) => {
    try {
        const response = await api.post('/payment/create-checkout-session', {
            courseId
        });
        return response.data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error.response?.data || error;
    }
};

/**
 * Verify payment session status after redirect
 * REASON: Confirm payment was completed before showing success
 * @param {string} sessionId - Stripe session ID from URL
 * @returns {Promise<Object>} - Payment status and metadata
 */
export const verifyPaymentSession = async (sessionId) => {
    try {
        const response = await api.get(`/payment/verify-session/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error verifying payment session:', error);
        throw error.response?.data || error;
    }
};

/**
 * Get user's payment history
 * REASON: Show user their past payments and enrollments
 * @param {string} type - Optional filter by payment type (course/donation)
 * @returns {Promise<Array>} - List of payment records
 */
export const getPaymentHistory = async (type = null) => {
    try {
        const params = type ? { type } : {};
        const response = await api.get('/payment/history', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching payment history:', error);
        throw error.response?.data || error;
    }
};