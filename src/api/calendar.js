import api from "./api";

/**
 * Get user's schedule based on role
 */
export const getMySchedule = () =>
    api.get("/calendar/my-schedule");