import api from "../api";

export const getVehicleModels = () => {
  return api.get("/vehiclemodels");
};