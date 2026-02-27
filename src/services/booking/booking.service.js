import api from "../api";

export const getBookingsByVehicle = (vehicleId) => {
  return api.get(`/bookings/vehicle/${vehicleId}`);
};

export const createBooking = (data) => {
  return api.post("/bookings", data);
};