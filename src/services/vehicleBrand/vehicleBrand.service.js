import api from "../api";

export const getVehicleBrands = () => {
  return api.get("/vehiclebrands");
};
