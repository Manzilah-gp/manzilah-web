import { getMyMosqueId } from "../api/course";

export const getMosqueIdForAdmin = async (user) => {
    const adminId = user.id;
    const response = await getMyMosqueId(adminId);
    return response.data.mosqueId;
};
