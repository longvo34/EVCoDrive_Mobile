import api from "../api";

export const getBookingsByVehicle = (vehicleId) => {
  return api.get(`/bookings/vehicle/${vehicleId}`);
};

export const createBooking = (data) => {
  return api.post("/bookings", data);
};

export const getQuotaByShareUnit = (shareUnitId) => {
  return api.get(`/share-units/${shareUnitId}/quotas`);
};

export const createUsageQuota = (data) =>
  api.post("/usage-quotas", data);