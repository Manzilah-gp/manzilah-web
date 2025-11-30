// src/api/dashboardApi.js
import api from "./api";

/**
 * Dashboard Statistics API
 * Handles fetching dashboard data for different user roles
 */

/**
 * Smart endpoint - fetches data based on user role automatically
 * Use this for simplicity - backend determines what data to return
 */
export const getDashboardData = () =>
    api.get("/dashboard/data");

/**
 * Ministry Admin - Get system-wide statistics
 */
export const getMinistryStatistics = () =>
    api.get("/dashboard/ministry-statistics");

/**
 * Ministry Admin - Get governorate-wise mosque distribution
 * Used for charts
 */
export const getGovernorateStats = () =>
    api.get("/dashboard/governorate-stats");

/**
 * Mosque Admin - Get statistics for their specific mosque
 */
export const getMosqueStatistics = () =>
    api.get("/dashboard/mosque-statistics");

/**
 * Mosque Admin - Get enrollment trends for charts
 */
export const getMosqueEnrollmentTrends = () =>
    api.get("/dashboard/mosque-enrollment-trends");