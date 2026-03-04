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

export const getBookingById = (bookingId) => {
  return api.get(`/bookings/${bookingId}`);
};

export const getBookingsByMember = (memberId, params = {}) => {
  return api.get(`/bookings/member/${memberId}`, {
    params: {
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
    },
  });
};

export const updateBooking = (bookingId, data) => {
  return api.put(`/bookings/${bookingId}`, data);
};

export const deleteBooking = (bookingId) => {
  return api.delete(`/bookings/${bookingId}`);
};