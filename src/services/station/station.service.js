import api from "../api";


export const getRecommendedStations = (userId) => {
  return api.get(`/stations/recommendations/${userId}`);
};