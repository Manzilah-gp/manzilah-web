import api from "./api";

/**
 * Dashboard Statistics API
 */

// Ministry Admin - Statistics by Governorate
export const getMinistryStatistics = () =>
    api.get("/dashboard/ministry-statistics");

// Mosque Admin - Statistics for specific mosque
export const getMosqueStatistics = (mosqueId) =>
    api.get(`/dashboard/mosque-statistics/${mosqueId}`);

// Governorate-wise mosque distribution
export const getGovernorateStats = () =>
    api.get("/dashboard/governorate-stats");